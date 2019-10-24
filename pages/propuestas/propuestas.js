$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {
        //Vacio el id
        $("#id").attr('value', "");
        //Asignamos el valor a input conv
        $("#conv").attr('value', getURLParameter('id'));

        //Verifica si el token actual tiene acceso de lectura
        permiso_lectura(token_actual, "Menu Participante");

        //Valido formulario
        validator_form(token_actual);

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m')},
            url: url_pv + 'Propuestas/buscar_propuesta/'
        }).done(function (data) {
            if (data == 'error_metodo')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            } else
            {
                if (data == 'error_token')
                {
                    //location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                } else
                {
                    if (data == 'crear_perfil')
                    {
                        //location.href = url_pv_admin + 'pages/perfilesparticipantes/persona_natural.html?msg=Para poder inscribir la propuesta debe crear el perfil de persona natural.&msg_tipo=danger';
                    } else
                    {
                        if (data == 'error_participante_propuesta')
                        {
                            //location.href = url_pv_admin + 'pages/perfilesparticipantes/persona_natural.html?msg=Se registro un error al importar el participante, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co.&msg_tipo=danger';
                        } else
                        {
                            if (data == 'acceso_denegado')
                            {
                                notify("danger", "remove", "Convocatorias:", "No tiene permisos para ver la información.");
                            } else
                            {
                                var json = JSON.parse(data);

                                //Verifico si es bpgota                                
                                if (json.propuesta.bogota)
                                {
                                    $(".class_descripcion_ejecucion").removeAttr("disabled");

                                    //Cargos el select de localidades
                                    $('#localidad').find('option').remove();
                                    $("#localidad").append('<option value="">:: Seleccionar ::</option>');
                                    if (json.localidades.length > 0) {
                                        $.each(json.localidades, function (key, localidad) {
                                            var selected = '';
                                            if (localidad.id == json.propuesta.localidad)
                                            {
                                                selected = 'selected="selected"';
                                            }
                                            $("#localidad").append('<option value="' + localidad.id + '" ' + selected + ' >' + localidad.nombre + '</option>');
                                        });
                                    }

                                    //Cargos el select de upzs
                                    $('#upz').find('option').remove();
                                    $("#upz").append('<option value="">:: Seleccionar ::</option>');
                                    if (json.upzs.length > 0) {
                                        $.each(json.upzs, function (key, upz) {
                                            var selected = '';
                                            if (upz.id == json.propuesta.upz)
                                            {
                                                selected = 'selected="selected"';
                                            }
                                            $("#upz").append('<option value="' + upz.id + '" ' + selected + ' >' + upz.nombre + '</option>');
                                        });
                                    }

                                    //Cargo los select de barrios
                                    $('#barrio').find('option').remove();
                                    $("#barrio").append('<option value="">:: Seleccionar ::</option>');
                                    if (json.barrios.length > 0) {
                                        $.each(json.barrios, function (key, barrio) {
                                            var selected = '';
                                            if (barrio.id == json.propuesta.barrio)
                                            {
                                                selected = 'selected="selected"';
                                            }
                                            $("#barrio").append('<option value="' + barrio.id + '" ' + selected + ' >' + barrio.nombre + '</option>');
                                        });
                                    }

                                }

                                //Cargo el formulario con los datos
                                $('#formulario_principal').loadJSON(json.propuesta);
                                $("#bogota option[value='" + json.propuesta.bogota + "']").prop('selected', true);
                            }
                        }

                    }
                }
            }
        });

        //Cargar Upz y Barrios
        $('#localidad').on('change', function () {
            var localidad = $(this).val();
            $('#upz').find('option').remove();
            $('#barrio').find('option').remove();
            $.ajax({
                type: 'GET',
                data: {"token": token_actual.token, "localidad": localidad},
                url: url_pv + 'Upzs/select'
            }).done(function (data) {
                if (data == 'error_metodo')
                {
                    notify("danger", "ok", "Usuarios:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                } else
                {
                    if (data == 'error_token')
                    {
                        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                    } else
                    {
                        var json = JSON.parse(data);
                        $("#upz").append('<option value="">:: Seleccionar ::</option>');
                        if(json!=null)
                        {    
                            if (json.length > 0) {
                                $.each(json, function (key, value) {
                                    $("#upz").append('<option value="' + value.id + '">' + value.nombre + '</option>');
                                });
                            }
                        }
                    }
                }
            });
            $.ajax({
                type: 'GET',
                data: {"token": token_actual.token, "localidad": localidad},
                url: url_pv + 'Barrios/select'
            }).done(function (data) {
                if (data == 'error_metodo')
                {
                    notify("danger", "ok", "Usuarios:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                } else
                {
                    if (data == 'error_token')
                    {
                        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                    } else
                    {
                        var json = JSON.parse(data);
                        $("#barrio").append('<option value="">:: Seleccionar ::</option>');
                        if(json!=null)
                        {
                            if (json.length > 0) {
                                $.each(json, function (key, value) {
                                    $("#barrio").append('<option value="' + value.id + '">' + value.nombre + '</option>');
                                });
                            }
                        }
                    }
                }
            });
        });

        //Cargar Barrios
        $('#upz').on('change', function () {
            var upz = $(this).val();
            var localidad = $("#localidad").val();
            $('#barrio').find('option').remove();
            $.ajax({
                type: 'GET',
                data: {"token": token_actual.token, "localidad": localidad, "upz": upz},
                url: url_pv + 'Barrios/select'
            }).done(function (data) {
                if (data == 'error_metodo')
                {
                    notify("danger", "ok", "Usuarios:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                } else
                {
                    if (data == 'error_token')
                    {
                        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                    } else
                    {
                        var json = JSON.parse(data);
                        $("#barrio").append('<option value="">:: Seleccionar ::</option>');
                        if (json.length > 0) {
                            $.each(json, function (key, value) {
                                $("#barrio").append('<option value="' + value.id + '">' + value.nombre + '</option>');
                            });
                        }
                    }
                }
            });
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
            primer_nombre: {
                validators: {
                    notEmpty: {message: 'El nombre de la agrupación es requerido'}
                }
            },
            correo_electronico: {
                validators: {
                    notEmpty: {message: 'El correo electrónico de la entidad es requerido'},
                    emailAddress: {
                        message: 'El Correo electrónico no es una dirección de correo electrónico válida'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {

        $("#mi-modal").modal('show');

        var modalConfirm = function (callback) {
            $("#modal-btn-si").on("click", function () {
                callback(true);
                $("#mi-modal").modal('hide');
            });

            $("#modal-btn-no").on("click", function () {
                callback(false);
                $("#mi-modal").modal('hide');
            });
        };

        // Prevent form submission
        e.preventDefault();
        // Get the form instance
        var $form = $(e.target);

        // Get the BootstrapValidator instance
        var bv = $form.data('bootstrapValidator');

        // Valido si el id existe, con el fin de eviarlo al metodo correcto
        $('#formulario_principal').attr('action', url_pv + 'Agrupaciones/editar_participante');


        modalConfirm(function (confirm) {
            if (confirm) {
                //Se realiza la peticion con el fin de guardar el registro actual
                $.ajax({
                    type: 'POST',
                    url: $form.attr('action'),
                    data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token
                }).done(function (result) {

                    if (result == 'error')
                    {
                        notify("danger", "ok", "Agrupación:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                    } else
                    {
                        if (result == 'error_token')
                        {
                            location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                        } else
                        {
                            if (result == 'acceso_denegado')
                            {
                                notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                            } else
                            {
                                if (result == 'error_usuario_perfil')
                                {
                                    notify("danger", "ok", "Agrupación:", "Se registro un error al crear el perfil, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                                } else
                                {
                                    if (result == 'participante_existente')
                                    {
                                        notify("danger", "ok", "Agrupación:", "El participante que intenta ingresar ya se encuentra registrado en la base de datos, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                                    } else
                                    {
                                        if (isNaN(result)) {
                                            notify("danger", "ok", "Agrupación:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                                        } else
                                        {
                                            location.href = url_pv_admin + 'pages/propuestas/propuesta.html?msg=Se actualizo con el éxito el participante como persona natural.&msg_tipo=success';
                                        }
                                    }
                                }
                            }
                        }
                    }

                });
            } else
            {
                $form.bootstrapValidator('disableSubmitButtons', false);
            }
        });
    });

}