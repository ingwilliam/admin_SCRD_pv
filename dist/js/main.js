//Definimos las variables del sitio
var url_pv = "http://localhost/crud_pv/api/";
var url_pv_admin = "http://localhost/admin_pv/";
var name_local_storage = "token_pv";

//funcion para extaer un parametro de la url
function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

function form_edit(id)
{
    location.href = "form.html?id=" + id;
}

/* Función para cargar alertas */
function notify(xclass, xicon, xtitle, xmessage) {
    $.notify({
        icon: 'glyphicon glyphicon-' + xicon,
        title: '<strong>' + xtitle + '</strong>',
        message: xmessage,
        /*url: 'http://www.movilmente.com',
         target: '_blank'*/
    }, {
        // settings
        type: xclass,
        allow_dismiss: true,
        newest_on_top: false,
        showProgressbar: false,
        placement: {
            from: "top",
            align: "right"
        },
        offset: 20,
        spacing: 10,
        z_index: 2000,
        delay: 5000,
        timer: 1000,
        animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutRight'
        },
    });
}

//Funcion para validar si el navegador soporta localStorage
function issetLocalStorage() {
    if (typeof (Storage) !== "undefined")
    {
        return true
    } else
    {
        location.href = 'error.html?msg=actualizar_navegador';
        return false;
    }
}

//Funcion para retornar el valor de la variable
function getLocalStorage(nombre)
{
    return JSON.parse(localStorage.getItem(nombre));
}

//Funcion para agregar el valor a una variable
function setLocalStorage(nombre, valor)
{
    localStorage.setItem(nombre, valor);
    return localStorage.getItem(nombre);
}

//Funcion para eliminar la variable
function removeLocalStorage(nombre)
{
    localStorage.removeItem(nombre);
}

//Funcion para lavidar permiso de lectura
function permiso_lectura(token_actual, modulo)
{
    $.ajax({
        type: 'POST',
        data: {"token": token_actual.token, modulo: modulo},
        url: url_pv + 'Session/permiso_lectura/'
    }).done(function (data) {
        if (data == 'error_metodo')
        {
            location.href = '../index/index.html?msg=Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co&msg_tipo=danger';
        } else
        {
            if (data == 'error')
            {
                location.href = '../index/index.html?msg=Se registro un error en la consulta, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co&msg_tipo=danger';
            } else
            {
                if (data == 'acceso_denegado')
                {
                    location.href = '../index/index.html?msg=Acceso denegado.&msg_tipo=danger';
                }
            }
        }
    });
}

//Logaut
function logout()
{
    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor
    //Si el token no esta activo o se presenta un error se elimina la variable del session storage
    var token_actual = getLocalStorage(name_local_storage);

    $.ajax({
        type: 'POST',
        data: {"token": token_actual.token},
        url: url_pv + 'Session/cerrar_session/'
    }).done(function (data) {
        if (data == 'error_metodo')
        {
            location.href = '../index/index.html?msg=Se registro un error en el método, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co&msg_tipo=danger';
        } else
        {
            if (data == 'error')
            {
                location.href = '../index/index.html?msg=Se registro un error en la consulta, comuníquese con la mesa de ayuda soporte.convocatorias@scrd.gov.co&msg_tipo=danger';
            } else
            {
                if (data == 'ok')
                {
                    removeLocalStorage(name_local_storage)
                    location.href = '../../index.html?msg=Cerro su sesión con éxito.&msg_tipo=success';
                }
            }
        }
    });
}

//Iniciamos el documento
$(document).ready(function () {
    //Verifico que no tenga ningun mensaje y el tipo
    var msg = getURLParameter('msg');
    var msg_tipo = getURLParameter('msg_tipo');
    if (typeof msg !== 'undefined' && typeof msg_tipo !== 'undefined')
    {
        notify(msg_tipo, "ok", "Login:", decodeURI(msg));
    }

    //Asignamos el valor a input id
    $("#id").attr('value', getURLParameter('id'));


    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor
    //Si el token no esta activo o se presenta un error se elimina la variable del session storage
    var token_actual = getLocalStorage(name_local_storage);
    if ((token_actual != null) || (token_actual != "") || (token_actual != "undefined"))
    {
        //Cargamos el menu principal
        $.ajax({
            type: 'POST',
            data: {"token": token_actual.token},
            url: url_pv + 'Administrador/menu'
        }).done(function (data) {
                $("#menu_principal").html(data);            
        });
    }
});

//Al crear cualquier peticion de ajax muestra el modal
$(document).ajaxStart(function () {
    $('#my_loader').modal({
        show: 'true'
    });
});
//Al completar cualquier peticion de ajax oculta el modal
$(document).ajaxComplete(function () {
    $("#my_loader").modal('hide');
});