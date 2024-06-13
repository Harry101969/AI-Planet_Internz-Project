// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./db/connection.js');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const mongoose = require('mongoose'); // Import Mongoose
// const { Schema } = mongoose; // Import Schema from Mongoose
// const extractTextFromPDF = require('./extractTextFromPDF');
// const { uploadOnCloudinary } = require("./utils/cloudinary.js")
// const compression = require('compression');
// // Initialize express app
// const app = express();
// app.use(compression());

// app.use(express.json());
// dotenv.config({ path: './.env' });

// // DB Connection
// connectDB();

// // Define PdfDetails schema
// const pdfDetailsSchema = new Schema({
//     pdf: String,
//     text: String
// });


// // Create PdfDetails model
// const PdfDetails = mongoose.model('PdfDetails', pdfDetailsSchema);

// // Multer configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, 'public', 'temp'));
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     }
// });
// const upload = multer({ storage: storage });
// const port = process.env.PORT || 3004;

// // Middlewares
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Routes
// app.get('/api/home', (req, res) => {
//     const printing = [
//         { id: 1, title: 'Hello1' },
//         { id: 2, title: 'Hello2' }
//     ];
//     res.send(printing);
// });

// app.post('/api/home', upload.single('pdfFile'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'File upload failed' });
//         }

//         const fileName = req.file.filename;
//         const filePath = req.file.path;

//         // Extract text from PDF
//         const dataBuffer = fs.readFileSync(filePath);
//         const extractedText = await extractTextFromPDF(dataBuffer);

//         // Save PDF details to database
//         try {
//             await PdfDetails.create({ pdf: fileName, text: extractedText });
//             console.log('PDF details saved to database');
//         } catch (dbError) {
//             console.error('Error saving PDF details to database:', dbError);
//             return res.status(500).json({ message: 'Database error', error: dbError.message });
//         }
//         // Upload PDF to Cloudinary
//         const filePath2 = req.file.path;
//         try {
//             const cloudinaryResponse = await uploadOnCloudinary(filePath2);
//             if (!cloudinaryResponse) {
//                 return res.status(500).json({ message: 'Error uploading PDF to Cloudinary' });
//             } else {
//                 console.log('PDF uploaded to Cloudinary');
//             }
//         } catch (error) {
//             console.error('Error uploading PDF to Cloudinary:', error);
//             return res.status(500).json({ message: 'Error uploading PDF to Cloudinary' });
//         } finally {
//             fs.unlinkSync(filePath);
//         }
//         // Remove the local PDF file after processing


//         return res.status(200).json({ message: 'File uploaded and text extracted successfully', fileName, extractedText });
//     } catch (error) {
//         console.error('Error processing request:', error);
//         return res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running at: http://localhost:${port}/api/home`);
// });


//A good one with openAi and huggingface
// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./db/connection.js');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const pdfParse = require('pdf-parse');
// const compression = require('compression');
// const { HfInference } = require('@huggingface/inference');
// const { uploadOnCloudinary } = require("./utils/cloudinary.js");
// const OpenAI = require("openai");

// // Initialize express app
// const app = express();
// app.use(compression());
// app.use(express.json());
// dotenv.config({ path: './.env' });

// // DB Connection
// connectDB();

// // Define PdfDetails schema
// const pdfDetailsSchema = new Schema({
//     pdf: String,
//     text: String
// });

// // Create PdfDetails model
// const PdfDetails = mongoose.model('PdfDetails', pdfDetailsSchema);

// // Multer configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, 'public', 'temp'));
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     }
// });
// const upload = multer({ storage: storage });
// const port = process.env.PORT || 3004;

// // Middleware
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Initialize Hugging Face Inference API
// const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// // Initialize OpenAI API
// const openai = new OpenAI(process.env.OPENAI_API_KEY);

// // Function to extract URLs from text using regex
// const extractUrls = (text) => {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.match(urlRegex) || [];
// };

// // Function to create completion with OpenAI (streaming) with retry logic
// const createOpenAICompletion = async (question, context, retries = 3) => {
//     try {
//         const stream = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 { role: "system", content: "You are a helpful assistant." },
//                 { role: "user", content: `Context: ${context}` },
//                 { role: "user", content: `Question: ${question}` }
//             ],
//             stream: true,
//         });

//         let answer = '';
//         for await (const chunk of stream) {
//             answer += chunk.choices[0]?.delta?.content || "";
//         }
//         return answer.trim();
//     } catch (error) {
//         console.error('Error creating OpenAI completion:', error);

//         if (error.code === 'insufficient_quota' && retries > 0) {
//             console.log(`Retrying... (${retries} attempts left)`);
//             await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay before retrying
//             return createOpenAICompletion(question, context, retries - 1); // Retry with decremented retries
//         }

//         throw error;
//     }
// };

// // Routes
// app.get('/api/home', async (req, res) => {
//     const printing = [
//         { id: 1, title: 'Hello1' },
//         { id: 2, title: 'Hello2' }
//     ];
//     res.send(printing);
// });

// // Updated /api/home endpoint to detect URLs
// app.post('/api/home', upload.single('pdfFile'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'File upload failed' });
//         }

//         const fileName = req.file.filename;
//         const filePath = req.file.path;

//         // Extract text from PDF
//         const dataBuffer = fs.readFileSync(filePath);
//         let extractedText = '';
//         let urls = []; // Array to store detected URLs

//         try {
//             const pdfData = await pdfParse(dataBuffer);
//             extractedText = pdfData.text;

//             // Detect URLs in the extracted text
//             const urlRegex = /(https?:\/\/[^\s]+)/g;
//             urls = extractedText.match(urlRegex) || [];
//         } catch (err) {
//             console.error('Error extracting text from PDF:', err);
//             return res.status(500).json({ message: 'Error extracting text from PDF', error: err.message });
//         }

//         // Save PDF details to database
//         await PdfDetails.create({ pdf: fileName, text: extractedText });

//         // Upload PDF to Cloudinary
//         const cloudinaryResponse = await uploadOnCloudinary(filePath);
//         if (!cloudinaryResponse) {
//             return res.status(500).json({ message: 'Error uploading PDF to Cloudinary' });
//         }

//         // Remove the local PDF file after processing
//         fs.unlinkSync(filePath);

//         return res.status(200).json({ message: 'File uploaded and text extracted successfully', fileName, extractedText, urls });
//     } catch (error) {
//         console.error('Error processing request:', error);
//         return res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// app.post('/api/query', async (req, res) => {
//     try {
//         const { text, questions } = req.body;

//         if (!text || !questions || !Array.isArray(questions) || questions.length === 0) {
//             return res.status(400).json({ message: 'Text and questions array are required' });
//         }

//         const cleanedText = text.trim();
//         const responses = [];

//         for (let i = 0; i < questions.length; i++) {
//             const cleanedQuestion = questions[i].trim();

//             // First, use Hugging Face for a response
//             const hfResponse = await hf.questionAnswering({
//                 question: cleanedQuestion,
//                 context: cleanedText.substring(0, 4000) // Adjust the context size as needed
//             });

//             // Then, use OpenAI for another response with retry logic
//             const openaiAnswer = await createOpenAICompletion(cleanedQuestion, cleanedText.substring(0, 4000));

//             responses.push({
//                 question: cleanedQuestion,
//                 hf_answer: hfResponse.answer,
//                 openai_answer: openaiAnswer
//             });
//         }

//         console.log('Responses:', responses);

//         return res.status(200).json({ responses });
//     } catch (error) {
//         console.error('Error processing request:', error);
//         return res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running at: http://localhost:${port}/api/home`);
// });
