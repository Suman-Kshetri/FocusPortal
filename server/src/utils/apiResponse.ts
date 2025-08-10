class ApiResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: any;

    constructor(statusCode: number, message: string = 'Success', data: any)
    {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

export { ApiResponse };