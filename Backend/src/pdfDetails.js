// Define PdfDetails schema
const mongoose = require('mongoose')
const pdfDetailsSchema = new mongoose.Schema({
    pdf: String,
    text: String
});

// Create PdfDetails model
const PdfDetails = mongoose.model('PdfDetails', pdfDetailsSchema);
module.exports = PdfDetails;