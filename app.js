"use strict";

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

//Aumentar el límite máximo permitido del request en 50m
//Nota: Por defecto el límite es muy pequeño para permitir subir fotos
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var ModuloMongo = require('./ModuloMongo.js').Qux;
var moduloMongo = new ModuloMongo();

var AccesoMail = require('./AccesoMail.js').Qux;
var accesoMail = new AccesoMail();

var AccesoJimp = require('./AccesoJimp.js').Qux;
var accesoJimp = new AccesoJimp();

var ModuloEncriptar = require('./ModuloEncriptar.js').Qux;
var moduloEncriptar = new ModuloEncriptar();

var ModuloHash = require('./ModuloHash.js').Qux;
var moduloHash = new ModuloHash();

var ModuloDesa = require('./ModuloDesa.js').Qux;
var moduloDesa = new ModuloDesa();

var async = require("async");

//Guardar datos en sesiones
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({
  secret: "Datos Personal",
  resave: false,
  saveUninitialized: false
}));

//Definición de puerto
app.set('port', (process.env.PORT || 5000));

//Archivos públicos
app.use(express.static('public'));

//Usar el paquete Pug para Templates
app.set('view engine', 'pug');



//Atributos
var nombreColeccionUsers = "Users";

//Obtener URI de Mong de variable de entorno por seguridad
var uriBD = (process.env.UriBD);




//INICIO Funciones AJAX**************************************************************************************

app.post('/login', function(req, res){

    var datos = req.body.content;

    if(!datos || !datos.id || !datos.pass){
        console.log("Login: No se recibieron las credenciales");
        //Enviar un flag de error de autenticación
        respuestaAjaxJson(res, "INCOMPLETE", "Complete los datos.")
    }
    else{

      moduloMongo.obtenerUsuarios(
        function () {
          console.log("Login: Error al intentar obtener la colección Users");

          //Enviar un flag de Error
          respuestaAjaxJson(res, "ERROR", "Error del Servidor")
        },moduloEncriptar.decrypt,
        function (result) {

          var encontrado = false;
          for(var i=0; i<result.length; i++){

            if (result[i].Id.toLowerCase() === datos.id.toLowerCase()){

              //Verificar hash
              encontrado = true;
              moduloHash.comparePassword(datos.pass, result[i].Pass, function(err, isPasswordMatch){
                if (err){
                  console.log("Login: Se produjo un error al intentar validar el password con el valor hash.");
                  console.log(err);

                  //Enviar un flag de Error
                  respuestaAjaxJson(res, "ERROR", "Error del Servidor")

                }else if (isPasswordMatch){
                  //Password correcto
                  req.session.user = result[i];

                  //Enviar un flag de Ok
                  respuestaAjaxJson(res, "OK")

                }else{
                  //Enviar un flag de error de autenticación
                  respuestaAjaxJson(res, "NOTFIND", "El usuario y/o password no son válidos")
                }

              });

              break;
            }
          }

          if (!encontrado){
            //Enviar un flag de error de autenticación
            respuestaAjaxJson(res, "NOTFIND", "El usuario y/o password no son válidos")
          }

        }
      );
    }
});

//FIN Funciones AJAX**************************************************************************************



//INICIO Definición URL**************************************************************************************

//Renderizar usando Pug
app.get('/', function(req, res){
  res.redirect('/index.html');
  
  ////Por el momento indicar que el sitio esta bajo reconstrucción
  ////res.render('home');
});

 //FIN Definición URL**************************************************************************************



//INICIO Control Atenticación**************************************************************************************

//<Vacio>

//FIN Control Atenticación**************************************************************************************



//INICIO Server**************************************************************************************

var server = app.listen(app.get('port'), function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Servidor iniciado en http://%s:%s", host, port)
})

//FIN Server**************************************************************************************



//INICIO Funciones iniciales**************************************************************************************

//Enviar mensajes Ajax al cliente en formato JSon
/*
  res: Objeto Response
  tipoMsj: "ERROR", "OK", etc.
  mensaje: (Opcional), texto a mostrar al usuario
  contenido: (Opcional), respuesta de la consulta realizada, no se muestra al usuario
*/
function respuestaAjaxJson(res, tipoMsj, mensaje, contenido){
  res.setHeader('Content-Type', 'application/json');

  var datos = {
    RESULTADO: tipoMsj
  };

  //Valores opcionales
  if (mensaje) datos.MENSAJE = mensaje;
  if (contenido) datos.CONTENIDO = contenido;

  //Enviar respuesta
  res.send(JSON.stringify( datos ));
}

//FIN Funciones iniciales**************************************************************************************


//////TEST
var uriBDTemporal = uriBD;

var usuarioTempo = {
    Id: "Pepe",
    Pass: "Pepe",
    Rol: "X",
    Mail: "pepe@pepe.pepe"
};

////moduloDesa.agregarUsuario(usuarioTempo, "Users", uriBDTemporal);