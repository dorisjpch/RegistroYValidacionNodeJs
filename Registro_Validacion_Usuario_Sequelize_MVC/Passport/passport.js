// Este módulo maneja todo el proceso de passport , serialización y deserialización.

'use strict'

var User = require('../models/User_Model_Sequelize'),
	passport = require ('passport'),
	LocalStrategy = require('passport-local').Strategy

module.exports = function (passport){

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local', new LocalStrategy({   
	usernameField: 'userEmail',
    passwordField: 'password'
    }, 
    function(userEmail, password, done) {

    User.getUserByUseremail(userEmail, function(err, user) {
    	if (err) { return done (err)}
      	if (!user) {
      		return done(null, false, { message: 'Usuario no registrado.' });
      		}

		User.comparePassword(password, user.password, function(err, isMatch){
	    		if (err) {return done (err)}
	        	if (isMatch){
	        		return done(null, user)
	        	} else 	{
	        		return done(null, false, { message: 'Contraseña inválida' }); 
	        	} 
	    	}); //fin de comparePassword
	}) // fin de getUserByUseremail
}));

}