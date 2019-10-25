$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
          location.href = url_pv_admin+'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {
        //Verifica si el token actual tiene acceso de lectura
        permiso_lectura(token_actual, "Jurados");
        init(token_actual) ;
        //cargar_datos_formulario(token_actual);
        //validator_form(token_actual);

        //carga select_convocatorias
        $('#anio').change(function(){
            cargar_select_convocatorias(token_actual, $('#anio').val(),  $('#entidad').val() );
        });
        //carga select_convocatorias
        $('#entidad').change(function(){
            cargar_select_convocatorias(token_actual, $('#anio').val(),  $('#entidad').val() );
        });
        //carga select_convocatorias
        $('#convocatorias').change(function(){
            cargar_select_categorias(token_actual,  $('#convocatorias').val() );
        });

        //carga la tabla con los criterios de busqueda
        $('#buscar').click(function(){
        //  alert("buscando");
            $('#resultado').focus();
            cargar_tabla(token_actual);
        });

        $('#buscar_banco').click(function(){
          //alert("buscando");
            $('#resultado').focus();
            cargar_tabla(token_actual);
        });

        $("#optionsRadiosInline1").click(function () {
          $('#evaluar').show();
        });

        $("#optionsRadiosInline2").click(function () {

          //$('#evaluar').toggle();

        });


    }

});

function init(token_actual) {
  //Realizo la peticion para cargar el formulario
  $.ajax({
      type: 'GET',
      data: {"token": token_actual.token, "id": $("#id").attr('value')},
      url: url_pv + 'Juradospreseleccion/init/'
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

        //Cargos el select de entidad
        $('#entidad').find('option').remove();
        $("#entidad").append('<option value="">:: Seleccionar ::</option>');
        if (json.entidades.length > 0) {
            $.each(json.entidades, function (key, entidad) {
                $("#entidad").append('<option value="' + entidad.id + '" >' + entidad.nombre + '</option>');
            });
        }

        //Cargos el select de entidad
        $('#anio').find('option').remove();
        $("#anio").append('<option value="">:: Seleccionar ::</option>');
        if (json.anios.length > 0) {
            $.each(json.anios, function (key, value) {
                $("#anio").append('<option value="' + value + '" >' + value + '</option>');
            });
        }

        break;
      }

  });



}

function cargar_select_convocatorias(token_actual, anio, entidad){


  $.ajax({
      type: 'GET',
      url: url_pv + 'Juradospreseleccion/select_convocatorias',
      data: {"token": token_actual.token, "anio": anio, "entidad":entidad },
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
        $('#convocatorias').find('option').remove();
        $("#convocatorias").append('<option value="">:: Seleccionar ::</option>');
        if ( json != null && json.length > 0) {
            $.each(json, function (key, array) {
                $("#convocatorias").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
            });
        }



        break;
      }

    }
  );
}

function cargar_select_categorias(token_actual, convocatoria){


  $.ajax({
      type: 'GET',
      url: url_pv + 'Juradospreseleccion/select_categorias',
      data: {"token": token_actual.token, "convocatoria": convocatoria },
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
        $('#categorias').find('option').remove();
        $("#categorias").append('<option value="">:: Seleccionar ::</option>');
        if ( json != null && json.length > 0) {
            $.each(json, function (key, array) {
                $("#categorias").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
            });
        }



        break;
      }

    }
  );
}

function cargar_tabla(token_actual){
 //var data = JSON.stringify( $("#formulario_busqueda_banco").serializeArray() );
var data =  $("#formulario_busqueda_banco").serializeArray();
  $('#table_list').DataTable({
                "language": {
                    "url": "../../dist/libraries/datatables/js/spanish.json"
                },
                "processing": true,
                "destroy": true,
                "serverSide": true,
                "lengthMenu": [10, 15, 20],
                "responsive": true,
                "ajax":{
                    url : url_pv+"Juradospreseleccion/all_preseleccionados",
                    data:
                            { "token": token_actual.token,
                              "convocatoria": $('#convocatorias').val(),
                              "filtros" : data
                            },



                    //async: false
                  },
                  "drawCallback": function (settings) {
                     //$(".check_activar_t").attr("checked", "true");
                     //$(".check_activar_f").removeAttr("checked");
                     acciones_registro(token_actual);

                    },
                "columns": [
                      {"data": "Postulado",
                    render: function ( data, type, row ) {
                            return row.postulado;
                          },
                    },

                    {"data": "Tipo documento",
                      render: function ( data, type, row ) {
                            return row.tipo_documento;
                          },
                    },
                    {"data": "Número documento",
                      render: function ( data, type, row ) {
                            return row.numero_documento;
                          },
                    },
                    {"data": "Nombres",
                      render: function ( data, type, row ) {
                            return row.nombres;
                          },
                    },
                    {"data": "Apellidos",
                      render: function ( data, type, row ) {
                            return row.apellidos;
                          },
                    },
                    {"data": "Puntaje",
                      render: function ( data, type, row ) {
                            return row.puntaje;
                          },
                    },


                    /*{"data": "Seleccionar",
                      render: function ( data, type, row ) {
                            return ' <input title=\"'+row.id+'\" type=\"checkbox\" class=\"check_activar_'+row.active+'  activar_registro" '+(row.active? 'checked ':'')+' />';
                            },
                    },*/
                    {"data": "aciones",
                              render: function ( data, type, row ) {
                                          return '<button id="'+row.id+'" title="Evaluar la hoja de vida " type="button" class="btn btn-primary btn_cargar" data-toggle="modal" data-target="#evaluar">'
                                              +'<span class="glyphicon glyphicon-check"></span></button>' ;
                                          },
                    }



                ]
            });

}


function acciones_registro(token_actual){


  $(".btn_cargar").click(function(){
    //alert( $(this).attr("id")+"\tconvocatoria:"+ $('#convocatorias').val() );
    //aceptar_terminos(token_actual);
    //$('#evaluar').modal('toggle');

     cargar_datos_basicos(token_actual,$(this).attr("id") );
     cargar_tabla_educacion_formal(token_actual, $(this).attr("id"));
     cargar_tabla_educacion_no_formal(token_actual, $(this).attr("id"));
     cargar_tabla_experiencia(token_actual, $(this).attr("id"));
     cargar_tabla_experiencia_jurado(token_actual, $(this).attr("id"));
     cargar_tabla_reconocimiento(token_actual, $(this).attr("id"));
     cargar_tabla_publicaciones(token_actual, $(this).attr("id"));
     cargar_criterios_evaluacion(token_actual,  $(this).attr("id") );

  });

}

