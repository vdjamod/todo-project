import dotenv from "dotenv";
dotenv.config();
import Todo from "./Models/todo.js";
import User from "./Models/user.js";
import bodyParser from "body-parser";
import {
  comparePassword,
  decryptPassword,
  encryptPassword,
  sendToken,
  verifyToken,
} from "./auth/auth.js";

import express from "express";
const app = express();
const port = 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

import mongoose from "mongoose";
import sendMail from "./helper/sendMail.js";

// connecting to mongoose server
main()
  .then(() => console.log("db connected successfully"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

//                                      ************ Reset password ****************
app.put("/API/reset-pass", async (req, res) => {
  const { id, newPassword } = req.body;

  const user = await User.findById(id);
  user.password = encryptPassword(newPassword);
  await user.save();
  res.status(200).send("Password Updated Successfully");
});

//                                      ************ Send mail ****************
app.post("/API/sendmail", async (req, res) => {
  const email = req.body.email;
  const encryptEmail = encryptPassword(email);
  const user = await User.findOne({ email });

  const id = user._id;
  let url = `http://localhost:5173/reset-password/76b${id}76b`;

  if (user) {
    const result = await sendMail(
      email,
      "Forget Password",
      `Hi ${user.name}. Your Reset Password link is: ${url}`
    );

    return res.status(200).send("Mail sent successfully");
  } else {
    return res.status(404).send("User Not Registered");
  }
});

//                                      ************ Check User ****************
app.post("/API/validate-user", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not valid");
    }

    res.status(200).send("User Valid");
  } catch (error) {
    res.status(201).send("Error validating user");
  }
});


//                                      ************ signup ****************
app.post("/API/user/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser !== null) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    // Create and save the new user
    console.log(password);
    const newPass = encryptPassword(password);
    console.log(newPass);
    let newUser = new User({ name, email, password: newPass });
    const result = await newUser.save();

    const dbUser = await User.findOne({ email });
    const token = sendToken(dbUser._id, email);

    console.log("New user saved into DB");
    res.status(201).send(token);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Login ****************
app.post("/API/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const dbUser = await User.findOne({ email });
    const result = comparePassword(password, dbUser.password);

    if (result) {
      const token = sendToken(dbUser._id, email);
      // console.log(token);
      res.status(201).send(token);
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/API/delete", verifyToken, async (req, res) => {
  try {
    await Todo.deleteMany({ user: req.id });
    await User.findByIdAndDelete(req.id);

    res.send("User Delete Successfully");
  } catch (error) {
    console.log("DELETE ERROR" + error);
  }
});

//                                      ************ All Todo ****************
app.get("/API/todo/all", verifyToken, async (req, res) => {
  try {
    const result = await Todo.find({
      user: req.id,
      isComplete: false,
      isDelete: false,
    }).sort({ createdAt: -1 });
    res.send(result);
  } catch (error) {
    console.error("All Todo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Completed Todo ****************
app.get("/API/user/todo/complete", verifyToken, async (req, res) => {
  try {
    const result = await Todo.find({ user: req.id, isComplete: true }).sort({
      completedTime: -1,
    });
    res.send(result);
  } catch (error) {
    console.error("Completed Todo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Delete Todo ****************
app.put("/API/user/todo/delete/:id", verifyToken, async (req, res) => {
  try {
    let todo = await Todo.findByIdAndUpdate(req.params.id, {
      $set: { isDelete: true },
      new: true,
    });

    res.send(todo);
  } catch (error) {
    console.error("Delete Todo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Update Todo ****************
app.put("/API/user/todo/:id", verifyToken, async (req, res) => {
  try {
    let todo = await Todo.findByIdAndUpdate(req.params.id, {
      $set: { isComplete: true, completedTime: Date.now() },
      new: true,
    });
    const result = await todo.save();

    res.send(result);
  } catch (error) {
    console.error("Update Todo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Add Todo ****************
app.post("/API/todo", verifyToken, async (req, res) => {
  try {
    let newTodo = new Todo(req.body);
    newTodo.user = req.id;
    const response = await newTodo.save();

    const findedUser = await User.findById(req.id);
    findedUser.todos.push(response._id);
    await findedUser.save();

    console.log("New Todo saved into DB");
    res.redirect("/user");
  } catch (error) {
    console.error("Add Todo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Filter ****************
app.get("/API/user/todo/filter/:date", verifyToken, async (req, res) => {
  try {
    const selectedDate = req.params.date;

    const startOfDay = new Date(selectedDate);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const results = await Todo.find({
      user: req.id,
      isComplete: false,
      isDelete: false,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).sort({ createdAt: -1 });

    res.send(results);
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Sort Todo ****************
app.get("/API/user/todo/sort/:option", verifyToken, async (req, res) => {
  console.log(req.params.option);
  try {
    let sortOrder = req.params.option;
    let sortOption = { level: 1, createdAt: -1 };

    if (sortOrder === "desc") {
      sortOption = { level: -1, createdAt: -1 };
    }

    const result = await Todo.find({
      user: req.id,
      isComplete: false,
      isDelete: false,
    }).sort(sortOption);

    res.send(result);
  } catch (error) {
    console.error("Sort Todo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Filter - Sort ****************
app.get(
  "/API/user/todo/filter/:date/sort/:option",
  verifyToken,
  async (req, res) => {
    const selectedDate = req.params.date;

    const startOfDay = new Date(selectedDate);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    let sortOrder = req.params.option;
    let sortOption = { level: 1, createdAt: -1 };

    if (sortOrder === "desc") {
      sortOption = { level: -1, createdAt: -1 };
    }

    try {
      const results = await Todo.find({
        user: req.id,
        isComplete: false,
        isDelete: false,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      }).sort(sortOption);

      res.send(results);
    } catch (error) {
      console.error("Filter error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get("/", (req, res) => {
  res.send(`app working correctly`);
});

app.listen(port, () => {
  console.log(`Server Listen on Port ${port}`);
});
