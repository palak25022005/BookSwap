import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

export const initializeSocket = (server) => {

    io = new Server(server,{
        cors:{
            origin:"http://localhost:5173",
            methods:["GET","POST"]
        }
    });

    io.on("connection",(socket)=>{

        console.log("Socket connected",socket.id);

        socket.on("register",(firebaseUid)=>{

            onlineUsers.set(firebaseUid,socket.id);

            console.log(firebaseUid,"connected");

        });

        socket.on("disconnect",()=>{

            for(const [uid,id] of onlineUsers){

                if(id===socket.id){

                    onlineUsers.delete(uid);

                    break;

                }

            }

            console.log("Socket disconnected");

        });

    });

};

export const getIO=()=>io;

export const getOnlineUsers=()=>onlineUsers;