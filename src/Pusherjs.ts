import Pusher from "pusher";

interface PusherConfig {
    appId: string;
    key: string;
    secret: string;
    cluster: string;
    useTLS: boolean;
}

const pusherConfig: PusherConfig = {
    appId: "1334589",
    key: "4aed833cb4657d97c07e",
    secret: "86332c55990b15158d61",
    cluster: "ap2",
    useTLS: true,
};

const pusher: Pusher = new Pusher(pusherConfig);

export { pusher };
