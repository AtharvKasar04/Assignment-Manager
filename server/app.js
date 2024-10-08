const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const assignmentRouter = require("./routes/assignmentRouter");
const index = require("./routes/index");
const isLoggedIn = require("./middlewares/isLoggedIn");
const path = require("path");
const _dirname = path.resolve();

require("dotenv").config();

const db = require("./config/mongooseConnection")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'https://assignment-manager-1.onrender.com',
    credentials: true
}));

app.use(express.static(path.join(_dirname, "/client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
})

app.use("/", index);
app.use("/user", userRouter);
app.use("/assignment", isLoggedIn, assignmentRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
})