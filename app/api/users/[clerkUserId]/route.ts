import { User } from "@/models/User"
export async function GET(request: Request, { params }: { params: { clerkUserId: string } }) {
    try {
        const { clerkUserId } = params;
        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return new Response("User not found", { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {

    }
};