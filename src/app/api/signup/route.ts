import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVefiticationEmail } from "@/helper/sendVerifyEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:Request) {
    await dbConnect();

    try {
        // req.json().then((data)=>{
        //     console.log('data ',data);
        // })
        const res = await req.json();
        // console.log('test ', res)
        const {username,email,password} = res;

        const verifiedUserExistByName = await UserModel.findOne({username, isVerified:true});

        if(verifiedUserExistByName){
            return NextResponse.json({success:false, message:"username already taken"});
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
             return NextResponse.json({success:false, message:"a user with this email already exits"}, {status:400});
            }else{
              const hasedPass = await bcrypt.hash(password, 10);

              existingUserByEmail.password = hasedPass;
              existingUserByEmail.verifyCode = verifyCode;
              existingUserByEmail.verifyCodeExp = new Date(Date.now() + 3600000);

              await existingUserByEmail.save();
            }
        }else{
            const hasedPass = await bcrypt.hash(password, 10);
            const expiryData = new Date();
            expiryData.setHours(expiryData.getHours()+1);

            const user = await UserModel.create({
                username,
                email,
                password: hasedPass,
                verifyCode,
                verifyCodeExp: expiryData,
                isVerified: false,
                isAcceptingMsg: true,
                messages: []
            })
        }

        const emailRes = await sendVefiticationEmail(username,email,verifyCode);

        if(!emailRes.success){
       return NextResponse.json({success:false, message:"email not sent"}, {status:500});
        }

       return NextResponse.json({success:true, message:"email registered successfully"}, {status:201});

    } catch (error) {
       console.error("signup route trycatch error", error);
       
       return NextResponse.json({success:false, message:"emternal server error"}, {status:500});
    }
}