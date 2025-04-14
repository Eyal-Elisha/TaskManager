import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tasksRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(tasksRoutes);

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send('Hello, world');
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
