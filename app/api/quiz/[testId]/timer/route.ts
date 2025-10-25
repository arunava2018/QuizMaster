//store the time taken to complete a test
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { TestInformation } from '@/models/TestInformation';
import { auth } from '@clerk/nextjs/server';
export async function POST(
  req: Request,
  context: { params: Promise<{ testId: string }> }
)  {
  try {
    const { testId } = await context.params;
    const { userId } = await auth();
    const { timeTaken } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return NextResponse.json({ message: 'Invalid test ID' }, { status: 400 });
    }
    const test = await TestInformation.findById(testId);
    if (!test) {
      return NextResponse.json({ message: 'Test not found' }, { status: 404 });
    }
    test.timeTaken = timeTaken;
    test.status = 'completed';
    await test.save();
    return NextResponse.json({ success: true, message: 'Time taken updated successfully' });
  } catch (error: any) {
    console.error('Error updating time taken:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}