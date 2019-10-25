/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 /*Cesar Britto*/
 $(document).ready(function () {


    $("#idc").val($("#id").val());
    $("#id").val(null);

    $('#table_list_b').DataTable({
       "responsive": true
     });

     //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor
     var token_actual = getLocalStorage(name_local_storage);

     //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
     if ($.isEmptyObject(token_actual)) {
         location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
     } else
     {
         //Verifica si el token actual tiene acceso de lectura
         permiso_lectura(token_actual, "Menu Participante");
         $("#back_step").attr("onclick", " location.href = 'postular_hoja_vida.html?m=2&id="+  $("#idc").val()+"' ");

         cargar_select_area(token_actual);
         validator_form(token_actual);

         //Listado de las postulaicones
         cargar_tabla_p(token_actual);

         //Postular hoja de vida
         $("#postular").click(function () {

             $('#perfil_info').modal('toggle');
             //actualizar tabla postulaciones
             postular(token_actual);

         });

       }

 });

 function cargar_select_area(token_actual){


   $.ajax({
       type: 'GET',
       url: url_pv + 'PropuestasJurados/postulacion_select_area',
       data: {"token": token_actual.token},
   }).done(function (data) {

     switch (data) {
       case 'error':
         notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
         break;
       case 'error_metodo':
           notify("danger", "ok", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
           break;
       case 'error_token':
         location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
         break;
       case 'acceso_denegado':
         notify("danger", "remove", "Usuario:", "No tiene permisos acceder a la información.");
         break;
       default:
         var json = JSON.parse(data);

         //Cargos el select de areasconocimientos
         $('#area').find('option').remove();
         $("#area").append('<option value="">:: Seleccionar ::</option>');
         if ( json != null && json.length > 0) {
             $.each(json, function (key, array) {
                 $("#area").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
             });
         }

          $("#formulario_principal").show();

         break;
       }

     }
   );
 }

 function validator_form(token_actual) {

       //Validar el formulario
       $('.formulario_principal').bootstrapValidator({
           feedbackIcons: {
               valid: 'glyphicon glyphicon-ok',
               invalid: 'glyphicon glyphicon-remove',
               validating: 'glyphicon glyphicon-refresh'
           },
           fields: {
               area: {
                   validators: {
                       notEmpty: {message: 'El área es requerida'}
                   }
               },

             }

       }).on('success.form.bv', function (e) {


           // Prevent form submission
           e.preventDefault();
           // Get the form instance
           var $form = $(e.target);

           // Get the BootstrapValidator instance
           var bv = $form.data('bootstrapValidator');

           //litado de las convocatorias a las cuales puede el jurado aplicar
           cargar_tabla_b(token_actual);

           $form.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
           bv.resetForm();


       });

   }

 function cargar_tabla_b(token_actual){
     console.log("idconvocatoria-->"+$("#idc").val() );
     //Cargar datos en la tabla actual
     $('#table_list_b').DataTable().clear().destroy();


      $('#postular').removeProp('disabled');
      $('#postular').removeAttr('disabled');

     $('#table_list_b').DataTable({
                   "language": {
                       "url": "../../dist/libraries/datatables/js/spanish.json"
                   },
                   "processing": true,
                   "destroy": true,
                   "serverSide": true,
                   "lengthMenu": [5,10],
                   "responsive": true,
                   "ajax":{
                       url : url_pv+"PropuestasJurados/postulacion_search_convocatorias",
                       data: {"token": token_actual.token, "area": $("#area").val(), "idc": $("#idc").val() },
                       async: false
                     },
                   "drawCallback": function (settings) {
                      //$(".check_activar_t").attr("checked", "true");
                      //$(".check_activar_f").removeAttr("checked");
                      acciones_b_registro(token_actual);
                     },
                   "columns": [

                       {"data": "Tipo programa",
                         render: function ( data, type, row ) {
                               return row.programa;
                               },
                       },
                       {"data": "Entidad",
                         render: function ( data, type, row ) {
                               return row.entidad;
                               },
                       },
                       {"data": "Area",
                         render: function ( data, type, row ) {
                               return row.area;
                               },
                       },
                       {"data": "Linea",
                         render: function ( data, type, row ) {
                               return row.linea_estrategica;
                               },
                       },
                       {"data": "Enfoque",
                         render: function ( data, type, row ) {
                               return row.enfoque;
                               },
                       },
                       {"data": "Nombre",
                         render: function ( data, type, row ) {
                               return row.nombre;
                               },
                       },
                       {"data": "aciones",
                                 render: function ( data, type, row ) {
                                             return '<button id="'+row.id+'"  title="Postularse" type="button" class="btn btn-warning btn_cargar_b" data-toggle="modal" data-target="#perfil_info\">'
                                                 +'<span class=" 	glyphicon glyphicon-check"></span></button>'
                                                 +'<button name="'+row.id+'"  title="Enlace de la convocatoria" type="button" class="btn btn-warning btn_link">'
                                                 +'<span class="glyphicon glyphicon-link"></span></button>';
                                             },
                       }

                   ]
               });

   }

   //Permite realizar acciones despues de cargar la tabla
 function acciones_b_registro(token_actual) {

     //Permite realizar la carga respectiva de cada registro
     $(".btn_cargar_b").click(function () {
         $("#idregistro").val( $(this).attr("id") );

         $("#lista_perfiles").find('div').remove();

         // cargo los datos
         cargar_datos_perfiles(token_actual);
     });

     $("#aceptar").click(function(){
       $('#perfil_info').modal('toggle');
     });

   }

 function cargar_datos_perfiles(token_actual){
    //$("#postular").attr("disabled","disabled");
    $('#postular').removeProp('disabled');
    $('#postular').removeAttr('disabled');

     // cargo los datos
     $.ajax({
         type: 'GET',
         url: url_pv + 'PropuestasJurados/postulacion_perfiles_convocatoria',
         data: {"token": token_actual.token, "idregistro": $("#idregistro").val()},

     }).done(function (data) {

       switch (data) {
         case 'error':
           notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
           break;
         case 'error_metodo':
             notify("danger", "ok", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
             break;
         case 'error_token':
           location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
           break;
         case 'acceso_denegado':
           notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
           break;
         default:

           var json = JSON.parse(data);

           $("#lista_perfiles").find('div').remove();

               if (json.length > 0) {

                   $.each(json, function (key, perfil_jurado) {
                       $("#lista_perfiles").append(
                         '  <div class="row"> <div class="col-lg-12">'
                         +'   <h4>Perfil '+(key+1)+'</h4></div>'
                         +'   <div class="col-lg-6"><div class="form-group">'
                         +'       <label>Descripción perfil</label>'
                         +'       <textarea id="descripcion_perfil" name="descripcion_perfil" class="form-control" rows="3" readonly style="resize:none">'+perfil_jurado.descripcion_perfil+'</textarea>'
                         +'   </div></div>'
                         +'   <div class="col-lg-6"><div class="form-group">'
                         +'       <label>Experiencia</label>'
                         +'       <textarea id="descripcion_perfil" name="descripcion_perfil" class="form-control" rows="3" readonly style="resize:none">'+perfil_jurado.campo_experiencia+'</textarea>'
                         +'   </div></div>'
                         +'   <div class="col-lg-6"><div class="form-group">'
                         +'       <label>Formación profesional</label>'
                         +'       <textarea id="descripcion_perfil" name="descripcion_perfil" class="form-control" rows="1" readonly style="resize:none">'+(perfil_jurado.formacion_profesional==true? 'Si' : 'No')+'</textarea>'
                         +'   </div></div>'
                         +'   <div class="col-lg-6"><div class="form-group">'
                         +'       <label>Residir en Bogotá</label>'
                         +'       <textarea id="descripcion_perfil" name="descripcion_perfil" class="form-control" rows="1" readonly style="resize:none">'+(perfil_jurado.reside_bogota==true? 'Si' : 'No')+'</textarea>'
                         +'   </div></div>'
                         +'</div>'

                       );
                     });

                     $("#postular").show();
                     $("#cancelar").show();

                     $("#aceptar").hide();

               }else{
                 $("#lista_perfiles").append(
                   '  <div class="row"> '
                   +' <div class="col-lg-12"> <h4>No tiene perfiles de jurado</h4></div>'
                   +'</div>'
                 );

                 $("#postular").hide();
                  $("#cancelar").hide();
                 $("#aceptar").show();


               }



           break;
         }

       }

       );

   }

 function postular(token_actual){

      $.ajax({
          type: 'POST',
          url: url_pv + 'PropuestasJurados/new_postulacion',
          data: {"token": token_actual.token, "modulo":"Menu Participante", "idc": $("#idc").val(), "idregistro": $("#idregistro").val()},
      }).done(function (result) {

        switch (result) {
          case 'error':
            notify("danger", "ok", "Convocatorias:", "Se registró un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            break;
          case 'error_token':
            location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
            break;
          case 'acceso_denegado':
            notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
            break;
          case 'deshabilitado':
            notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
              //cargar_tabla_p(token_actual);
            break;
          case 'error_limite':
            notify("danger", "remove", "Usuario:", "Se cumplió el máximo de postulaciones");
            ///  cargar_tabla_p(token_actual);
            break;
          default:
            notify("success", "ok", "Convocatorias:", "Se postuló la hoja de vida con éxito.");
              $('#table_list_b').DataTable().clear().destroy();
              cargar_tabla_p(token_actual);
            break;
        }

      });

    }

 function cargar_tabla_p(token_actual){

       //Cargar datos en la tabla actual
       $('#table_list_p').DataTable({
                     "language": {
                         "url": "../../dist/libraries/datatables/js/spanish.json"
                     },
                     "processing": true,
                     "destroy": true,
                     "serverSide": true,
                     "lengthMenu": [5,10,15],
                     "bFilter":false,
                     "info":     false,
                     "responsive": true,
                     "ajax":{
                         url : url_pv+"PropuestasJurados/search_postulacion",
                         data: {"token": token_actual.token,  "idc": $("#idc").val() },
                         async: false
                       },
                       "drawCallback": function (settings) {
                          //$(".check_activar_t").attr("checked", "true");
                          //$(".check_activar_f").removeAttr("checked");
                         acciones_P_registro(token_actual);
                         },
                     "columns": [

                         {"data": "Tipo programa",
                           render: function ( data, type, row ) {
                                 return row.convocatoria.programa;
                                 },
                         },
                         {"data": "Entidad",
                           render: function ( data, type, row ) {
                                 return row.convocatoria.entidad;
                                 },
                         },
                         {"data": "Area",
                           render: function ( data, type, row ) {
                                 return row.convocatoria.area;
                                 },
                         },
                         {"data": "Linea",
                           render: function ( data, type, row ) {
                                 return row.convocatoria.linea_estrategica;
                                 },
                         },
                         {"data": "Enfoque",
                           render: function ( data, type, row ) {
                                 return row.convocatoria.enfoque;
                                 },
                         },
                         {"data": "Nombre",
                           render: function ( data, type, row ) {
                                 return row.convocatoria.nombre;
                                 },
                         },

                         {"data": "Seleccionar",
                           render: function ( data, type, row ) {
                                 return ' <input title=\"'+row.postulacion.id+'\" type=\"checkbox\" class=\"check_activar_'+row.postulacion.active+'  activar_registro" '+(row.postulacion.active? 'checked ':'')+' />';
                                 },
                         },

                                              ]
                 });

     }

   //Permite realizar acciones despues de cargar la tabla
 function acciones_P_registro(token_actual) {

   //Permite activar o eliminar una registro
   $(".activar_registro").click(function () {

       //Cambio el estado del check
       var active = "false";

       if ($(this).prop('checked')) {
           active = "true";
       }

       //Peticion para inactivar el evento
       $.ajax({
           type: 'DELETE',
           data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active, "idc": $("#idc").val()},
           url: url_pv + 'PropuestasJurados/delete_postulacion/' + $(this).attr("title")
       }).done(function (result) {

         switch (result) {
           case 'Si':
               notify("info", "ok", "Convocatorias:", "Se activó el registro con éxito.");
               break;
           case 'No':
                 notify("info", "ok", "Convocatorias:", "Se desactivó el registro con éxito.");
                 break;
           case 'error':
             notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
             break;
           case 'error_token':
             location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
             break;
           case 'acceso_denegado':
             notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
             break;
           case 'deshabilitado':
             notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
             break;
           default:
             notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
             cargar_tabla_p(token_actual);
             break;
         }


       });
   });

   }
