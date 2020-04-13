$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin+'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
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
        
        //Cargos el autocomplete de ciudad de residencia
        $("#ciudad_residencia_name").autocomplete({
            source: json_ciudades,
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

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "id": $("#id").attr('value')},
            url: url_pv + 'Personasjuridicas/search/'
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
                    
                    //Cargos el select de tipo de documento
                    $('#tipo_documento').find('option').remove();
                    if (json.tipo_documento.length > 0) {
                        $.each(json.tipo_documento, function (key, array) {
                            if(array.id==7)
                            {
                                selected = 'selected="selected"';                                
                                $("#tipo_documento").append('<option value="' + array.id + '" '+selected+' >' + array.descripcion + '</option>');
                            }                            
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
                    
                    //Cargos el select de estrato
                    $('#tipo_sede').find('option').remove();
                    $("#tipo_sede").append('<option value="">:: Seleccionar ::</option>');
                    if (json.tipo_sede.length > 0) {
                        $.each(json.tipo_sede, function (key, array) {
                            var selected = '';
                            if(array == json.participante.tipo_sede)
                            {
                                selected = 'selected="selected"';
                            }
                            $("#tipo_sede").append('<option value="' + array + '" '+selected+' >' + array + '</option>');
                        });
                    }                                        
                    
                    //Asigno el nombre de las barrio
                    $("#barrio_residencia_name").val(json.barrio_residencia_name);                            
                    
                    //Asigno el nombre de las ciudades
                    $("#ciudad_residencia_name").val(json.ciudad_residencia_name);                                        
                    
                    //Cargo el formulario con los datos
                    $('#formulario_principal').loadJSON(json.participante);
                    
                    $("#cuenta_sede option[value='" + json.participante.cuenta_sede + "']").prop('selected', true);
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
                    notEmpty: {message: 'El número de Nit es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            primer_nombre: {
                validators: {
                    notEmpty: {message: 'El primer nombre es requerido'}
                }
            },
            dv: {
                validators: {
                    notEmpty: {message: 'El dv es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            numero_celular: {
                validators: {
                    notEmpty: {message: 'El número de celular es requerido'},
                    numeric: {message: 'Debe ingresar solo numeros'}
                }
            },
            ciudad_residencia_name: {
                validators: {
                    notEmpty: {message: 'El municipio es requerido'}
                }
            },
            fecha_nacimiento: {
                validators: {
                    notEmpty: {message: 'La fecha de constitución es requerida'}
                }
            },            
            direccion_residencia: {
                validators: {
                    notEmpty: {message: 'La dirección es requerida'}
                }
            },
            estrato: {
                validators: {
                    notEmpty: {message: 'El estrato es requerido'}
                }
            },
            objeto_social: {
                validators: {
                    notEmpty: {message: 'El objeto social es requerido'}
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
        // Prevent form submission
        e.preventDefault();
        // Get the form instance
        var $form = $(e.target);

        // Get the BootstrapValidator instance
        var bv = $form.data('bootstrapValidator');

        // Valido si el id existe, con el fin de eviarlo al metodo correcto
        $('#formulario_principal').attr('action', url_pv + 'Personasjuridicas/new');
        

        //Se realiza la peticion con el fin de guardar el registro actual
        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            data: $form.serialize() + "&modulo=Menu Participante&token=" + token_actual.token
        }).done(function (result) {

            if (result == 'error')
            {
                notify("danger", "ok", "Persona jurídica:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
            } 
            else
            {
                if (result == 'error_token')
                {
                    location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                } 
                else
                {
                    if (result == 'acceso_denegado')
                    {
                        notify("danger", "remove", "Usuario:", "No tiene permisos para editar información.");
                    } 
                    else
                    {
                        if (result == 'error_usuario_perfil')
                        {
                            notify("danger", "ok", "Persona jurídica:", "Se registro un error al crear el perfil, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                        } 
                        else
                        {
                            if (result == 'participante_existente')
                            {
                                notify("danger", "ok", "Persona jurídica:", "El participante que intenta ingresar ya se encuentra registrado en la base de datos, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                            } 
                            else
                            {
                                if (isNaN(result)) {
                                    notify("danger", "ok", "Persona jurídica:", "Se registro un error, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
                                } 
                                else
                                {
                                    notify("success", "ok", "Persona jurídica:", "Se actualizó con el éxito el participante como persona jurídica.");                                    
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