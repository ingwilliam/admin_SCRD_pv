
$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {

        //Verifica si el token actual tiene acceso de lectura
        permiso_lectura(token_actual, "Convocatorias");

        //Realizo la peticion para cargar el formulario
        if ($("#id").val() != "") {

            //Establesco los text area html
            $('.textarea_html').jqte();

            //Limpio el formulario de las categorias
            $('#nueva_convocatoria').on('hidden.bs.modal', function () {
                $("#nuevo_descripcion").jqteVal('');
                $("#nuevo_nombre").val("");
                $("#nuevo_orden").val("");
                $("#nuevo_seudonimo option[value='false']").prop("selected", true);
            })

            $('#editar_convocatoria').on('hidden.bs.modal', function () {
                $("#nuevo_descripcion").jqteVal('');
                $("#nuevo_nombre").val("");
                $("#nuevo_orden").val("");
                $("#nuevo_seudonimo option[value='false']").prop("selected", true);                
                
                $("#numero_estimulos").val("");
                $("#valor_total_estimulos").val("");
                $("#bolsa_concursable option[value='false']").prop("selected", true);
                $("#descripcion_bolsa").val("");                                      
                
            })

            //Realizo la peticion para cargar el formulario
            $.ajax({
                type: 'GET',
                data: {"token": token_actual.token, "id": $("#id").attr('value')},
                url: url_pv + 'Convocatorias/search/'
            }).done(function (data) {
                if (data == 'error_metodo')
                {
                    notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                } else
                {
                    if (data == 'error')
                    {
                        location.href = 'list.html?msg=Debe seleccionar una convocatoria, para poder continuar.&msg_tipo=danger';
                    } else
                    {
                        if (data == 'error_token')
                        {
                            location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                        } else
                        {
                            var json = JSON.parse(data);

                            if (typeof json.convocatoria.id === 'number') {

                                $(".regresar").attr("onclick", "location.href='update.html?id=" + $("#id").attr('value') + "'");

                                //Valido si la convocatoria tiene categorias
                                if (json.convocatoria.tiene_categorias == false)
                                {
                                    notify("danger", "ok", "Convocatorias:", "La convocatoria no tiene habilitada la opción de crear categorías, para habilitarla debe seleccionar (Sí) en el campo ¿Tiene categorias? de la seccion Información General.");
                                    $("#page-wrapper").css("display", "none");
                                }

                                //Valido si la convocatoria tiene categorias
                                if (json.convocatoria.diferentes_categorias == false)
                                {
                                    $(".diferentes_requisitos").css("display", "none");
                                    $(".diferentes_requisitos_disable").attr("disabled", "disabled");
                                }
                            }
                        }
                    }
                }
            });


            $('#detalle_especie_modal').on('hidden.bs.modal', function () {
                $("#id_especie").attr("value", "");
                $("#form_validator_especie").bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
                $("#form_validator_especie").data('bootstrapValidator').resetForm();
            });

            $('#distribucion_bolsa_modal').on('hidden.bs.modal', function () {
                $("#id_bolsa").attr("value", "");
                $("#form_validator_bolsa").bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
                $("#form_validator_bolsa").data('bootstrapValidator').resetForm();
            });


            //Cargar datos de la tabla de categorias
            cargar_tabla(token_actual);

        } else
        {
            location.href = 'list.html?msg=Debe seleccionar una convocatoria, para poder continuar.&msg_tipo=danger';
        }

        //guardar registro de convocatoria perfil participante
        $("#guardar_cp").click(function () {
            if ($("#id_cp").val() != "") {
                //Realizo la peticion con el fin de editar el registro del perfil de la convocatoria
                $.ajax({
                    type: 'PUT',
                    url: url_pv + 'Convocatoriasparticipantes/edit/' + $("#id_cp").attr('value'),
                    data: "active=TRUE&descripcion_perfil=" + $("#descripcion_cp").val() + "&modulo=Convocatorias&token=" + token_actual.token
                }).done(function (result) {
                    if (result == 'error')
                    {
                        notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                    } else
                    {
                        if (result == 'acceso_denegado')
                        {
                            notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                        } else
                        {
                            if (result == 'error_token')
                            {
                                location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                            } else
                            {
                                if (isNaN(result))
                                {
                                    notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                                } else
                                {
                                    notify("info", "ok", "Convocatorias:", "Se edito el perfil de participante con éxito.");
                                    //Activo en perfil de la convocatoria actual
                                    $(".tipo_participante_" + $("#id_tipo_participante").val()).attr('checked', true);
                                    $(".tipo_participante_" + $("#id_tipo_participante").val()).prop("checked", true);

                                    //Limpio el formulario
                                    $("#id_cp").attr('value', '');
                                    $("#id_tipo_participante").attr('value', '');
                                    $("#descripcion_cp").jqteVal('');
                                    $("#tipo_participante_cp").html('');

                                    cargar_tabla_perfiles_participante(token_actual);
                                }
                            }
                        }
                    }
                });
            } else
            {
                if ($("#id_tipo_participante").val() != "") {
                    //Se realiza la peticion con el fin de guardar el registro de la convocatoria participante
                    $.ajax({
                        type: 'POST',
                        url: url_pv + 'Convocatoriasparticipantes/new/',
                        data: "active=TRUE&descripcion_perfil=" + $("#descripcion_cp").val() + "&convocatoria=" + $("#id_categoria").val() + "&tipo_participante=" + $("#id_tipo_participante").val() + "&modulo=Convocatorias&token=" + token_actual.token
                    }).done(function (result) {

                        if (result == 'error')
                        {
                            notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                        } else
                        {
                            if (result == 'acceso_denegado')
                            {
                                notify("danger", "remove", "Convocatorias:", "No tiene permisos para editar información.");
                            } else
                            {
                                if (result == 'error_token')
                                {
                                    location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                                } else
                                {
                                    if (isNaN(result)) {
                                        notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                                    } else
                                    {
                                        notify("info", "ok", "Convocatorias:", "Se creo el perfil de participante con éxito.");

                                        //Activo en perfil de la convocatoria actual
                                        $(".tipo_participante_" + $("#id_tipo_participante").val()).attr('checked', true);
                                        $(".tipo_participante_" + $("#id_tipo_participante").val()).prop("checked", true);

                                        //Limpio el formulario
                                        $("#id_cp").attr('value', '');
                                        $("#id_tipo_participante").attr('value', '');
                                        $("#descripcion_cp").jqteVal('');
                                        $("#tipo_participante_cp").html('');

                                        cargar_tabla_perfiles_participante(token_actual);
                                    }
                                }
                            }
                        }

                    });
                } else
                {
                    notify("danger", "ok", "Convocatorias:", "No ha seleccionado ningun perfil del participante");
                }
            }
        });

        validator_form(token_actual);
        $(".check_activar_t").attr("checked", "true");
    }
});