//carga información básica del participante seleccionado
function cargar_datos_basicos(token_actual, participante){
  //consulto si tengo ppropuesta cargada

  // cargo los datos
  $.ajax({
      type: 'GET',
      url: url_pv + 'Juradospreseleccion/search_info_basica_jurado',
      data: {"token": token_actual.token, "idc":  $('#convocatorias').val(), "participante":participante},
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
      case 'deshabilitado':
        notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
        cargar_datos_formulario(token_actual);
        break;
      default:

        var json = JSON.parse(data);

        if( json.participante ){

          $('#tipo_documento').html(json.participante.tipo_documento);
          $('#numero_documento').html(json.participante.numero_documento);

          $('#nombres').html(json.participante.primer_nombre+' '+json.participante.segundo_nombre);
          $('#apellidos').html(json.participante.primer_apellido+' '+json.participante.segundo_apellido);

          $('#fecha_nacimiento').html(json.participante.fecha_nacimiento);
          $('#sexo').html(json.participante.sexo);

          $('#orientacion_sexual').html(json.participante.orientacion_sexual);
          $('#identidad_genero').html(json.participante.identidad_genero);

          $('#ciudad').html(json.participante.ciudad_residencia);
          $('#barrio').html(json.participante.barrio_residencia);

          $('#direccion_residencia').html(json.participante.direccion_residencia);
          $('#correo_electronico').html(json.participante.correo_electronico);
          $('#perfil').html(json.perfil);

          $('#nombres2').html(json.participante.primer_nombre+' '+json.participante.segundo_nombre);
          $('#apellidos2').html(json.participante.primer_apellido+' '+json.participante.segundo_apellido);
          $('#perfil2').html(json.perfil);
          //$('<p>'+json.participante.tipo_documento+'</p>').appendTo('#tipo_documento');
/*
          $("#idp").val(json.participante.id);
          //console.log("tipo-->"+json.participante.tipo);
          $('#categoria').val(json.categoria);
          $('#numero_documento').val(json.participante.numero_documento);
          $('#primer_nombre').val(json.participante.primer_nombre);
          $('#segundo_nombre').val(json.participante.segundo_nombre);
          $('#primer_apellido').val(json.participante.primer_apellido);
          $('#segundo_apellido').val(json.participante.segundo_apellido);
          $('#fecha_nacimiento').val(json.participante.fecha_nacimiento);

          if(json.participante.ciudad_nacimiento != null){
            $('#ciudad_nacimiento_name').val(json.participante.ciudad_nacimiento.label);
            $('#ciudad_nacimiento').val(json.participante.ciudad_nacimiento.id);
          }

          if(json.participante.ciudad_residencia != null){
            $('#ciudad_residencia_name').val(json.participante.ciudad_residencia.label);
            $('#ciudad_residencia').val(json.participante.ciudad_residencia.id);
          }

          if(json.participante.barrio_residencia != null ){
            $('#barrio_residencia_name').val(json.participante.barrio_residencia.label);
            $('#barrio_residencia').val(json.participante.barrio_residencia.id);
          }

          $('#direccion_residencia').val(json.participante.direccion_residencia);
          $('#direccion_correspondencia').val(json.participante.direccion_correspondencia);
          $('#numero_telefono').val(json.participante.numero_telefono);
          $('#numero_celular').val(json.participante.numero_celular);
          $('#correo_electronico').val(json.participante.correo_electronico);


          //Cargos el select de tipo de documento
          $('#tipo_documento').find('option').remove();
          $("#tipo_documento").append('<option value="">:: Seleccionar ::</option>');
          if (json.tipo_documento.length > 0) {
              $.each(json.tipo_documento, function (key, array) {
                  var selected = '';
                  if(json.participante != null  && array.id == json.participante.tipo_documento)
                  {
                      selected = 'selected="selected"';
                  }
                  $("#tipo_documento").append('<option value="' + array.id + '" '+selected+' >' + array.descripcion + '</option>');
              });
          }


          //Cargos el select de sexo
          $('#sexo').find('option').remove();
          $("#sexo").append('<option value="">:: Seleccionar ::</option>');
          if (json.sexo.length > 0) {
              $.each(json.sexo, function (key, array) {
                  var selected = '';
                  if( json.participante != null  && array.id == json.participante.sexo)
                  {
                      selected = 'selected="selected"';
                  }
                  $("#sexo").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
              });
          }
          //Cargos el select de orientacion sexual
          $('#orientacion_sexual').find('option').remove();
          $("#orientacion_sexual").append('<option value="">:: Seleccionar ::</option>');
          if (json.orientacion_sexual.length > 0) {
              $.each(json.orientacion_sexual, function (key, array) {
                  var selected = '';
                  if(json.participante != null  &&  array.id == json.participante.orientacion_sexual)
                  {
                      selected = 'selected="selected"';
                  }
                  $("#orientacion_sexual").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
              });
          }
          //Cargos el select de identidad genero
          $('#identidad_genero').find('option').remove();
          $("#identidad_genero").append('<option value="">:: Seleccionar ::</option>');
          if (json.orientacion_sexual.length > 0) {
              $.each(json.identidad_genero, function (key, array) {
                  var selected = '';
                  if(json.participante != null  &&  array.id == json.participante.identidad_genero)
                  {
                      selected = 'selected="selected"';
                  }
                  $("#identidad_genero").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
              });
          }
          //Cargos el select de grupo etnico
          $('#grupo_etnico').find('option').remove();
          $("#grupo_etnico").append('<option value="">:: Seleccionar ::</option>');
          if (json.grupo_etnico.length > 0) {
              $.each(json.grupo_etnico, function (key, array) {
                  var selected = '';
                  if( json.participante != null  &&  array.id == json.participante.grupo_etnico)
                  {
                      selected = 'selected="selected"';
                  }
                  $("#grupo_etnico").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
              });
          }
          //Cargos el select de estrato
          $('#estrato').find('option').remove();
          $("#estrato").append('<option value="">:: Seleccionar ::</option>');
          if (json.estrato.length > 0) {
              $.each(json.estrato, function (key, array) {
                  var selected = '';
                  if(json.participante != null  &&  array == json.participante.estrato)
                  {
                      selected = 'selected="selected"';
                  }
                  $("#estrato").append('<option value="' + array + '" '+selected+' >' + array + '</option>');
              });
          }

          //Cargos el autocomplete de ciudad de nacimiento
          //$("#ciudad_nacimiento_name").val(json.ciudad[json.participante.ciudad_nacimiento].label);
          $( "#ciudad_nacimiento_name" ).autocomplete({
              source: json.ciudad,
              minLength: 2,
              select: function (event, ui) {
                  $(this).val(ui.item ? ui.item : " ");
                  $("#ciudad_nacimiento").val(ui.item.id);
              },

              change: function (event, ui) {
                  if (!ui.item) {
                      this.value = '';
                      $("#ciudad_nacimiento").val("");
                  }
              //else { Return your label here }
              }
          });

          //Cargos el autocomplete de ciudad de residencia

          $( "#ciudad_residencia_name" ).autocomplete({
              source: json.ciudad,
              minLength: 2,
              select: function (event, ui) {
                  $(this).val(ui.item ? ui.item : " ");
                  $("#ciudad_residencia").val(ui.item.id);
              },
              change: function (event, ui) {
                  if (!ui.item) {
                      this.value = '';
                      $('.formulario_principal').bootstrapValidator('revalidateField', 'ciudad_residencia_name');
                      $("#ciudad_residencia").val("");
                  }
              //else { Return your label here }
              }
          });

          //Cargos el autocomplete de barrios

          $( "#barrio_residencia_name" ).autocomplete({
              source: json.barrio,
              minLength: 2,
              select: function (event, ui) {
                  $(this).val(ui.item ? ui.item : " ");
                  $("#barrio_residencia").val(ui.item.id);
              },
              change: function (event, ui) {
                  if (!ui.item) {
                      this.value = '';
                      $("#barrio_residencia").val("");
                  }
              //else { Return your label here }
              }
          });

            $("#formulario_principal").show();
*/
        }else{

          //console.log(notify());

          //window.location.href = url_pv_admin+"pages/perfilesparticipantes/jurado.html";
        //  notify("danger", "ok", "Convocatorias:", "No tiene el perfil de participante para esta convocatoria.");
        //  location.href = url_pv_admin+"/perfilesparticipantes/jurado.html";
          //location.href = url_pv_admin + 'pages/perfilesparticipantes/jurado.html?msg=No tiene el perfil de participante para esta convocatoria.&msg_tipo=danger';
        // window.location.href = url_pv_admin+"pages/perfilesparticipantes/jurado.html?msg=No tiene el perfil de participante para esta convocatoria. Debe registrar los datos del perfil.&msg_tipo=danger";

        }

        break;
      }

    }

    );

}

