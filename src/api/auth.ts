// src/api/auth.ts
import request from "./request";

export const sendCodeApi = () => {
    return request.get("/auth/send-code");
};

export const loginApi = (data: { phone: string; code: string }) => {
    return request.post("/auth/login", data);
};
