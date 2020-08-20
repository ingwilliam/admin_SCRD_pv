$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    var href_regresar = "";
    var href_siguiente = "";
    //Creando link de navegación
    if (getURLParameter('m') == "agr")
    {
        href_regresar = "perfil_agrupacion.html?m=" + getURLParameter('m') + "&id=" + getURLParameter('id') + "&p=" + getURLParameter('p');
        href_siguiente = "integrantes.html?m=" + getURLParameter('m') + "&id=" + getURLParameter('id') + "&p=" + getURLParameter('p');
    }

    if (getURLParameter('m') == "pn")
    {
        href_regresar = "perfil_persona_natural.html?m=" + getURLParameter('m') + "&id=" + getURLParameter('id') + "&p=" + getURLParameter('p');
        href_siguiente = "documentacion.html?m=" + getURLParameter('m') + "&id=" + getURLParameter('id') + "&p=" + getURLParameter('p');
    }

    if (getURLParameter('m') == "pj")
    {
        href_regresar = "perfil_persona_juridica.html?m=" + getURLParameter('m') + "&id=" + getURLParameter('id') + "&p=" + getURLParameter('p');
        href_siguiente = "junta.html?m=" + getURLParameter('m') + "&id=" + getURLParameter('id') + "&p=" + getURLParameter('p');
    }

    $("#link_participante").attr("onclick", "location.href = '" + href_regresar + "'");
    $("#link_integrantes").attr("onclick", "location.href = '" + href_siguiente + "'");

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {
        //Valido el id de la propuesta
        if (Number.isInteger(parseInt(getURLParameter('p'))))
        {
            $('.semana').datetimepicker({
                language: 'es',
                daysOfWeekDisabled: [0,2,3,4,5,6],
                weekStart: 1,
                todayBtn: 0,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            }).on('changeDate', function(ev){
                
            
                alert(new Date(ev.date).toISOString().substring(0, 10));
            });            
            
            
            //Realizo la peticion para validar acceso a la convocatoria
            $.ajax({
                type: 'POST',
                data: {"token": token_actual.token, "p": getURLParameter('p')},
                url: url_pv + 'PropuestasBusquedasConvocatorias/validar_acceso/' + $("#id").val()
            }).done(function (data) {
                if (data == 'error_metodo')
                {
                    notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                } else
                {
                    if (data == 'error_token')
                    {
                        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                    } else
                    {
                        if (data == 'error_fecha_cierre')
                        {
                            notify("danger", "ok", "Convocatorias:", "La convocatoria ya no se encuentra disponible para inscribir su propuesta.");
                        } else
                        {
                            if (data == 'error_fecha_apertura')
                            {
                                notify("danger", "ok", "Convocatorias:", "La convocatoria esta en estado publicada, por favor revisar la fecha de apertura en el cronograma de la convocatoria.");
                            } else
                            {
                                if (data == 'error_maximo')
                                {
                                    location.href = url_pv_admin + 'pages/propuestas/propuestas_busqueda_convocatorias.html?msg=Ya tiene el máximo de propuestas guardadas permitidas para esta convocatoria, para visualizar sus propuestas por favor ingrese al menú Mis propuestas.&msg_tipo=danger';
                                } else
                                {
                                    if (data == 'error_propuesta')
                                    {
                                        location.href = url_pv_admin + 'pages/propuestas/propuestas_busqueda_convocatorias.html?msg=El código de la propuesta no es valido.&msg_tipo=danger';
                                    } else
                                    {
                                        if (data == 'error_participante')
                                        {
                                            location.href = url_pv_admin + 'pages/index/index.html?msg=Para poder inscribir la propuesta debe crear al menos un perfil como participante.&msg_tipo=danger';
                                        } else
                                        {
                                            if (data == 'ingresar')
                                            {
                                                //Vacio el id
                                                $("#id").attr('value', "");
                                                //Asignamos el valor a input conv
                                                $("#conv").attr('value', getURLParameter('id'));

                                                //disabled todos los componentes
                                                $("#formulario_principal input,select,button[type=submit],textarea").attr("disabled", "disabled");

                                                //Verifica si el token actual tiene acceso de lectura
                                                permiso_lectura(token_actual, "Menu Participante");

                                                //Realizo la peticion para cargar el formulario
                                                $.ajax({
                                                    type: 'GET',
                                                    data: {"token": token_actual.token, "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m'), "p": getURLParameter('p')},
                                                    url: url_pv + 'PropuestasPdac/buscar_propuesta/'
                                                }).done(function (data) {
                                                    if (data == 'error_metodo')
                                                    {
                                                        notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                                                    } else
                                                    {
                                                        if (data == 'error_token')
                                                        {
                                                            location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                                                        } else
                                                        {
                                                            if (data == 'acceso_denegado')
                                                            {
                                                                notify("danger", "remove", "Convocatorias:", "No tiene permisos para ver la información.");
                                                            } else
                                                            {
                                                                if (data == 'crear_perfil')
                                                                {
                                                                    location.href = url_pv_admin + 'pages/perfilesparticipantes/persona_natural.html?msg=Para poder inscribir la propuesta debe crear el perfil de persona natural.&msg_tipo=danger';
                                                                } else
                                                                {
                                                                    if (data == 'error_cod_propuesta')
                                                                    {
                                                                        location.href = url_pv_admin + 'pages/propuestas/propuestas_busqueda_convocatorias.html?msg=El código de la propuesta no es valido.&msg_tipo=danger';
                                                                    } else
                                                                    {

                                                                        var json = JSON.parse(data);

                                                                        //eliminó disabled todos los componentes
                                                                        if (json.estado == 7)
                                                                        {
                                                                            $("#formulario_principal input,select,button[type=submit],textarea").removeAttr("disabled");
                                                                        }                                                                        
                                                                                                                                                                                                                        
                                                                        //Cargo los parametros obligatorios
                                                                        $("#validator").attr("value", JSON.stringify(json.validator));

                                                                        //Cargo el formulario con los datos
                                                                        $('#formulario_principal').loadJSON(json.propuesta);                                                                        

                                                                        //agrego los totales de caracteres
                                                                        $(".caracter_objetivo_general").html(1000 - json.propuesta.objetivo_general.length);

                                                                        //Limpio select de categorias
                                                                        $('#propuestaobjetivo').find('option').remove();
                                                                        
                                                                        $("#propuestaobjetivo").append('<option value="" >::Seleccionar::</option>');
                                                                        
                                                                        //Cargo el select de las categorias                                                
                                                                        if (json.objetivos_especificos.length > 0) {
                                                                            $.each(json.objetivos_especificos, function (key, objetivo) {
                                                                                $("#propuestaobjetivo").append('<option value="' + objetivo.id + '" >' + objetivo.objetivo + '</option>');
                                                                            });
                                                                        }
                                                                        
                                                                        //Valido formulario
                                                                        validator_form(token_actual);
                                                                        
                                                                        //Creo la tabla de objetivos
                                                                        cargar_tabla(token_actual);     
                                                                    }
                                                                }

                                                            }
                                                        }
                                                    }
                                                });                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            
            //Limpio el formulario
            $('#nuevo_objetivo').on('hidden.bs.modal', function () {
                $("#objetivo").val("");
                $("#meta").val("");
                $("#orden").val("");                                                    
                $("#id_registro").val("");                   
            });
            
            //Limpio el formulario
            $('#nuevo_actividad').on('hidden.bs.modal', function () {
                $("#actividad").val("");
                $("#orden").val("");                                                    
                $("#id_registro_2").val("");                   
            });                               
            
        } else
        {
            location.href = url_pv_admin + 'pages/propuestas/propuestas_busqueda_convocatorias.html?msg=El código de la propuesta no es valido.&msg_tipo=danger';
        }

    }

    $(".contar_caracteres").keyup(function () {
        var total = $(this).attr("title");
        var total_text = $(this).val().length;
        var obj = $(this).attr("id");
        var total_actual = total - total_text;
        if (total_actual <= 0)
        {
            total_actual = 0;
        }
        $(".caracter_" + obj).html(total_actual);
    });

});

function validator_form(token_actual) {

    //Validar el formulario    
    $('.formulario_principal').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {            
            objetivo_general: {
                validators: {
                    notEmpty: {message: 'El objetivo general, es requerido'}
                }
            }
        }
    }).on('success.form.bv', function (e) {
        
        var validar = true;

        //William debe validar si creo al menos un objetivo espeficico y validar si creo al menos una actividad
    
        // Prevent form submission
        e.preventDefault();
        // Get the form instance
        var $form = $(e.target);

        if (validar)
        {
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

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Valido si el id existe, con el fin de eviarlo al metodo correcto
            $('#formulario_principal').attr('action', url_pv + 'PropuestasPdac/editar_propuesta_objetivo');

            modalConfirm(function (confirm) {
                if (confirm) {
                    //Se realiza la peticion con el fin de guardar el registro actual
                    $.ajax({
                        type: 'POST',
                        url: $form.attr('action'),
                        data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token + "&m=" + getURLParameter('m'),
                    }).done(function (result) {

                        if (result == 'error')
                        {
                            notify("danger", "ok", "Propuesta:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
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
                                    if (isNaN(result)) {
                                        notify("danger", "ok", "Propuesta:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                                    } else
                                    {
                                        notify("success", "ok", "Propuesta:", "Se actualizó con el éxito la propuesta.");

                                        var redirect = "territorios_poblaciones.html";
                                        
                                        setTimeout(function () {
                                            location.href = url_pv_admin + 'pages/propuestas/' + redirect + '?m=' + getURLParameter('m') + '&id=' + $("#conv").attr('value') + '&p=' + getURLParameter('p');
                                        }, 1800);
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
        } 
        else
        {
            $form.bootstrapValidator('disableSubmitButtons', false);
        }
    });
    
    //Validar el formulario    
    $('.form_nuevo_objetivo').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {            
            orden: {
                validators: {
                    notEmpty: {message: 'El orden del objetivo específico, es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            objetivo: {
                validators: {
                    notEmpty: {message: 'El objetivo específico, es requerido'}
                }
            },
            meta: {
                validators: {
                    notEmpty: {message: 'La meta, es requerido'}
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
            $('#form_nuevo_objetivo').attr('action', url_pv + 'PropuestasPdac/editar_propuesta_objetivo_especifico');

            //Se realiza la peticion con el fin de guardar el registro actual
            $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token + "&m=" + getURLParameter('m')+"&propuesta="+getURLParameter('p'),
            }).done(function (result) {

                if (result == 'error')
                {
                    notify("danger", "ok", "Propuesta:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
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
                            if (isNaN(result)) {
                                notify("danger", "ok", "Propuesta:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                            } else
                            {
                                notify("success", "ok", "Propuesta:", "Se guardo con el éxito el objetivo específico.");                               
                                $('#nuevo_objetivo').modal('toggle');
                                cargar_tabla(token_actual);
                            }
                        }
                    }
                }

            });                
    });
    
    //Validar el formulario    
    $('.form_nuevo_actividad').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {            
            propuestaobjetivo: {
                validators: {
                    notEmpty: {message: 'El objetivo específico, es requerido'}
                }
            },
            orden: {
                validators: {
                    notEmpty: {message: 'El orden de la actividad, es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            actividad: {
                validators: {
                    notEmpty: {message: 'La actividad, es requerido'}
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
            $('#form_nuevo_actividad').attr('action', url_pv + 'PropuestasPdac/editar_propuesta_actividad');

            //Se realiza la peticion con el fin de guardar el registro actual
            $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token + "&m=" + getURLParameter('m')+"&propuesta="+getURLParameter('p'),
            }).done(function (result) {

                if (result == 'error')
                {
                    notify("danger", "ok", "Propuesta:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
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
                            if (isNaN(result)) {
                                notify("danger", "ok", "Propuesta:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                            } else
                            {
                                notify("success", "ok", "Propuesta:", "Se guardo con el éxito la actividad.");                               
                                $('#nuevo_actividad').modal('toggle');
                                cargar_tabla(token_actual);
                            }
                        }
                    }
                }

            });                
    });
}

function cargar_tabla(token_actual)
{    
    $('#table_registros').DataTable({
        "language": {
            "url": "../../dist/libraries/datatables/js/spanish.json"
        },
        "processing": true,
        "destroy": true,
        "serverSide": true,
        "ordering": false,
        "lengthMenu": [20, 30, 40],
        "ajax": {
            url: url_pv + "PropuestasPdac/cargar_tabla_objetivos",
            data: {"token": token_actual.token, "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m'), "p": getURLParameter('p'), "tipo": $("#tipo").attr('value')}
        },
        "drawCallback": function (settings) {
            $(".check_activar_t").attr("checked", "true");
            $(".check_activar_f").removeAttr("checked");
            //Cargo el formulario, para crear o editar
            cargar_formulario(token_actual);
        },
        "columns": [
            {"data": "orden"},
            {"data": "objetivo"},
            {"data": "meta"},
            {"data": "activar_registro"},
            {"data": "editar"}
        ]
    });
    
    $('#tabla_actividades').DataTable({
        "language": {
            "url": "../../dist/libraries/datatables/js/spanish.json"
        },
        "processing": true,
        "destroy": true,
        "serverSide": true,
        "ordering": false,
        "lengthMenu": [20, 30, 40],
        "ajax": {
            url: url_pv + "PropuestasPdac/cargar_tabla_actividades",
            data: {"token": token_actual.token, "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m'), "p": getURLParameter('p'), "tipo": $("#tipo").attr('value')}
        },
        "drawCallback": function (settings) {
            $(".check_activar_t").attr("checked", "true");
            $(".check_activar_f").removeAttr("checked");
            //Cargo el formulario, para crear o editar
            cargar_formulario_actividad(token_actual);
        },
        "columns": [
            {"data": "orden"},
            {"data": "objetivo"},
            {"data": "actividad"},
            {"data": "activar_registro"},
            {"data": "cronograma"},
            {"data": "presupuesto"},
            {"data": "editar"}
        ]
    });
    
}

function cargar_formulario(token_actual)
{
    $(".cargar_formulario").click(function () {
        //Cargo el id actual        
        $("#id").attr('value', $(this).attr('title'))
        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "propuesta": getURLParameter('p'), "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m'), "id": $("#id").attr('value')},
            url: url_pv + 'PropuestasPdac/consultar_objetivo/'
        }).done(function (data) {
            if (data == 'error_metodo')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
            } else
            {
                if (data == 'error_token')
                {
                    location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                } else
                {
                    var json = JSON.parse(data);
                    
                    //Cargo el formulario con los datos
                    $('#form_nuevo_objetivo').loadJSON(json);
                    $('#objetivo').val(json.objetivo);
                    $('#meta').val(json.meta); 
                    
                    //agrego los totales de caracteres
                    $(".caracter_objetivo").html(500 - json.objetivo.length);
                    $(".caracter_meta").html(500 - json.meta.length);
                    
                }
            }
        });
    });       
    
    //Permite activar o inactivar un objetivo
    $(".activar_objetivo").click(function () {

        var active = "false";
        if ($(this).prop('checked')) {
            active = "true";
        }

        $.ajax({
            type: 'DELETE',
            data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active},
            url: url_pv + 'PropuestasPdac/eliminar_objetivo_especifico/' + $(this).attr("title")
        }).done(function (data) {
            if (data == 'ok')
            {
                if (active == "true")
                {
                    notify("info", "ok", "Convocatorias:", "Se activó el objetivo específico con éxito.");
                } else
                {
                    notify("info", "ok", "Convocatorias:", "Se inactivo el objetivo específico con éxito.");
                }
            } else
            {
                if (data == 'acceso_denegado')
                {
                    notify("danger", "remove", "Convocatorias:", "Acceso denegado.");
                } else
                {
                    notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                }
            }
        });
    });
    
}

function cargar_formulario_actividad(token_actual)
{
    $(".cargar_formulario_actividad").click(function () {
        //Cargo el id actual        
        $("#id").attr('value', $(this).attr('title'))
        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "propuesta": getURLParameter('p'), "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m'), "id": $("#id").attr('value')},
            url: url_pv + 'PropuestasPdac/consultar_actividad/'
        }).done(function (data) {
            if (data == 'error_metodo')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
            } else
            {
                if (data == 'error_token')
                {
                    location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                } else
                {
                    var json = JSON.parse(data);
                    
                    //Cargo el formulario con los datos
                    $('#form_nuevo_actividad').loadJSON(json);
                    $('#actividad').val(json.actividad);                    
                    
                    //agrego los totales de caracteres
                    $(".caracter_actividad").html(500 - json.actividad.length);                    
                    
                }
            }
        });
    });       
    
    //Permite activar o inactivar un actividad
    $(".activar_actividad").click(function () {

        var active = "false";
        if ($(this).prop('checked')) {
            active = "true";
        }

        $.ajax({
            type: 'DELETE',
            data: {"token": token_actual.token, "modulo": "Menu Participante", "active": active},
            url: url_pv + 'PropuestasPdac/eliminar_actividad/' + $(this).attr("title")
        }).done(function (data) {
            if (data == 'ok')
            {
                if (active == "true")
                {
                    notify("info", "ok", "Convocatorias:", "Se activó la actividad con éxito.");
                } else
                {
                    notify("info", "ok", "Convocatorias:", "Se inactivo la actividad con éxito.");
                }
            } else
            {
                if (data == 'acceso_denegado')
                {
                    notify("danger", "remove", "Convocatorias:", "Acceso denegado.");
                } else
                {
                    notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                }
            }
        });
    });
    
    
}