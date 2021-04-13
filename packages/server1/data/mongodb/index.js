const mongoose = require('mongoose')
const config = require('./config')

mongoose.connect(config.url, config.options)
const db = mongoose.connection
db.on('err', console.error.bind(console, 'connection error:'))
db.once('open',function(){
	console.log('Connected!')
})
