import { Schema, model, Document } from "mongoose";

const OrderSchema = new Schema({
    isready: {
        required: true,
        type: Boolean
    },
    ordernumber: {
        type: Number
    },
    tablenumber: {
        type: String,
        required: true
    },
    waitername: {
        type: String,
        required: true
    },
    order: [
        {
            type: Object,
            required: true
        }
    ]
});

export interface OrderModel extends Document {
    isready: boolean;
    tablenumber: string;
    waitername: string;
    order: object[]; // Adjust the type based on the structure of your 'order' field
}

export default model<OrderModel>("Order", OrderSchema);
