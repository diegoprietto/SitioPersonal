"use strict";

var MongoClient = require('mongodb').MongoClient;
var MongoDb = require('mongodb');


var Qux = function () {};

//Obtener una consulta personalizada
/*
	callbackOk(respuesta): Función que se ejecuta cuando se ejecuta la consulta con éxito
	callbackError(respuesta): Función que se ejecuta cuando se produce una excepción
	uri: Cadena de conexión para MongoDb
	coleccion: Nombre de la colección a consultar
	filtros: Filtro que se aplica a la consulta, si no se aplica ningún filtro usar filtros = {}
*/
Qux.prototype.consultarDatos = function (callbackOk, callbackError, uri, coleccion, filtros) {
	
	//Se conecta a la BD y obtiene los datos
	MongoClient.connect(uri, function(err, db) {

		if (err){
			//Ocurrió un error
			if (callbackError) error(err);
		}else{
		  	//Referenciar a la colección
			var collection = db.collection(coleccion);

			//Ejecutar un Find
			collection.find(filtros).toArray(function(err, docs) {

				if (err){
					//Ocurrió un error
					if (callbackError) error(err);
				}else{
					//Retornar resultado de la consulta
					if (callbackOk) callbackOk(docs);
				}
			});
		}
		//Cerrar conexión
		db.close();
	});

}

//Guardar un array de registros en una colección
/*
	callbackOk(respuesta): Función que se ejecuta cuando se ejecuta la consulta con éxito
	callbackError(respuesta): Función que se ejecuta cuando se produce una excepción
	uri: Cadena de conexión para MongoDb
	coleccion: Nombre de la colección donde almacenar
	arrayRegistros: Array de registros a almacenar, ej. [{ Nombre: "pepe", Edad: 21 }, { Nombre: "Pepa", Edad: 23 }]
*/
Qux.prototype.guardarArrayRegistros = function(callbackOk, callbackError, uri, coleccion, arrayRegistros) {

	//Conectarse a la BD
	MongoClient.connect(uri, function(err, db) {

		if (err){
			//Ocurrió un error
			if (callbackError) error(err);
		}else{

		  	//Referenciar a la colección
			var collection = db.collection(coleccion);

			//Insertar documentos
			collection.insertMany(
				arrayRegistros,
				function(err, result) {

					if (err){
						//Ocurrió un error
						if (callbackError) error(err);
					}else{
						//Retornar resultado de la consulta
						if (callbackOk) callbackOk(result);
					}
			});

		}

		//Cerrar conexión
		db.close();
	});
}

//Guardar un único registro en una colección
/*
	callbackOk(respuesta): Función que se ejecuta cuando se inserta con éxito
	callbackError(respuesta): Función que se ejecuta cuando se produce una excepción
	uri: Cadena de conexión para MongoDb
	coleccion: Nombre de la colección donde almacenar
	registro: Registro a almacenar, ej. { Nombre: "pepe", Edad: 21 }
*/
Qux.prototype.guardarRegistro = function(callbackOk, callbackError, uri, coleccion, registro) {

	//Conectarse a la BD
	MongoClient.connect(uri, function(err, db) {

		if (err){
			//Ocurrió un error
			if (callbackError) error(err);
		}else{

		  	//Referenciar a la colección
			var collection = db.collection(coleccion);

			//Insertar documentos
			collection.insertOne(
				registro,
				function(err, result) {

					if (err){
						//Ocurrió un error
						if (callbackError) error(err);
					}else{
						//Éxito
						//Retornar resultado de la consulta
						if (callbackOk) callbackOk(result);
					}
			});

		}

		//Cerrar conexión
		db.close();
	});
}

exports.Qux = Qux;