$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {
        
        //Verifica si el token actual tiene acceso de lectura
        permiso_lectura(token_actual, "Reporte Propuestas");

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "modulo": "Reporte Propuestas"},
            url: url_pv + 'Convocatorias/modulo_buscador_propuestas'
        }).done(function (data) {
            if (data == 'error_metodo')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            } else
            {
                if (data == 'error')
                {
                    location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                } else
                {
                    if (data == 'acceso_denegado')
                    {
                        notify("danger", "remove", "Convocatorias:", "No tiene permisos para ver la información.");
                    } else
                    {
                        var json = JSON.parse(data);

                        $("#anio").append('<option value="">:: Seleccionar ::</option>');
                        if (json.anios.length > 0) {
                            $.each(json.anios, function (key, anio) {
                                $("#anio").append('<option value="' + anio + '"  >' + anio + '</option>');
                            });
                        }

                        $("#entidad").append('<option value="">:: Seleccionar ::</option>');
                        if (json.entidades.length > 0) {
                            $.each(json.entidades, function (key, entidad) {
                                $("#entidad").append('<option value="' + entidad.id + '"  >' + entidad.nombre + '</option>');
                            });
                        }

                        if (json.entidades.length > 0) {
                            //var selected;
                            $.each(json.estados_propuestas, function (key, estado_propuesta) {
                                if (estado_propuesta.id != 7)
                                {
                                    $("#estado_propuesta").append('<option value="' + estado_propuesta.id + '" >' + estado_propuesta.nombre + '</option>');
                                }
                            });
                        }
                    }
                }
            }
        });

        $('#entidad, #anio').change(function () {

            $("#categoria option[value='']").prop('selected', true);
            $("#convocatoria option[value='']").prop('selected', true);
            $("#categoria").attr("disabled", "disabled");
            
            $("#reportes_propuestas").css("display","none");

            if ($("#anio").val() == "")
            {
                notify("danger", "ok", "Propuestas:", "Debe seleccionar el año");
            } else
            {
                if ($("#entidad").val() != "")
                {
                    $.ajax({
                        type: 'GET',
                        data: {"modulo": "Reporte Propuestas", "token": token_actual.token, "anio": $("#anio").val(), "entidad": $("#entidad").val()},
                        url: url_pv + 'ReportesPropuestas/select_convocatorias'
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
                                if (data == 'acceso_denegado')
                                {
                                    notify("danger", "remove", "Convocatorias:", "No tiene permisos para ver la información.");
                                } else
                                {
                                    var json = JSON.parse(data);

                                    $('#convocatoria').find('option').remove();
                                    $("#convocatoria").append('<option value="">:: Seleccionar ::</option>');
                                    $.each(json, function (key, value) {
                                        $("#convocatoria").append('<option dir="' + value.tiene_categorias + '" lang="' + value.diferentes_categorias + '" value="' + value.id + '">' + value.nombre + '</option>');
                                    });

                                    $("#convocatoria").selectpicker('refresh');

                                }
                            }
                        }
                    });
                }
            }

        });

        $('#convocatoria').change(function () {

            $("#reportes_propuestas").css("display","none");
            
            if ($("#convocatoria option:selected").attr("dir") == "true")
            {
                $("#categoria").removeAttr("disabled")
            } else
            {
                $("#categoria").attr("disabled", "disabled");
            }

            if ($("#convocatoria").val() != "")
            {
                $.ajax({
                    type: 'GET',
                    data: {"modulo": "Reporte Propuestas", "token": token_actual.token, "conv": $("#convocatoria").val()},
                    url: url_pv + 'ReportesPropuestas/select_categorias'
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
                            if (data == 'acceso_denegado')
                            {
                                notify("danger", "remove", "Convocatorias:", "No tiene permisos para ver la información.");
                            } else
                            {
                                var json = JSON.parse(data);

                                $('#categoria').find('option').remove();
                                $("#categoria").append('<option value="">:: Seleccionar ::</option>');
                                $.each(json, function (key, value) {
                                    $("#categoria").append('<option value="' + value.id + '">' + value.nombre + '</option>');
                                });
                            }
                        }
                    }
                });
            }

        });

        $('#buscar').click(function () {

            if ($("#convocatoria").val() != "")
            {

                var mensaje;
                if ($("#convocatoria option:selected").attr("dir") == "true")
                {
                    $("#id_convocatoria").val($("#categoria").val());
                    mensaje = "categoría";

                } else
                {
                    $("#id_convocatoria").val($("#convocatoria").val());
                    mensaje = "convocatoria";
                }

                if ($("#id_convocatoria").val() == "")
                {                    
                    notify("danger", "ok", "Convocatorias:", "Debe seleccionar la " + mensaje + ".");
                } else
                {
                    //Realizo la peticion para validar cargar las prouestas a subsanar
                    $.ajax({
                        type: 'GET',
                        data: {"token": token_actual.token, "modulo": "Reporte Propuestas", "convocatoria": $("#id_convocatoria").val()},
                        url: url_pv + 'ReportesPropuestas/generar_reportes'
                    }).done(function (data) {
                        
                        var json = JSON.parse(data);
                        
                        if (json.error == 'error_metodo')
                        {                            
                            notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                        } else
                        {
                            if (json.error == 'error_token')
                            {
                                location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                            } else
                            {
                                 if (data == 'acceso_denegado')
                                {
                                    notify("danger", "remove", "Convocatorias:", "No tiene permisos para ver la información.");
                                } else
                                {
                                    $("#reportes_propuestas").css("display","block");
                                    
                                    
                                    $("#reporte_propuestas_estados").empty();
                                
                                
                                    Morris.Bar({
                                        element: 'reporte_propuestas_estados',
                                        data: [
                                        {device: 'Registradas', geekbench: json.reporte_propuestas_estados[7]},    
                                        {device: 'Inscritas', geekbench: json.reporte_propuestas_estados[8]},    
                                        {device: 'Anuladas', geekbench: json.reporte_propuestas_estados[20]},    
                                        {device: 'Por Subsanar', geekbench: json.reporte_propuestas_estados[21]},    
                                        {device: 'Subsanación\nRecibida', geekbench: json.reporte_propuestas_estados[22]},    
                                        {device: 'Subsanadas', geekbench: json.reporte_propuestas_estados[31]},
                                        {device: 'Rechazadas', geekbench: json.reporte_propuestas_estados[23]},    
                                        {device: 'Habilitadas', geekbench: json.reporte_propuestas_estados[24]}                                        
                                        ],
                                        xkey: 'device',
                                        ykeys: ['geekbench'],
                                        labels: ['Total'],
                                        barRatio: 0.4,
                                        xLabelAngle: 35,
                                        hideHover: 'auto'           
                                    });
                                    
                                    
                                    
                                }                                
                            }
                        }
                    });
                }

            } else
            {                
                notify("danger", "ok", "Propuestas:", "Debe seleccionar la convocatoria");
            }            

        });                
    }
});

