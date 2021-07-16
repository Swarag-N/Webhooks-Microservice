"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let validUrl = require('valid-url');

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
      required: [true, 'hookURL required']
	},
});

WebHookSchema.pre('save', function(next) {
  if (!validUrl.isWebUri(this.hookURL)){
    throw new Error('Hook URL is not Proper');
  }
  next()
});

module.exports = mongoose.model("WebHook", WebHookSchema);