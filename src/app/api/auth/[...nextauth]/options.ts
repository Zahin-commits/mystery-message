import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'


export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials:{
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any>{
             await dbConnect();
              try {
                // console.log('cretendtials', credentials.identifier);
                // console.log('password', credentials.password);
               const user = await UserModel.findOne({
                $or:[
                    {email:credentials.identifier},
                    {username:credentials.identifier}
                ]
               });

               if(!user){
                 throw new Error("no user found with this credential lol");
               };
               if(!user.isVerified){
                 throw new Error("please verify your account first");
               }

             const isPassCorrect = await bcrypt.compare(credentials.password, user.password);
             
             if(isPassCorrect){
                return user;
             }else{
                throw new Error("Incorect password");
             }
            
            } catch (error:any) {
                throw new Error(error);
              }
            }
        })
    ],

    callbacks:{
      async session({ session, token }:any) {
        if(token){
          session.user._id = token?._id?.toString();
          session.user.isVerified = token?.isVerified;
          session.user.isAcceptingMsg = token?.isAcceptingMsg;
          session.user.username = token?.username;

          console.log('session', session);
          console.log('session username', session?.user.username);
        }
        return session
      },
      async jwt({ token, user}) {

        if(user){
          token._id = user?._id?.toString();
          token.isVerified = user?.isVerified;
          token.isAcceptingMsg = user?.isAcceptingMsg;
          token.username = user?.username;

          console.log('token username', token?.username);
        }
        return token
      }
    },

    pages:{
      signIn: '/sign-in'
    },

    session:{
      strategy: 'jwt'
    },

    secret: process.env.AUTH_SECRET
}