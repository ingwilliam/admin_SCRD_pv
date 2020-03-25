$(document).ready(function () {

    //Verifico si el token exite en el cliente y verifico que el token este activo en el servidor                
    var token_actual = getLocalStorage(name_local_storage);

    //Verifico si el token esta vacio, para enviarlo a que ingrese de nuevo
    if ($.isEmptyObject(token_actual)) {
        location.href = url_pv_admin + 'index.html?msg=Su sesión ha expirado, por favor vuelva a ingresar.&msg_tipo=danger';
    } else
    {

        //Verifica si el token actual tiene acceso de lectura
        permiso_lectura(token_actual, "Reporte Contratistas");

        //Realizo la peticion para cargar el formulario
        $.ajax({
            type: 'GET',
            data: {"token": token_actual.token, "modulo": "Reporte Contratistas"},
            url: url_pv + 'Convocatorias/modulo_buscador_propuestas'
        }).done(function (data) {
            if (data == 'error_metodo')
            {
                notify("danger", "ok", "Convocatorias:", "Se registro un error en el método, comuníquese con la mesa de ayuda convocatorias@scrd.gov.co");
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

                        $("#entidad").append('<option value="">:: Seleccionar ::</option>');
                        if (json.entidades.length > 0) {
                            $.each(json.entidades, function (key, entidad) {
                                $("#entidad").append('<option value="' + entidad.id + '"  >' + entidad.nombre + '</option>');
                            });
                        }                        
                    }
                }
            }
        });

        //Cargar datos en la tabla actual
        var dataTable = $('#table_list').DataTable({
            "language": {
                "url": "../../dist/libraries/datatables/js/spanish.json"
            },
            "processing": true,
            "serverSide": true,
            "lengthMenu": [50, 75, 100],
            "ajax":{                
                data: function (d) {
                    d.entidad = $('#entidad').val();
                    d.modulo = "Reporte Contratistas";                    
                    d.token = token_actual.token;
                },
                url: url_pv + 'ReportesPropuestas/generar_reportes_contratistas'
              },                        
            "columns": [                        
                {"data": "entidad"},
                {"data": "numero_documento"},
                {"data": "primer_nombre"},
                {"data": "segundo_nombre"},
                {"data": "primer_apellido"},
                {"data": "segundo_apellido"},                
                {"data": "acciones"}                
            ]
        });
        
        $('#buscar').click(function () {
            dataTable.draw();
        });
        
    }
    
    $('input[type="file"]').change(function (evt) {

        alert($("ent").val());

        var f = evt.target.files[0];
        var reader = new FileReader();

        // Cierre para capturar la información del archivo.
        reader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64
            var srcName = f.name;
            var srcSize = f.size;
            var srcType = f.type;
            alert(srcName);
            alert(srcSize);
            alert(srcType);
            /*
            $.post("http://localhost/Chemistry-Convocatorias/archivo_cargar.php", {srcData: srcData, srcName: srcName, srcSize: srcSize, srcType: srcType}).done(function (data) {

                        });*/
        };
         // Leer en el archivo como una URL de datos.                
        reader.readAsDataURL(f);
    });
    
});

