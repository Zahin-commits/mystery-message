

'use client'
import { Suggestions } from '@/components/Suggestions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import suggestions from '@/suggestions.json';
import { useEffect, useState } from 'react';

const feedbackSchema = z.object({
    content: z.string().min(10, "Your feedback can not be less than 10 letters").max(200, "Your feedback can not contain more than 200 letters")
});

const {list} = suggestions;
const page = () => {
  const [suggestList, setSuggestList] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: '',
    },
  });

  const getSuggestList = () => {
    const i = Math.floor(Math.random() * 10);
    setSuggestList(list[i]);
  };

  const handleSubmit = async (data: z.infer<typeof feedbackSchema>) => {
    try {
      const res = await axios.post('/api/send-message', {
        username,
        content: data.content,
      });
      if (res.data.success) {
        toast({ title: res.data.message });
      } else {
        toast({
          title: res.data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('error', error);
      toast({
        title: "Internal server error",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (list && list.length > 0) {
      getSuggestList();
    }
  }, []);

  return (
    <div className="h-screen mx-auto w-3/4 flex flex-col items-center">
      <div className="send-msg w-3/4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="max-w-lg m-auto w-full flex flex-col justify-between gap-3"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-xl">Your Feedback</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your feedback"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        setInput(value);
                        field.onChange(value); // Sync with React Hook Form
                      }}
                      value={input} // Keep value synced with state
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="uppercase w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>

      <Separator className="mt-4" />

      <div className="sgt-msg flex flex-col items-center">
        <h2 className="text-[1.5rem] uppercase text-center mt-5">Suggested Feedbacks</h2>

        {suggestList.map((suggestion, i) => (
          <Suggestions
            key={i}
            text={suggestion}
            setInput={(value:any) => {
              setInput(value); // Update input state
              form.setValue('content', value); // Update React Hook Form state
            }}
          />
        ))}

        <Button
          className="mt-2 uppercase text-lg"
          onClick={() => {
            getSuggestList();
          }}
        >
          Refresh Suggestions
        </Button>
      </div>
    </div>
  );
};

export default page;

