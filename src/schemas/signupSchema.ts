import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(3,"Username can not be less than 3 characters")
    .max(20,"Username can not be larger than 20 characters");

export const signupSchema = z.object({
    username: usernameValidation,

    email: z.string().email({message:"invalid email adress"}),
    
    password: z.string().min(6,"password must contain 6 or characters"),

})
