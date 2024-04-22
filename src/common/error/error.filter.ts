import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { Response } from "express";

@Catch(ZodError, Prisma.PrismaClientKnownRequestError)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    switch (true) {
      case exception instanceof ZodError:
        response.status(400).json({
          message: fromZodError(exception).toString(),
          error: "Validation error",
          statusCode: 400,
        });
        break;
      case exception instanceof Prisma.PrismaClientKnownRequestError:
        this.handlePrismaError(exception, response);
        break;
      default:
        response.status(500).json({
          message: exception.message,
          error: "Internal server error",
          statusCode: 500,
        });
    }
  }

  private handlePrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
    response: Response,
  ) {
    const prismaErrorResponseMap = {
      P2002: {
        message:
          "There is a unique constraint violation, a new row cannot be created in the database.",
        error: "Database error",
        statusCode: 400,
      },
      P2003: {
        message:
          "Cannot delete or update a parent row: a foreign key constraint fails.",
        error: "Database error",
        statusCode: 400,
      },
    };

    const errorResponse = prismaErrorResponseMap[exception.code] || {
      message: exception.message,
      statusCode: 500,
    };

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
