import redis, { RedisClient } from 'redis';
import Order, { OrderModel } from "../models/OrderModul";
import crypto from 'crypto';

import { Request, Response, NextFunction } from 'express';

class CacheController {
    private static readonly REDIS_PORT: number = 6379;
    public static client: RedisClient = redis.createClient(CacheController.REDIS_PORT);

    public static setResponse(username: string, repos: number): string {
        console.log(username);
        return `<h2>${username} has ${repos} github repos</h2>`;
    }
    public static githubCache(req: Request, res: Response, next: NextFunction): void {
        const { username } = req.params;
        CacheController.client.get(username, (err, data) => {
            if (err) throw err;
            if (data !== null) {
                res.send(CacheController.setResponse(username, Number(data)));
            } else {
                next();
            }
        });
    }
    public static async orderCache(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            CacheController.client.get("orders", async (err, cachedData) => {
                if (err) throw err;

                if (cachedData !== null) {
                    const cachedOrders: OrderModel[] = JSON.parse(cachedData);

                    const newData: OrderModel[] = await Order.find({}).sort({ _id: -1 });

                    const cachedHash = crypto.createHash('md5').update(JSON.stringify(cachedOrders)).digest('hex');
                    const newHash = crypto.createHash('md5').update(JSON.stringify(newData)).digest('hex');

                    const dataChanged = cachedHash !== newHash;

                    if (dataChanged) {
                        CacheController.client.setex("orders", 3600, JSON.stringify(newData));
                        res.send(newData);
                    } else {
                        res.send(cachedOrders);
                    }
                } else {
                    next();
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching orders");
        }
    }



}

export default CacheController;
