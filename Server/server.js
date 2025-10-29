import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./Routes/userRoutes.js";
import messageRouter from "./Routes/messageRoutes.js";
import { Server } from "socket.io"

// Creatw Expess app and HTTP server
const app = express()
const server = http.createServer(app)

// Middleware setup
// Body parsers (single place, higher limit for base64 payloads)
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store Online Users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io Connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query?.userId;
    if (!userId) return;

    const wasConnected = !!userSocketMap[userId];
    userSocketMap[userId] = socket.id;
    console.log(wasConnected ? "User Reconnected" : "User Connected", userId);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
    if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
    });
});


// Routes Setup
app.use("/api/status", (req, res)=>res.send("Server is live "));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)

app.use((err, req, res, next) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Payload too large" });
  }
  next(err);
});

// Connect to MONGODB
await connectDB();

if(process.env.NODE_ENV !== "production"){
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, ()=> console.log("Server is running on PORT " + PORT));  
}


// Export server for vercel
export default server;