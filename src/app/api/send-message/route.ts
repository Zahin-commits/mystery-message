import dbConnect from "@/lib/db";
import UserModel, { Message } from "@/model/User";


export async function POST(req:Request) {
    await dbConnect();
    const {username, content} = await req.json();
    
    try {
        const user = await UserModel.findOne({username});

        if(!user){
            return Response.json({
                success:false,
                message: 'no user fuond with this username'
            },{status:404})
        }

        if(!user.isAcceptingMsg){
            return Response.json({
                success:false,
                message: 'user is not accepting feedbacks'
            },{status:403})
        };

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success:true,
            message: 'Feedback sent successfully'
        })
    } catch (error) {
        return Response.json({
            success:false,
            message: 'somthing went wrong'
        },{status:500})    
    }
}