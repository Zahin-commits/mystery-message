'use client'

import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation'
import * as z from "zod"
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@react-email/components';

const page = () => {
  const router = useRouter();
  const params = useParams<{username:string}>();
  const {toast} = useToast();


  const form = useForm({
    resolver: zodResolver(verifySchema)
  });

// const onSubmit = async (data:z.infer<typeof verifySchema>) => {
const onSubmit = async (data:any) => {
    try {
        const req = await axios.post('/api/verify', {
            username: params.username,
            code: data.code
        });

        toast({
            title:'Success',
            description: req.data.message
        });

        router.replace('/sign-in');
    } catch (error) {
        console.error(error);
        toast({
          title:"Signup error",
          description:"something went wrong",
          variant: 'destructive'
        });
    }
}

  return (
    <div className='w-1/3 mx-auto'>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default page