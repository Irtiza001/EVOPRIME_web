const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
});

// Mongoose Schema for Message
const messageSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});

const Message = mongoose.model('Message', messageSchema);

// API to Save Message Data
app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    
    console.log("Received Data:", { firstName, lastName, email, message }); // Log received data
    
    if (!firstName || !lastName || !email || !message) {
        console.warn("Validation Failed: Missing required fields");
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    try {
        const newMessage = new Message({ firstName, lastName, email, message });
        await newMessage.save(); // Save to MongoDB
        console.log("Message saved successfully:", { firstName, lastName, email, message });
        res.status(200).json({ success: true, message: 'Message saved successfully!' });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ success: false, error: 'Failed to save message' });
    }
});

// Mongoose Schema for Form Data
const formSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
});

// Create a model from the schema
const FormData = mongoose.model('FormData', formSchema);

// API to Handle Form Submission
app.post('/submit-form', async (req, res) => {
    const { firstName, lastName, phone, email, message } = req.body;

    console.log("Received Form Data:", { firstName, lastName, phone, email, message });

    if (!firstName || !lastName || !phone || !email || !message) {
        console.warn("Validation Failed: Missing required fields");
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    try {
        const newForm = new FormData({
            firstName,
            lastName,
            phone,
            email,
            message
        });

        await newForm.save(); // Save to MongoDB
        console.log("Form Data saved successfully:", { firstName, lastName, phone, email, message });
        res.status(200).json({ success: true, message: 'Form submitted successfully' });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ success: false, message: 'Failed to submit form' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
