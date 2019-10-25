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
         location.href = url_pv_admin+'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
     } else
     {
         //Verifica si el token actual tiene acceso de lectura
         permiso_lectura(token_actual, "Menu Participante");

         $("#back_step").attr("onclick", " location.href = 'documentos_administrativos.html?m=2&id="+  $("#idc").val()+"' ");
         $("#next_step").attr("onclick", " location.href = 'postulaciones.html?m=2&id="+  $("#idc").val()+"' ");
         cargar_datos_formulario(token_actual);

         $("#postular").click(function(){
           if( $("#acepta").prop('checked') ){

               $("#mensaje").show();
               $("#bcancelar").show();
               $("#baceptar").show();

               $("#mensaje2").hide();
               $("#aceptar").hide();

           }else{

                $("#mensaje").hide();
                $("#bcancelar").hide();
                $("#baceptar").hide();

                $("#mensaje2").show();
                $("#aceptar").show();

           }

         });

          $("#baceptar").click(function(){
            aceptar_terminos(token_actual);
            $('#exampleModal').modal('toggle');

          });

       }

 });

 function cargar_datos_formulario(token_actual){

   var documento;
   //PDFObject.embed("http://192.168.56.101:8080/share/page/context/mine/document-details?nodeRef=workspace://SpacesStore/8be63cb8-bb24-41e7-a7fa-e6e24e0ab0e0", "#documento");

  //datos de la propuesta
  $.ajax({
      type: 'GET',
      data: {"token": token_actual.token, "modulo": "Menu Participante", "idc": $("#idc").val()},
      url: url_pv + 'PropuestasJurados/propuesta'
  }).done(function (data) {

    var json = JSON.parse(data);

    documento = json.documento.id_alfresco;

    if(documento){

    }

    if(json.propuesta.estado == 7){

      $("#estado").hide();
      $("#terminos").show();
      $("#formulario_principal").show();
    }

    if(json.propuesta.estado == 8){
      $("#estado").show();
      $("#terminos").hide();
      $("#formulario_principal").hide();

    }

  });


  $(".download_file").click(function () {
    //Cargo el id file

    $.AjaxDownloader({
        url: url_pv + 'PropuestasJurados/download_file/',
        data : {
            cod   : documento,
            token   : token_actual.token
        }
    });

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

     cargar_datos_formulario(token_actual);

   });



}
