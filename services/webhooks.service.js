"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

/**
 * WebHook
 * 
 * @typedef {object} WebHook
 * @property {string} name - WebHook name
 * @property {string} hookURL - Webhook's Target URL
 * @property {string} _id - WebHook's ID.
 */
const Webhook = require("../models/webhook.model");
const validUrl = require("valid-url");
const axios = require("axios");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/**
 * @module WebHooksService
 * @description WebHook Service
 */
module.exports = {
	name: "webhooks",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.MONGO_URI || "mongodb://localhost/moleculer-webhook", { 
		useNewUrlParser: true, 
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true, }),
	model: Webhook,

	/**
	 * Settings
	 */
	settings: {
		// Trigger Batch Size
		BATCH_SIZE : 10,
		// Number of Retries before classifying as a failed 
		RETRY_COUNT: 3,
	},


	/**
	 * 
	 * Service Methods
	 */
	methods:{

		/**
		 * chunkWebHooks 
		 * 
		 * @param {WebHook[]} webHooksArray Array of webHooks
		 * @param {number} chunkSize BATCH_SIZE 
		 * @description Categrorize the WebHookArrays of BATCH_SIZE
		 * @returns {WebHook[][]} WebHooks as Batches
		 */
		chunkWebHooks(webHooksArray, chunkSize){
			let chunks = [];
			let i = 0;
			let n = webHooksArray.length;
			
			while (i < n) {
				// Creates Arrays of Size ChunkSize
				chunks.push(webHooksArray.slice(i, i += chunkSize));
			}

			return chunks;
		},

		/**
		 * @typedef {object} WebHooksGrouped
		 * @property {Webhook[]} success WebHook Repsponse Status Success
		 * @property {Webhook[]} failed WebHook Repsponse Status failed
		 * @param { object[] } responseArray Axios Server Response
		 * @description classify webhooks into successful and failed requests
		 * @returns {WebHooksGrouped} Grouped WebHooks 
		 */
		groupResponses(responseArray) {
			
			let success = [];
			let failed =[];
			
			responseArray.forEach(response=>{
				if(response.success){
					success.push(response);
				}else{
					failed.push(response);
				}
			});

			return {success,failed};
		},

		/**
		 * 
		 * @param {WebHook[]} webHooksArray Webhook
		 * @param {PostData} postData - IP Address of Client
		 * @description Make API Requests
		 * @returns {WebHooksGrouped} Axios Request Respones
		 */
		async makeRequests(webHooksArray,postData){
			let prom = webHooksArray.map(
				async hook=>{
					const {hookURL,_id,name} = hook;
					return axios.post(hook.hookURL,postData)
						.then((res)=>{
							let flag = false;
							if(res.status == 200){
								flag=true;
							}				
							return {success:flag,hookURL,_id,name};
						})
						/*eslint-disable */
						.catch((error)=>({success:false,hookURL,_id,name}));
						/*eslint-enable */
				}
			);

			let responses = await Promise.all(prom);
			return this.groupResponses(responses);
		},

		/**
		 * @typedef {object} PostData
		 * @property {string} ipadr IP Adreess of User
		 * @property {string} timeStamp timeStamp Of Request
		 * @param {WebHook[]} webHooks WebHooks Registered  
		 * @param {PostData} postData User Post Data
		 * @returns {Report} Hook Trigger Report 
		 */
		async initateProcessing(webHooks,postData){

			const {BATCH_SIZE,RETRY_COUNT} = this.settings; 
			let chunks = await this.chunkWebHooks(webHooks,BATCH_SIZE);
			let failedRequests = [];
			let successRequests = [];

			let batchRequest = chunks.map(subset=>(this.makeRequests(subset,postData)));
			let batchResponse = await Promise.all(batchRequest);

			batchResponse.forEach(batch=>{
				const {success,failed} = batch;
				failedRequests.push(...failed);
				successRequests.push(...success);
			});

			/**
			 * @typedef {object} Report
			 * @property {WebHook[]} success  ArrayWebHooks of with Sucessfull response on first call 
			 * @property {WebHook[]} retrySuccess1 ArrayWebHooks of with Sucessfull response on second call
			 * @property {WebHook[]} retrySuccess2 ArrayWebHooks of with Sucessfull response on third call
			 * @property {WebHook[]} retrySuccess3 ArrayWebHooks of with Sucessfull response on fourth call
			 * .
			 * .
			 * .
			 * @property {WebHook[]} retrySuccessRETRY_COUNT1 ArrayWebHooks of with Sucessfull response on <RETRY_COUNT-1>th call
			 * @property {WebHook[]} failed ArrayWebHooks of with Failed response after retries
			 * {
			 * 		success:[],
			 * 		retrySuccess1:[],
			 * 		retrySuccess2:[],
			 * 		... retrySuccess${RETRY_COUNT-1}:[],
			 * 		
			 * 		failed: []
			 * 
			 * }
			 */
			let trigger_Report  = {successRequests};

			for(let i=1;i<RETRY_COUNT;i++){

				// Grouping Failed Requeste as ArraySize of BATCH_SIZE 
				let failedChunks = this.chunkWebHooks(failedRequests,BATCH_SIZE);
				
				// flushing all failed requests
				failedRequests = [];

				// Retry for making a request
				let retryRequests = failedChunks.map(subset=>(this.makeRequests(subset,postData)));
				let retryResponses = await Promise.all(retryRequests);

				// Classify Requests into failed and success 
				retryResponses.forEach(batch=>{
					const {success,failed} = batch;
					// Failed Requests
					failedRequests.push(...failed);
					// Successfull Requests
					trigger_Report [`retrySuccess${i}`] =success;
				});

			}

			// Failed Responses
			trigger_Report ["failed"]=failedRequests;

			return trigger_Report ;
		},

		/**
		 * 
		 * Seed DB with Target Servers
		 */
		async seedDB(){
			let webHooks = [];
			for(let i=0;i<5;i++){
				let tempWH = {
					name:`Server#${i}`,
					hookURL:`http://localhost:400${i}`
				};
				webHooks.push(tempWH);
			}

			let newWebHooks = await  this.adapter.insertMany(webHooks);
			newWebHooks.forEach(hook=>{
				this.logger.info(hook);
			});
		}

		
	},

	started() {
		this.seedDB();
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 * 
	 * @description Custom Actions for Service other than DBService
	 */
	actions: {


		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create  (alias Register) 
		 *  - insert
		 *  - update
		 *  - remove
		 */

		/**
		 * 
		 * Validate and Update the Values of WebHooks
		 * 
		 * @param {_id}	_id
		 * @param {string}	hookURL
		 * @param {string} name
		 * @returns {WebHook} Updated WebHook
		 */
		validateAndUpdate:{
			params:{
				_id:"string",
				hookURL:"string",
				name:"string"
			},
			/** 
			 * @param {Context} ctx Moelculer Action Context 
			 * @returns {WebHook} Updated WebHook
			 */
			async handler(ctx) {
				try{
					const {_id,name,hookURL} = ctx.params;
					/** 
					 * Molecular Adapter of Mongoose skipped the the options parametrt
					 * to avoid code breaking, action validator is used 
					 */
					if(hookURL){
						console.log(validUrl.isWebUri(hookURL));
						if (!validUrl.isWebUri(hookURL)){
							throw new Error("Hook Not Proper");
						}
					}
					const UpdatedWebHook = await this.adapter.updateById(_id,{name,hookURL});
					return UpdatedWebHook;
				}catch(error){
					throw error;
				}
				
			}

		},

		
		/**
		 * trigger
		 * 
		 * @description
		 * Divide the Requests into Batches of 10, use Promise.all()
		 * resolve all requests
		 * 
		 * Caviat: Reponse Object of Axios Dont Contain Context 
		 * @param {string} IPAddress - User
		 */
		trigger:{
			params: {
				ipadr: "string"
			},

			/** 
			 * @param {Context} ctx Moelculer Action Context  
			 * @returns {Report} Report
			 */
			async handler(ctx) {
				// Use Axios to Send IPaddres
				try {
					const {ipadr} = ctx.params;
					const timeStamp = new Date().getTime();
					const webHooks = await this.adapter.find({});
					let data = await this.initateProcessing(webHooks,{ipadr,timeStamp});
					return data;
				} catch (error) {
					throw(error);
				}				
			}
		}

	},
};
