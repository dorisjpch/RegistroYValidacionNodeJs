// Módulo de modelo de datos. Es invocado por el controlador para la manipulación de datos en la base de datos.
//Se utiliza para gestionar los datos el Sequelize y MySql. Además de la dependencia bcrypt para encriptar el password

'use strict'
var bcrypt = require('bcryptjs'),
    mysql2 = require('mysql2'),
    conf = require('./db-conf'), // se lo trae del JSON    
    Sequelize = require('sequelize'),
    connection = new Sequelize({database: conf.mysql.db,  username : conf.mysql.user, password: null , dialect:'mysql', host : conf.mysql.host, port : conf.mysql.port, operatorsAliases: false});

const User = connection.define( "user", {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
        },
    name: {
        type: Sequelize.STRING, 
        allowNull: false, 
        },
    userName:  {
        type: Sequelize.STRING,
        notEmpty: true,           
        },
    userEmail:  {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false,
        validate: {
            isEmail:{
                msg: 'Por favor, ingrese un correo válido. Este campo es requerido' 
            },   
            notEmpty: true,  
        }
        },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty :{
                msg: 'Por favor, ingrese un email. Este campo es requerido' 
            }   // don't allow empty strings
        }
        },
    },   
    {
            freezeTableName: true,
            timestamps: false,
            tableName: 'user',
    },
    {
        hooks:{

        beforeValidate: function(){
        },

        afterValidate: function(){
        },

        beforeCreate: function(){
        },
        afterCreate: function(){
        }
    }
})
    
User.sync()
    .then(function() {
        console.log('La base de datos está bien')})
    .catch(function(err) {
        console.log(err, "Algo salió mal con la actualización de la base de datos!") });



User.createUser = function(newUser,done){
    var data = newUser;
    User.findOne({
      where: {
        userEmail: data.userEmail
      }
    }).then(function (newUser) {
      if (newUser) {
        return done(newUser, false)
      }
      else{
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(data.password,salt,function(err,hash){
                data.password = hash;
                console.log(data.password);
                User.create(data)
                   .then(function(data, created) {
                      if (!data) {
                        return done(null, false)
                      }
                      if (data){
                       return done(null, data) 
                     }
                   })
            }) //Fin segundo bcrypt
        }) // fin primer bcrypt
      } //fin del else
    }) // fin del then
} // fin module

User.getUserByUseremail = function(userEmail,callback){
    User.findOne({
      where: {
        userEmail: userEmail
            }
            }).then(function(user) {
                    callback(null, user)
            })
}

User.getUserById= function(id,callback){
    User.findById(id).then(function(user) {
         if (user) {
             callback(null, user);
         } else {
             callback(err, null);
         }
     });
}

User.comparePassword = function (candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err,isMatch) {
        if (err) throw err;
        callback(null, isMatch); 
    })
}



module.exports = User
