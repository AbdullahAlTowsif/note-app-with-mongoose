import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import { z } from "zod";
export const usersRoutes = express.Router();

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
  const users = await User.find();

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
  const user = await User.findByIdAndDelete(userId);
  // const note = await User.deleteOne({_id: noteId})
  // const note = await User.findOneAndDelete({_id: noteId})

  res.status(201).json({
    success: true,
    message: "User deleted successfully",
    user,
  });
});
