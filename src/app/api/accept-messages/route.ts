import dbConnect from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function POST(req:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
   
    if(!session || !session.user){
        // console.log(error);
        return Response.json({
            success:false,
            message: 'Error checking username'
        },{status:500})
    }

    const userId = user._id;

    const {isAcceptingMsg} = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMsg}, {new:true});

        if(!updatedUser){
            return Response.json({
                success:false,
                message: 'no updated user foun'
            },{status:401})
        }

        return Response.json({
            success:true,
            message: 'Accepting messages updated',
            isAcceptingMsg: updatedUser.isAcceptingMsg
    })
    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message: 'Error checking username'
        },{status:500})
    }
};


export async function GET(req:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
   
    if(!session || !session.user){
        // console.log(error);
        return Response.json({
            success:false,
            message: 'Error checking username'
        },{status:500})
    }

    const userId = user._id;
    
   try {
    const foundUser = await UserModel.findById(userId);
    
    if(!foundUser){
     return Response.json({
         success:false,
         message: 'no user found'
     },{status:404})
    };
 
    return Response.json({
     success:true,
     message: 'found user successfully',
     isAcceptingMsg: foundUser.isAcceptingMsg
 })
   } catch (error) {
    return Response.json({
        success:false,
        message: 'something went wrong bro'
    },{status:500})
   }

}