//carga información de la educacion formal
function cargar_tabla_educacion_formal(token_actual, participante){
  //Cargar datos en la tabla actual
  $('#table_educacion_formal').DataTable({
                "language": {
                    "url": "../../dist/libraries/datatables/js/spanish.json"
                },
                "processing": true,
                "destroy": true,
                "serverSide": true,
                "lengthMenu": [10, 15, 20],
                "responsive": true,
                "searching":false,
                "ajax":{
                    url : url_pv+"Juradospreseleccion/all_educacion_formal",
                    data: {"token": token_actual.token, "idc":$('#convocatorias').val(), "participante":participante },
                    //async: false
                  },
                  "drawCallback": function (settings) {
                     //$(".check_activar_t").attr("checked", "true");
                     //$(".check_activar_f").removeAttr("checked");
                     acciones_registro_educacion_formal(token_actual);
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
                            return (row.graduado == true? 'Si':'No');
                            },
                    },
                    {"data": "aciones",
                              render: function ( data, type, row ) {
                                          return '<button  id="'+row.id+'" title="Ver mas información" type="button" class="btn btn-success btn_cargar_educacion_formal"  >'
                                              +'<span class="glyphicon glyphicon-eye-open "></span></button>'
                                              +'<button id="'+ row.file+'" title="'+( row.file == null ? "No se ha cargado archivo": "Descargar archivo")+'" type="button" class="btn btn-primary download_file_educacion_formal">'
                                              + ( row.file == null ? '<span class="glyphicon glyphicon-ban-circle" title="No se ha cargado archivo"></span>':'<span class="glyphicon glyphicon-download-alt"></span>')
                                              + '</button>';
                                          },
                    }



                ]
            });

}

//Permite realizar acciones despues de cargar la tabla educacion formal
function acciones_registro_educacion_formal(token_actual) {

  //Permite realizar la carga respectiva de cada registro
    $(".btn_cargar_educacion_formal").click(function (data) {

      /*$.ajax({
          type: 'GET',
          url: url_pv + 'Juradospreseleccion/all_educacion_formal',
          data: "&modulo=Menu Participante&token=" + token_actual.token+"&idc="+$('#convocatorias').val()+"&participante="+participante
      }).done(function (data) {

        });
        */
      //  $('#vermasModalLabel').html("Educación formal");

      $('#contenidox').html(" <div class='row'><div class='col-lg-6'>"
                          +"    <h5><b>Titulo: </b><div id='titulo'>"+$(this).attr("id")+" </div></h5>"
                          +"  </div>"
                          +"  <div class='col-lg-6'>"
                          +"    <h5><b>Número de documento de identificación: </b><div id='numero_documento'> </div></h5>"
                          +"  </div></div>");

           $('#vermas').show();
           $('#table_eformal').toggle();
    /*  $("#idregistro").val( $(this).attr("title") );
      // cargo los datos
      cargar_datos_formulario(token_actual);*/
    });

    $("#vermas_back").click(function () {
      $('#vermas').toggle();
      $('#table_eformal').show();
    });


  //Permite activar o eliminar una registro
  /*$(".activar_registro").click(function () {

      //Cambio el estado del check
      var active = "false";

      if ($(this).prop('checked')) {
          active = "true";
      }

      //Peticion para inactivar el evento
      $.ajax({
          type: 'DELETE',
          data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active, "idc": $("#idc").val()},
          url: url_pv + 'PropuestasJurados/delete_educacion_formal/' + $(this).attr("title")
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
            cargar_datos_formulario(token_actual);
            break;
          default:
            notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
            cargar_datos_formulario(token_actual);
            break;
        }


      });
  });
  */
  //descargar archivo
  $(".download_file_educacion_formal").click(function () {
    //Cargo el id file
    var cod = $(this).attr('id');

    $.AjaxDownloader({
        url: url_pv + 'PropuestasJurados/download_file/',
        data : {
            cod   : cod,
            token   : token_actual.token
        }
    });

  });

}


//carga información de la educacion no formal
function cargar_tabla_educacion_no_formal(token_actual, participante){
  //Cargar datos en la tabla actual
  $('#table_educacion_no_formal').DataTable({
                "language": {
                    "url": "../../dist/libraries/datatables/js/spanish.json"
                },
                "processing": true,
                "destroy": true,
                "serverSide": true,
                "lengthMenu": [10, 15, 20],
                "responsive": true,
                "searching":false,
                "ajax":{
                    url : url_pv+"Juradospreseleccion/all_educacion_no_formal",
                    data: {"token": token_actual.token,"idc":$('#convocatorias').val(), "participante":participante },
                  //  async: false
                  },
                  "drawCallback": function (settings) {
                     //$(".check_activar_t").attr("checked", "true");
                     //$(".check_activar_f").removeAttr("checked");
                     acciones_registro_educacion_no_formal(token_actual);
                    },
                "columns": [
                    {"data": "Tipo",
                      render: function ( data, type, row ) {
                            return row.tipo;
                            },
                    },
                    {"data": "Modalidad",
                      render: function ( data, type, row ) {
                            return row.modalidad;
                            },
                    },
                    {"data": "Noḿbre",
                      render: function ( data, type, row ) {
                            return row.nombre;
                            },
                    },
                    {"data": "Institución",
                      render: function ( data, type, row ) {
                            return row.institucion;
                            },
                    },
                    {"data": "Fecha de Inicio",
                      render: function ( data, type, row ) {
                            return row.fecha_inicio;
                            },
                    },
                    {"data": "Fecha de Terminación",
                      render: function ( data, type, row ) {
                            return row.fecha_fin;
                            },
                    },
                    {"data": "Número de Horas",
                      render: function ( data, type, row ) {
                            return row.numero_hora;
                            },
                    },
                    {"data": "Ciudad",
                      render: function ( data, type, row ) {
                            return row.ciudad;
                            },
                    },

                    {"data": "aciones",
                              render: function ( data, type, row ) {
                                          return '<button  id="'+row.id+'" title="Ver mas información"  type="button" class="btn btn-success btn_cargar_educacion_no_formal" >'
                                              +'<span class="glyphicon glyphicon-eye-open"></span></button>'
                                              +'<button id="'+row.file+'" title="'+( row.file == null ? "No se ha cargado archivo": "Descargar archivo")+'" type="button" class="btn btn-primary download_file_educacion_no_formal">'
                                              + ( row.file == null ? '<span class="glyphicon glyphicon-ban-circle" title="No se ha cargado archivo"></span>':'<span class="glyphicon glyphicon-download-alt"></span>')
                                              + '</button>';

                                          },
                    }



                ]
            });


}

