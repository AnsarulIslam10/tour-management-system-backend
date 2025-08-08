/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';
import { connectRedis } from './app/config/redis.config';

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("Connected to db");

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listning to port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

(async () => {
    await connectRedis()
    await startServer()
    await seedSuperAdmin()
})()

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

// Unhandled rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught exception error
// throw new Error("I forgot to handle this local error")