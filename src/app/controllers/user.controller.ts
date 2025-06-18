import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import { z } from "zod";

export const usersRoutes = express.Router();
// import bcrypt from "bcryptjs";

const CreateUserZodSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  email: z.string(),
  password: z.string(),
  role: z.string().optional(),
});

// create a user
usersRoutes.post("/create-user", async (req: Request, res: Response) => {
  try {
    // const body = await CreateUserZodSchema.parseAsync(req.body);
    const body = req.body;

    // const password = await bcrypt.hash(body.password, 10);
    // console.log(password);
    // body.password = password;

    // const user = await User.create(body);

    // for built-in and custom instance method
    // const user = new User(body);
    // const password = await user.hashPassword(body.password)
    // user.password = password
    // await user.save()

    // for built-in and custom static method
    // const password = await User.hashPassword(body.password)
    // body.password = password

    const user = await User.create(body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
});

// get all users
usersRoutes.get("/", async (req: Request, res: Response) => {
  const userEmail = req.query.email;
  let users = [];

  // filtering
  if (userEmail) {
    users = await User.find({ email: userEmail });
  } else {
    users = await User.find();
  }

  // sorting
  users = await User.find().sort({"email": "ascending"});
  
  // skipping
  users = await User.find().skip(2)

  // limit
  users = await User.find().limit(2);

  res.status(201).json({
    success: true,
    message: "All users fetched successfully",
    users,
  });
});

// get single user by id
usersRoutes.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  res.status(201).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

// update note by id
usersRoutes.patch("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updatedBody = req.body;
  const user = await User.findByIdAndUpdate(userId, updatedBody, { new: true });

  res.status(201).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

// delete user by id
usersRoutes.delete("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  // const user = await User.findByIdAndDelete(userId);
  // const note = await User.deleteOne({_id: noteId})
  // const note = await User.findOneAndDelete({_id: noteId})

  // for query middleware | And normal case
  const user = await User.findOneAndDelete({ _id: userId });

  res.status(201).json({
    success: true,
    message: "User deleted successfully",
    user,
  });
});
