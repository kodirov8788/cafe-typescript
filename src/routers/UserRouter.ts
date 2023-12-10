import { Router, Request, Response } from "express";
import User from "../models/UserModel";

const router = Router();

router.get("/get", async (_req: Request, res: Response) => {
    try {
        const data = await User.find({});
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send("Error fetching users");
    }
});

router.post("/create", async (req: Request, res: Response) => {
    try {
        const { name, lastname, age, username, role = "user", gender } = req.body;
        const newUser = new User({ name, lastname, age, username, role, gender });
        const user = await newUser.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send("Error creating user");
    }
});

router.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (req.body.name) user.name = req.body.name;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.age) user.age = req.body.age;

        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("Error updating user");
    }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).send(deletedUser);
    } catch (error) {
        res.status(500).send("Error deleting user");
    }
});

export default router;
