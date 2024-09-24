const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();

// Set up Multer for handling multipart form-data (file uploads)
const upload = multer({ storage: multer.memoryStorage() }); // Store the file in memory

// Route to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Create a form-data object and append the file
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname); // Use buffer for file data

        // Send the file to FastAPI endpoint
        const response = await axios.post('http://bseb-test.ap-south-1.elasticbeanstalk.com/predict/upload', formData, {
            headers: {
                ...formData.getHeaders(), // Ensure proper headers are sent
            },
        });

        // Respond with the result from FastAPI
        res.json(response.data);
    } catch (error) {
        console.error('Error forwarding the request:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

// Start the server
app.listen(80, () => {
    console.log('Server started on port 80');
});
