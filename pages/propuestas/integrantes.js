$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    var href_regresar="";
    var href_siguiente="";
    //Creando link de navegación
    if(getURLParameter('m')=="agr")
    {
        href_regresar="propuestas.html?m="+getURLParameter('m')+"&id="+getURLParameter('id')+"";
        href_siguiente="documentacion.html?m="+getURLParameter('m')+"&id="+getURLParameter('id')+"";
    }
    
    if(getURLParameter('m')=="pj")
    {
        href_regresar="propuestas.html?m="+getURLParameter('m')+"&id="+getURLParameter('id')+"";
        href_siguiente="documentacion.html?m="+getURLParameter('m')+"&id="+getURLParameter('id')+"";
    }
    
    $("#link_propuestas").attr("onclick","location.href = '"+href_regresar+"'");
    $("#link_documentacion").attr("onclick","location.href = '"+href_siguiente+"'");

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

        //Peticion para buscar barrios
        var json_barrio = function (request, response) {
                $.ajax({
                    type: 'GET',
                    data: {"token": token_actual.token, "id": $("#id").attr('value'),q: request.term},
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
                    data: {"token": token_actual.token, "id": $("#id").attr('value'),q: request.term},
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
        
        //Cargos el autocomplete de ciudad de residencia
        $("#ciudad_residencia_name").autocomplete({
            source: json_ciudades,
            minLength: 2,
            select: function (event, ui) {
                $(this).val(ui.item ? ui.item : " ");
                $("#ciudad_residencia").val(ui.item.id);
                
                //Valido para que muestre solo los barrios de bogota                    
                if(ui.item.id==151)
                {
                    $("#barrio_residencia_name").css("display","block");
                }
                else
                {
                    $("#barrio_residencia_name").css("display","none");
                }
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

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m')},
            url: url_pv + 'Personasnaturales/formulario_integrante'
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
                    if (data == 'crear_perfil_pn')
                    {
                        location.href = url_pv_admin + 'pages/perfilesparticipantes/persona_natural.html?msg=Para poder inscribir la propuesta debe crear el perfil de persona natural.&msg_tipo=danger';
                    } else
                    {
                        if (data == 'crear_perfil_pj')
                        {
                            location.href = url_pv_admin + 'pages/perfilesparticipantes/persona_juridica.html?msg=Para poder inscribir la propuesta debe crear el perfil de persona juridica.&msg_tipo=danger';
                        } else
                        {
                            if (data == 'crear_perfil_agr')
                            {
                                location.href = url_pv_admin + 'pages/perfilesparticipantes/agrupacion.html?msg=Para poder inscribir la propuesta debe crear el perfil de agrupacion.&msg_tipo=danger';
                            } else
                            {

                                if (data == 'crear_propuesta')
                                {
                                    location.href = url_pv_admin + 'pages/propuestas/propuestas_busqueda_convocatorias.html?msg=Para poder inscribir la propuesta debe crear el perfil de agrupacion.&msg_tipo=danger';
                                } else
                                {
                                    if (data == 'acceso_denegado')
                                    {
                                        notify("danger", "remove", "Convocatorias:", "No tiene permisos para ver la información.");
                                    } else
                                    {
                                        var json = JSON.parse(data);
                                        
                                        //Cargos el select de tipo de documento
                                        $('#tipo_documento').find('option').remove();
                                        $("#tipo_documento").append('<option value="">:: Seleccionar ::</option>');
                                        if (json.tipo_documento.length > 0) {
                                            $.each(json.tipo_documento, function (key, array) {
                                                $("#tipo_documento").append('<option value="' + array.id + '" >' + array.descripcion + '</option>');
                                            });
                                        }
                                        //Cargos el select de sexo
                                        $('#sexo').find('option').remove();
                                        $("#sexo").append('<option value="">:: Seleccionar ::</option>');
                                        if (json.sexo.length > 0) {
                                            $.each(json.sexo, function (key, array) {
                                                $("#sexo").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
                                            });
                                        }
                                        //Cargos el select de orientacion sexual
                                        $('#orientacion_sexual').find('option').remove();
                                        $("#orientacion_sexual").append('<option value="">:: Seleccionar ::</option>');
                                        if (json.orientacion_sexual.length > 0) {
                                            $.each(json.orientacion_sexual, function (key, array) {
                                                $("#orientacion_sexual").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
                                            });
                                        }
                                        //Cargos el select de identidad genero
                                        $('#identidad_genero').find('option').remove();
                                        $("#identidad_genero").append('<option value="">:: Seleccionar ::</option>');
                                        if (json.orientacion_sexual.length > 0) {
                                            $.each(json.identidad_genero, function (key, array) {
                                                $("#identidad_genero").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
                                            });
                                        }
                                        //Cargos el select de grupo etnico
                                        $('#grupo_etnico').find('option').remove();
                                        $("#grupo_etnico").append('<option value="">:: Seleccionar ::</option>');
                                        if (json.grupo_etnico.length > 0) {
                                            $.each(json.grupo_etnico, function (key, array) {
                                                $("#grupo_etnico").append('<option value="' + array.id + '" >' + array.nombre + '</option>');
                                            });
                                        }
                                        //Cargos el select de estrato
                                        $('#estrato').find('option').remove();
                                        $("#estrato").append('<option value="">:: Seleccionar ::</option>');
                                        if (json.estrato.length > 0) {
                                            $.each(json.estrato, function (key, array) {
                                                $("#estrato").append('<option value="' + array + '" >' + array + '</option>');
                                            });
                                        }

                                        //Cargo el formulario con los datos
                                        $('#formulario_principal').loadJSON(json.formulario);

                                        //Valido formulario
                                        validator_form(token_actual);

                                        //Cargar datos de la tabla
                                        cargar_tabla(token_actual);

                                    }
                                }
                            }
                        }

                    }
                }
            }
        });  
        
        //Limpio el formulario de los anexos
        $('#nuevo_integrante').on('hidden.bs.modal', function () {            
            $("#formulario_principal")[0].reset();
            $("#id").val("");
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
            rol: {
                validators: {
                    notEmpty: {message: 'El rol es requerido'}
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
        $('#formulario_principal').attr('action', url_pv + 'Personasnaturales/crear_integrante');

        //Se realiza la peticion con el fin de guardar el registro actual
        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token
        }).done(function (result) {

            if (result == 'error')
            {
                notify("danger", "ok", "Integrantes:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
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
                        if (result == 'error_metodo')
                        {
                            notify("danger", "ok", "Integrantes:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                        } else
                        {
                            if (isNaN(result)) {
                                notify("danger", "ok", "Integrantes:", "Se registro un error, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                            } else
                            {
                                notify("success", "ok", "Integrantes:", "Se guardo con el éxito el integrante.");
                                cargar_tabla(token_actual);
                            }                            
                        }
                    }
                }
            }

        });
        
        $form.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
        bv.resetForm();
        $('#nuevo_integrante').modal('toggle');
        
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
        "lengthMenu": [10, 20, 30],
        "ajax": {
            url: url_pv + "Personasnaturales/cargar_tabla_integrantes",            
            data: {"token": token_actual.token, "propuesta": $("#propuesta").attr('value'), "participante": $("#participante").attr('value'), "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m'), "tipo": $("#tipo").attr('value')}
        },
        "drawCallback": function (settings) {
            //Cargo el formulario, para crear o editar
            cargar_formulario(token_actual);            
        },
        "columns": [
            {"data": "tipo_documento"},
            {"data": "numero_documento"},
            {"data": "primer_nombre"},
            {"data": "segundo_nombre"},
            {"data": "primer_apellido"},
            {"data": "segundo_apellido"},
            {"data": "rol"},
            {"data": "acciones"}
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
            data: {"token": token_actual.token, "propuesta": $("#propuesta").attr('value'), "participante": $("#participante").attr('value'), "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m'),"id": $("#id").attr('value')},            
            url: url_pv + 'Personasnaturales/editar_integrante/'
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
                    
                    //Asigno el nombre de las barrio
                    $("#barrio_residencia_name").val(json.barrio_residencia_name);                            

                    //Asigno el nombre de las ciudades
                    $("#ciudad_nacimiento_name").val(json.ciudad_nacimiento_name);
                    $("#ciudad_residencia_name").val(json.ciudad_residencia_name);
                    
                    //Cargo el formulario con los datos
                    $('#formulario_principal').loadJSON(json.participante);                                        
                    
                    //Valido para que muestre solo los barrios de bogota
                    if($("#ciudad_residencia").val()==151)
                    {
                        $("#barrio_residencia_name").css("display","block");
                    }
                    else
                    {
                        $("#barrio_residencia_name").css("display","none");
                    }
                
                    $('#nuevo_integrante').modal('toggle');
                }
            }
        });
    });
}