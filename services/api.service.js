"use strict";

const express = require("express");
const bodyParser = require('body-parser');
const { remove } = require("../models/webhook.model");

module.exports = {
	name: "api",

	settings: {
		// Exposed port
		port: process.env.PORT || 3000,
		log4XXResponses: true,
		
	},

	methods:{
		initRoutes(app) {
			app.get("/register", this.registerWebHook);
			app.get("/list", this.listWebHooks);
			app.put("/update", this.update);
			app.delete("/delete", this.delete);
		},

		async registerWebHook (req,res){
			try{
				const {name,hookURL} = req.body;
				const newWebHook = await this.broker.call("webhooks.create",{name,hookURL});
				const {_id } = newWebHook;
				res.send({message:"New Hook Added", _id})
			}catch(err){
				res.send(err)
			}
			  
		},

		async update (req,res){
			try{
				const {_id,name,hookURL} = req.body;
				const newWebHook = await this.broker.call("webhooks.update",{id:_id,name,hookURL});
				res.send({message:"New Hook Updated", _id})
			}catch(err){
				res.send(err)
			}
		},
		
		
		async listWebHooks (req, res) {
			const str = await this.broker.call("webhooks.list"); 
			res.send(str);
		},

		async delete (req,res){
			try{
				const {_id} = req.body;
				const newWebHook = await this.broker.call("webhooks.remove",{id:_id});
				res.send({message:"Hook Removed", _id})
			}catch(error){
				res.send(error);
			}
		},

	},

	created(){
		const app = express();
		app.use(bodyParser.urlencoded({ extended: false }))
		app.use(bodyParser.json())
		this.initRoutes(app);
		this.app = app;
	},
	
	started() {
		this.app.listen(Number(this.settings.port), err => {
			if (err)
				return this.broker.fatal(err);
			this.logger.info(`API Server started on port ${this.settings.port}`);
		});

	},

	stopped() {
		if (this.app.listening) {
			this.app.close(err => {
				if (err)
					return this.logger.error("Server close error!", err);

				this.logger.info("Server Stopped");
			});
		}
	}
};
