
var baucis=require('baucis');
var controller=baucis.rest('owners');
controller.request('put',function(req,res,next){
	if(req.body.email){
		delete req.body.email;
	}
	/*if(req.body.password){
		console.log(req);
		if(!(req.owner.email===req.body.email)){
			delete req.body.password;
		}
		
	}*/
	next();
});
module.exports=controller;