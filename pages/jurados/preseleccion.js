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
        //  $('#evaluar').show();
        });

        $("#optionsRadiosInline2").click(function () {

          //$('#evaluar').toggle();

        });

        $(".guardar_aplica_perfil").click(function(){

          evaluar_perfil(token_actual, $(".btn_cargar").attr("id"));

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
                "searching":false,
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
                "rowCallback": function( row, data, index ) {
                      if ( data["aplica_perfil"] ){
                          $('td', row).css('background-color', '#dcf4dc');
                      }
                      else if ( !data["aplica_perfil"]){
                          $('td', row).css('background-color', '#f4dcdc');
                      }
                  },
                "columns": [
                    {"data": "Postulado",
                      render: function ( data, type, row ) {
                            return (row.postulado)? "Si":"No";
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
     cargar_tabla_documentos(token_actual, $(this).attr("id"));
     cargar_tabla_educacion_formal(token_actual, $(this).attr("id"));
     cargar_tabla_educacion_no_formal(token_actual, $(this).attr("id"));
     cargar_tabla_experiencia(token_actual, $(this).attr("id"));
     cargar_tabla_experiencia_jurado(token_actual, $(this).attr("id"));
     cargar_tabla_reconocimiento(token_actual, $(this).attr("id"));
     cargar_tabla_publicaciones(token_actual, $(this).attr("id"));
     cargar_criterios_evaluacion(token_actual,  $(this).attr("id") );
     cargar_datos_convocatoria(token_actual,  $(this).attr("id"));

  });



}

function cargar_datos_convocatoria(token_actual, participante){
  $("#perfiles_jurados").html("");

  $.ajax({
      type: 'GET',
      url: url_pv + 'Juradospreseleccion/search_convocatoria_propuesta',
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


          $.each(json.participantes	, function (key, perfil) {


                $("#perfiles_jurados").append('<div class="well"><div class="row">'
                                            +' <div class="col-lg-12">'
                                            +'  <h4>Perfil '+(key+1)+'</h4>'
                                            +' </div>'
                                            +' <div class="col-lg-12">'
                                            +'  <h5><b>Descripción:</h5></b> '+perfil.descripcion_perfil
                                            +' </div>'
                                            +' <div class="col-lg-6">'
                                            + ' <h5><b>Formación profesional:</h5></b> '+perfil.formacion_profesional
                                            +' </div>'
                                            +' <div class="col-lg-6">'
                                            + ' <h5><b>Formación de postgrado:</h5></b> '+perfil.formacion_postgrado
                                            +' </div>'
                                            +' <div class="col-lg-6">'
                                            +'  <h5><b>Nivel educativo:</h5></b> '+perfil.nivel_educativo
                                            +' </div>'
                                            +' <div class="col-lg-6">'
                                            + ' <h5><b>Area de conocimiento:</h5></b> '+perfil.area_conocimiento
                                            +' </div>'
                                            +' <div class="col-lg-6">'
                                            +'  <h5><b>Campo de experiencia:</h5></b>'+perfil.campo_experiencia
                                            +' </div>'
                                            +' <div class="col-lg-6">'
                                            +'  <h5><b>Area del perfíl:</h5></b> '+perfil.area_perfil
                                            +' </div>'
                                            +' <div class="col-lg-6">'
                                            +'  <h5><b>Reside en bogota:</h5></b> '+perfil.reside_bogota
                                            +' </div>'

                                            +' </div></div>');


          });

        break;
      }
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

        }else{

      
        }

        break;
      }

    }

    );

}

//carga información de la educacion formal
function cargar_tabla_documentos(token_actual, participante){
  //Cargar datos en la tabla documentos
  $('#table_documentos').DataTable({
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
                    url : url_pv+"Juradospreseleccion/all_documento",
                    data: {"token": token_actual.token, "idc":$('#convocatorias').val(), "participante":participante },
                    //async: false
                  },
                  "drawCallback": function (settings) {
                     //$(".check_activar_t").attr("checked", "true");
                     //$(".check_activar_f").removeAttr("checked");
                     acciones_registro_documento(token_actual);
                    },
                "columns": [

                    {"data": "Documento",
                      render: function ( data, type, row ) {
                            return row.categoria_jurado;
                            },
                    },
                    {"data": "aciones",
                              render: function ( data, type, row ) {
                                          return '<button id="'+ row.file+'" title="'+( row.file == null ? "No se ha cargado archivo": "Descargar archivo")+'" type="button" class="btn btn-primary download_file_documento">'
                                              + ( row.file == null ? '<span class="glyphicon glyphicon-ban-circle" title="No se ha cargado archivo"></span>':'<span class="glyphicon glyphicon-download-alt"></span>')
                                              + '</button>';
                                          },
                    }

                ]
            });

}

