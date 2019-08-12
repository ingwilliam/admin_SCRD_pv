/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 /*Cesar Britto*/

  $(document).ready(function () {

 //$("#idp").attr('value')
     $("#idc").val($("#id").val());
     $("#id").val(null);

      //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor
      var token_actual = getLocalStorage(name_local_storage);

      //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
      if ($.isEmptyObject(token_actual)) {
          location.href = '../../index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
      } else
      {
          //Verifica si el token actual tiene acceso de lectura
         // $("#formulario_perfil").hide();
          permiso_lectura(token_actual, "Menu Participante");
          //cargar_datos_formulario(token_actual);
          //validator_form(token_actual);
        //  validar_requisitos(token_actual);
          //validator_form(token_actual);
      }

  });
