$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin+'../../index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {
        //Verifica si el token actual tiene acceso de lectura
        permiso_lectura(token_actual, "Menu Participante");
        cargar_datos_formulario(token_actual);
        validator_form(token_actual);
    }

});

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
      url: url_pv + 'Jurados/search/'
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
