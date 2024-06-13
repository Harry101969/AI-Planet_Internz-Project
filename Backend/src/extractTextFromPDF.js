// const fs = require('fs');
// const pdfParse = require('pdf-parse');

// async function extractTextFromPDF(dataBuffer) {
//     try {
//         const data = await pdfParse(dataBuffer);
//         return data.text;
//     } catch (err) {
//         console.error('Error extracting text:', err);
//         throw err;
//     }
// }

// const isDebugMode = !module.parent;

// // For testing purposes
// if (isDebugMode) {
//     const PDF_FILE = './test/data/05-versions-space.pdf';
//     const dataBuffer = fs.readFileSync(PDF_FILE);

//     extractTextFromPDF(dataBuffer).then(data => {
//         fs.writeFileSync(`${PDF_FILE}.txt`, data, {
//             encoding: 'utf8',
//             flag: 'w'
//         });
//         console.log('Text extracted and saved to file.');
//     }).catch(err => {
//         console.error('Error extracting text:', err);
//     });
// }

// module.exports = extractTextFromPDF;
const fs = require('fs');
const pdfParse = require('pdf-parse'); // Ensure correct import

async function extractTextFromPDF(dataBuffer) {
    try {
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (err) {
        console.error('Error extracting text:', err);
        throw err;
    }
}

const isDebugMode = !module.parent;

// For testing purposes
if (isDebugMode) {
    const PDF_FILE = './test/data/05-versions-space.pdf';
    const dataBuffer = fs.readFileSync(PDF_FILE);

    extractTextFromPDF(dataBuffer).then(data => {
        fs.writeFileSync(`${PDF_FILE}.txt`, data, {
            encoding: 'utf8',
            flag: 'w'
        });
        console.log('Text extracted and saved to file.');
    }).catch(err => {
        console.error('Error extracting text:', err);
    });
}

module.exports = extractTextFromPDF;
