import mongoose from "mongoose";

type connectObj = {
 isConnected?: number
};

const connection : connectObj = {};

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("already connected to db");
     return
    }

    try {
      const db = await mongoose.connect(process.env.DB_LINK!);
      
      console.log("is connected", db.connections[0].readyState);

    } catch (error) {
        console.log("db failed",error);
        process.exit(1);
    }

}

export default dbConnect;