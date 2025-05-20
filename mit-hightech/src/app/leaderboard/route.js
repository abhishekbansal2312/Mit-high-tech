import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@clerk/nextjs';
import clientPromise from '../lib/mongodb';
import Score from '../models/Score';

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

// GET handler - Get leaderboard scores
export async function GET() {
  try {
    await connectDB();
    
    // Get top 10 scores
    const scores = await Score.find({})
      .sort({ score: -1 })
      .limit(10)
      .lean();
    
    return NextResponse.json({ success: true, scores });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
// POST handler - Save a new score
export async function POST(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const data = await request.json();
    
    // Validate score data
    if (!data.score || typeof data.score !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid score data' },
        { status: 400 }
      );
    }
    
    // Create new score record
    const newScore = new Score({
      userId,
      username: data.username,
      score: data.score
    });
    
    await newScore.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Score saved successfully',
      score: newScore
    });
    
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save score' },
      { status: 500 }
    );
  }
}