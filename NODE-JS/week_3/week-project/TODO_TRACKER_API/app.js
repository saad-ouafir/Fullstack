const express = require("express");
const app = express();

const helmet=require("helmet");
const cors=require("cors");
const rateLimit=require("express-rate-limit");

const Logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

const todosRouter = require("./routes/todos.routes");
const authRouter = require("./routes/auth.routes");
const config = require("./config/config");

//sécurité API
app.use(helmet());
app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials:true
}));
const limiter=rateLimit({windowMs: 15 *60 *1000, max: 100});
app.use(limiter);




const connectToDB = require("./config/database");
const MONGO_URL = config.MONGO_URL;
connectToDB(MONGO_URL);



app.use(Logger());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to TODO TRACKER API",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      todos: "/api/todos",
    },
  });
});

app.use("/api/auth", authRouter);
app.use("/api/todos", todosRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    code: 404,
    timestamp: new Date().toISOString(),
  });
});


app.use(errorHandler);

module.exports = app;
