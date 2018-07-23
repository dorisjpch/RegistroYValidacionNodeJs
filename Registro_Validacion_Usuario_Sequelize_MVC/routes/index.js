// En este archivo se manejan las routas de la aplicación. Desde acá se invoca los modulos del controlador (Modelo Vista Controlardo - MVC)
'use strict'

var express = require('express'),
	router = express.Router(),
	UserController = require('../controllers/user-controller'),
	passport = require ('passport'),
	LocalStrategy = require('passport-local').Strategy


router
	.get('/', mustbeAuthenticated, function(req,res){
		res.render('index', { title: 'Página de Inicio' } );
	})
	.get('/login', UserController.getLogin)
	.post('/login', passport.authenticate('local', 
		{ successRedirect:'/', failureRedirect: '/login', failureFlash: true}),
		function(req, res) {
			res.redirect('/' + req.user.userName)
		})
	.get('/register', UserController.getRegister)
	.post('/register', UserController.postRegister)
	.get('/logout', UserController.getLogout)

// Con esta función se filtra las rutas de acceso en el caso que no estes autenticado. 
function mustbeAuthenticated(req,res,next){
	if (req.isAuthenticated()){
		return next();
	} else{
		req.flash('error_msg', 'No has ingresado al sistema')
		res.redirect('/login')
	}
}
module.exports = router		
