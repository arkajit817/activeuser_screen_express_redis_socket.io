var mongoose=require('mongoose');
var tokenSchema=mongoose.Schema({
	
	email: { type :String},
	token: {type: String}
});