//Permite realizar acciones despues de cargar la tabla educacion no formal
function acciones_registro_educacion_no_formal(token_actual) {

  //Permite realizar la carga respectiva de cada registro
    $(".btn_cargar_educacion_no_formal").click(function () {

      /*$.ajax({
          type: 'GET',
          url: url_pv + 'Juradospreseleccion/all_educacion_formal',
          data: "&modulo=Menu Participante&token=" + token_actual.token+"&idc="+$('#convocatorias').val()+"&participante="+participante
      }).done(function (data) {

        });
        */
      //  $('#vermasModalLabel').html("Educación formal");

      $('#contenido_enf').html(" <div class='row'><div class='col-lg-6'>"
                          +"    <h5><b>Titulo: </b><div id='titulo'>"+$(this).attr("id")+" </div></h5>"
                          +"  </div>"
                          +"  <div class='col-lg-6'>"
                          +"    <h5><b>Número de documento de identificación: </b><div id='numero_documento'> </div></h5>"
                          +"  </div></div>");

           $('#vermas_enf').show();
           $('#table_enformal').toggle();
    /*  $("#idregistro").val( $(this).attr("title") );
      // cargo los datos
      cargar_datos_formulario(token_actual);*/
    });

    $("#vermas_back_enf").click(function () {
      $('#vermas_enf').toggle();
      $('#table_enformal').show();
    });


  //Permite activar o eliminar una registro
  /*$(".activar_registro").click(function () {

      //Cambio el estado del check
      var active = "false";

      if ($(this).prop('checked')) {
          active = "true";
      }

      //Peticion para inactivar el evento
      $.ajax({
          type: 'DELETE',
          data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active, "idc": $("#idc").val()},
          url: url_pv + 'PropuestasJurados/delete_educacion_formal/' + $(this).attr("title")
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
            cargar_datos_formulario(token_actual);
            break;
          default:
            notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
            cargar_datos_formulario(token_actual);
            break;
        }


      });
  });
  */
  //descargar archivo
  $(".download_file_educacion_no_formal").click(function () {
    //Cargo el id file
    var cod = $(this).attr('id');

    $.AjaxDownloader({
        url: url_pv + 'PropuestasJurados/download_file/',
        data : {
            cod   : cod,
            token   : token_actual.token
        }
    });

  });

}

//carga información de la experiencia disciplinar
function cargar_tabla_experiencia(token_actual, participante){
  //Cargar datos en la tabla actual
  $('#table_experiencia').DataTable({
                "language": {
                    "url": "../../dist/libraries/datatables/js/spanish.json"
                },
                "processing": true,
                "destroy": true,
                "serverSide": true,
                "lengthMenu": [10, 15, 20],
                "responsive": true,
                "searching":false,
                "ajax":{
                    url : url_pv+"Juradospreseleccion/all_experiencia_laboral",
                    data: {"token": token_actual.token, "idc":$('#convocatorias').val(), "participante":participante },
                    async: false
                  },
                  "drawCallback": function (settings) {
                     //$(".check_activar_t").attr("checked", "true");
                     //$(".check_activar_f").removeAttr("checked");
                     acciones_registro_experiencia(token_actual);
                    },
                "columns": [
                    {"data": "Ciudad",
                      render: function ( data, type, row ) {
                            return row.ciudad;
                            },
                    },

                    {"data": "Tipo Entidad",
                      render: function ( data, type, row ) {
                            return row.tipo_entidad;
                            },
                    },

                    {"data": "Entidad",
                      render: function ( data, type, row ) {
                            return row.entidad;
                            },
                    },
                    {"data": "Línea",
                      render: function ( data, type, row ) {
                            return row.linea;
                            },
                    },

                    {"data": "Fecha de Inicio",
                      render: function ( data, type, row ) {
                            return row.fecha_inicio;
                            },
                    },
                    {"data": "Fecha de Terminación",
                      render: function ( data, type, row ) {
                            return row.fecha_fin;
                            },
                    },
                    {"data": "Meses de Experiencia",
                      render: function ( data, type, row ) {
                            return  ( ( ( (new Date(row.fecha_fin)) - (new Date(row.fecha_inicio)) ) / (60 * 60 * 24 * 1000) ) / 30 ).toFixed(1);
                            },
                    },

                    {"data": "aciones",
                              render: function ( data, type, row ) {
                                          return '<button  id="'+row.id+'" title="Ver mas información" type="button" class="btn btn-success btn_cargar_experiencia" >'
                                              +'<span class="glyphicon glyphicon-eye-open"></span></button>'
                                              +'<button  id="'+row.file+'" title="'+( row.file == null ? "No se ha cargado archivo": "Descargar archivo")+'" type="button" class="btn btn-primary download_file_experiencia">'
                                              + ( row.file == null ? '<span class="glyphicon glyphicon-ban-circle" title="No se ha cargado archivo"></span>':'<span class="glyphicon glyphicon-download-alt"></span>')
                                              + '</button>';
                                          },
                    }



                ]
            });

}

//Permite realizar acciones despues de cargar la tabla experiencia disciplina
function acciones_registro_experiencia(token_actual) {

  //Permite realizar la carga respectiva de cada registro
    $(".btn_cargar_experiencia").click(function () {

      /*$.ajax({
          type: 'GET',
          url: url_pv + 'Juradospreseleccion/all_educacion_formal',
          data: "&modulo=Menu Participante&token=" + token_actual.token+"&idc="+$('#convocatorias').val()+"&participante="+participante
      }).done(function (data) {

        });
        */
      //  $('#vermasModalLabel').html("Educación formal");

      $('#contenido_experiencia').html(" <div class='row'><div class='col-lg-6'>"
                          +"    <h5><b>Titulo: </b><div id='titulo'>"+$(this).attr("id")+" </div></h5>"
                          +"  </div>"
                          +"  <div class='col-lg-6'>"
                          +"    <h5><b>Número de documento de identificación: </b><div id='numero_documento'> </div></h5>"
                          +"  </div></div>");

           $('#vermas_experiencia').show();
           $('#row_experiencia').toggle();
    /*  $("#idregistro").val( $(this).attr("title") );
      // cargo los datos
      cargar_datos_formulario(token_actual);*/
    });

    $("#vermas_back_experiencia").click(function () {
      $('#vermas_experiencia').toggle();
      $('#row_experiencia').show();
    });


  //Permite activar o eliminar una registro
  /*$(".activar_registro").click(function () {

      //Cambio el estado del check
      var active = "false";

      if ($(this).prop('checked')) {
          active = "true";
      }

      //Peticion para inactivar el evento
      $.ajax({
          type: 'DELETE',
          data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active, "idc": $("#idc").val()},
          url: url_pv + 'PropuestasJurados/delete_educacion_formal/' + $(this).attr("title")
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
            cargar_datos_formulario(token_actual);
            break;
          default:
            notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
            cargar_datos_formulario(token_actual);
            break;
        }


      });
  });
  */
  //descargar archivo
  $(".download_file_experiencia").click(function () {
    //Cargo el id file
    var cod = $(this).attr('id');

    $.AjaxDownloader({
        url: url_pv + 'PropuestasJurados/download_file/',
        data : {
            cod   : cod,
            token   : token_actual.token
        }
    });

  });

}

