import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { Topic } from "@/models/Topics";

//increase userAttempts count in Topic model
export async function POST(req: NextRequest,context: { params: Promise<{ id: string }> }){
    try{
        const { userId } = await auth();
        if(!userId){
            return NextResponse.json({message: "You must be logged in."}, {status: 401});
        }
        await connectDB();
        const { id } = await context.params;
        if(!id){
            return NextResponse.json({message: "Invalid topic ID"}, {status: 400});
        }
        const topic = await Topic.findById(id);
        if(!topic){
            return NextResponse.json({message: "Topic not found"}, {status: 404});
        }
        topic.userAttempted += 1;
        await topic.save();
        return NextResponse.json({message: "User attempt recorded", userAttempts: topic.userAttempts}, {status: 200});
    }catch(error){
        console.error("Error recording user attempt:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}