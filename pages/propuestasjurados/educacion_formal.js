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
          //cargar_tabla(token_actual);
          validator_form(token_actual);

          //Si el nivel es superior a bachiller muestra los select areasconocimientos y nucleosbasicos
          $('#niveleseducativos').change(function(){
              $("#niveleseducativos").val() > 2? $("#niveleseducativosextra").show() : $("#niveleseducativosextra").hide() ;
          });

            //cargar_select_nucleobasico
          $('#areasconocimientos').change(function(){
              cargar_select_nucleobasico(token_actual, $('#areasconocimientos').val() );
          });

        }

  });



  function cargar_datos_formulario(token_actual){

    // cargo los datos
    $.ajax({
        type: 'GET',
        url: url_pv + 'PropuestasJurados/search_educacion_formal',
        data: {"token": token_actual.token, "idc": $("#idc").val()},
    }).done(function (data) {

      switch (data) {
        case 'error':
          notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
          break;
        case 'error_metodo':
            notify("danger", "ok", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            break;
        case 'error_token':
          location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
          break;
        case 'acceso_denegado':
          notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
          break;
        default:

          var json = JSON.parse(data);

          if( json.usuario_perfil ){

            //Cargos el select de nivel_educacion
            $('#niveleseducativos').find('option').remove();
            $("#niveleseducativos").append('<option value="">:: Seleccionar ::</option>');
            if (json.niveleseducativos.length > 0) {
                $.each(json.niveleseducativos, function (key, array) {
                    $("#niveleseducativos").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
                });
            }
            //Cargos el select de areasconocimientos
            $('#areasconocimientos').find('option').remove();
            $("#areasconocimientos").append('<option value="">:: Seleccionar ::</option>');
            if (json.areasconocimientos.length > 0) {
                $.each(json.areasconocimientos, function (key, array) {
                    $("#areasconocimientos").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
                });
            }

            //Cargos el autocomplete de ciudad

            $( "#ciudad_name" ).autocomplete({
                source: json.ciudad,
                minLength: 2,
                select: function (event, ui) {
                    $(this).val(ui.item ? ui.item : " ");
                    $("#ciudad").val(ui.item.id);
                },
                change: function (event, ui) {
                    if (!ui.item) {
                        this.value = '';
                        $('.formulario_principal').bootstrapValidator('revalidateField', 'ciudad_name');
                        $("#ciudad").val("");
                    }
                //else { Return your label here }
                }
            });

            $("#formulario_principal").show();

            cargar_tabla(token_actual);

          }else{

            //window.location.href = url_pv_admin+"pages/perfilesparticipantes/jurado.html";
            notify("danger", "ok", "Convocatorias:", "No tiene el perfil de participante para esta convocatoria");

          }

          break;
        }

      }

      );

  }

  function cargar_select_nucleobasico(token_actual, id_areasconocimientos){


    // cargo los datos
    $.ajax({
        type: 'GET',
        url: url_pv + 'PropuestasJurados/select_nucleobasico',
        data: {"token": token_actual.token, "id": id_areasconocimientos },
    }).done(function (data) {

      switch (data) {
        case 'error':
          notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
          break;
        case 'error_metodo':
            notify("danger", "ok", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            break;
        case 'error_token':
          location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
          break;
        case 'acceso_denegado':
          notify("danger", "remove", "Usuario:", "No tiene permisos acceder a la información.");
          break;
        default:
          var json = JSON.parse(data);

          //Cargos el select de areasconocimientos
          $('#nucleosbasicos').find('option').remove();
          $("#nucleosbasicos").append('<option value="">:: Seleccionar ::</option>');
          if ( json != null && json.length > 0) {
              $.each(json, function (key, array) {
                  $("#nucleosbasicos").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
              });
          }
          break;
        }

      }
    );
  }

  function cargar_tabla(token_actual){

          //Cargar datos en la tabla actual
              $('#table_list').DataTable({
                  "language": {
                      "url": "../../dist/libraries/datatables/js/spanish.json"
                  },
                  "processing": true,
                  "destroy": true,
                  "serverSide": true,
                  "lengthMenu": [10, 15, 20],
                  "ajax":{
                      url : url_pv+"PropuestasJurados/all_educacion_formal",
                      data: {"token": token_actual.token, "idc": $("#idc").val() },
                    },
                    "drawCallback": function (settings) {
                       //$(".check_activar_t").attr("checked", "true");
                       //$(".check_activar_f").removeAttr("checked");
                       //acciones_ronda(token_actual);
                      },
                  "columns": [
                      {"data": "Nivel",
                        render: function ( data, type, row ) {
                              return row.nivel_educacion;
                              },
                      },
                      {"data": "Titulo",
                        render: function ( data, type, row ) {
                              return row.titulo;
                              },
                      },
                      {"data": "Institución educativa",
                        render: function ( data, type, row ) {
                              return row.institucion;
                              },
                      },
                      {"data": "Graduado",
                        render: function ( data, type, row ) {
                              return row.graduado;
                              },
                      },


                      {"data": "Seleccionar",
                        render: function ( data, type, row ) {
                              return ' <input title=\"'+row.id+'\" type=\"checkbox\" class=\"check_activar_'+row.active+'  activar_registro" '+(row.active? 'checked ':'')+' />';
                              },
                      },
                      {"data": "aciones",
                                render: function ( data, type, row ) {
                                            return '<button title="'+row.id+'" type="button" class="btn btn-warning btn_cargar" data-toggle="modal" data-target="#nueva_ronda\">'
                                                +'<span class="glyphicon glyphicon-edit"></span></button>';
                                            },
                      }



                  ]
              });

  }


  function validator_form(token_actual) {

      

      //Se debe colocar debido a que el calendario es un componente diferente
      $('.calendario').on('changeDate show', function (e) {
          $('.formulario_principal').bootstrapValidator('revalidateField', 'fecha_nacimiento');
      });
      //Validar el formulario
      $('.formulario_principal').bootstrapValidator({
          feedbackIcons: {
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
          },
          fields: {
              niveleseducativos:{
                validators: {
                    notEmpty: {message: 'La categoria es requerida'}
                }
              },
              titulo: {
                  validators: {
                      notEmpty: {message: 'El tipo de documento de identificación es requerido'}
                  }
              },
              institucion: {
                  validators: {
                      notEmpty: {message: 'La institución es requerida'}
                  }
              },
              ciudad_name: {
                  validators: {
                      notEmpty: {message: 'La cidudad es requerida'}
                  }
              },
              fecha: {
                  validators: {
                      notEmpty: {message: 'La fecha es requerida'}
                  }
              }
            }

      }).on('success.form.bv', function (e) {
          // Prevent form submission
          e.preventDefault();
          // Get the form instance
          var $form = $(e.target);

          // Get the BootstrapValidator instance
          var bv = $form.data('bootstrapValidator');

          if (typeof $("#idregistro").attr('value') == 'undefined') {
                console.log("guardar");

                  $('#graduado').is(":checked") ? $('#graduado').val(true):$('#graduado').val(false);

                //$("#id").val($("#idp").attr('value'));
                //Se realiza la peticion con el fin de guardar el registro actual
                $.ajax({
                    type: 'POST',
                    url: url_pv + 'PropuestasJurados/new_educacion_formal',
                    data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token
                }).done(function (result) {


                  switch (result) {
                    case 'error':
                      notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                      break;
                    case 'error_token':
                      location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                      break;
                    case 'acceso_denegado':
                      notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                      break;
                    case 'deshabilitado':
                      notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                      cargar_datos_formulario(token_actual);
                      break;
                    default:
                      notify("success", "ok", "Convocatorias:", "Se agregó el registro con éxito.");
                      cargar_datos_formulario(token_actual);
                      break;
                  }


                });

            }else{
                console.log("Actualizar");
            }


          $form.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
          //$form.bootstrapValidator('destroy', true);
          bv.resetForm();
      });

  }
