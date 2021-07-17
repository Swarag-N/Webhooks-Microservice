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
		chunkSize : 10

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
		 * @param {WebHooks[]} webHooksArray 
		 * @param {String} ipadr - IP Address of Client
		 *  
		 * 
		 * @returns {WebHooks{_id}[] success, WebHooks{_id}[] failed }  
		 */
		async makeRequests(webHooksArray,ipadr){
			let failedWebHooks = []
			let successWebHooks = []
			let promises = []

			try {
				webHooksArray.forEach(webHook => {
					this.logger.info(webHook.hookURL)
					promises.push(
						axios
						.get(webHook.hookURL,{data:ipadr})
						.then(function(response) {
							return {
								success: true,
								data: response.data
							};
						})
						.catch(function(error) {
							return { success: false };
						})
					)
				})
				return Promise.all(promises)
			} catch (error) {
				console.log(error.message);
			}
			return {failedWebHooks,successWebHooks}
		},


		async initateProcessing(){
			let chunks = await this.chunkWebHooks(webHooks,this.settings.chunkSize);
			chunks.forEach(async subset=>{
				let responses = this.makeRequests(subset,ctx.params.ipadr)
				try {
					responses.then(([...resp])=>{console.log("########")}).catch(([...e])=>{console.log("*******")})	
				} catch (error) {
					console.log(error)
				}
			})
		},

		groupArray(array, property) {
			var hash = {};
			for (var i = 0; i < array.length; i++) {
				if (!hash[array[i][property]]) hash[array[i][property]] = [];
				hash[array[i][property]].push(array[i]);
			}
			return hash;
		}
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
		 * DbService Mixin of Molecuar Js Provides 
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

				
					const webHooks = await this.adapter.find({});
					let prom = webHooks.map(async hook=>(axios.get(hook.hookURL,{ip:ctx.params.ipadr})
					.then(res=>({success:true,id:hook._id}))
					.catch(err=>({success:false,id:hook._id})))
					)

					let repsponses = await Promise.all(prom);
					let data = this.groupArray(repsponses,'success')
					this.logger.info(data);
					
					return data
				} catch (error) {
					console.log(error)
					// throw error
				}
				return {}
				
			}
		}

	},
};
