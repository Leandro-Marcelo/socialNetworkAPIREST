const { Storage } = require("@google-cloud/storage");
const { Readable } = require("stream");
const { bucket_name } = require("../config");
const uuid = require("uuid");
const path = require("path");

/* la configuración para conectarse con el servicio cloud storage */
const storage = new Storage({
    keyFilename: "credentials-gcloud.json",
});

/* al fileName hay que modificarle el nombre porque si una persona me sube un archivo con el mismo nombre de un archivo ya subido por otra persona, este lo reemplaza */
/* multer es quien nos lo sube en un buffer */
/* basicamente inicia con un writableStream para leer el archivo que viene en un buffer y pasarlo a Stream, luego va hacer un writableStream del stream que contiene la imagen/archivo hacía cloud storage (donde la referencia de la dirección es el file)  */
const uploadFile = (fileName, buffer) => {
    /* esta validación sirve si es que hacemos que la imagen sea necesaria, como elegí que no entonces esta al pedo */
    if (!fileName || !buffer) {
        return { success: false, message: "A file is necessary" };
    }

    /* con esto obtengo la extension del archivo, ex, jpge/png/mp4 etc */
    const ext = path.extname(fileName);
    /* creamos un uuid.v4 y lo únimos con la ext y ese será el nombre del archivo que será subido a cloud storage */
    const uuidFileName = uuid.v4() + ext;

    //Referencia al objeto de archivo en google cloud
    /* le pone el bucket_name que viene de config, nombre del archivo o como queremos que se llame en cloud storage/google cloud */
    const file = storage.bucket(bucket_name).file(uuidFileName);

    /* entonces gracias a ese buffer, podemos crear un Readable stream para leer a partir de ese buffer  */
    const stream = Readable.from(buffer);

    return new Promise((resolve, reject) => {
        /* y ahora con ese stream (que es un readable stream) le hacemos un pipe para hacer writeStream de la data que venía en el buffer a la dirección de file (la cual es la referencia, destination donde va a quedar nuestro archivo en el clodStorage),*/
        stream
            /*  es decir, para cada uno de los datos que tenemos en el Readable Stream los estamos escribiendo en el WriteStream del archivo (file) para crear el archivo de salida y que para cada una de las partes que vamos haciendo stream hacia la nube, se vaya subiendo, es decir, acá en el file.createWrite... va llegando en partecitas, cuando ya llegan todas,  se une todo el archivo  y quedaría solamente el archivo completo a partir del nombre (por eso es muy importante que tengamos el nombre del archivo) */
            .pipe(file.createWriteStream())
            .on("finish", () => {
                resolve({
                    success: true,
                    message: "File uploaded succesfully",
                    fileName: uuidFileName,
                });
            })
            .on("error", (err) => {
                console.log(err);
                reject({ success: false, message: "An error ocurred" });
            });
    });
};

/* Descargar el archivo y enviarlo directamente como un resultado de alguna petición */
const downloadFile = (fileName, res) => {
    /* Primero leo todos los datos del archivo (que ya se encuentra en cloud storage) */
    const file = storage.bucket(bucket_name).file(fileName);

    /* crea un readableStream para leer el contenido del archivo (que ya esta en cloud storage me imagino) y de este readStream lo que quiero es hacer un writeStream pero ahora para el otro lado para la respuesta que nosotros tendríamos del frontend (quiere decir de enviarle  ese archjivo al frontend, ya sea mobil, web, desktop application)*/
    const stream = file.createReadStream().on("error", (error) => {
        if (error.code === 404) {
            res.status(error.code).json({
                error: true,
                message: "No se encontró el archivo",
            });
        }
    });
    /* aca no hace falta crear un writable stream porque la respuesta ya es un writestream esto lo sabemos porque cuando recibimos datos en formato json esta viene en formato stream y tenemos que parsearla con el middleware de express.json() */
    /* no hay que gestionar el error por asi decirlo porque acá es cuando ya se finaliza con la petición, donde podría causar el error si descarga un archivo que no existe es al momento de crearle un readable stream al archivo, por eso el evento de error lo pongo ahí y no acá */
    stream.pipe(res);
    /*   .on("finish", () => {
            console.log("Descargado exitosamente");
        })
        .on("error", (error) => {
            console.log(error);
        }); */
};

module.exports = { uploadFile, downloadFile };

// Streams: Manuel Alexander
