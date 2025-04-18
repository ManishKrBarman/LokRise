import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lokrise');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Function to drop the database
const dropDatabase = async () => {
    try {
        console.log('Connecting to database...');
        const conn = await connectDB();

        console.log('WARNING: This will drop the entire database. All data will be lost.');
        console.log('Are you sure you want to proceed? (yes/no)');

        // Wait for user confirmation
        process.stdin.once('data', async (data) => {
            const confirmation = data.toString().trim().toLowerCase();

            if (confirmation === 'yes') {
                console.log('Dropping the database...');
                await conn.connection.db.dropDatabase();
                console.log('Database has been dropped successfully.');
            } else {
                console.log('Operation cancelled. Database was not dropped.');
            }

            // Close connection and exit
            await mongoose.connection.close();
            process.exit(0);
        });
    } catch (error) {
        console.error(`Error dropping database: ${error.message}`);
        process.exit(1);
    }
};

// Run the function
dropDatabase();