//carga información de la experiencia como jurado
function cargar_tabla_experiencia_jurado(token_actual, participante){

  //Cargar datos en la tabla actual
  $('#table_experiencia_jurado').DataTable({
                "language": {
                    "url": "../../dist/libraries/datatables/js/spanish.json"
                },
                "processing": true,
                "destroy": true,
                "serverSide": true,
                "lengthMenu": [10, 15, 20],
                "responsive":true,
                "searching":false,
                "ajax":{
                    url : url_pv+"Juradospreseleccion/all_experiencia_jurado",
                    data: {"token": token_actual.token, "idc":$('#convocatorias').val(), "participante":participante  },
                    async: false
                  },
                  "drawCallback": function (settings) {
                     //$(".check_activar_t").attr("checked", "true");
                     //$(".check_activar_f").removeAttr("checked");
                     acciones_registro_experiencia_jurado(token_actual);
                    },
                "columns": [

                    {"data": "Nombre convocatoria",
                      render: function ( data, type, row ) {
                            return row.nombre;
                            },
                    },

                    {"data": "Entidad",
                      render: function ( data, type, row ) {
                            return row.entidad;
                            },
                    },

                    {"data": "Año",
                      render: function ( data, type, row ) {
                            return row.anio;
                            },
                    },
                    {"data": "Ambito",
                      render: function ( data, type, row ) {
                            return row.ambito;
                            },
                    },
                    {"data": "Ciudad",
                      render: function ( data, type, row ) {
                            return row.ciudad;
                            },
                    },

                    {"data": "aciones",
                              render: function ( data, type, row ) {
                                          return '<button  id="'+row.id+'" title="Ver mas información" type="button" class="btn btn-success btn_cargar_experiencia_jurado" >'
                                              +'<span class="glyphicon glyphicon-eye-open"></span></button>'
                                              +'<button  id="'+row.file+'" title="'+( row.file == null ? "No se ha cargado archivo": "Descargar archivo")+'"  type="button" class="btn btn-primary download_file_experiencia_jurado">'
                                              + ( row.file == null ? '<span class="glyphicon glyphicon-ban-circle" title="No se ha cargado archivo"></span>':'<span class="glyphicon glyphicon-download-alt"></span>')
                                              + '</button>';
                                          },
                    }

                ]
            });

}

//Permite realizar acciones despues de cargar la tabla experiencia disciplina
function acciones_registro_experiencia_jurado(token_actual) {

  //Permite realizar la carga respectiva de cada registro
    $(".btn_cargar_experiencia_jurado").click(function () {

      /*$.ajax({
          type: 'GET',
          url: url_pv + 'Juradospreseleccion/all_educacion_formal',
          data: "&modulo=Menu Participante&token=" + token_actual.token+"&idc="+$('#convocatorias').val()+"&participante="+participante
      }).done(function (data) {

        });
        */
      //  $('#vermasModalLabel').html("Educación formal");

      $('#contenido_experiencia_jurado').html(" <div class='row'><div class='col-lg-6'>"
                          +"    <h5><b>Titulo: </b><div id='titulo'>"+$(this).attr("id")+" </div></h5>"
                          +"  </div>"
                          +"  <div class='col-lg-6'>"
                          +"    <h5><b>Número de documento de identificación: </b><div id='numero_documento'> </div></h5>"
                          +"  </div></div>");

           $('#vermas_experiencia_jurado').show();
           $('#row_experiencia_jurado').toggle();
    /*  $("#idregistro").val( $(this).attr("title") );
      // cargo los datos
      cargar_datos_formulario(token_actual);*/
    });

    $("#vermas_back_experiencia_jurado").click(function () {
      $('#vermas_experiencia_jurado').toggle();
      $('#row_experiencia_jurado').show();
    });


  //Permite activar o eliminar una registro
  /*$(".activar_registro").click(function () {

      //Cambio el estado del check
      var active = "false";

      if ($(this).prop('checked')) {
          active = "true";
      }

      //Peticion para inactivar el evento
      $.ajax({
          type: 'DELETE',
          data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active, "idc": $("#idc").val()},
          url: url_pv + 'PropuestasJurados/delete_educacion_formal/' + $(this).attr("title")
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
            cargar_datos_formulario(token_actual);
            break;
          default:
            notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
            cargar_datos_formulario(token_actual);
            break;
        }


      });
  });
  */
  //descargar archivo
  $(".download_file_experiencia_jurado").click(function () {
    //Cargo el id file
    var cod = $(this).attr('id');

    $.AjaxDownloader({
        url: url_pv + 'PropuestasJurados/download_file/',
        data : {
            cod   : cod,
            token   : token_actual.token
        }
    });

  });

}


//carga información de la experiencia como jurado
function cargar_tabla_reconocimiento(token_actual, participante){

  //Cargar datos en la tabla actual
  $('#table_reconocimiento').DataTable({
                "language": {
                    "url": "../../dist/libraries/datatables/js/spanish.json"
                },
                "processing": true,
                "destroy": true,
                "serverSide": true,
                "lengthMenu": [10, 15, 20],
                "responsive":true,
                "searching":false,
                "ajax":{
                    url : url_pv+"Juradospreseleccion/all_reconocimiento",
                    data: {"token": token_actual.token, "idc":$('#convocatorias').val(), "participante":participante  },
                    async: false
                  },
                  "drawCallback": function (settings) {
                     //$(".check_activar_t").attr("checked", "true");
                     //$(".check_activar_f").removeAttr("checked");
                     acciones_registro_reconocimiento(token_actual);
                    },
                "columns": [

                    {"data": "Nombre",
                      render: function ( data, type, row ) {
                            return row.nombre;
                            },
                    },
                    {"data": "Institución",
                      render: function ( data, type, row ) {
                            return row.institucion;
                            },
                    },
                    {"data": "Tipo",
                      render: function ( data, type, row ) {
                            return row.tipo;
                            },
                    },
                    {"data": "Año",
                      render: function ( data, type, row ) {
                            return row.anio;
                            },
                    },
                    {"data": "Ciudad",
                      render: function ( data, type, row ) {
                            return row.ciudad;
                            },
                    },

                    {"data": "aciones",
                              render: function ( data, type, row ) {
                                          return '<button id="'+row.id+'" title="Ver mas información" type="button" class="btn btn-success btn_cargar_reconocimiento" >'
                                              +'<span class="glyphicon glyphicon-eye-open"></span></button>'
                                              +'<button id="'+row.file+'" title="'+( row.file == null ? "No se ha cargado archivo": "Descargar archivo")+'" type="button" class="btn btn-primary download_file_reconocimiento">'
                                              + ( row.file == null ? '<span class="glyphicon glyphicon-ban-circle" title="No se ha cargado archivo"></span>':'<span class="glyphicon glyphicon-download-alt"></span>')
                                              + '</button>';
                                          },
                    }

                ]
            });


}

//Permite realizar acciones despues de cargar la tabla experiencia disciplina
function acciones_registro_reconocimiento(token_actual) {

  //Permite realizar la carga respectiva de cada registro
    $(".btn_cargar_reconocimiento").click(function () {

      /*$.ajax({
          type: 'GET',
          url: url_pv + 'Juradospreseleccion/all_educacion_formal',
          data: "&modulo=Menu Participante&token=" + token_actual.token+"&idc="+$('#convocatorias').val()+"&participante="+participante
      }).done(function (data) {

        });
        */
      //  $('#vermasModalLabel').html("Educación formal");

      $('#contenido_reconocimiento').html(" <div class='row'><div class='col-lg-6'>"
                          +"    <h5><b>Titulo: </b><div id='titulo'>"+$(this).attr("id")+" </div></h5>"
                          +"  </div>"
                          +"  <div class='col-lg-6'>"
                          +"    <h5><b>Número de documento de identificación: </b><div id='numero_documento'> </div></h5>"
                          +"  </div></div>");

           $('#vermas_reconocimiento').show();
           $('#row_reconocimiento').toggle();
    /*  $("#idregistro").val( $(this).attr("title") );
      // cargo los datos
      cargar_datos_formulario(token_actual);*/
    });

    $("#vermas_back_reconocimiento").click(function () {
      $('#vermas_reconocimiento').toggle();
      $('#row_reconocimiento').show();
    });


  //Permite activar o eliminar una registro
  /*$(".activar_registro").click(function () {

      //Cambio el estado del check
      var active = "false";

      if ($(this).prop('checked')) {
          active = "true";
      }

      //Peticion para inactivar el evento
      $.ajax({
          type: 'DELETE',
          data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active, "idc": $("#idc").val()},
          url: url_pv + 'PropuestasJurados/delete_educacion_formal/' + $(this).attr("title")
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
            cargar_datos_formulario(token_actual);
            break;
          default:
            notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
            cargar_datos_formulario(token_actual);
            break;
        }


      });
  });
  */
  //descargar archivo
  $(".download_file_reconocimiento").click(function () {
    //Cargo el id file
    var cod = $(this).attr('id');

    $.AjaxDownloader({
        url: url_pv + 'PropuestasJurados/download_file/',
        data : {
            cod   : cod,
            token   : token_actual.token
        }
    });

  });

}


