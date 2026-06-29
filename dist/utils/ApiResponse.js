"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, data, message = 'Success', meta) {
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        if (meta)
            this.meta = meta;
    }
}
exports.ApiResponse = ApiResponse;
