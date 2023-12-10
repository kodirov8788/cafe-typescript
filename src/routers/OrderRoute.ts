import express, { Request, Response } from "express";
import Order, { OrderModel } from "../models/OrderModul";
import { pusher } from "../Pusherjs";
import CacheController from "../redis/redis";


const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const { ordernumber, tablenumber, waitername, order } = req.body;
        console.log(tablenumber);

        // Assuming OrderModel is defined correctly
        const newOrder: OrderModel = new Order({
            isready: false,
            ordernumber,
            tablenumber,
            waitername,
            order
        });

        const savedOrder = await newOrder.save();
        console.log(savedOrder);

        // pusher.trigger('chat-channel', 'new-message', savedOrder);
        res.status(201).send(savedOrder);
    } catch (error) {
        res.status(500).send("Error creating order");
    }
});


router.put("/made/:id", async (req: Request, res: Response) => {
    try {
        const orderId: string = req.params.id;
        const newOrder: OrderModel | null = await Order.findByIdAndUpdate(orderId, { isready: true }, { new: true });

        if (newOrder) {
            pusher.trigger('chat-channel', 'new-message', newOrder);
            res.status(200).send(newOrder);
        } else {
            res.status(404).send("Order not found");
        }
    } catch (error) {
        res.status(500).send("Error updating order");
    }
});

router.get("/get", async (_req: Request, res: Response) => {
    try {
        const data: OrderModel[] = await Order.find({}).sort({ _id: -1 });
        CacheController.client.setex("orders", 3600, JSON.stringify(data));
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send("Error fetching orders");
    }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const orderId: string = req.params.id;
        const deletedOrder: OrderModel | null = await Order.findByIdAndDelete(orderId).lean<OrderModel>().exec();

        if (deletedOrder) {
            res.status(200).send(deletedOrder);
        } else {
            res.status(404).send("Order not found");
        }
    } catch (error) {
        res.status(500).send("Error deleting order");
    }
});

router.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const orderId: string = req.params.id;
        const updateData: Partial<OrderModel> = req.body; // assuming you send only the fields needed to update

        const updatedOrder: OrderModel | null = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

        if (updatedOrder) {
            res.status(200).send(updatedOrder);
        } else {
            res.status(404).send("Order not found");
        }
    } catch (error) {
        res.status(500).send("Error updating order");
    }
});

export default router;
