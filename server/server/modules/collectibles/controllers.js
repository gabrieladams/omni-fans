
var baucis=require('baucis');
var controller=baucis.rest('collectibles');
controller.request('put',function(req,res,next){
	if(req.body.email){
		delete req.body.email;
	}
	/*if(req.body.password){
		console.log(req);
		if(!(req.collectible.email===req.body.email)){
			delete req.body.password;
		}
		
	}*/
	next();
});
module.exports=controller;