$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {
        //Verifica si el token actual tiene acceso de lectura
        permiso_lectura(token_actual, "Menu Participante");

        //Valido formulario
        validator_form(token_actual);

        //Peticion para buscar barrios
        var json_barrio = function (request, response) {
            $.ajax({
                type: 'GET',
                data: {"token": token_actual.token, "id": $("#id").attr('value'), q: request.term},
                url: url_pv + 'Barrios/autocompletar/',
                dataType: "jsonp",
                success: function (data) {
                    response(data);
                }
            });
        };

        //Peticion para buscar ciudades
        var json_ciudades = function (request, response) {
            $.ajax({
                type: 'GET',
                data: {"token": token_actual.token, "id": $("#id").attr('value'), q: request.term},
                url: url_pv + 'Ciudades/autocompletar/',
                dataType: "jsonp",
                success: function (data) {
                    response(data);
                }
            });
        };

        //Cargos el autocomplete de barrios
        $("#barrio_residencia_name").autocomplete({
            source: json_barrio,
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
            }
        });

        //Cargos el autocomplete de ciudad de nacimiento
        $("#ciudad_nacimiento_name").autocomplete({
            source: json_ciudades,
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

        //Cargar el select de Pais
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token},
            url: url_pv + 'Paises/select'
        }).done(function (data) {
            if (data == 'error_metodo')
            {
                notify("danger", "ok", "Usuarios:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
            } else
            {
                if (data == 'error')
                {
                    notify("danger", "ok", "Usuarios:", "El usuario no se encuentra registrado, por favor registrarse");
                } else
                {
                    var json = JSON.parse(data);
                    $("#pais").append('<option value="">:: Seleccionar ::</option>');
                    if (json.length > 0) {
                        $.each(json, function (key, pais) {
                            $("#pais").append('<option value="' + pais.id + '">' + pais.nombre + '</option>');
                        });
                    }
                }
            }
        });

        //cargar select departamento
        $('#pais').on('change', function () {
            var pais = $(this).val();
            $('#departamento').find('option').remove();
            $('#ciudad_residencia').find('option').remove();
            $.ajax({
                type: 'GET',
                data: {"token": token_actual.token, "pais": pais},
                url: url_pv + 'Departamentos/select'
            }).done(function (data) {
                if (data == 'error_metodo')
                {
                    notify("danger", "ok", "Usuarios:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                } else
                {
                    if (data == 'error')
                    {
                        notify("danger", "ok", "Usuarios:", "El usuario no se encuentra registrado, por favor registrarse");
                    } else
                    {
                        var json = JSON.parse(data);
                        $("#departamento").append('<option value="">:: Seleccionar ::</option>');
                        $("#ciudad_residencia").append('<option value="">:: Seleccionar ::</option>');
                        if (json.length > 0) {
                            $.each(json, function (key, value) {
                                $("#departamento").append('<option value="' + value.id + '">' + value.nombre + '</option>');
                            });
                        }
                    }
                }
            });
        });
        
        // Cargar Ciudad
        $('#departamento').on('change', function () {
            var departamento = $(this).val();
            $('#ciudad_residencia').find('option').remove();
            $.ajax({
                type: 'GET',
                data: {"token": token_actual.token, "departamento": departamento},
                url: url_pv + 'Ciudades/select'
            }).done(function (data) {
                if (data == 'error_metodo')
                {
                    notify("danger", "ok", "Usuarios:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                } else
                {
                    if (data == 'error')
                    {
                        notify("danger", "ok", "Usuarios:", "El usuario no se encuentra registrado, por favor registrarse");
                    } else
                    {
                        var json = JSON.parse(data);
                        $("#ciudad_residencia").append('<option value="">:: Seleccionar ::</option>');
                        if (json.length > 0) {
                            $.each(json, function (key, value) {
                                $("#ciudad_residencia").append('<option value="' + value.id + '">' + value.nombre + '</option>');
                            });
                        }
                    }
                }
            });
        });

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',            
            data: {"token": token_actual.token, "id": $("#id").attr('value')},
            url: url_pv + 'Personasnaturales/search/'
        }).done(function (data) {
            var json = JSON.parse(data);
            
            //Error del metodo
            if (json.error === 1)
            {
                notify("danger", "ok", "Persona natural:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
            } else
            {
                //Error del token
                if (json.error === 2)
                {
                    location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                } 
                else
                {
                    //valido que no hay errores
                    if (json.error === 0)
                    {
                        json=json.respuesta;
                        
                        $('#departamento').find('option').remove();
                        $("#departamento").append('<option value="">:: Seleccionar ::</option>');
                        if (json.departamentos.length > 0) {
                            $.each(json.departamentos, function (key, departamento) {
                                var selected = '';
                                if(departamento.id == json.departamento_residencia_id)
                                {
                                    selected = 'selected="selected"';
                                }
                                $("#departamento").append('<option value="' + departamento.id + '" '+selected+' >' + departamento.nombre + '</option>');
                            });
                        }

                        $('#ciudad_residencia').find('option').remove();
                        $("#ciudad_residencia").append('<option value="">:: Seleccionar ::</option>');
                        if (json.ciudades.length > 0) {
                            $.each(json.ciudades, function (key, ciudad) {
                                var selected = '';
                                if(ciudad.id == json.ciudad_residencia_id)
                                {
                                    selected = 'selected="selected"';
                                }
                                $("#ciudad_residencia").append('<option value="' + ciudad.id + '" '+selected+' >' + ciudad.nombre + '</option>');
                            });
                        }
                        
                        
                        //Cargos el select de tipo de documento
                        $('#tipo_documento').find('option').remove();
                        $("#tipo_documento").append('<option value="">:: Seleccionar ::</option>');
                        if (json.tipo_documento.length > 0) {
                            $.each(json.tipo_documento, function (key, array) {
                                var selected = '';
                                if (array.id == json.participante.tipo_documento)
                                {
                                    selected = 'selected="selected"';
                                }
                                $("#tipo_documento").append('<option value="' + array.id + '" ' + selected + ' >' + array.descripcion + '</option>');
                            });
                        }
                        //Cargos el select de sexo
                        $('#sexo').find('option').remove();
                        $("#sexo").append('<option value="">:: Seleccionar ::</option>');
                        if (json.sexo.length > 0) {
                            $.each(json.sexo, function (key, array) {
                                var selected = '';
                                if (array.id == json.participante.sexo)
                                {
                                    selected = 'selected="selected"';
                                }
                                $("#sexo").append('<option value="' + array.id + '" ' + selected + ' >' + array.nombre + '</option>');
                            });
                        }
                        //Cargos el select de orientacion sexual
                        $('#orientacion_sexual').find('option').remove();
                        $("#orientacion_sexual").append('<option value="">:: Seleccionar ::</option>');
                        if (json.orientacion_sexual.length > 0) {
                            $.each(json.orientacion_sexual, function (key, array) {
                                var selected = '';
                                if (array.id == json.participante.orientacion_sexual)
                                {
                                    selected = 'selected="selected"';
                                }
                                $("#orientacion_sexual").append('<option value="' + array.id + '" ' + selected + ' >' + array.nombre + '</option>');
                            });
                        }
                        //Cargos el select de identidad genero
                        $('#identidad_genero').find('option').remove();
                        $("#identidad_genero").append('<option value="">:: Seleccionar ::</option>');
                        if (json.orientacion_sexual.length > 0) {
                            $.each(json.identidad_genero, function (key, array) {
                                var selected = '';
                                if (array.id == json.participante.identidad_genero)
                                {
                                    selected = 'selected="selected"';
                                }
                                $("#identidad_genero").append('<option value="' + array.id + '" ' + selected + ' >' + array.nombre + '</option>');
                            });
                        }
                        //Cargos el select de grupo etnico
                        $('#grupo_etnico').find('option').remove();
                        $("#grupo_etnico").append('<option value="">:: Seleccionar ::</option>');
                        if (json.grupo_etnico.length > 0) {
                            $.each(json.grupo_etnico, function (key, array) {
                                var selected = '';
                                if (array.id == json.participante.grupo_etnico)
                                {
                                    selected = 'selected="selected"';
                                }
                                $("#grupo_etnico").append('<option value="' + array.id + '" ' + selected + ' >' + array.nombre + '</option>');
                            });
                        }
                        //Cargos el select de estrato
                        $('#estrato').find('option').remove();
                        $("#estrato").append('<option value="">:: Seleccionar ::</option>');
                        if (json.estrato.length > 0) {
                            $.each(json.estrato, function (key, array) {
                                var selected = '';
                                if (array == json.participante.estrato)
                                {
                                    selected = 'selected="selected"';
                                }
                                $("#estrato").append('<option value="' + array + '" ' + selected + ' >' + array + '</option>');
                            });
                        }

                        //Asigno el nombre de las barrio
                        $("#barrio_residencia_name").val(json.barrio_residencia_name);

                        //Asigno el nombre de las ciudades
                        $("#ciudad_nacimiento_name").val(json.ciudad_nacimiento_name);                        

                        //Cargo el formulario con los datos
                        $('#formulario_principal').loadJSON(json.participante);
                        
                        $("#pais option[value='" + json.pais_residencia_id + "']").prop('selected', true);
                    }
                    else
                    {
                        notify("danger", "ok", "Persona natural:", "Se registro un error al cargar el registro, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                    }                    
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
                    notEmpty: {message: 'El número de documento de identificación es requerido'}
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
            pais: {
                validators: {
                    notEmpty: {message: 'El país de residencia es requerido'}
                }
            },
            departamento: {
                validators: {
                    notEmpty: {message: 'El departamento de residencia es requerido'}
                }
            },
            ciudad_residencia: {
                validators: {
                    notEmpty: {message: 'La ciudad de residencia es requerida, seleccione país y departamento de residencia'}
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

        // Valido si el id existe, con el fin de eviarlo al metodo correcto
        $('#formulario_principal').attr('action', url_pv + 'Personasnaturales/new');


        //Se realiza la peticion con el fin de guardar el registro actual
        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token
        }).done(function (result) {
            var json = JSON.parse(result);
                        
            if (json.error === 1)
            {
                notify("danger", "ok", "Persona natural:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
            } else
            {
                if (json.error === 2)
                {
                    location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                } else
                {
                    if (json.error === 3)
                    {
                        notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                    } else
                    {
                        if (json.error === 4)
                        {
                            notify("danger", "ok", "Persona natural:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                        } else
                        {
                        
                            if (json.error === 5)
                            {
                                notify("danger", "ok", "Persona natural:", "Se registro un error al crear el perfil, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                            } else
                            {
                                if (json.error === 6)
                                {
                                    notify("danger", "ok", "Persona natural:", json.mensaje);
                                } else
                                {
                                    if (json.error === 0)
                                    {
                                        /**
                                        *Cesar Britto, 2020-02-28.
                                        *Se realiza el ajuste para cuando se crea perfil de pn
                                        */
                                          $("#id").val(json.respuesta);
                                          notify("success", "ok", "Persona natural:", "Se actualizo con el éxito el participante como persona natural.");
                                    }
                                    else
                                    {
                                        notify("danger", "ok", "Persona natural:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                                    }

                                }
                            }
                        }
                    }
                }
            }
        });

        //$form.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
    });

}
