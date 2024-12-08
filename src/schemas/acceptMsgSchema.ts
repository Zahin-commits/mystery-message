import {z} from 'zod';

export const msgAcceptSchema = z.object({
 acceptMsg: z.boolean(),
 
})