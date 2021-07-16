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

	methods:{

		chunkWebHooks(webHooksArray, chunkSize){
			let chunks = [];
			let i = 0;
			let n = webHooksArray.length;
			
			while (i < n) {
				chunks.push(webHooksArray.slice(i, i += chunkSize));
			}

			return chunks
		},


		makeRequests(webHooksArray){
			let failedWebHooks = []
			let successWebHooks = []
			let promises = []

			try {
				webHooksArray.forEach(webHook => {
					this.logger.info(webHook.hookURL)
				});
			} catch (error) {
				
			}

			// return {failedWebHooks,successWebHooks}
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
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
		 * @param {_id} 	WebHookObjectID
		 * @param {url} WebHookURL
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
				// Use Axios to Send IPaddres
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
				const webHooks = await this.adapter.find({});
				let chunks = await this.chunkWebHooks(webHooks,this.settings.chunkSize);
				chunks.forEach(subset=>{
					this.makeRequests(subset)
				})
				return `Welcome, ${ctx.params.ipadr}`;
			}
		}

	},
};
