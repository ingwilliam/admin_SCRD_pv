/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 /*Cesar Britto*/
 $(document).ready(function () {


    $("#idc").val($("#id").val());
    $("#id").val(null);

     //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor
     var token_actual = getLocalStorage(name_local_storage);

     //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
     if ($.isEmptyObject(token_actual)) {
         location.href = '../../index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
     } else
     {
         //Verifica si el token actual tiene acceso de lectura
         permiso_lectura(token_actual, "Menu Participante");
         cargar_datos_formulario(token_actual);

         $("#postular").click(function(){


           if( $("#acepta").prop('checked') ){
             if(confirm("Esta seguro de postular su hoja de vida registrada hasta el momento?")){

               aceptar_terminos(token_actual);

             }
           }else{
             alert("No ha aceptado los terminos de participación");

           }

         });



       }

 });

 function cargar_datos_formulario(token_actual){


  PDFObject.embed("http://192.168.56.101:8080/share/page/document-details?nodeRef=workspace://SpacesStore/bbbfa389-1067-4564-9c3c-878381e09cb5", "#documento");


  //datos de la propuesta
  $.ajax({
      type: 'GET',
      data: {"token": token_actual.token, "modulo": "Menu Participante", "idc": $("#idc").val()},
      url: url_pv + 'PropuestasJurados/propuesta'
  }).done(function (data) {

    var json = JSON.parse(data);

    console.log(json);

    if(json.estado == 7){
      $("#estado").hide();
      $("#terminos").show();
      $("#formulario_principal").show();
    }
    if(json.estado == 8){
      $("#estado").show();
      $("#terminos").hide();
      $("#formulario_principal").hide();

    }

  });





 }

 function aceptar_terminos(token_actual){
   //alert("modificando estado de la propuesta"+$("#idc").val());
   //Peticion para inactivar el evento
   $.ajax({
       type: 'GET',
       data: {"token": token_actual.token, "modulo": "Menu Participante", "idc": $("#idc").val()},
       url: url_pv + 'PropuestasJurados/postular'
   }).done( function(result) {


   });



}
