"use strict";

//Indica si esta en movimiento o no el contenedor deslizable
var enMovimiento = false;
//Atributos para rotación de COG
var gradosActual = 0;
var velocidadActual = 0.0;
var intervalRotar;
var tiempoAnterior;
var detener = false;


$(document).ready(function () {
	//Animación del COG
  iniciarRotacion();
  //Inicializar los ToolTips
  $('[data-toggle="tooltip"]').tooltip();
});


//Evento de hacer clic en el botón para abrir/cerrar el cuadro deslizante
function accion(){
	if ($("#divDeslizante").hasClass("cerrado")){
  	//La primera vez aplicar las clases para animar
		implementarAnimacion();
	}else if (!enMovimiento) {
  	//Solo animar si no esta en movimiento
    if ($("#divDeslizante").hasClass("abrir")){
      $(".abrir").removeClass("abrir").addClass("cerrar");
    }else{
      $(".cerrar").removeClass("cerrar").addClass("abrir");
    }
  }
}

//Aplica las clases de animación por primera vez
function implementarAnimacion(){
  var e = document.getElementById("divDeslizante");

  e.addEventListener("animationstart", listenerAnimacion, false);
  e.addEventListener("animationend", listenerAnimacion, false);

  e.className = "abrir cuadro";
}

//Evento que se ejecuta al cambiar de estado una animación
function listenerAnimacion(e) {
	//Determinar el tipo de evento
  switch(e.type) {
    case "animationstart":
    	enMovimiento = true;
      break;
    case "animationend":
      enMovimiento = false;
      break;
  }
}

function iniciarRotacion(){
  if (intervalRotar){
    detener = !detener;
  }else{
    //Reloj para rotar
    tiempoAnterior = new Date().getTime();
    velocidadActual = 0.0;  //Reiniciar velocidad
    intervalRotar = setInterval(function(){
       rotar(1);
    }, 1);
  }
}

//Actualiza la rotación
function rotar(grados){
  let tiempo = obtenerTiempoTranscurrido();
  //Calcular velocidad actual
  if (detener){
    if (velocidadActual > 0.0){
      velocidadActual -= 0.01;
    }
    else{
      clearInterval(intervalRotar);
      intervalRotar=null;
      detener = false;
    }

  }
  else{
    if (velocidadActual < 2.0)
      velocidadActual += 0.01;
  }

  gradosActual += grados*velocidadActual*(tiempo/10);
  if (gradosActual > 360) gradosActual-=360;

  $(".rotatorio").css("transform", "rotate(" + gradosActual + "deg)");
}

//Obtener tiempo transcurrido entre Frames
function obtenerTiempoTranscurrido(){
  //Calcular tiempo transcurrido
  let tiempoTransurrido = new Date().getTime() - tiempoAnterior;
  tiempoAnterior =  new Date().getTime();

  return tiempoTransurrido;
}

//Cerrar aside
function cerrar(){
  $("#cuerpoDerecho").toggleClass("cuerpoDerechoReducido").toggleClass("cuerpoDerecho");
  $("aside").toggleClass("oculto");
  $("#abrirAside").show();
  //Detener animación COG 
  detener = true;
}

//Abrir aside
function abrirAside(){
  $("#cuerpoDerecho").toggleClass("cuerpoDerechoReducido").toggleClass("cuerpoDerecho");
  $("aside").toggleClass("oculto");
  $("#abrirAside").hide();
}

function login(){
  $.ajax({
    contentType: "application/json",
    method: "POST",
    url: "login",
    data: JSON.stringify({ content:
      {
        id: $("#id").val(),
        pass: $("#pass").val()
      }
    }),
    success: function(response) { logOk(response); },
    error: function(response) { LogError(response); }
  });

}