import { Message } from "@/model/User";

export interface ApiRes {
  success: boolean;
  message: string;
  isAccespting?: boolean;
  messages?: Array<Message> 
}