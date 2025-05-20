import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from "@clerk/nextjs/server";

import Score from '../../models/Score';

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

// GET handler - Get user's score
export async function GET(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const userScore = await Score.findOne({ userId }).lean();
    
    if (!userScore) {
      return NextResponse.json({ 
        success: true, 
        score: null,
        message: 'No score found for this user' 
      });
    }
    console.log(userScore);
    
    
    return NextResponse.json({ 
      success: true, 
      score: userScore 
    });
  } catch (error) {
    console.error('Error fetching user score:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user score' },
      { status: 500 }
    );
  }
}