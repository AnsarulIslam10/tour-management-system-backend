/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // throw new AppError(httpStatus.BAD_REQUEST, "fale error")
        const user = await UserServices.createUser(req.body)
        
        res.status(httpStatus.CREATED).json({
            message: "User Created Successfully"
        })
    } catch (err: any) {
        console.log(err)
        next(err)
    }
}

export const UserControllers = {
    createUser
}