//Permite realizar acciones despues de cargar la tabla educacion formal
function acciones_registro_documento(token_actual) {

  //descargar archivo
  $(".download_file_documento").click(function () {
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
                "rowCallback": function( row, data, index ) {

                          $('#contenidox').html(" <div class='row'><div class='col-lg-6'>"
                                              +"    <h5><b>Titulo: </b><div id='titulo'>"+data["titulo"]+" </div></h5>"
                                              +"  </div>"
                                              +"  <div class='col-lg-6'>"
                                              +"    <h5><b>Institución: </b><div id='institucion'>"+data["institucion"]+" </div></h5>"
                                              +"  </div>"
                                              +"  <div class='col-lg-6'>"
                                              +"    <h5><b>Ciudad: </b><div id='ciudad'>"+data["ciudad"]+" </div></h5>"
                                              +"  </div>"
                                              +"  <div class='col-lg-6'>"
                                              +"    <h5><b>Número de semestres: </b><div id='numero_semestres'>"+data["numero_semestres"]+" </div></h5>"
                                              +"  </div>"
                                              +"  <div class='col-lg-6'>"
                                              +"    <h5><b>Graduado: </b><div id='graduado'>"+ ( (data["graduado"])? "Si" : "No" )+" </div></h5>"
                                              +"  </div>"
                                              +"  <div class='col-lg-6'>"
                                              +"    <h5><b>Fecha de graduación: </b><div id='fecha_graduacion'>"+data["fecha_graduacion"] +" </div></h5>"
                                              +"  </div>"
                                              +"</div>");


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

           $('#vermas').show();
           $('#table_eformal').toggle();

    });

    $("#vermas_back").click(function () {
      $('#vermas').toggle();
      $('#table_eformal').show();
    });

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
                  "rowCallback": function( row, data, index ) {

                              $('#contenido_enf').html(" <div class='row'><div class='col-lg-6'>"
                                                  +"    <h5><b>Tipo: </b><div id='tipo'>"+data["tipo"]+" </div></h5>"
                                                  +"  </div>"
                                                  +"  <div class='col-lg-6'>"
                                                  +"    <h5><b>Modalidad: </b><div id='modalidad'>"+data["modalidad"]+" </div></h5>"
                                                  +"  </div>"
                                                  +"  <div class='col-lg-6'>"
                                                  +"    <h5><b>Nombre: </b><div id='nombre'>"+data["nombre"]+" </div></h5>"
                                                  +"  </div>"
                                                  +"  <div class='col-lg-6'>"
                                                  +"    <h5><b>Institución: </b><div id='institucion'>"+data["institucion"]+" </div></h5>"
                                                  +"  </div>"
                                                  +"  <div class='col-lg-6'>"
                                                  +"    <h5><b>Fecha de inicio: </b><div id='fecha_inicio'>"+ data["fecha_inicio"]+" </div></h5>"
                                                  +"  </div>"
                                                  +"  <div class='col-lg-6'>"
                                                  +"    <h5><b>Fecha de finalización: </b><div id='fecha_fin'>"+ data["fecha_fin"]+" </div></h5>"
                                                  +"  </div>"
                                                  +"  <div class='col-lg-6'>"
                                                  +"    <h5><b>Número de horas: </b><div id='numero_hora'>"+ data["numero_hora"]+" </div></h5>"
                                                  +"  </div>"
                                                  +"  <div class='col-lg-6'>"
                                                  +"    <h5><b>Ciudad: </b><div id='ciudad'>"+data["ciudad"] +" </div></h5>"
                                                  +"  </div>"
                                                  +"</div>");


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
           $('#vermas_enf').show();
           $('#table_enformal').toggle();

    });

    $("#vermas_back_enf").click(function () {
      $('#vermas_enf').toggle();
      $('#table_enformal').show();
    });

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
                  "rowCallback": function( row, data, index ) {
                    $('#contenido_experiencia').html(" <div class='row'><div class='col-lg-6'>"
                                        +"    <h5><b>Ciudad: </b><div id='titulo'>"+data["ciudad"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Tipo de entidad: </b><div id='tipo_entidad'>"+data["tipo_entidad"]+"</div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Entidad: </b><div id='entidad'>"+data["entidad"]+"</div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Funciones: </b><div id='funcion'>"+data["funcion"]+"</div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Fecha de inicio: </b><div id='fecha_inicio'>"+data["fecha_inicio"]+"</div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Fecha de finalización: </b><div id='fecha_fin'>"+data["fecha_fin"]+"</div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Nombre: </b><div id='nombre'>"+data["nombre"]+"</div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>correo: </b><div id='correo'>"+data["correo"]+"</div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Teléfono: </b><div id='telefono'>"+data["telefono"]+"</div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Dirección: </b><div id='direccion'>"+data["direccion"]+"</div></h5>"
                                        +"  </div>"
                                        +"</div>");
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
           $('#vermas_experiencia').show();
           $('#row_experiencia').toggle();

    });

    $("#vermas_back_experiencia").click(function () {
      $('#vermas_experiencia').toggle();
      $('#row_experiencia').show();
    });


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
                  "rowCallback": function( row, data, index ) {
                    $('#contenido_experiencia_jurado').html(" <div class='row'><div class='col-lg-6'>"
                                        +"    <h5><b>Nombre: </b><div id='nombre'>"+data["nombre"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Entidad: </b><div id='entidad'>"+data["entidad"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Año: </b><div id='anio'>"+data["anio"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Ambito: </b><div id='ambito'>"+data["ambito"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Ciudad: </b><div id='ciudad'>"+data["ciudad"]+" </div></h5>"
                                        +"  </div>"
                                        +"</div>");
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
           $('#vermas_experiencia_jurado').show();
           $('#row_experiencia_jurado').toggle();

    });

    $("#vermas_back_experiencia_jurado").click(function () {
      $('#vermas_experiencia_jurado').toggle();
      $('#row_experiencia_jurado').show();
    });

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
                  "rowCallback": function( row, data, index ) {
                    $('#contenido_reconocimiento').html(" <div class='row'><div class='col-lg-6'>"
                                        +"    <h5><b>Nombre: </b><div id='nombre'>"+data["nombre"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Institucion: </b><div id='institucion'>"+data["institucion"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Tipo: </b><div id='tipo'>"+data["tipo"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Año: </b><div id='anio'>"+data["anio"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Ciudad: </b><div id='ciudad'>"+data["ciudad"]+" </div></h5>"
                                        +"  </div>"
                                        +"</div>");
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

           $('#vermas_reconocimiento').show();
           $('#row_reconocimiento').toggle();

    });

    $("#vermas_back_reconocimiento").click(function () {
      $('#vermas_reconocimiento').toggle();
      $('#row_reconocimiento').show();
    });


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
                  "rowCallback": function( row, data, index ) {
                    $('#contenido_reconocimiento').html(" <div class='row'><div class='col-lg-6'>"
                                        +"    <h5><b>Nombre: </b><div id='nombre'>"+data["nombre"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Institución: </b><div id='institucion'>"+data["institucion"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Tipo: </b><div id='tipo'>"+data["tipo"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Año: </b><div id='anio'>"+data["anio"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Ciudad: </b><div id='ciudad'>"+data["ciudad"]+" </div></h5>"
                                        +"  </div>"
                                        +"</div>");
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
      $('#vermas_reconocimiento').show();
      $('#row_reconocimiento').toggle();

    });

    $("#vermas_back_reconocimiento").click(function () {
      $('#vermas_reconocimiento').toggle();
      $('#row_reconocimiento').show();
    });

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
                  "rowCallback": function( row, data, index ) {
                    $('#contenido_publicaciones').html(" <div class='row'><div class='col-lg-6'>"
                                        +"    <h5><b>Titulo: </b><div id='titulo'>"+data["titulo"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Tema: </b><div id='tema'>"+data["tema"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Tipo: </b><div id='tipo'>"+data["tipo"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Formato: </b><div id='formato'>"+data["formato"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Medio: </b><div id='medio'>"+data["medio"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Ciudad: </b><div id='ciudad'>"+data["ciudad"]+" </div></h5>"
                                        +"  </div>"
                                        +"  <div class='col-lg-6'>"
                                        +"    <h5><b>Año: </b><div id='anio'>"+data["anio"]+" </div></h5>"
                                        +"  </div>"
                                        +"</div>");
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


//carga información de los criterios de evaluacion de las rondas
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
        //cargar_datos_formulario(token_actual);
          var json = JSON.parse(data);


          //ronda
          $.each(json, function (r, ronda){

            $("#id_ronda").val(json[r].ronda.id);

            //Se establece los valores de la evaluación del perfil
            //alert(typeof json[r].perfil.aplica_perfil);

            $("nput[name=option_aplica_perfil][value=true]").removeAttr('checked');
            $("input[name=option_aplica_perfil][value=false]").removeAttr('checked');

            if( json[r].postulacion.aplica_perfil ){
                $("input[name=option_aplica_perfil][value=true]").attr('checked', 'checked');
            }else if( (!json[r].postulacion.aplica_perfil) || (json[r].postulacion.aplica_perfil === null) ){
                $("input[name=option_aplica_perfil][value=false]").attr('checked', 'checked');
            }

            $("#descripcion_evaluacion").val(json[r].postulacion.descripcion_evaluacion);

            $("#id_jurados_postulados").val(json[r].postulacion.id);

            //grupo
            $.each(json[r].criterios, function (key, array) {
              //console.log("key-->"+key);
              //console.log("arraysss-->"+Object.keys(array));

              $("#criterios").append('<div class="row">'
                                            +' <div class="col-lg-12"> <h5><b>'+Object.keys(array)+'</b><div id="perfil2"> </div></h5></div>'
                                            +'</div>');

              //criterio
              $.each(array[Object.keys(array)], function (k, a) {

              //  key.push(a.id);
                //console.log("-->>"+a.id);
                //  console.log("min"+a.puntaje_minimo+'-max'+a.puntaje_maximo);

                //se construye las opciones del componente select
                select ='<select id="'+a.id+'" name="'+a.id+'" class="form-control '+r+key+'"'
                                  + ( a.exclusivo ? ' onchange=" limpiar( this, '+r+key+' ) "': "")
                                  +' >'
                        +        '<option value="null">::Sin calificar::</option>';

                for(i = a.puntaje_minimo; i<= a.puntaje_maximo;i++){
                  select=select+'<option '+ ((a.evaluacion.puntaje == i)? 'selected': '') +' value='+i+' >'+i+'</option>';
                }

                select=select+'</select>';

                //Se construye los radio
                $("#criterios").append('<div class="row">'
                                                // +' <div class="col-lg-12"> <h5><b>'+key+'</b><div id="perfil2"> sssssss</div></h5></div>'
                                                +' <div class="col-lg-6" >'
                                              /*  + ( a.exclusivo ?
                                                  '  <input type="radio" name="optionsRadios'+a.grupo_criterio+'" id="optionsRadios1" value="option1"> '
                                                  : "checkbox" )*/
                                                +    a.descripcion_criterio //+" - "+a.exclusivo
                                                +' </div>'
                                                +' <div class="col-lg-6">'
                                                +'  <div class="form-group">'
                                                +     select
                                                +'  </div>'
                                                +' </div>'
                                                +'</div>');
              //append

                       });
              //$.each(array[Object.keys(array)], function (k, a)
             });

             $("#criterios").append('<div class="col-lg-12" style="text-align: right"><button type="button" class="btn btn-default '+( (json[r].postulacion.estado == 11) ? "disabled":' guardar_evaluacion_'+$("#id_ronda").val() )+'">Guardar</button></div>');

          });



            $(".guardar_evaluacion_"+$("#id_ronda").val() ).click(function(){

              evaluar_criterios(token_actual, participante);
            });

            $("#baceptar").click(function(){
              evaluar_criterios(token_actual, participante);
              $('#alertModal').modal('toggle');

            });

        break;
    }

    });

}

//Restablece los componentes select cuyo grupo de criterios sean exclusivos
function limpiar(criterio, key){
  //console.log(" limpiar()");

  $("."+key).each(function(c,v) {

    if ( $("."+key)[c].id != criterio.id ){
      //console.log(" id-->"+$("."+key)[c].value);
      $("."+key)[c].selectedIndex = 0;
    }

 });

}

//Guarda la evaluación del perfil del jurado
function evaluar_perfil(token_actual, participante){

  //  alert("guardando\nparticipante:"+participante);


  $.ajax({
      type: 'PUT',
      url: url_pv + 'Juradospreseleccion/evaluar_perfil',
      data: $("#form_aplica_perfil").serialize()
            + "&modulo=Jurados&token="+ token_actual.token
            + "&idc="+ $('#convocatorias').val()
            + "&participante="+participante
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
        //cargar_datos_formulario(token_actual);
        break;
      case 'error_duplicado':
          notify("danger", "remove", "Usuario:", "Ya existe un usuario registrado con el mismo documento de identificación.");
          //cargar_datos_formulario(token_actual);
          break;
      default:
          notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
          cargar_tabla(token_actual);
       break;
     }

  });



}

//Guarda la evaluación de los criterios evaluados
function evaluar_criterios(token_actual, participante){

    //alert("guardando\nparticipante:"+participante);

  $.ajax({
      type: 'POST',
      url: url_pv + 'Juradospreseleccion/evaluar_criterios',
      data: $("#criterios").serialize()
            + "&modulo=Jurados&token="+ token_actual.token
            + "&idc="+ $('#convocatorias').val()
            + "&participante="+participante
            + "&ronda="+$("#id_ronda").val()
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
        break;
      case 'error_duplicado':
        notify("danger", "remove", "Usuario:", "Ya existe un usuario registrado con el mismo documento de identificación.");
        break;
      default:
        notify("success", "ok", "Convocatorias:", "Se actualizó el registro con éxito.");
        cargar_tabla(token_actual);
       break;
     }

  });



}
