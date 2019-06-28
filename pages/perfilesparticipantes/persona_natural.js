$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = '../../index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {
        //Verifica si el token actual tiene acceso de lectura
        permiso_lectura(token_actual, "Menu Participante");        

        validator_form(token_actual);

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "id": $("#id").attr('value')},
            url: url_pv + 'Personasnaturales/search/'
        }).done(function (data) {
            if (data == 'error_metodo')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            } else
            {
                if (data == 'error_token')
                {
                    location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                } else
                {
                    var json = JSON.parse(data);
                    
                    //Cargos el select de tipo de documento
                    $('#tipo_documento').find('option').remove();
                    $("#tipo_documento").append('<option value="">:: Seleccionar ::</option>');
                    if (json.tipo_documento.length > 0) {
                        $.each(json.tipo_documento, function (key, array) {
                            var selected = '';
                            if(array.id == json.participante.tipo_documento)
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
                            if(array.id == json.participante.sexo)
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
                            if(array.id == json.participante.orientacion_sexual)
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
                            if(array.id == json.participante.identidad_genero)
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
                            if(array.id == json.participante.grupo_etnico)
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
                            if(array == json.participante.estrato)
                            {
                                selected = 'selected="selected"';
                            }
                            $("#estrato").append('<option value="' + array + '" '+selected+' >' + array + '</option>');
                        });
                    }
                    
                    //Cargos el select de ciudad de nacimiento y de residencia 
                    $('#ciudad_nacimiento').find('option').remove();
                    $("#ciudad_nacimiento").append('<option value=""></option>');                    
                    if (json.ciudad.length > 0) {
                        $.each(json.ciudad, function (key, array) {
                            var selected = '';
                            if(array.id == json.participante.ciudad_nacimiento)
                            {
                                selected = 'selected="selected"';
                            }
                            $("#ciudad_nacimiento").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
                        });
                    }
                    
                    $('#ciudad_residencia').find('option').remove();
                    $("#ciudad_residencia").append('<option value=""></option>');                    
                    if (json.ciudad.length > 0) {
                        $.each(json.ciudad, function (key, array) {
                            var selected = '';
                            if(array.id == json.participante.ciudad_residencia)
                            {
                                selected = 'selected="selected"';
                            }
                            $("#ciudad_residencia").append('<option value="' + array.id + '" '+selected+' >' + array.nombre + '</option>');
                        });
                    }
                    
                    
                    $("select.flexselect").flexselect({
                        allowMismatch: true,
                        inputNameTransform:  function(name) { return "new_" + name; }
                      });
                }

            }
        });

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
            ciudad_residencia: {
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
        // Prevent form submission
        e.preventDefault();
        // Get the form instance
        var $form = $(e.target);

        // Get the BootstrapValidator instance
        var bv = $form.data('bootstrapValidator');


        $form.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
        bv.resetForm();
    });

}