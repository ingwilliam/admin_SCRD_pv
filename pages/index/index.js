//Iniciamos el documento
$(document).ready(function () {
    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'POST',
            data: {"token": token_actual.token},
            url: url_pv + 'Session/consultar_usuario'
        }).done(function (data) {
            if (data == 'error_metodo')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co");
            } 
            else
            {
                if (data == 'error_token')
                {
                    location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                } else
                {
                    if (data == 'error')
                    {
                        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
                    } 
                    else
                    {
                        var json = JSON.parse(data);
                        if(json.primer_nombre==null)
                        {
                           json.primer_nombre="";
                        }
                        if(json.segundo_nombre==null)
                        {
                           json.segundo_nombre="";
                        }
                        if(json.primer_apellido==null)
                        {
                           json.primer_apellido="";
                        }
                        if(json.segundo_apellido==null)
                        {
                           json.segundo_apellido="";
                        }
                        $("#nombre_bienvenida").html(json.primer_nombre+" "+json.segundo_nombre+" "+json.primer_apellido+" "+json.segundo_apellido);                        
                    }
                }
            }
        });

    }
});