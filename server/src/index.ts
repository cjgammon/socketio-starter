import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupSocket } from "./config/socket";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const io = setupSocket(app);
const httpServer = io.httpServer;

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
