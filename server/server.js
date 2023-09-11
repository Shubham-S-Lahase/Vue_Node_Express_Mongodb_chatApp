const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const jwtStrategy = require("./passport");
const userRoutes = require("./routes/userRoutes");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/chatApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

passport.use(jwtStrategy);

app.use(passport.initialize());

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({ message: "You have accessed a protected route" });
  }
);
