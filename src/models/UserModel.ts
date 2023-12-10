import { Schema, model, Document } from "mongoose";

interface User extends Document {
    name: string;
    lastname: string;
    age: number;
    username: string;
    role: string;
    gender: string;
}

const UserSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: "user",
    },
    gender: {
        type: String,
        required: true,
    },
});

const UserModel = model<User>("User", UserSchema);

export default UserModel;
