/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"
import { TErrorSources } from "../interfaces/error.types"
import { handlerValidationError } from "../helpers/handlerValidationError"


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = "Something Went Wrong!!"
    //Duplicate error
    if (err.code === 11000) {
        console.log("Duplicate error", err.message)
        const duplicate = err.message.match(/"([^""]*)"/)
        statusCode = 400
        message = `${duplicate[1]} already exist`
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid MongoDb ObjectID, Please provide a valid ID";
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}