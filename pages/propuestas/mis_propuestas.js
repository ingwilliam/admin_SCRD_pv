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

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "modulo": "Menu Participante"},
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
                                $("#estado_propuesta").append('<option value="' + estado_propuesta.id + '" >' + estado_propuesta.nombre + '</option>');
                            });
                        }
                    }
                }
            }
        });

        if ($("#busqueda").val() == "0")
        {
            //Cargar datos en la tabla actual
            $('#table_list').DataTable({
                "language": {
                    "url": "../../dist/libraries/datatables/js/spanish.json"
                },
                "searching": false,
                "processing": true,
                "serverSide": true,
                "ordering": false,
                "lengthMenu": [20, 30, 40],
                "ajax": {
                    url: url_pv + "PropuestasParticipantes/buscar_propuestas",
                    data: function (d) {
                        var params = new Object();
                        params.anio = $('#anio').val();
                        params.entidad = $('#entidad').val();
                        params.convocatoria = $('#convocatoria').val();
                        params.categoria = $('#categoria').val();
                        params.codigo = $('#codigo').val();
                        params.estado = $('#estado_propuesta').val();
                        d.params = JSON.stringify(params);
                        d.token = token_actual.token;
                        d.modulo = "Menu Participante";
                    },
                },
                "columnDefs": [{
                        "targets": 0,
                        "render": function (data, type, row, meta) {
                            var categoria = row.convocatoria;
                            if (row.categoria != "") {
                                row.convocatoria = row.categoria;
                                row.categoria = categoria;
                            }
                            return row.estado;
                        }
                    }
                ],
                "columns": [
                    {"data": "estado"},
                    {"data": "anio"},
                    {"data": "entidad"},
                    {"data": "convocatoria"},
                    {"data": "categoria"},
                    {"data": "propuesta"},
                    {"data": "codigo"},
                    {"data": "tipo_participante"},
                    {"data": "participante"},
                    {"data": "ver_propuesta"},
                    {"data": "ver_reporte"}
                ]
            });
            $("#busqueda").attr("value", "1");
        } else
        {
            $('#table_list').DataTable().draw();
        }

        $('#buscar').click(function () {

            var relizar_busqueda = false;

            if ($("#codigo").val() == "")
            {
                if ($("#convocatoria").val() != "")
                {
                    relizar_busqueda = true;
                } else
                {
                    notify("danger", "ok", "Propuestas:", "Debe seleccionar la convocatoria");
                }
            } else
            {
                relizar_busqueda = true;
            }


            if (relizar_busqueda)
            {
                if ($("#busqueda").val() == "0")
                {
                    //Cargar datos en la tabla actual
                    $('#table_list').DataTable({
                        "language": {
                            "url": "../../dist/libraries/datatables/js/spanish.json"
                        },
                        "searching": false,
                        "processing": true,
                        "serverSide": true,
                        "ordering": false,
                        "lengthMenu": [20, 30, 40],
                        "ajax": {
                            url: url_pv + "PropuestasParticipantes/buscar_propuestas",
                            data: function (d) {
                                var params = new Object();
                                params.anio = $('#anio').val();
                                params.entidad = $('#entidad').val();
                                params.convocatoria = $('#convocatoria').val();
                                params.categoria = $('#categoria').val();
                                params.codigo = $('#codigo').val();
                                params.estado = $('#estado_propuesta').val();
                                d.params = JSON.stringify(params);
                                d.token = token_actual.token;
                                d.modulo = "Menu Participante";
                            },
                        },
                        "columns": [
                            {"data": "estado"},
                            {"data": "anio"},
                            {"data": "entidad"},
                            {"data": "convocatoria"},
                            {"data": "categoria"},
                            {"data": "propuesta"},
                            {"data": "codigo"},
                            {"data": "participante"},                            
                            {"data": "ver_propuesta"},
                            {"data": "ver_reporte"}
                        ]
                    });

                    $("#busqueda").attr("value", "1");
                } else
                {
                    $('#table_list').DataTable().draw();
                }
            }

        });

        $('#entidad, #anio').change(function () {

            $("#categoria option[value='']").prop('selected', true);
            $("#convocatoria option[value='']").prop('selected', true);
            $("#categoria").attr("disabled", "disabled");

            if ($("#anio").val() == "")
            {
                notify("danger", "ok", "Propuestas:", "Debe seleccionar el año");
            } else
            {
                if ($("#entidad").val() != "")
                {
                    $.ajax({
                        type: 'GET',
                        data: {"modulo": "Menu Participante", "token": token_actual.token, "anio": $("#anio").val(), "entidad": $("#entidad").val()},
                        url: url_pv + 'PropuestasParticipantes/select_convocatorias'
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
                                        $("#convocatoria").append('<option dir="' + value.tiene_categorias + '" value="' + value.id + '">' + value.nombre + '</option>');
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
                    data: {"modulo": "Menu Participante", "token": token_actual.token, "conv": $("#convocatoria").val()},
                    url: url_pv + 'PropuestasParticipantes/select_categorias'
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

    }
});