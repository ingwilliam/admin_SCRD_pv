$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {

        //Verifica si el token actual tiene acceso de lectura
        permiso_lectura(token_actual, "Propuestas convocatorias");

        //Realizo la peticion para validar acceso a la convocatoria
        $.ajax({
            type: 'POST',
            data: {"token": token_actual.token},
            url: url_pv + 'PropuestasBusquedasConvocatorias/validar_acceso/' + $("#id").val()
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
                            if (data == 'ingresar')
                            {
                                $(".validar_acceso").css("display", "block");


                                //Realizo la peticion para cargar los tipos de participantes
                                $.ajax({
                                    type: 'POST',
                                    data: {"token": token_actual.token},
                                    url: url_pv + 'PropuestasPerfiles/consultar_tipos_participantes/' + $("#id").val()
                                }).done(function (data) {
                                    
                                    var json = JSON.parse(data);
                                    
                                    if (data == 'error_metodo')
                                    {
                                        notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
                                    } else
                                    {
                                        if (data == 'error_token')
                                        {
                                            location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                                        } 
                                        else
                                        {
                                            var html_table = "";
                                            
                                            $.each(json, function (key, participante) {
                                                html_table = html_table+'<div class="col-lg-4 col-centrada">';                    
                                                html_table = html_table+'<div class="panel panel-primary">';                    
                                                html_table = html_table+'<div class="panel-heading">'+participante.tipo_participante+'</div>';
                                                html_table = html_table+'<div class="panel-body"><p>'+participante.descripcion_perfil+'</p></div>';
                                                html_table = html_table+'</div>';                        
                                                html_table = html_table+'</div>';                        
                                            });                    
                                            $( "#cargar_tipos_participantes" ).html(html_table); 
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });

    }
});