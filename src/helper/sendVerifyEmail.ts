// import { resend } from "@/lib/resend";
import { Resend } from 'resend';
import VerificationEmail from "../../emails/VerifyEmail";
import { ApiRes } from "@/types/ApiRes";

const resend = new Resend(process.env.RESEND_KEY);

export async function sendVefiticationEmail(
    username:string,
    email:string,
    verifyCode: string
): Promise<ApiRes> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: 'lerole6680@operades.com',
            subject: 'Hello world',
            react: VerificationEmail({username, otp:verifyCode}),
          });

          console.log('email', email);

          if(data){
            console.log('resend data', data);
          }else{
            console.log('resend error', error);
          }

          return {success:true , message: "verification email sent successfully"}
    } catch (error) {
        console.log("email sending error", error);
        return {success:false , message: "failed to send email"}
    }
}