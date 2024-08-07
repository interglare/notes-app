export class BasicServiceResponse<T> {
    data: T | null;
    error: boolean;
    message: string;

    constructor(data: T, error: boolean, message: string);
    constructor(error: boolean, message: string);
    constructor(data: T);

    constructor(dataOrError: T | boolean, errorOrMessage?: boolean | string, message?: string) {
        if (typeof dataOrError === 'boolean') {
            this.data = null;
            this.error = dataOrError as boolean;
            this.message = errorOrMessage as string;
        } else {
            this.data = dataOrError;
            this.error = errorOrMessage as boolean;
            this.message = message!;
        }
    }
}
