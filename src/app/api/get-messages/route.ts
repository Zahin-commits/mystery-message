import dbConnect from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import mongoose from "mongoose";


export async function GET(req:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    
    // console.log('get message session', session);
    if(!session || !session.user){
        return Response.json({
            success:false,
            message: 'Error checking username'
        },{status:500})
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        const user = await UserModel.aggregate([
           {$match:{_id:userId}},
           {$unwind: '$messages'},
           {$sort:{'messages.createdAt':-1}},
           {$group:{_id:'$_id', messages:{$push:'$messages'}}}
        ]);

        if(!user || user.length === 0){
            return Response.json({
                success:false,
                message: 'user not found'
            },{status:401})
        }
        // console.log('get-message user', user);
        return Response.json({
            success:true,
            messages: user[0].messages
        })
    } catch (error) {
        return Response.json({
        success:false,
        message: 'somthing went wrong'
    },{status:500})
    }
}