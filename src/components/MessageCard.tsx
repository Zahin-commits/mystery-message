'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

type MessageCardProp={
 message: Message,
 onMessageDelete: (messageId:string) => void
}
  
const MessageCard = ({message, onMessageDelete}:MessageCardProp) => {
// const MessageCard = ({message, onMessageDelete}:any) => {

    const {toast} = useToast();
    const handleDeleteConfirm = async()=>{
       try {
        const req = await axios.delete(`/api/delete-msg/${message._id}`);
        if(req?.data?.success){
            toast({
                title:'Message deleted successfully'
            });
        }else{
            toast({
                title:"Something went wrong",
                variant: "destructive"
            })
        }

        onMessageDelete(message?._id);
    } catch (error) {
        toast({
            title:"Enternal server error",
            variant: "destructive"
        })
       }
    }
  return (
    <Card>
    <CardHeader className="p-2" >
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-8 flex ml-auto bg-red-500 text-white hover:bg-red-600 hover:text-white" variant="outline"> <X /> </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this feedback.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeleteConfirm()} >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </CardHeader>
    <CardContent className="text-lg p-4 pt-0 text-center" >{message.content}</CardContent>
  </Card>  
  )
}

export default MessageCard