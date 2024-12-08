import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    _id: any;
    content: string;
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true
  },

  createdAt:{
    type: Date,
    required: true,
    default: Date.now
  }
}); 


export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExp: Date;
    isVerified: boolean;
    isAcceptingMsg: boolean;
    messages: Message[]
}


const userSchema: Schema<User> = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
  
    email: {
        type: String,
        required: true,
        unique: true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'please use a valid email address']
      },
  
    password: {
        type: String,
        required: true,
      },

    verifyCode: {
        type: String,
        required: true,
      },

    verifyCodeExp: {
        type: Date,
        required: true,
      },
     
    isVerified: {
        type:Boolean,
        default:false
    },

    isAcceptingMsg: {
        type:Boolean,
        default:true
    },
    
    messages: [messageSchema]
  }); 
  
  const UserModel = (mongoose.models.User as mongoose.Model<User>) ||(mongoose.model<User>("User", userSchema));

  export default UserModel;