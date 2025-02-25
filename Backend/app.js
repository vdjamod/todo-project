import dotenv from "dotenv";
dotenv.config();
import Todo from "./Models/todo.js";
import User from "./Models/user.js";
import bodyParser from "body-parser";
import {
  comparePassword,
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

// connecting to mongoose server
main()
  .then(() => console.log("db connected successfully"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

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
    const newPass = await encryptPassword(password);
    let newUser = new User({ name, email, password: newPass });
    const result = await newUser.save();

    // const token = sendToken(existingUser._id, email);
    const dbUser = await User.findOne({ email });
    const token = sendToken(dbUser._id, email);

    console.log("New user saved into DB");
    res.status(201).send(token);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Signin ****************
app.post("/API/user/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const dbUser = await User.findOne({ email });
    const result = comparePassword(password, dbUser.password);

    if (res) {
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

//                                      ************ Sort Todo ****************
app.get("/API/user/todo/sort/:option", verifyToken, async (req, res) => {
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
    // console.log(findedUser);
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
    const selectedDate = req.params.date; // User-selected date

    const startOfDay = new Date(selectedDate);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

    // Mongoose query
    const results = await Todo.find({
      user: req.id,
      isComplete: false,
      isDelete: false,
      createdAt: {
        $gte: startOfDay, // Start of the selected date
        $lt: endOfDay, // End of the selected date
      },
    }).sort({ createdAt: -1 });

    res.send(results);
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//                                      ************ Filter - Sort ****************
app.get(
  "/API/user/todo/filter/:date/sort/:option",
  verifyToken,
  async (req, res) => {
    const selectedDate = req.params.date; // User-selected date

    const startOfDay = new Date(selectedDate);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

    let sortOrder = req.params.option;
    let sortOption = { level: 1, createdAt: -1 };

    if (sortOrder === "desc") {
      sortOption = { level: -1, createdAt: -1 };
    }

    try {
      // Mongoose query
      const results = await Todo.find({
        user: req.id,
        isComplete: false,
        isDelete: false,
        createdAt: {
          $gte: startOfDay, // Start of the selected date
          $lt: endOfDay, // End of the selected date
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
