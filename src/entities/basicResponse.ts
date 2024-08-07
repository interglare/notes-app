export class BasicResponse<T> {
    data: T | null;
    error: boolean;
    message: string;
    statusCode: number;

    constructor(data: T, error: boolean, message: string, statusCode: number);
    constructor(error: boolean, message: string, statusCode: number);

    constructor(dataOrError: T | boolean, errorOrMessage: boolean | string, messageOrStatusCode: string | number, statusCode?: number) {
        if (typeof dataOrError === 'boolean') {
            this.data = null;
            this.error = dataOrError;
            this.message = errorOrMessage as string;
            this.statusCode = messageOrStatusCode as number;
        } else {
            this.data = dataOrError;
            this.error = errorOrMessage as boolean;
            this.message = messageOrStatusCode as string;
            this.statusCode = statusCode!;
        }
    }
}