//carga información de la experiencia como jurado
function cargar_tabla_reconocimiento(token_actual, participante){

  //Cargar datos en la tabla actual
  $('#table_reconocimiento').DataTable({
                "language": {
                    "url": "../../dist/libraries/datatables/js/spanish.json"
                },
                "processing": true,
                "destroy": true,
                "serverSide": true,
                "lengthMenu": [10, 15, 20],
                "responsive":true,
                "searching":false,
                "ajax":{
                    url : url_pv+"Juradospreseleccion/all_reconocimiento",
                    data: {"token": token_actual.token, "idc":$('#convocatorias').val(), "participante":participante  },
                    async: false
                  },
                  "drawCallback": function (settings) {
                     //$(".check_activar_t").attr("checked", "true");
                     //$(".check_activar_f").removeAttr("checked");
                     acciones_registro_reconocimiento(token_actual);
                    },
                "columns": [

                    {"data": "Nombre",
                      render: function ( data, type, row ) {
                            return row.nombre;
                            },
                    },
                    {"data": "Institución",
                      render: function ( data, type, row ) {
                            return row.institucion;
                            },
                    },
                    {"data": "Tipo",
                      render: function ( data, type, row ) {
                            return row.tipo;
                            },
                    },
                    {"data": "Año",
                      render: function ( data, type, row ) {
                            return row.anio;
                            },
                    },
                    {"data": "Ciudad",
                      render: function ( data, type, row ) {
                            return row.ciudad;
                            },
                    },

                    {"data": "aciones",
                              render: function ( data, type, row ) {
                                          return '<button id="'+row.id+'" title="Ver mas información" type="button" class="btn btn-success btn_cargar_reconocimiento" >'
                                              +'<span class="glyphicon glyphicon-eye-open"></span></button>'
                                              +'<button id="'+row.file+'" title="'+( row.file == null ? "No se ha cargado archivo": "Descargar archivo")+'" type="button" class="btn btn-primary download_file_reconocimiento">'
                                              + ( row.file == null ? '<span class="glyphicon glyphicon-ban-circle" title="No se ha cargado archivo"></span>':'<span class="glyphicon glyphicon-download-alt"></span>')
                                              + '</button>';
                                          },
                    }

                ]
            });


}

//Permite realizar acciones despues de cargar la tabla experiencia disciplina
function acciones_registro_reconocimiento(token_actual) {

  //Permite realizar la carga respectiva de cada registro
    $(".btn_cargar_reconocimiento").click(function () {

      /*$.ajax({
          type: 'GET',
          url: url_pv + 'Juradospreseleccion/all_educacion_formal',
          data: "&modulo=Menu Participante&token=" + token_actual.token+"&idc="+$('#convocatorias').val()+"&participante="+participante
      }).done(function (data) {

        });
        */
      //  $('#vermasModalLabel').html("Educación formal");

      $('#contenido_reconocimiento').html(" <div class='row'><div class='col-lg-6'>"
                          +"    <h5><b>Titulo: </b><div id='titulo'>"+$(this).attr("id")+" </div></h5>"
                          +"  </div>"
                          +"  <div class='col-lg-6'>"
                          +"    <h5><b>Número de documento de identificación: </b><div id='numero_documento'> </div></h5>"
                          +"  </div></div>");

           $('#vermas_reconocimiento').show();
           $('#row_reconocimiento').toggle();
    /*  $("#idregistro").val( $(this).attr("title") );
      // cargo los datos
      cargar_datos_formulario(token_actual);*/
    });

    $("#vermas_back_reconocimiento").click(function () {
      $('#vermas_reconocimiento').toggle();
      $('#row_reconocimiento').show();
    });


  //Permite activar o eliminar una registro
  /*$(".activar_registro").click(function () {

      //Cambio el estado del check
      var active = "false";

      if ($(this).prop('checked')) {
          active = "true";
      }

      //Peticion para inactivar el evento
      $.ajax({
          type: 'DELETE',
          data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active, "idc": $("#idc").val()},
          url: url_pv + 'PropuestasJurados/delete_educacion_formal/' + $(this).attr("title")
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
            cargar_datos_formulario(token_actual);
            break;
          default:
            notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
            cargar_datos_formulario(token_actual);
            break;
        }


      });
  });
  */
  //descargar archivo
  $(".download_file_reconocimiento").click(function () {
    //Cargo el id file
    var cod = $(this).attr('id');

    $.AjaxDownloader({
        url: url_pv + 'PropuestasJurados/download_file/',
        data : {
            cod   : cod,
            token   : token_actual.token
        }
    });

  });

}


//carga información de la experiencia como jurado
function cargar_tabla_publicaciones(token_actual, participante){
  //Cargar datos en la tabla actual
  $('#table_publicaciones').DataTable({
                "language": {
                    "url": "../../dist/libraries/datatables/js/spanish.json"
                },
                "processing": true,
                "destroy": true,
                "serverSide": true,
                "lengthMenu": [10, 15, 20],
                "responsive":true,
                "searching":false,
                "ajax":{
                    url : url_pv+"Juradospreseleccion/all_publicacion",
                    data: {"token": token_actual.token, "idc":$('#convocatorias').val(), "participante":participante },
                    async: false
                  },
                  "drawCallback": function (settings) {
                     //$(".check_activar_t").attr("checked", "true");
                     //$(".check_activar_f").removeAttr("checked");
                     acciones_registro_publicaciones(token_actual);
                    },
                "columns": [

                    {"data": "titulo",
                      render: function ( data, type, row ) {
                            return row.titulo;
                            },
                    },
                    {"data": "Tema",
                      render: function ( data, type, row ) {
                            return row.tema;
                            },
                    },
                    {"data": "Tipo",
                      render: function ( data, type, row ) {
                            return row.tipo;
                            },
                    },
                    {"data": "Ciudad",
                      render: function ( data, type, row ) {
                            return row.ciudad;
                            },
                    },
                    {"data": "aciones",
                              render: function ( data, type, row ) {
                                          return '<button  id="'+row.id+'" title="Ver mas información" type="button" class="btn btn-success btn_cargar_publicaciones" >'
                                              +'<span class="glyphicon glyphicon-eye-open"></span></button>'
                                              +'<button  id="'+row.file+'" title="'+( row.file == null ? "No se ha cargado archivo": "Descargar archivo")+'" type="button" class="btn btn-primary download_file_publicaciones">'
                                              + ( row.file == null ? '<span class="glyphicon glyphicon-ban-circle" title="No se ha cargado archivo"></span>':'<span class="glyphicon glyphicon-download-alt"></span>')
                                              + '</button>';
                                          },
                    }

                ]
            });

}