function validator_form(token_actual) {
    //Validar el formulario
    $('.form_nuevo_convocatoria').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            nombre: {
                validators: {
                    notEmpty: {message: 'El nombre de la convocatoria es requerido'}
                }
            },
            descripcion: {
                validators: {
                    notEmpty: {message: 'La descripción corta de la convocatoria es requerida'}
                }
            },
            orden: {
                validators: {
                    notEmpty: {message: 'El orden es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
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

        //Se realiza la peticion con el fin de guardar el registro actual
        $.ajax({
            type: 'POST',
            url: url_pv + 'Convocatorias/new_categoria',
            data: $form.serialize() + "&modulo=Convocatorias&token=" + token_actual.token
        }).done(function (result) {

            if (result == 'error')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            } else
            {
                if (result == 'acceso_denegado')
                {
                    notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                } else
                {
                    if (isNaN(result)) {
                        notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                    } else
                    {
                        notify("success", "ok", "Convocatorias:", "Se creó la categoría con éxito.");
                        //Cargar datos de la tabla de categorias
                        cargar_tabla(token_actual);
                    }
                }
            }

        });

        $form.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
        bv.resetForm();
        $("#nuevo_descripcion").jqteVal('');
        $("#nuevo_nombre").val("");
        $("#nuevo_orden").val("");
        $("#nuevo_seudonimo option[value='false']").prop("selected", true);
    });

    //Validar el formulario de editar la categoria
    $('.form_edit_convocatoria').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            nombre: {
                validators: {
                    notEmpty: {message: 'El nombre de la convocatoria es requerido'}
                }
            },
            descripcion: {
                validators: {
                    notEmpty: {message: 'La descripción corta de la convocatoria es requerida'}
                }
            },
            tipo_estimulo: {
                validators: {
                    notEmpty: {message: 'El tipo de estímulo es requerido'}
                }
            },
            valor_total_estimulos: {
                validators: {
                    notEmpty: {message: 'El valor total de recursos que entregará la convocatoria es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            numero_estimulos: {
                validators: {
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            orden: {
                validators: {
                    notEmpty: {message: 'El orden es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
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

        //Se realiza la peticion con el fin de guardar el registro actual
        $.ajax({
            type: 'PUT',
            url: url_pv + 'Convocatorias/edit_categoria/' + $("#id").attr('value'),
            data: $form.serialize() + "&modulo=Convocatorias&token=" + token_actual.token
        }).done(function (result) {

            if (result == 'error')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            } else
            {
                if (result == 'acceso_denegado')
                {
                    notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                } else
                {
                    if (isNaN(result)) {
                        notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                    } else
                    {
                        notify("success", "ok", "Convocatorias:", "Se edito la categoría con éxito.");
                        //Cargar datos de la tabla de categorias
                        cargar_tabla(token_actual);
                    }
                }
            }

        });
    });

    //Validar el formulario de la bolsa
    $('.form_validator_bolsa').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            orden: {
                validators: {
                    notEmpty: {message: 'El número de estímulos a otorgar es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            valor_recurso: {
                validators: {
                    notEmpty: {message: 'El valor individual por estímulo es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
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

        // Enviar datos del formulario para guardar
        if ($("#id_bolsa").val() == "") {
            //Se realiza la peticion con el fin de guardar el registro actual
            $.ajax({
                type: 'POST',
                url: url_pv + 'Convocatoriasrecursos/new/',
                data: $form.serialize() + "&modulo=Convocatorias&token=" + token_actual.token + "&convocatoria=" + $("#id_categoria").attr('value')
            }).done(function (result) {

                if (result == 'error')
                {
                    notify("danger", "ok", "Convocatoria recurso:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                } else
                {
                    if (result == 'acceso_denegado')
                    {
                        notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                    } else
                    {
                        if (isNaN(result)) {
                            notify("danger", "ok", "Convocatoria recurso:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                        } else
                        {
                            notify("success", "ok", "Convocatoria recurso:", "Se creó el registro con éxito.");
                            cargar_tabla_registros(token_actual, 'tbody_distribuciones_bolsas', 'Bolsa');
                        }
                    }
                }

            });
        } else {
            //Realizo la peticion con el fin de editar el registro actual
            $.ajax({
                type: 'PUT',
                url: url_pv + 'Convocatoriasrecursos/edit/' + $("#id_bolsa").attr('value'),
                data: $form.serialize() + "&modulo=Convocatorias&token=" + token_actual.token
            }).done(function (result) {
                if (result == 'error')
                {
                    notify("danger", "ok", "Convocatoria recurso:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                } else
                {
                    if (result == 'acceso_denegado')
                    {
                        notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                    } else
                    {
                        if (isNaN(result))
                        {
                            notify("danger", "ok", "Convocatoria recurso:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                        } else
                        {
                            notify("info", "ok", "Convocatoria recurso:", "Se edito el registro con éxito.");
                            cargar_tabla_registros(token_actual, 'tbody_distribuciones_bolsas', 'Bolsa');
                        }
                    }
                }
            });
        }

        //Elimino contenido del formulario
        $("#id_bolsa").attr("value", "");
        $form.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
        bv.resetForm();
    });

    //Validar el formulario de la especie
    $('.form_validator_especie').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            orden: {
                validators: {
                    notEmpty: {message: 'El orden es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            recurso_no_pecuniario: {
                validators: {
                    notEmpty: {message: 'El tipo de estímulo no pecuniario es requerido'}
                }
            },
            valor_recurso: {
                validators: {
                    notEmpty: {message: 'La valoración del recurso no pecuniario es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            descripcion_recurso: {
                validators: {
                    notEmpty: {message: 'La descripción del recurso no pecuniario es requerida'}
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

        // Enviar datos del formulario para guardar
        if ($("#id_especie").val() == "") {
            //Se realiza la peticion con el fin de guardar el registro actual
            $.ajax({
                type: 'POST',
                url: url_pv + 'Convocatoriasrecursos/new/',
                data: $form.serialize() + "&modulo=Convocatorias&token=" + token_actual.token + "&convocatoria=" + $("#id_categoria").attr('value')
            }).done(function (result) {

                if (result == 'error')
                {
                    notify("danger", "ok", "Convocatoria recurso:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                } else
                {
                    if (result == 'acceso_denegado')
                    {
                        notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                    } else
                    {
                        if (result == 'error_token')
                        {
                            location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                        } else
                        {
                            if (isNaN(result)) {
                                notify("danger", "ok", "Convocatoria recurso:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                            } else
                            {
                                notify("success", "ok", "Convocatoria recurso:", "Se creó el registro con éxito.");
                                cargar_tabla_registros(token_actual, 'tbody_distribuciones_especie', 'Especie');
                            }
                        }
                    }
                }

            });
        } else {
            //Realizo la peticion con el fin de editar el registro actual
            $.ajax({
                type: 'PUT',
                url: url_pv + 'Convocatoriasrecursos/edit/' + $("#id_especie").attr('value'),
                data: $form.serialize() + "&modulo=Convocatorias&token=" + token_actual.token
            }).done(function (result) {
                if (result == 'error')
                {
                    notify("danger", "ok", "Convocatoria recurso:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                } else
                {
                    if (result == 'acceso_denegado')
                    {
                        notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                    } else
                    {
                        if (result == 'error_token')
                        {
                            location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                        } else
                        {
                            if (isNaN(result))
                            {
                                notify("danger", "ok", "Convocatoria recurso:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                            } else
                            {
                                notify("info", "ok", "Convocatoria recurso:", "Se edito el registro con éxito.");
                                cargar_tabla_registros(token_actual, 'tbody_distribuciones_especie', 'Especie');
                            }
                        }
                    }
                }
            });
        }

        //Elimino contenido del formulario
        $("#id_especie").attr("value", "");
        $form.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
        bv.resetForm();
    });

}

function cargar_tabla(token_actual)
{
    $('#table_categorias').DataTable({
        "language": {
            "url": "../../dist/libraries/datatables/js/spanish.json"
        },
        "processing": true,
        "destroy": true,
        "serverSide": true,
        "lengthMenu": [20, 30, 40],
        "ordering": false,
        "ajax": {
            url: url_pv + "Convocatorias/all",
            data: {"token": token_actual.token, "convocatoria": $("#id").attr('value')}
        },
        "drawCallback": function (settings) {
            $(".check_activar_t").attr("checked", "true");
            $(".check_activar_f").removeAttr("checked");
            acciones_categoria(token_actual);
        },
        "columns": [
            {"data": "orden"},
            {"data": "nombre"},
            {"data": "descripcion"},
            {"data": "activar_registro"},
            {"data": "acciones"}
        ]
    });

}

function acciones_categoria(token_actual)
{
    //Valido si tiene bolsa concursable                                    
    $('#tipo_estimulo').on('change', function () {
        if ($(this).val() == 2 || $(this).val() == 3)
        {
            $(".class_tipo_estimulo").removeAttr("disabled");
        } else
        {
            $(".class_tipo_estimulo").attr("disabled", "disabled");
        }

    });

    //Valido si tiene bolsa concursable
    $("#bolsa_concursable").on('change', function () {
        if ($(this).val() == "true")
        {
            $(".class_bolsa_concursable").removeAttr("disabled");
            $("input[name='numero_estimulos']").attr("disabled", "disabled");
            $("input[name='numero_estimulos']").val("");
        } else
        {
            $("input[name='numero_estimulos']").removeAttr("disabled");
            $(".class_bolsa_concursable").attr("disabled", "disabled");
            $("#descripcion_bolsa").val("");
        }
    });

    //Limpio el formulario de los perfiles de los participantes
    $('#editar_convocatoria').on('hidden.bs.modal', function () {
        $("#id_cp").attr('value', '');
        $("#descripcion_cp").jqteVal('');
        $("#tipo_participante_cp").html('');
    })

    //Permite realizar la carga respectiva de la categoria
    $(".btn_categoria").click(function () {
        $("#id_categoria").attr('value', $(this).attr("title"));
        $("#convocatoria_padre_categoria").attr('value', getURLParameter('id'));


        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "id": $(this).attr("title")},
            url: url_pv + 'Convocatorias/search/'
        }).done(function (data) {
            if (data == 'error_metodo')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            } else
            {
                if (data == 'error')
                {
                    notify("danger", "ok", "Convocatorias:", "El convocatoria no se encuentra registrado, por favor registrarse");
                } else
                {
                    var json = JSON.parse(data);

                    //Cargo los checks de quienes pueden participar
                    $('#quienes_pueden_participar').html("<label>¿Quién puede participar?</label><br/>");
                    $("#tbody_tipos_participantes").find("tr").remove();
                    if (json.tipos_participantes.length > 0) {
                        $.each(json.tipos_participantes, function (key, tipo_participante) {
                            var checked = '';
                            if (tipo_participante.active == true)
                            {
                                checked = 'checked="checked"';
                            }

                            $("#quienes_pueden_participar").append('<label class="checkbox-inline"><input class="tipo_participante tipo_participante_' + tipo_participante.id + '" value="' + tipo_participante.id + '" type="checkbox" ' + checked + '>' + tipo_participante.nombre + '</label>');

                            if (tipo_participante.descripcion == null)
                            {
                                tipo_participante.descripcion = '';
                            }

                            $("#tbody_tipos_participantes").append('<tr><td>' + tipo_participante.nombre + '</td><td><button type="button" class="btn btn-warning btn-update-convocatoria-participante" lang="' + JSON.stringify(tipo_participante).replace(/\"/g, "&quot;") + '"><span class="glyphicon glyphicon-edit"></span></button></td></tr>');
                        });
                    }

                    //Cargo los perfiles de los jurados en esta convocatoria
                    if (json.perfiles_jurados.length > 0) {
                        $.each(json.perfiles_jurados, function (key, perfil_jurado) {
                            var checked = '';
                            if (perfil_jurado.active == true)
                            {
                                checked = "checked='checked'";
                            }
                            $("#tbody_perfiles_jurados").append('<tr><td>' + perfil_jurado.orden + '</td><td>' + perfil_jurado.descripcion_perfil + '</td><td><input onclick="activar_perfil_jurado(' + perfil_jurado.id + ',' + $("#id").attr('value') + ',\'' + token_actual.token + '\')" type="checkbox" ' + checked + '></td><td><button type="button" class="btn btn-warning btn-update-convocatoria-jurados-' + perfil_jurado.id + '" onclick="cargar_perfil_jurado(' + perfil_jurado.id + ')" lang="' + JSON.stringify(perfil_jurado).replace(/\"/g, "&quot;") + '"><span class="glyphicon glyphicon-edit"></span></button></td></tr>');
                        });
                    }

                    //Cargo los la distribucion de bolsas
                    $("#tbody_distribuciones_bolsas").find("tr").remove();
                    if (json.distribuciones_bolsas.length > 0) {
                        $.each(json.distribuciones_bolsas, function (key, distribucion_bolsa) {
                            var checked = '';
                            if (distribucion_bolsa.active == true)
                            {
                                checked = "checked='checked'";
                            }
                            $("#tbody_distribuciones_bolsas").append('<tr><td>' + distribucion_bolsa.orden + '</td><td>' + distribucion_bolsa.valor_recurso + '</td><td><input onclick="activar_registro(' + distribucion_bolsa.id + ',\'' + token_actual.token + '\')" type="checkbox" ' + checked + '></td><td><button type="button" class="btn btn-warning btn-update-distribucion-registro-' + distribucion_bolsa.id + '" onclick="cargar_registro(' + distribucion_bolsa.id + ',\'form_validator_bolsa\')" lang="' + JSON.stringify(distribucion_bolsa).replace(/\"/g, "&quot;") + '"><span class="glyphicon glyphicon-edit"></span></button></td></tr>');
                        });
                    }

                    //Cargo los la distribucion de especies
                    $("#tbody_distribuciones_especie").find("tr").remove();
                    if (json.distribuciones_especies.length > 0) {
                        $.each(json.distribuciones_especies, function (key, distribucion_especie) {
                            var checked = '';
                            if (distribucion_especie.active == true)
                            {
                                checked = "checked='checked'";
                            }
                            $("#tbody_distribuciones_especie").append('<tr><td>' + distribucion_especie.orden + '</td><td>' + distribucion_especie.nombre_recurso_no_pecuniario + '</td><td>' + distribucion_especie.valor_recurso + '</td><td><input onclick="activar_registro(' + distribucion_especie.id + ',\'' + token_actual.token + '\')" type="checkbox" ' + checked + '></td><td><button type="button" class="btn btn-warning btn-update-distribucion-registro-' + distribucion_especie.id + '" onclick="cargar_registro(' + distribucion_especie.id + ',\'form_validator_especie\')" lang="' + JSON.stringify(distribucion_especie).replace(/\"/g, "&quot;") + '"><span class="glyphicon glyphicon-edit"></span></button></td></tr>');
                        });
                    }

                    //para habilitar formulario de convocatoria participante
                    $(".btn-update-convocatoria-participante").click(function () {
                        var json_update = JSON.parse($(this).attr("lang"));
                        $("#id_cp").val(json_update.id_cp);
                        $("#id_tipo_participante").val(json_update.id);
                        $("#tipo_participante_cp").html(json_update.nombre);
                        $("#descripcion_cp").jqteVal(json_update.descripcion_cp);
                    });

                    //Creamos los participantes en la convocatoria
                    $('.tipo_participante').click(function () {
                        var tipo_participante = $(this).val();
                        if ($(this).prop('checked')) {
                            //Se realiza la peticion con el fin de guardar el registro de la convocatoria participante
                            $.ajax({
                                type: 'POST',
                                url: url_pv + 'Convocatoriasparticipantes/new/',
                                data: "convocatoria=" + $("#id_categoria").val() + "&tipo_participante=" + $(this).val() + "&modulo=Convocatorias&token=" + token_actual.token
                            }).done(function (result) {

                                if (result == 'error')
                                {
                                    notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                                } else
                                {
                                    if (result == 'acceso_denegado')
                                    {
                                        notify("danger", "remove", "Convocatorias:", "No tiene permisos para editar información.");
                                    } else
                                    {
                                        if (result == 'error_token')
                                        {
                                            location.href = url_pv + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                                        } else
                                        {
                                            if (isNaN(result)) {
                                                notify("danger", "ok", "Convocatorias:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                                            } else
                                            {
                                                notify("success", "ok", "Convocatorias:", "Se creó el perfil del participante con éxito.");
                                                cargar_tabla_perfiles_participante(token_actual)
                                            }
                                        }
                                    }
                                }

                            });
                        } else
                        {
                            //Se realiza la peticion para desactivar la convocatoria participante
                            $.ajax({
                                type: 'DELETE',
                                data: {"token": token_actual.token, "modulo": "Convocatorias", "convocatoria": $("#id_categoria").val(), "tipo_participante": $(this).val()},
                                url: url_pv + 'Convocatoriasparticipantes/delete'
                            }).done(function (data) {
                                if (data == 'Si' || data == 'No')
                                {
                                    if (data == 'Si')
                                    {
                                        notify("info", "ok", "Convocatorias:", "Se activo el perfil del participante con éxito.");
                                    } else
                                    {
                                        notify("info", "ok", "Convocatorias:", "Se elimino el perfil del participante con éxito.");
                                    }
                                } else
                                {
                                    if (data == 'acceso_denegado')
                                    {
                                        notify("danger", "remove", "Convocatorias:", "Acceso denegado.");
                                    } else
                                    {
                                        notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                                    }
                                }
                            });
                        }
                    });

                    //Cargo el select de los recursos no pecuniarios
                    $('#recurso_no_pecuniario').find('option').remove();
                    $("#recurso_no_pecuniario").append('<option value="">:: Seleccionar ::</option>');
                    if (json.recursos_no_pecunarios.length > 0) {
                        $.each(json.recursos_no_pecunarios, function (key, recurso_no_pecuniario) {
                            $("#recurso_no_pecuniario").append('<option value="' + recurso_no_pecuniario.id + '" >' + recurso_no_pecuniario.nombre + '</option>');
                        });
                    }

                    //Cargo el select de tipos de estimulos
                    $('#tipo_estimulo').find('option').remove();
                    $("#tipo_estimulo").append('<option value="">:: Seleccionar ::</option>');
                    if (json.tipos_estimulos.length > 0) {
                        $.each(json.tipos_estimulos, function (key, tipo_estimulo) {
                            var selected = '';
                            if (tipo_estimulo.id == json.convocatoria.tipo_estimulo)
                            {
                                selected = 'selected="selected"';
                            }
                            $("#tipo_estimulo").append('<option value="' + tipo_estimulo.id + '" ' + selected + ' >' + tipo_estimulo.nombre + '</option>');
                        });
                    }

                    //Habilito los modales dependiendo del tipo de estimulo
                    if ($("#tipo_estimulo").val() == 2 || $("#tipo_estimulo").val() == 3)
                    {
                        $(".class_tipo_estimulo").removeAttr("disabled");
                    } else
                    {
                        $(".class_tipo_estimulo").attr("disabled", "disabled");
                    }

                    //Habilito los modales dependiendo del tipo de estimulo
                    if ($("#tipo_estimulo").val() == 2)
                    {
                        $(".class_bolsa_concursable").attr("disabled", "disabled");
                    } else
                    {
                        $(".class_bolsa_concursable").removeAttr("disabled");
                    }

                    $('#form_edit_convocatoria').loadJSON(json.convocatoria);

                    //Se realiza este set debido a que los boolean no lo toma con load json
                    $("#seudonimo option[value='" + json.convocatoria.seudonimo + "']").prop('selected', true);
                    $("#bolsa_concursable option[value='" + json.convocatoria.bolsa_concursable + "']").prop('selected', true);
                    //Verifico si es bolsa concursable
                    if ($("#bolsa_concursable").val() == "true")
                    {
                        $(".class_bolsa_concursable").removeAttr("disabled");
                        $("input[name='numero_estimulos']").attr("disabled", "disabled");
                        $("input[name='numero_estimulos']").val("");
                    } else
                    {
                        $(".class_bolsa_concursable").attr("disabled", "disabled");
                        $("input[name='numero_estimulos']").removeAttr("disabled");
                        $("#descripcion_bolsa").val("");
                    }

                    //Se realiza este set en cada text area html debido a que jste no es compatible con load json
                    $("#descripcion").jqteVal(json.convocatoria.descripcion);
                    $("#orden").val(json.convocatoria.orden);

                }
            }
        });


    });

    //Permite activar o eliminar una categoria
    $(".activar_categoria").click(function () {

        var active = "false";
        if ($(this).prop('checked')) {
            active = "true";
        }


        $.ajax({
            type: 'DELETE',
            data: {"token": token_actual.token, "modulo": "Convocatorias", "active": active},
            url: url_pv + 'Convocatorias/delete_categoria/' + $(this).attr("title")
        }).done(function (data) {
            if (data == 'ok')
            {
                if (active == "true")
                {
                    notify("info", "ok", "Convocatorias:", "Se activo la categoría con éxito.");
                } else
                {
                    notify("info", "ok", "Convocatorias:", "Se elimino el categoría con éxito.");
                }
            } else
            {
                if (data == 'acceso_denegado')
                {
                    notify("danger", "remove", "Convocatorias:", "Acceso denegado.");
                } else
                {
                    notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                }
            }
        });
    });
}

//Carga la tabla de los recursos de la convocatoria
function cargar_tabla_registros(token_actual, tbody, tipo_recurso) {
    $.ajax({
        type: 'GET',
        data: {"token": token_actual.token, "convocatoria": $("#id_categoria").val(), "tipo_recurso": tipo_recurso},
        url: url_pv + 'Convocatoriasrecursos/select_convocatoria'
    }).done(function (data) {
        if (data == 'error_metodo')
        {
            notify("danger", "ok", "Usuarios:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
        } else
        {
            if (data == 'error')
            {
                notify("danger", "ok", "Usuarios:", "El usuario no se encuentra registrado, por favor registrarse");
            } else
            {
                var json = JSON.parse(data);
                if (json.length > 0) {
                    $("#" + tbody).find("tr").remove();
                    $.each(json, function (key, distribucion_bolsa) {
                        var checked = '';
                        if (distribucion_bolsa.active == true)
                        {
                            checked = "checked='checked'";
                        }

                        if (tipo_recurso == "Bolsa")
                        {

                            $("#" + tbody).append('<tr><td>' + distribucion_bolsa.orden + '</td><td>' + distribucion_bolsa.valor_recurso + '</td><td><input onclick="activar_registro(' + distribucion_bolsa.id + ',\'' + token_actual.token + '\')" type="checkbox" ' + checked + '></td><td><button type="button" class="btn btn-warning btn-update-distribucion-registro-' + distribucion_bolsa.id + '" onclick="cargar_registro(' + distribucion_bolsa.id + ',\'form_validator_bolsa\')" lang="' + JSON.stringify(distribucion_bolsa).replace(/\"/g, "&quot;") + '"><span class="glyphicon glyphicon-edit"></span></button></td></tr>');
                        } else
                        {
                            $("#" + tbody).append('<tr><td>' + distribucion_bolsa.orden + '</td><td>' + distribucion_bolsa.nombre_recurso_no_pecuniario + '</td><td>' + distribucion_bolsa.valor_recurso + '</td><td><input onclick="activar_registro(' + distribucion_bolsa.id + ',\'' + token_actual.token + '\')" type="checkbox" ' + checked + '></td><td><button type="button" class="btn btn-warning btn-update-distribucion-registro-' + distribucion_bolsa.id + '" onclick="cargar_registro(' + distribucion_bolsa.id + ',\'form_validator_especie\')" lang="' + JSON.stringify(distribucion_bolsa).replace(/\"/g, "&quot;") + '"><span class="glyphicon glyphicon-edit"></span></button></td></tr>');
                        }


                    });
                }
            }
        }
    });
}

//Funcion para activar o desactivar los recursos del estimulo
function activar_registro(id, token_actual) {
    $.ajax({
        type: 'DELETE',
        data: {"token": token_actual, "modulo": "Convocatorias"},
        url: url_pv + 'Convocatoriasrecursos/delete/' + id
    }).done(function (data) {
        if (data == 'Si' || data == 'No')
        {
            if (data == 'Si')
            {
                notify("info", "ok", "Convocatoria recurso:", "Se activo el registro con éxito.");
            } else
            {
                notify("danger", "ok", "Convocatoria recurso:", "Se inactivo el registro con éxito.");
            }
        } else
        {
            if (data == 'acceso_denegado')
            {
                notify("danger", "remove", "Convocatorias:", "Acceso denegado.");
            } else
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            }
        }
    });
}

//Carga el registro el registro del recurso de la convocatoria
function cargar_registro(id, form) {
    var json_update = JSON.parse($(".btn-update-distribucion-registro-" + id).attr("lang"));
    $('#' + form).loadJSON(json_update);
}

//Funcion para activar o desactivar participante
function activar_participante(tipo_participante, convocatoria, token_actual) {
    //Se realiza la peticion para desactivar la convocatoria participante
    $.ajax({
        type: 'DELETE',
        data: {"token": token_actual, "modulo": "Convocatorias", "convocatoria": convocatoria, "tipo_participante": tipo_participante},
        url: url_pv + 'Convocatoriasparticipantes/delete'
    }).done(function (data) {
        if (data == 'Si' || data == 'No')
        {
            if (data == 'Si')
            {
                notify("info", "ok", "Convocatorias:", "Se activo el perfil del participante con éxito.");
                $(".tipo_participante_" + tipo_participante).attr('checked', true);
                $(".tipo_participante_" + tipo_participante).prop("checked", true);
            } else
            {
                notify("info", "ok", "Convocatorias:", "Se elimino el perfil del participante con éxito.");
                $(".tipo_participante_" + tipo_participante).attr('checked', false);
                $(".tipo_participante_" + tipo_participante).prop("checked", false);
            }
        } else
        {
            if (data == 'acceso_denegado')
            {
                notify("danger", "remove", "Convocatorias:", "Acceso denegado.");
            } else
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            }
        }
    });
}

//Carga la tabla de los perfiles de los participantes
function cargar_tabla_perfiles_participante(token_actual) {
    $.ajax({
        type: 'GET',
        data: {"token": token_actual.token, "convocatoria": $("#id_categoria").val()},
        url: url_pv + 'Convocatoriasparticipantes/select_form_convocatoria'
    }).done(function (data) {
        if (data == 'error_metodo')
        {
            notify("danger", "ok", "Usuarios:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
        } else
        {
            if (data == 'error')
            {
                notify("danger", "ok", "Usuarios:", "El usuario no se encuentra registrado, por favor registrarse");
            } else
            {
                var json = JSON.parse(data);
                if (json.length > 0) {
                    $("#tbody_tipos_participantes").find("tr").remove();
                    $.each(json, function (key, tipo_participante) {
                        var checked = '';
                        if (tipo_participante.active == true)
                        {
                            checked = "checked='checked'";
                        }
                        $("#tbody_tipos_participantes").append('<tr><td>' + tipo_participante.nombre + '</td><td><button type="button" class="btn btn-warning btn-update-convocatoria-participante" lang="' + JSON.stringify(tipo_participante).replace(/\"/g, "&quot;") + '"><span class="glyphicon glyphicon-edit"></span></button></td></tr>');
                    });

                    //para habilitar formulario de convocatoria participante
                    $(".btn-update-convocatoria-participante").click(function () {
                        var json_update = JSON.parse($(this).attr("lang"));
                        $("#id_cp").val(json_update.id_cp);
                        $("#id_tipo_participante").val(json_update.id);
                        $("#tipo_participante_cp").html(json_update.nombre);
                        $("#descripcion_cp").jqteVal(json_update.descripcion_cp);
                    });
                }
            }
        }
    });
}