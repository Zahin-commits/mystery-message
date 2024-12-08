import {z} from 'zod';

export const signinSchema = z.object({
//  identifier: z.string().length(6,"verifyCode must be of 6 degits"),
//  password: z.string().length(6,"verifyCode must be of 6 degits")
 identifier: z.string(),
 password: z.string().min(6,"Password must be of 6 degits or more")
})