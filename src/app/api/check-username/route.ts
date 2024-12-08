import dbConnect from "@/lib/db";
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signupSchema";
import UserModel from "@/model/User";

// dbConnect();

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req:Request) {
    await dbConnect();

   try {
    const {searchParams} = new URL(req.url);
    const queryParam = {
        username:searchParams.get('username')
    }

    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(queryParam, result);

    if(!result.success){
        const usernameErrors = result.error.format().username?._errors || [];
        return Response.json({
        success:false,
        message: 'somthing went wrong checking username'
    },{status:400});
    }
    
    const {username} = result.data;

    const usernameTaken = await UserModel.findOne({username, isVerified:true});
    
    if(usernameTaken){
        return Response.json({
            success:false,
            message: 'username is already taken'
        },{status:400});
    }

    return Response.json({
        success:true,
        message: 'username is available'
    });

   } catch (error) {
    console.log(error);

    return Response.json({
        success:false,
        message: 'Error checking username'
    },{status:500})
   }
}