import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function handleError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
        console.error(`Erro [${error.code}]: ${error.message}`);
        return null;
    }

    console.log(error);
    return null;
}