//Permite realizar acciones despues de cargar la tabla experiencia disciplina
function acciones_registro_publicaciones(token_actual) {

  //Permite realizar la carga respectiva de cada registro
    $(".btn_cargar_publicaciones").click(function () {

      /*$.ajax({
          type: 'GET',
          url: url_pv + 'Juradospreseleccion/all_educacion_formal',
          data: "&modulo=Menu Participante&token=" + token_actual.token+"&idc="+$('#convocatorias').val()+"&participante="+participante
      }).done(function (data) {

        });
        */
      //  $('#vermasModalLabel').html("Educación formal");

      $('#contenido_publicaciones').html(" <div class='row'><div class='col-lg-6'>"
                          +"    <h5><b>Titulo: </b><div id='titulo'>"+$(this).attr("id")+" </div></h5>"
                          +"  </div>"
                          +"  <div class='col-lg-6'>"
                          +"    <h5><b>Número de documento de identificación: </b><div id='numero_documento'> </div></h5>"
                          +"  </div></div>");

           $('#vermas_publicaciones').show();
           $('#row_publicaciones').toggle();
    /*  $("#idregistro").val( $(this).attr("title") );
      // cargo los datos
      cargar_datos_formulario(token_actual);*/
    });

    $("#vermas_back_publicaciones").click(function () {
      $('#vermas_publicaciones').toggle();
      $('#row_publicaciones').show();
    });


  //Permite activar o eliminar una registro
  /*$(".activar_registro").click(function () {

      //Cambio el estado del check
      var active = "false";

      if ($(this).prop('checked')) {
          active = "true";
      }

      //Peticion para inactivar el evento
      $.ajax({
          type: 'DELETE',
          data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active, "idc": $("#idc").val()},
          url: url_pv + 'PropuestasJurados/delete_educacion_formal/' + $(this).attr("title")
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
            cargar_datos_formulario(token_actual);
            break;
          default:
            notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
            cargar_datos_formulario(token_actual);
            break;
        }


      });
  });
  */
  //descargar archivo
  $(".download_file_publicaciones").click(function () {
    //Cargo el id file
    var cod = $(this).attr('id');

    $.AjaxDownloader({
        url: url_pv + 'PropuestasJurados/download_file/',
        data : {
            cod   : cod,
            token   : token_actual.token
        }
    });

  });

}


