'use client'

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { msgAcceptSchema } from "@/schemas/acceptMsgSchema";
import { ApiRes } from "@/types/ApiRes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const {toast} = useToast();

  const handleDeleteMessage = async(messageId:string)=>{
   setMessages(messages.filter((message)=>message._id !== messageId));
  }

  const {data: session} = useSession();
  console.log(session);

  const form = useForm({
    resolver: zodResolver(msgAcceptSchema)
  });

  const {register, watch, setValue} = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async()=>{
     setIsSwitchLoading(true);

     try {
      const res = await axios.get('/api/accept-messages');

      setValue('acceptMessages', res.data.isAcceptingMsg);

     } catch (error) {
      toast({
        title: "Opps",
        description: "Something went wrong",
        variant: "destructive"
      }) 
     }finally{
        setIsSwitchLoading(false);
      }
  },[setValue]);

  const fetchMessages = useCallback(async(refresh:boolean=false)=>{
    setIsLoading(true);
    setIsSwitchLoading(true);

    try {
      const res = await axios.get<ApiRes>('/api/get-messages');
      console.log('messages', res.data);
      setMessages(res?.data?.messages || []);
      if(refresh){
        toast({
          title:"Refreshed messages",
          description:"Showing lastest messages"
        })
      }
    } catch (error) {
      toast({
        title: "Opps",
        description: "Something went wrong",
        variant: "destructive"
      }) 
    }finally{
      setIsSwitchLoading(false);
      setIsLoading(false);
    }
  },[setIsLoading,setMessages])


  useEffect(()=>{
   if(!session || !session.user) return ; 
  //  if(!session) return ; 
  fetchMessages();
  fetchAcceptMessages();
  },[session,setValue,toast,fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async()=>{
    try {
      const res = await axios.post('/api/accept-messages', {
        isAcceptingMsg: !acceptMessages
      });

      setValue('acceptMessages',res.data.isAcceptingMsg);

      toast({
        title:res.data.message,
      })
    } catch (error) {
     toast({
      title:"Opps",
      description:'failed to update the option'
     })   
    }
  }

  // const {username} = session?.user as User;
  const user:User = session?.user as User;
  const username = user?.username;

  const baseUrl = `${window.location.protocol}//${window.location.host}`

  const profileUrl = `${baseUrl}/u/${username}`
  // const profileUrl = `zan`

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl);
    toast({
      title:"URL Copid to clipboard"
    })
  }

  if(!session || !session.user){
   return <>
    <h1>Please login first</h1>
   </>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
          // <RefreshCcw className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}

        {/* <MessageCard message={{content:"this is a test msg"}} /> */}
      </div>
    </div>
  );
  
}

export default page