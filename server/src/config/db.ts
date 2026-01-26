import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
    try {
        // Validate MongoDB URI
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain at least 5 socket connections
            maxIdleTimeMS: 10000, // Remove sockets after 10s of inactivity
            family: 4 // Use IPv4, skip IPv6
        };

        console.log("🔄 Attempting to connect to MongoDB...");
        
        await mongoose.connect(process.env.MONGO_URI, options);
        
        console.log("✅ MongoDB Connected Successfully");
        
        // Set up connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB Connection Error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB Disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB Reconnected');
        });

        mongoose.connection.on('connecting', () => {
            console.log('🔄 Connecting to MongoDB...');
        });

        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB Connected');
        });

    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error instanceof Error ? error.message : error);
        
        // Graceful shutdown if we can't connect to DB
        if (process.env.NODE_ENV === 'production') {
            console.error("🛑 Critical: Cannot connect to database in production. Exiting...");
            process.exit(1);
        }
        
        throw error;
    }
};

export default connectDB;