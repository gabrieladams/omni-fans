
var baucis=require('baucis');
var controller=baucis.rest('tokens');
controller.request('put',function(req,res,next){
	if(req.body.email){
		delete req.body.email;
	}
	/*if(req.body.password){
		console.log(req);
		if(!(req.token.email===req.body.email)){
			delete req.body.password;
		}
		
	}*/
	next();
});
module.exports=controller;