import dbConnect from "@/lib/db";
import UserModel from "@/model/User";

export async function POST(req:Request) {
    await dbConnect();

    try {
        const {username,code} = await req.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username: decodedUsername});

        if(!user){
            return Response.json({
                success:false,
                message: 'user not found'
            },{status:404})
        }

        const isCodeVaild = user.verifyCode == code;
        const isCodeNotExpired = new Date(user.verifyCodeExp) > new Date();

        if(isCodeVaild && isCodeNotExpired){
            user.isVerified = true;

            await user.save();

            return Response.json({
                success:true,
                message: 'user verified successfully'
            })
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message: 'verification code timeout, signup again'
            },{status:400})
        };

        return Response.json({
            success:false,
            message: 'incorrect code'
        },{status:400})
    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message: 'Error checking username'
        },{status:500})
    }
}