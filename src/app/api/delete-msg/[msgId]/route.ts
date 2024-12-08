import dbConnect from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";


export async function DELETE(req:Request, {params}:{params:{msgId:string}}) {
    const msgId = params.msgId;
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
    try {
      const updatedRes = await UserModel.updateOne(
        {_id:user._id},
        {$pull:{messages:{_id:msgId}}}
      )  

      if(updatedRes.modifiedCount == 0){
        return Response.json({
            success:false,
            message: 'message not found'
        },{status:404})
      }

      return Response.json({
        success:true,
        message: 'message delete successfully'
    })
    } catch (error) {
        return Response.json({
        success:false,
        message: 'somthing went wrong'
    },{status:500})
    }
}