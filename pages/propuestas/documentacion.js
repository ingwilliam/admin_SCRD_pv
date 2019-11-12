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

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "conv": $("#conv").attr('value'), "modulo": "Menu Participante", "m": getURLParameter('m')},
            url: url_pv + 'PropuestasDocumentacion/buscar_documentacion'
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
                                        
                                        var html_table='';                    
                                        $.each(json.administrativos, function (key2, documento) {     
                                            html_table = html_table+'<tr><td>'+documento.orden+'</td><td>'+documento.requisito+'</td><td>'+documento.descripcion+'</td><td>'+documento.archivos_permitidos+'</td><td>'+documento.tamano_permitido+' MB</td><td><button title="'+documento.id+'" type="button" onclick="btn_tecnico_documento(\''+documento.archivos_permitidos+'\',\''+documento.tamano_permitido+'\')" class="btn btn-success" data-toggle="modal" data-target="#cargar_documento"><span class="glyphicon glyphicon-open"></span></button></td><td><button title="'+documento.id+'" type="button" class="btn btn-primary btn_tecnico_link" data-toggle="modal" data-target="#cargar_link"><span class="glyphicon glyphicon-link"></span></button></td></tr>';                       
                                        });
                                                                                
                                        $( "#tabla_administrativos" ).append(html_table);  
                                        
                                        html_table='';                    
                                        $.each(json.tecnicos, function (key2, documento) {     
                                            html_table = html_table+'<tr><td>'+documento.orden+'</td><td>'+documento.requisito+'</td><td>'+documento.descripcion+'</td><td>'+documento.archivos_permitidos+'</td><td>'+documento.tamano_permitido+' MB</td><td><button title="'+documento.id+'" type="button" onclick="btn_tecnico_documento(\''+documento.archivos_permitidos+'\',\''+documento.tamano_permitido+'\')" class="btn btn-success" data-toggle="modal" data-target="#cargar_documento"><span class="glyphicon glyphicon-open"></span></button></td><td><button title="'+documento.id+'" type="button" class="btn btn-primary btn_tecnico_link" data-toggle="modal" data-target="#cargar_link"><span class="glyphicon glyphicon-link"></span></button></td></tr>';                       
                                        });
                                                                                
                                        $( "#tabla_tecnicos" ).append(html_table);  
                                        
                                    }
                                }
                            }
                        }

                    }
                }
            }
        });
    }
});

function btn_tecnico_documento(permitido,tamano){

    $("#archivos_permitidos").html(permitido);        
    
    var extensiones= permitido.split(',');
    
    $('input[type="file"]').change(function (evt) {
        var f = evt.target.files[0];
        var reader = new FileReader();

        // Cierre para capturar la información del archivo.
        reader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64
            var srcName = f.name;
            var srcSize = f.size;
            var srcType = f.type;
            var ext = srcName.split('.');
            // ahora obtenemos el ultimo valor despues el punto
            // obtenemos el length por si el archivo lleva nombre con mas de 2 puntos
            srcExt = ext[ext.length-1];
            if(extensiones.includes( srcExt ))
            {
                //mb -> bytes
                permitidotamano=tamano*1000*1000;
                if(srcSize>permitidotamano)
                {
                    notify("danger", "ok", "Documentación:", "El tamaño del archivo excede el permitido ("+tamano+" MB)");
                }
                else
                {
                    
                }                
            }
            else
            {
                notify("danger", "ok", "Documentación:", "Archivo no permitido");
            }
                    
        };
         // Leer en el archivo como una URL de datos.                
        reader.readAsDataURL(f);
    });
    
    
    
    $( "form.formulario_documento" ).submit(function(){
        var retrunform = false;
        
        alert("a");
        
        
        return retrunform;
    });
    
    
    
}
