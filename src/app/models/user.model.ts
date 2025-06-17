import { Model, model, Schema } from "mongoose";
import {
  IAddress,
  IUser,
  UserInstanceMethods,
  UserStaticMethods,
} from "../interfaces/user.interface";
import validator from "validator";
import bcrypt from "bcryptjs";
import { Note } from "./notes.models";

const addressSchema = new Schema<IAddress>(
  {
    city: {
      type: String,
    },
    street: {
      type: String,
    },
    zip: {
      type: Number,
    },
  },
  {
    _id: false,
  }
);

// for instance method
// new Schema<IUser, Model<IUser>, UserInstanceMethods>

// for static method
const userSchema = new Schema<IUser, UserStaticMethods, UserInstanceMethods>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 10,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Age MUST be at least 18, got {VALUE}"],
      max: 60,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: [true, "Email must be unique!"],
      // validate: {
      //     validator: function(value) {
      //         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      //     },
      //     message: function(props) {
      //         return `Email ${props.value} is not valid email`
      //     }
      // }

      validate: [validator.isEmail, "Invalid email {VALUE}"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      uppercase: true,
      enum: {
        values: ["USER", "ADMIN", "SUPERADMIN"],
        message: "Role is not valid! got {VALUE}",
      },
      default: "USER",
    },
    address: {
      type: addressSchema,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
);

// for instance method
userSchema.method("hashPassword", async function (plainPassword: string) {
  const password = await bcrypt.hash(plainPassword, 10);
  return password;
});

// for static method
userSchema.static("hashPassword", async function (plainPassword: string) {
  const password = await bcrypt.hash(plainPassword, 10);
  return password;
});

// for middleware | pre or post hooks

// pre hook

// document middleware
userSchema.pre("save", async function (next) {
  // console.log(this);
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// query middleware
userSchema.pre("find", function (next) {
  console.log("Inside pre find hook");
  next();
})

// post hook

// query middleware: find the user by id and delete the user and all the notes created by that user
userSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    await Note.deleteMany({ user: doc._id });
  }
  next();
});

// document middleware
userSchema.post("save", function (doc, next) {
  console.log(`${doc._id} has been saved`);
  next();
});


// virtual mongoose
userSchema.virtual('fullName').get(function(){
  return `${this.firstName} ${this.lastName}`
})


// for instanec method
// export const User = model<IUser, Model<IUser, {}, UserInstanceMethods>>("User", userSchema);

// for static method
export const User = model<IUser, UserStaticMethods>("User", userSchema);
