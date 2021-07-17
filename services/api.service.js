"use strict";

const express = require("express");
const bodyParser = require("body-parser");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('moleculer').Service } Service Moleculer's Context
 */


/**
 * @module APIService
 * @description Express API Service acts as a API GATEWAY
 */
module.exports = {
	name: "api",
	
	settings: {
		// Exposed port
		port: process.env.PORT || 3000,
		log4XXResponses: true,
		pageSize: 50,
		maxRequestTimeOut:  5 * 1000// 5 Seconds :grin: 
		
	},

	/**
	 * Life Cycle methods to start Express App
	 * 
	 * created : Start App
	 * started : Load App
	 * stopped	: Load App
	 */

	/**
	 * Service Created lifecycle event handler
	 *
	 * @memberof module.APIService
	 */
	created(){
		const app = express();
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());
		this.initRoutes(app);
		this.app = app;
	},
	

	/**
	 * 
	 * Service started lifecycle event handler
	 *
	 * @memberof module.APIService
	 */
	started() {

		this.app.listen(Number(this.settings.port), err => {
			if (err)
				return this.broker.fatal(err);
			this.logger.info(`API Server started on port ${this.settings.port}`);
		});

	},
	
	/**
	 * Service stopped lifecycle event handler
	 *
	 *  @memberof module.APIService
	 */
	stopped() {
		if (this.app.listening) {
			this.app.close(err => {
				if (err)
					return this.logger.error("Server close error!", err);

				this.logger.info("Server Stopped");
			});
		}
	},


	/**
	 * Service Methods
	 */
	methods:{
		initRoutes(app) {
			app.get("/register", this.registerWebHook);
			app.get("/list", this.listWebHooks);
			app.put("/update", this.update);
			app.delete("/delete", this.delete);
			app.get("/ip", this.trigger);
		},


		/**
		 * 
		 * Register WebHook
		 * 
		 * @param {express.Request} req client req
		 * @param {express.Response} res response
		 * @returns {WebHook._id} New Web Hook ID
		 */
		async registerWebHook (req,res){
			try{
				const {name,hookURL} = req.body;
				/**
				 * WebHook
				 * 
				 * @typedef {object} WebHook
				 * @property {string} name - WebHook name
				 * @property {string} hookURL - Webhook's Target URL
				 * @property {string} _id - WebHook's ID.
				 */
				const newWebHook = await this.broker.call("webhooks.create",{name,hookURL});
				const {_id } = newWebHook;
				res.send({message:"New Hook Added", _id});
			}catch(err){
				res.send({message:err.message});
			}

		},

		/**
		 * List of Registered WebHooks
		 * 
		 * @param {express.Request} req client req
		 * @param {express.Response} res response
		 * @returns {WebHook[]} Arrayof WebHooks 
		 */
		async listWebHooks (req, res) {
			const {pageSize} = this.settings;
			const str = await this.broker.call("webhooks.list",{pageSize}); 
			res.send({str,message:`${this.broker.nodeid}`});
		},

		/**
		 * 
		 * Update WebHook
		 * 
		 * @param {express.Request} req client req
		 * @param {express.Response} res response
		 * @returns {WebHook} Updated WebHook
		 */
		async update (req,res){
			try{
				const {_id,name,hookURL} = req.body;
				//  default Update Action does not supported Mongoose Update Validation, 
				const UpdatedWebHook = await this.broker.call("webhooks.validateAndUpdate",{_id,name,hookURL});
				res.send({message:"New Hook Updated", UpdatedWebHook});
			}catch(err){
				res.send({message:err.message});
			}
		},

		
		/**
		 * Delete a Regitered WebHook
		 * 
		 * @param {express.Request} req client req
		 * @param {express.Response} res response
		 * @returns {WebHook} Deleted WebHook
		 */
		async delete (req,res){
			try{
				const {_id} = req.body;
				const deletedWebHook = await this.broker.call("webhooks.remove",{id:_id});
				res.send({message:"Hook Removed", deletedWebHook});
			}catch(error){
				res.send({message:error.message});
			}
		},

		/**
		 * Initaites the Trigger Funtionality
		 * 
		 * @param {express.Request} req client req
		 * @param {express.Response} res response
		 */
		async trigger(req,res){
			try{
				const {maxRequestTimeOut} = this.settings;
				const ipadr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
				const report = await this.broker.call("webhooks.trigger",{ipadr}, { timeout: maxRequestTimeOut });
				res.send({message:"Trigger Report", report});
			}catch(error){
				res.send({message:error.message});
			}
		}
	},
};
