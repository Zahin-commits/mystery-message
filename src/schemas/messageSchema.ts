import {z} from 'zod';

export const messageSchema = z.object({
 content: z.string()
 .min(10,"feedback can not be less than 10 characters")
 .max(300,"feedback can not be larger than 300 characters")
 
})