import {z} from 'zod';

// export const verifySchema = z.object({
//  verifyCode: z.string().length(6,"verifyCode must be of 6 degits"),
 
// })
export const verifySchema = z.object({
 code: z.string().length(6,"verifyCode must be of 6 degits"),
 
})