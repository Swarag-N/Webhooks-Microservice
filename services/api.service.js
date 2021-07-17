"use strict";

const express = require("express");
const bodyParser = require("body-parser");

/**
 * 
 * @description Express API Service acts as a API GATEWAY
 */
module.exports = {
	name: "api",

	settings: {
		// Exposed port
		port: process.env.PORT || 3000,
		log4XXResponses: true,
		pageSize: 50,
		
	},

	/**
	 * 
	 * @description Life Cycle methods to start Express App 
	 */

	/**
	 * 
	 * Service created lifecycle event handler
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
	 */
	started() {

		/**
		 * 
		 * @function listens on PORT
		 */
		this.app.listen(Number(this.settings.port), err => {
			if (err)
				return this.broker.fatal(err);
			this.logger.info(`API Server started on port ${this.settings.port}`);
		});

	},
	
	/**
	 * Service stopped lifecycle event handler
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
	 * 
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
		 * @param {Request} req
		 * @param {Response} res
		 * 
		 * @returns New Web Hook ID
		 */
		async registerWebHook (req,res){
			try{
				const {name,hookURL} = req.body;
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
		 * @param {Request} req 
		 * @param {Response} res
		 * 
		 * @returns {WebHook[]} 
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
		 * @param {Request} req
		 * @param {Response} res
		 * 
		 * @returns {WebHook} Updated WebHook
		 */
		async update (req,res){
			try{
				const {_id,name,hookURL} = req.body;
				/**
				 * Custom Update Actions Mongoose Support Update Validation,
				 *  where as DbService API doesnt give option 
				 */
				const UpdatedWebHook = await this.broker.call("webhooks.validateAndUpdate",{_id,name,hookURL});
				res.send({message:"New Hook Updated", UpdatedWebHook});
			}catch(err){
				res.send({message:err.message});
			}
		},

		
		/**
		 * Delete a Regitered WebHook
		 * 
		 * @param {Request} req 
		 * @param {Response} res
		 * 
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
		 * @param {Request} req 
		 * @param {Response} res 
		 */
		async trigger(req,res){
			try{
				const ipadr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
				const obj = await this.broker.call("webhooks.trigger",{ipadr}, { timeout: 100000 });
				res.send({message:"Hey User", obj});
			}catch(error){
				res.send(error);
			}
		}
	},
};
