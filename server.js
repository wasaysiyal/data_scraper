const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB connection helper
async function connectToMongoDB(connectionString) {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

// API Routes
app.post('/api/save-to-mongodb', async (req, res) => {
    try {
        const { connectionString, collectionName, data } = req.body;
        
        if (!connectionString || !collectionName || !data) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        // Create dynamic schema based on the data structure
        const Schema = mongoose.Schema;
        const dynamicSchema = new Schema({}, { strict: false, timestamps: true });
        
        // Connect to MongoDB
        await connectToMongoDB(connectionString);
        
        // Create or get the model
        const Model = mongoose.model(collectionName, dynamicSchema, collectionName);
        
        // Insert data with batch processing for large datasets
        const batchSize = 100;
        const results = [];
        
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const batchResults = await Model.insertMany(batch, { ordered: false });
            results.push(...batchResults);
        }
        
        // Disconnect from MongoDB
        await mongoose.disconnect();
        
        res.json({
            success: true,
            message: `Successfully saved ${results.length} records to MongoDB`,
            insertedCount: results.length
        });
        
    } catch (error) {
        console.error('❌ Error saving to MongoDB:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving to MongoDB',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('🔗 MongoDB API endpoints:');
    console.log(`POST /api/save-to-mongodb`);
    console.log(`GET  /api/health`);
});
