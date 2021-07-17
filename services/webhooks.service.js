"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Webhook = require("../models/webhook.model");
const validUrl = require("valid-url");
const axios = require('axios');
const { response } = require("express");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
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
		 * @param {WebHooks[]} webHooksArray 
		 * @param {Integer} chunkSize 
		 * 
		 * @description Categrorize the WebHooksArray to chunkSize for concurent Requests
		 * 
		 * @returns {WebHooks[][]} WebHooks as Batches
		 */
		chunkWebHooks(webHooksArray, chunkSize){
			let chunks = [];
			let i = 0;
			let n = webHooksArray.length;
			
			while (i < n) {
				// Creates Arrays of Size ChunkSize
				chunks.push(webHooksArray.slice(i, i += chunkSize));
			}

			return chunks
		},

		/**
		 * 
		 * @param { Response[] } responseArray
		 */
		groupResponses(responseArray) {
			
			let success = [];
			let failed =[];
			
			responseArray.forEach(response=>{
				if(response.success){
					success.push(response)
				}else{
					failed.push(response)
				}
			})

			return {success,failed};
		},

		/**
		 * 
		 * @param {WebHooks[]} webHooksArray 
		 * @param {String} ipadr - IP Address of Client
		 *  
		 * 
		 * @returns {WebHooks{_id}[] success, WebHooks{_id}[] failed }  
		 */
		async makeRequests(webHooksArray,ipadr){
			let prom = webHooksArray.map(
				async hook=>{
					const {hookURL,_id,name} = hook
					return axios.get(hook.hookURL,{ipadr})
					.then((res)=>{
						let flag = false;
						if(res.status == 200){
							flag=true;
						}				
						return {success:flag,hookURL,_id,name}
					})
					.catch(err=>({success:false,hookURL,_id,name}))
				}
			)

			let responses = await Promise.all(prom);
			return this.groupResponses(responses)
		},


		async initateProcessing(webHooks,ipadr){
			const {BATCH_SIZE,RETRY_COUNT} = this.settings; 
			let chunks = await this.chunkWebHooks(webHooks,BATCH_SIZE);
			let failedRequests = [];
			let successRequests = [];

			let batchRequest = chunks.map(subset=>(this.makeRequests(subset,ipadr)))
			let batchResponse = await Promise.all(batchRequest);

			batchResponse.forEach(batch=>{
				const {success,failed} = batch
				failedRequests.push(...failed);
				successRequests.push(...success);
			})

			/**
			 * 
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
			let retryRespones = {successRequests}

			for(let i=1;i<RETRY_COUNT;i++){
				let failedChunks = this.chunkWebHooks(failedRequests,BATCH_SIZE);
				failedRequests = [];
				let retryRequests = failedChunks.map(subset=>(this.makeRequests(subset,ipadr)))
				let retryResponses = await Promise.all(retryRequests);
				retryResponses.forEach(batch=>{
					const {success,failed} = batch
					failedRequests.push(...failed);
					retryRespones[`retrySuccess${i}`] =success;
				})
			}

			retryRespones['failed']=failedRequests;
			return retryRespones;
		},

		
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
		 * DbService Mixin of 
		 * Molecuar Js Provides 
		 * 
		 * Register alias of Create
		 * Update 
		 * Delete
		 * List
		 */

		/**
		 * 
		 * Validate and Update the Values of WebHooks
		 * 
		 * @param {_id}	WebHookObjectID
		 * @param {url}	WebHookURL
		 * @param {name} WebHookURL
		 */
		validateAndUpdate:{
			params:{
				_id:"string",
				hookURL:"string",
				name:"string"
			},
			/** 
			 * @param {Context} ctx 
			 * */
			async handler(ctx) {
				try{
					const {_id,name,hookURL} = ctx;
					if(hookURL){
						if (!validUrl.isWebUri(hookURL)){
							throw new Error("Hook Not Proper");
						}
					}
					const UpdatedWebHook = await this.adapter.updateById(_id,{name,hookURL});
					return UpdatedWebHook;
				}catch(error){
					throw error
				}
				
			}

		},

		
		/**
		 * trigger
		 * 
		 * @description TODO
		 * Divide the Requests into Batches of 10, use Promise.all()
		 * resolve all requests
		 * 
		 * Caviat: Reponse Object of Axios Dont Contain Context 
		 * @param {String} IPAddress - User
		 */
		trigger:{
			params: {
				ipadr: "string"
			},

			/** 
			 * @param {Context} ctx  
			 * */
			async handler(ctx) {
				// Use Axios to Send IPaddres
				try {
					const {ipadr} = ctx.params;
					const webHooks = await this.adapter.find({});;
					let data = await this.initateProcessing(webHooks,ipadr)
					
					return data
				} catch (error) {
					console.log(error)
				}				
			}
		}

	},
};
