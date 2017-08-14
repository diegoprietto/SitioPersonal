"use strict";

//Indica si esta en movimiento o no
var enMovimiento = false;


$(document).ready(function () {
	//Inicio
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