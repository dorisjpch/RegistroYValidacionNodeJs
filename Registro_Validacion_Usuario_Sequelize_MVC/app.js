'use strict'

var express = require('express'), 
	path =require ('path'),
	cookieParser = require ('cookie-parser'),
	bodyParser = require ('body-parser'), 
	expressValidator = require('express-validator'),
	flash = require ('connect-flash'),
	session =require ('express-session'),
	favicon = require('serve-favicon'), 
	morgan = require('morgan'), // muestra en consola todo lo que consume la aplicación
	routes =require ('./routes/index'), 
	faviconURL = `${__dirname}/public/img/img_favicon.png`, 
	port = (process.env.PORT || 3000),
	passport = require ('passport');
	require('./passport/passport')(passport)
	


// Inicio de aplicación
var app = express()

// ---------- Configurando app ..........//

// Motor de vistas
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Middleware de bodyParser y cookiePArser 
// paquete que utiliza mucho express bodyPaser permite parsearlo a json

app.use ( bodyParser.json() ) 
app.use ( bodyParser.urlencoded({extended: false}) ) // parse application/x-www-form-urlencoded
app.use(cookieParser())

// Coloca la carpeta estática
app.use(express.static(path.join(__dirname, 'public')))

// sesión de express
app.use (session({
		secret:'secret',
		saveUninitialized: true,
		resave: true
	}))

// Inicialización del passport	

app.use(passport.initialize())
app.use(passport.session())
	
// Validador de express - tomado - ver 'express-validator
app.use(expressValidator({
		errorFormatter: function(param,msg,value){
			var namespace = param.split('.'),
				root =namespace.shift(),
				formParam = root
				while (namespace.length) {
					formParam +='[' + namespace.shift() + ']'     	
				}
				return {
					param: formParam,
					msg: msg,
					value : value	
				}
		}
	}))	
// conecta con flash - nos permitira la emision de mensajes
app.use(flash())

// variables globales usadas para el manejo de mensajes
app.use(function(req,res,next){
		res.locals.success_msg = req.flash('success_msg')
		res.locals.error_msg = req.flash('error_msg')
		res.locals.error = req.flash('error')
		res.locals.user = req.user|| null
		next()
	})	
// ejecutando middlewares
app.use('/', routes)
app.use ( favicon(faviconURL) )
app.use( morgan('dev') ) //permite ver mensajes sobre la ejecución por consola

// Puerto	
app.set('port', port)    
module.exports = app
