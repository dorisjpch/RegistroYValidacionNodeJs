// Módulo del controlador, de aqui se controla el modelo y la vista que renderiza (Patrón MVC)

'use strict'
var //UserController = require('../controllers/user-controller'),
	passport = require ('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('../models/User_Model_Sequelize'),
	UserController = () => {}


//register
UserController.getLogin = (req, res, next) => {
	res.render('login' );
}

UserController.getLogout = (req,res) => {
	req.logout()
	req.flash('success_msg', 'Saliste del sistema')
	res.redirect('/login')
}

UserController.getRegister = (req,res) => {
	res.render('register')
}

UserController.postRegister = (req,res) => {
//A continuación tomo los datos que vienen del front -> http://localhost:3000/users/register	
	var name =req.body.name,
		userName=req.body.userName,
		userEmail =req.body.userEmail,
		password =req.body.password,
		password2 =req.body.password2;
	
	//Utilizamos la dependencia de express-validation para hacer validaciones e indicar error si existen:
		req.checkBody('name', 'Nombre es requerido').notEmpty();
		req.checkBody('userName', 'Su nombre Completo es requerido').notEmpty();
		req.checkBody('userEmail', 'Su correo es requerido').notEmpty();
		req.checkBody('userEmail', 'Su correo no tiene formato válido').isEmail();
		req.checkBody('password', 'Su contraseña es requerida').notEmpty();
		req.checkBody('password2', 'Su contraseña no coincide').equals(req.body.password);
		
	var errors = req.validationErrors();
		console.log(errors)
		if (errors)
		{
			return (res.render('register',{errors:errors}))
		} else {
		//Creo el objeto con el cual transfiero los datos al sequelize para su inserción en la base de datos    			
			var newUser = new Object({
				name: name,
				userName: userName,
				userEmail: userEmail,
				password: password,
			});
			User.createUser(newUser, function(errors, newUser){
				if (!newUser) { 
					req.flash('error_msg', "El correo suministrado ya existe en la base de datos");
					return (res.redirect('/register'))
				} 
				else{
				//Después que se devuelve del sequelizeuelize y registra usuario, se le reenvia el inicio de sesión				
					req.flash('success_msg', "Ya estas registrado, ahora puedes Iniciar Sesión");
					res.redirect('/login'); 			
				}

			});
		} // fin del else
}

module.exports = UserController