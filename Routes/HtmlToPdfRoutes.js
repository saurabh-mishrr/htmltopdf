'use strict';


module.exports = function(app) {
    var htmlToPdf = require('./../Controllers/HtmlToPdfController');

    app.route('/convert').post(htmlToPdf.convert);
    app.route('/download/:file(*)').get(htmlToPdf.downloadFile);
}