//carga información de la experiencia como jurado
function cargar_criterios_evaluacion(token_actual, participante){
  $("#criterios").empty();
  //Cargar datos en la tabla actual
  $.ajax({
      type: 'GET',
      url: url_pv + 'Juradospreseleccion/criterios_evaluacion',
      data: "&modulo=Menu Participante&token=" + token_actual.token+"&idc="+$('#convocatorias').val()+"&participante="+participante
  }).done(function (data) {

    switch (data) {
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
        //cargar_datos_formulario(token_actual);
        break;
      default:
        //notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
        //cargar_datos_formulario(token_actual);
          var json = JSON.parse(data);


           /*  if (json.tipo_documento.length > 0) {
                  $.each(json.tipo_documento, function (key, array) {
                      var selected = '';
                      if(json.participante != null  && array.id == json.participante.tipo_documento)
                      {
                          selected = 'selected="selected"';
                      }
                      $("#tipo_documento").append('<option value="' + array.id + '" '+selected+' >' + array.descripcion + '</option>');
                  });
              }*/
            //  console.log("array criterios-->"+json[0].criterios);

                //console.log("xxxx-->"+json[0].criterios.["Nivel académico"]);

               //if ( json[0].criterios.length > 0) {
               $.each(json, function (k, o){



                   $.each(json[k].criterios, function (key, array) {
                     //console.log("key-->"+key);
                     //console.log("arraysss-->"+Object.keys(array));

                     $("#criterios").append('<div class="row">'
                                            +' <div class="col-lg-12"> <h5><b>'+Object.keys(array)+'</b><div id="perfil2"> </div></h5></div>'
                                            +'</div>');

                       $.each(array[Object.keys(array)], function (k, a) {
                          //console.log("-->>"+a.id);
                        //  console.log("min"+a.puntaje_minimo+'-max'+a.puntaje_maximo);

                          select ='    <select class="form-control"><option selected>::Sin calificar::</option>';
                          for(i = a.puntaje_minimo; i<= a.puntaje_maximo;i++){
                            select=select+'<option value='+i+' >'+i+'</option>';
                          }
                            select=select+'</select>';

                          $("#criterios").append('<div class="row">'
                                                // +' <div class="col-lg-12"> <h5><b>'+key+'</b><div id="perfil2"> sssssss</div></h5></div>'
                                                +' <div class="col-lg-6">'

                                                +' <input type="radio" name="optionsRadios'+a.grupo_criterio+'" id="optionsRadios1" value="option1" checked=""> '+a.descripcion_criterio

                                                +' </div>'
                                                +' <div class="col-lg-6">'
                                                +'  <div class="form-group">'
                                                +select
                                                +'  </div>'
                                                +' </div>'
                                                +'</div>');
                       });



                   });

              });
               //}


        break;
    }

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
            tipo_documento: {
                validators: {
                    notEmpty: {message: 'El tipo de documento de identificación es requerido'}
                }
            },
            numero_documento: {
                validators: {
                    notEmpty: {message: 'El número de documento de identificación es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            primer_nombre: {
                validators: {
                    notEmpty: {message: 'El primer nombre es requerido'}
                }
            },
            primer_apellido: {
                validators: {
                    notEmpty: {message: 'El primer apellido es requerido'}
                }
            },
            fecha_nacimiento: {
                validators: {
                    notEmpty: {message: 'La fecha de nacimiento es requerida'}
                }
            },
            sexo: {
                validators: {
                    notEmpty: {message: 'El sexo es requerido'}
                }
            },
            ciudad_residencia_name: {
                validators: {
                    notEmpty: {message: 'La ciudad de residencia es requerida'}
                }
            },
            direccion_residencia: {
                validators: {
                    notEmpty: {message: 'La dirección de residencia es requerida'}
                }
            },
            estrato: {
                validators: {
                    notEmpty: {message: 'El estrato es requerido'}
                }
            },
            correo_electronico: {
                validators: {
                    notEmpty: {message: 'El correo electrónico es requerido'},
                    emailAddress: {
                        message: 'El Correo electrónico no es una dirección de correo electrónico válida'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {

    //  alert("idd-->"+typeof $("#idd").attr('value')+" idd-->>"+$("#idd").val() )

        // Prevent form submission
        e.preventDefault();
        // Get the form instance
        var $form = $(e.target);

        // Get the BootstrapValidator instance
        var bv = $form.data('bootstrapValidator');

        if ( typeof $("#idd").attr('value') === 'undefined' || $("#idd").val() == null || $("#idd").val() == '') {

        //  alert("nuevo!!!");
              //Se realiza la peticion con el fin de guardar el registro actual
              $.ajax({
                  type: 'POST',
                  url: url_pv + 'Jurados/new',
                  data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token
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
                  case 'deshabilitado':
                    notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                    cargar_datos_formulario(token_actual);
                    break;
                  case 'error_duplicado':
                      notify("danger", "remove", "Usuario:", "Ya existe un usuario registrado con el mismo documento de identificación.");
                      cargar_datos_formulario(token_actual);
                      break;
                  default:
                      notify("success", "ok", "Convocatorias:", "Se creó el registro con éxito.");
                      //Cargar datos de la tabla de rondas
                      //cargar_tabla_criterio($("#convocatoria_ronda").attr('value'),token_actual);
                      $("#idd").val(data);
                      cargar_datos_formulario(token_actual);
                   break;
                 }

              });

          }else{

            //  alert("editado!!!");
            //Realizo la peticion con el fin de editar el registro actual
            $.ajax({
                type: 'POST',
                url: url_pv + 'Jurados/edit/'+$("#idd").val(),
                data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token
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
                      case 'deshabilitado':
                        notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                        cargar_datos_formulario(token_actual);
                        break;
                      case 'error_duplicado':
                        notify("danger", "remove", "Usuario:", "Ya existe un usuario registrado con el mismo documento de identificación.");
                        cargar_datos_formulario(token_actual);
                        break;
                      default:
                        notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
                        //Cargar datos de la tabla de rondas
                        //cargar_tabla_criterio($("#convocatoria_ronda").attr('value'),token_actual);
                        $("#idd").val(data);
                        cargar_datos_formulario(token_actual);
                       break;
                     }

            });
          }

        $form.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
        //$form.bootstrapValidator('destroy', true);
        bv.resetForm();
    });

}

function cargar_datos_formulario(token_actual) {
  //Realizo la peticion para cargar el formulario
  $.ajax({
      type: 'GET',
      data: {"token": token_actual.token, "id": $("#id").attr('value')},
      url: url_pv + 'Juradospreseleccion/search/'
  }).done(function (data) {
      if (data == 'error_metodo')
      {
          notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
      } else
      {
          if (data == 'error_token')
          {
              location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
          } else
          {
              var json = JSON.parse(data);

                //$('#formulario_principal').loadJSON(json.participante);
               //console.log(typeof json.participante.id);
                if ( json.participante) {

                  $("#idd").val(json.participante.id);

                  $('#numero_documento').val(json.participante.numero_documento);
                  $('#primer_nombre').val(json.participante.primer_nombre);
                  $('#segundo_nombre').val(json.participante.segundo_nombre);
                  $('#primer_apellido').val(json.participante.primer_apellido);
                  $('#segundo_apellido').val(json.participante.segundo_apellido);
                  $('#fecha_nacimiento').val(json.participante.fecha_nacimiento);

                  if(json.participante.ciudad_nacimiento != null){
                    $('#ciudad_nacimiento_name').val(json.participante.ciudad_nacimiento.label);
                    $('#ciudad_nacimiento').val(json.participante.ciudad_nacimiento.id);
                  }

                  if(json.participante.ciudad_residencia != null){
                    $('#ciudad_residencia_name').val(json.participante.ciudad_residencia.label);
                    $('#ciudad_residencia').val(json.participante.ciudad_residencia.id);
                  }

                  if(json.participante.barrio_residencia != null ){
                    $('#barrio_residencia_name').val(json.participante.barrio_residencia.label);
                    $('#barrio_residencia').val(json.participante.barrio_residencia.id);
                  }

                  $('#direccion_residencia').val(json.participante.direccion_residencia);
                  $('#direccion_correspondencia').val(json.participante.direccion_correspondencia);
                  $('#numero_telefono').val(json.participante.numero_telefono);
                  $('#numero_celular').val(json.participante.numero_celular);
                  $('#correo_electronico').val(json.participante.correo_electronico);

                }

              //Cargos el select de tipo de documento
              $('#tipo_documento').find('option').remove();
              $("#tipo_documento").append('<option value="">:: Seleccionar ::</option>');
              if (json.tipo_documento.length > 0) {
                  $.each(json.tipo_documento, function (key, array) {
                      var selected = '';
                      if(json.participante != null  && array.id == json.participante.tipo_documento)
                      {
                          selected = 'selected="selected"';
                      }
                      $("#tipo_documento").append('<option value="' + array.id + '" '+selected+' >' + array.descripcion + '</option>');
                  });
              }


              //Cargos el select de sexo
              $('#sexo').find('option').remove();
              $("#sexo").append('<option value="">:: Seleccionar ::</option>');
              if (json.sexo.length > 0) {
                  $.each(json.sexo, function (key, array) {
                      var selected = '';
                      if( json.participante != null  && array.id == json.participante.sexo)
                      {
                          selected = 'selected="selected"';
                      }
                      $("#sexo").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
                  });
              }
              //Cargos el select de orientacion sexual
              $('#orientacion_sexual').find('option').remove();
              $("#orientacion_sexual").append('<option value="">:: Seleccionar ::</option>');
              if (json.orientacion_sexual.length > 0) {
                  $.each(json.orientacion_sexual, function (key, array) {
                      var selected = '';
                      if(json.participante != null  &&  array.id == json.participante.orientacion_sexual)
                      {
                          selected = 'selected="selected"';
                      }
                      $("#orientacion_sexual").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
                  });
              }
              //Cargos el select de identidad genero
              $('#identidad_genero').find('option').remove();
              $("#identidad_genero").append('<option value="">:: Seleccionar ::</option>');
              if (json.orientacion_sexual.length > 0) {
                  $.each(json.identidad_genero, function (key, array) {
                      var selected = '';
                      if(json.participante != null  &&  array.id == json.participante.identidad_genero)
                      {
                          selected = 'selected="selected"';
                      }
                      $("#identidad_genero").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
                  });
              }
              //Cargos el select de grupo etnico
              $('#grupo_etnico').find('option').remove();
              $("#grupo_etnico").append('<option value="">:: Seleccionar ::</option>');
              if (json.grupo_etnico.length > 0) {
                  $.each(json.grupo_etnico, function (key, array) {
                      var selected = '';
                      if( json.participante != null  &&  array.id == json.participante.grupo_etnico)
                      {
                          selected = 'selected="selected"';
                      }
                      $("#grupo_etnico").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
                  });
              }
              //Cargos el select de estrato
              $('#estrato').find('option').remove();
              $("#estrato").append('<option value="">:: Seleccionar ::</option>');
              if (json.estrato.length > 0) {
                  $.each(json.estrato, function (key, array) {
                      var selected = '';
                      if(json.participante != null  &&  array == json.participante.estrato)
                      {
                          selected = 'selected="selected"';
                      }
                      $("#estrato").append('<option value="' + array + '" '+selected+' >' + array + '</option>');
                  });
              }

              //Cargos el autocomplete de ciudad de nacimiento
              //$("#ciudad_nacimiento_name").val(json.ciudad[json.participante.ciudad_nacimiento].label);
              $( "#ciudad_nacimiento_name" ).autocomplete({
                  source: json.ciudad,
                  minLength: 2,
                  select: function (event, ui) {
                      $(this).val(ui.item ? ui.item : " ");
                      $("#ciudad_nacimiento").val(ui.item.id);
                  },

                  change: function (event, ui) {
                      if (!ui.item) {
                          this.value = '';
                          $("#ciudad_nacimiento").val("");
                      }
                  //else { Return your label here }
                  }
              });

              //Cargos el autocomplete de ciudad de residencia

              $( "#ciudad_residencia_name" ).autocomplete({
                  source: json.ciudad,
                  minLength: 2,
                  select: function (event, ui) {
                      $(this).val(ui.item ? ui.item : " ");
                      $("#ciudad_residencia").val(ui.item.id);
                  },
                  change: function (event, ui) {
                      if (!ui.item) {
                          this.value = '';
                          $('.formulario_principal').bootstrapValidator('revalidateField', 'ciudad_residencia_name');
                          $("#ciudad_residencia").val("");
                      }
                  //else { Return your label here }
                  }
              });

              //Cargos el autocomplete de barrios

              $( "#barrio_residencia_name" ).autocomplete({
                  source: json.barrio,
                  minLength: 2,
                  select: function (event, ui) {
                      $(this).val(ui.item ? ui.item : " ");
                      $("#barrio_residencia").val(ui.item.id);
                  },
                  change: function (event, ui) {
                      if (!ui.item) {
                          this.value = '';
                          $("#barrio_residencia").val("");
                      }
                  //else { Return your label here }
                  }
              });


          }

      }


  }

);


  //validator_form(token_actual);

}
