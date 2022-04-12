/* Para poder recibir esa imagen que nos viene como contenido de una request, necesitamos agregar la dependencia multer la cual es un middleware que detecta si en la petición vienen archivos de tipo imagen */
/* este middleware nos sirve para transformar lo que viene en el form-data, principalmente los archivos, es decir, para procesar los archivos necesitamos multer  */

const multer = require("multer");

/* si nosotros queremos devolver la imagen ó subirla a cloud storage, vamos a decírle que no vaya a un cierto destino sino que lo almacene en memoria, que momentaneamente lo tenga en memoria, eso hace la línea de abajo */
const storage = multer.memoryStorage();

const upload = multer({
    /* recuerda que esto es lo mismo que storage:storage, basicamente en la propiedad storage almacena la imagen/archivo */
    storage,
});

module.exports = upload;

/* 

//importamos / requerimos multer
const multer = require("multer");
// especificamos el destino donde se guardaran las imagenes
// hace lo mismo que el express.json() pero que nos da otros métodos para procesar en vez de json multi-part form-data
const upload = multer({ dest: "uploads/" });

*/
