"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let validUrl = require("valid-url");

/**
 * WebHook
 * 
 * @typedef {object} WebHook
 * @property {string} name - WebHook name
 * @property {string} hookURL - Webhook's Target URL
 * @property {string} _id - WebHook's ID.
 */
let WebHookSchema = new Schema({
	name:{
		type:String,
	},
	hookURL: {
		type: String,
		validate: {
			validator:(suspect)=>{
				if(validUrl.isWebUri(suspect)){
					return true;
				}
				return false;
			},
			message: props => `${props.value} is not a valid hookURL!`
		},
		required: [true, "hookURL required"]
	},
});

module.exports = mongoose.model("WebHook", WebHookSchema);