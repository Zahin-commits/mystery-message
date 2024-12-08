'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import axios from 'axios'
import { ApiRes } from "@/types/ApiRes"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const page = () => {
  const [username,setUsername] = useState('');
  const [usernameMsg,setUsernameMsg] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues:{
      username:'',
      email: '',
      password:''
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true);
        setUsernameMsg('');

        try {
          const req = await axios.get(`/api/check-username?username=${username}`);
          setUsernameMsg(req.data.message);
        } catch (error) {
          console.log(error);
          setUsernameMsg("Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
  checkUsernameUnique();
  }, [username]);
  
const onSubmit = async (data: z.infer<typeof signupSchema>) => {
  setIsSubmitting(true);

  try {
    const req = await axios.post<ApiRes>('/api/signup', data);

    toast({title: "Success", description: req.data.message});

    router.replace(`/verify/${username}`);
    setIsSubmitting(false);
  } catch (error) {
    console.error(error);
    toast({
      title:"Signup error",
      description:"something went wrong",
      variant: 'destructive'
    });
  setIsSubmitting(false);
  }
}
  return (
    <div className="h-screen mx-auto flex flex-col justify-center items-center " >

      <h1 className="text-2xl text-center font-bold">Sign Up</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-6 w-[30%] p-4 rounded mt-6 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                 onChange={e=>{
                  field.onChange(e)
                  debounced(e.target.value)
                 }}
                />
                
                {/* {isCheckingUsername && <Loader2 className="animate-spin" />} */}

              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}
                />
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} type="password"
                />
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} >
          {isSubmitting?'Loading...':'SUBMIT'}
        </Button>
        </form>
      </Form>
    </div>
  )
}

export default page