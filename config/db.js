const mongoose = require('mongoose');

const connectDB = async (MongoUri)=>{
    try{
        await mongoose.connect(MongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    }catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
    }
}

module.exports = connectDB;
