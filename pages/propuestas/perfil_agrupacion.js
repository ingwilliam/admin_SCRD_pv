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
            data: {"token": token_actual.token, "conv": $("#conv").attr('value'), "modulo": "Menu Participante"},
            url: url_pv + 'Agrupaciones/buscar_participante/'
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
                    if (data == 'crear_perfil')
                    {
                        location.href = url_pv_admin + 'pages/perfilesparticipantes/persona_natural.html?msg=Para poder inscribir la propuesta debe crear el perfil de persona natural.&msg_tipo=danger';
                    } else
                    {
                        if (data == 'error_participante_propuesta')
                        {
                            location.href = url_pv_admin + 'pages/perfilesparticipantes/persona_natural.html?msg=Se registro un error al importar el participante, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co.&msg_tipo=danger';
                        } else
                        {
                            if (data == 'acceso_denegado')
                            {
                                notify("danger", "remove", "Convocatorias:", "No tiene permisos para ver la información.");
                            } else
                            {
                                var json = JSON.parse(data);

                                //Cargo el formulario con los datos
                                $('#formulario_principal').loadJSON(json.participante);
                               
                            }
                        }

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
                                            notify("success", "ok", "Persona natural:", "Se actualizo con el éxito el participante como agrupación.");                                    
                                            setTimeout(function(){location.href = url_pv_admin + 'pages/propuestas/propuestas.html?m=agr&id='+$("#conv").attr('value');}, 1800);                                                                                                                                                                                                                            
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