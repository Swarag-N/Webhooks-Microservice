"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Webhook = require("../models/webhook.model");
const validUrl = require("valid-url");

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
				webHooks.forEach(webhook => {
					this.logger.info(webhook._id)
				});
				return `Welcome, ${ctx.params.ipadr}`;
			}
		}

	},
};
