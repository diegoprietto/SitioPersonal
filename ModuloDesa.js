"use strict";

//Contiene funciones comunes necesarias en el momento que aún no esta el sitio productivo

//Librerias auxiliares:
var ModuloMongo = require('./ModuloMongo.js').Qux;
var moduloMongo = new ModuloMongo();


var Qux = function () {};

//Añadir nuevo usuario
/*
  Ejemplo de parámetro usaurio:
  usuario = {
    Id: Texto (Nombre de usuario) (Encriptado)
    Pass: Texto (Clave de acceso) (Hash)
    Rol: Texto ("A": Admin; "X": Desarrollador)
    Mail: Texto (Mail del usuario) (Encriptado)
  }
*/
Qux.prototype.agregarUsuario = function(usuario, nombreColeccion, uri) {

  moduloMongo.guardarRegistro(null, null, uri, nombreColeccion, usuario);

};

exports.Qux = Qux;