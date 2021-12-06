
module.exports={
	development:{
		port:3001,
		url:'http://localhost',
		database_url:'mongodb://localhost:27017,localhost:27018,localhost:27019/OmniBridge?replicaSet=rs0',
		block_url:'wss://rinkeby.infura.io/ws/v3/9b4c835555dd4522a097e5ceff0ccdab'
	},
	production:{
		port:8080,
		url:'http://localhost',
		database_url:'mongodb://localhost:27017,localhost:27018,localhost:27019/OmniBridge?replicaSet=omnibridge',
		block_url:'wss://rinkeby.infura.io/ws/v3/9b4c835555dd4522a097e5ceff0ccdab'
	},
    secret:'pool'
};