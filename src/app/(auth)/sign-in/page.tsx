'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { ApiRes } from "@/types/ApiRes"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signinSchema } from "@/schemas/sugninSchema"
import { signIn } from "next-auth/react"

const page = () => {
  const [isSubmitting,setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues:{
      identifier: '',
      password:''
    }
  });

const onSubmit = async (data: z.infer<typeof signinSchema>) => {
   
  const result = await signIn('credentials',{
    redirect:false,
    identifier: data.identifier,
    password: data.password
  });

  if(result?.error){
     toast({
      title:"Login Failed",
      description:"Something went wrong",
      variant: "destructive"
    })

    // console.log('login data', data);
    // console.log('login error', result);
  }

  if(result?.url){
    router.replace('/dashboard')
  }
}
  return (
    <div className="h-screen mx-auto flex flex-col justify-center items-center " >
      <h1 className="text-2xl text-center font-bold">Sign In</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-6 w-[30%] p-4 rounded mt-6 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
        
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username/Email</FormLabel>
              <FormControl>
                <Input placeholder="identifier" {...field}
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

        <Button type="submit">
          SUBMIT
        </Button>
        </form>
      </Form>
    </div>
  )
}

export default page