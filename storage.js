/**
 * Each file contains the following information:

    fieldname: Field name specified in the form.
    originalname: Name of the file on the user’s computer.
    encoding: Encoding type of the file.
    mimetype: Mime type of the file.
    size: Size of the file in bytes.
    destination: The folder to which the file has been saved.
    filename: The name of the file in the destination.
    path: The full path to the uploaded file.
    buffer: A Buffer of the entire file.
 */
const multer = require('multer');
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./assets");
    },
    filename: function (req, file, callback) {
        let ext = file.originalname.slice(file.originalname.lastIndexOf("."), file.originalname.length);
        callback(null, file.fieldname + "_" + Date.now() + ext);
    }
});

var upload = multer({
    storage: Storage
}).single("brandImage");    //Field name and max count

module.exports = upload;