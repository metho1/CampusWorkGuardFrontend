// src/api/auth.ts
import request from "./request";

// 发送验证码的接口参数
export interface SendCodeParams {
    role: "login" | "register";
    email: string;
}

// 发送验证码的响应结果
export interface SendCodeResponse {
    code: number;
    message: string;
    data: null;
}

// 发送验证码接口
// POST /auth/send-code
export const sendCodeApi = (data:SendCodeParams) => {
    return request.post<SendCodeResponse>("/auth/send_code",data);
};

// 密码登录的接口参数
export interface PasswordLoginParams {
    schoolId: string | number;
    studentId: string;
    password: string;
}

// 密码登录的响应结果
export interface PasswordLoginResponse {
    code: number;
    message: string;
    data: null;
}

// 密码登录接口
export const passwordLoginApi = (data: PasswordLoginParams) => {
    return request.post<PasswordLoginResponse>("/auth/student/login", data);
};

// 邮箱登录的接口参数
export interface EmailLoginParams {
    email: string;
    code: string;
}

// 邮箱登录的响应结果
export interface EmailLoginResponse {
    code: number;
    message: string;
    data: null;
}

// 邮箱登录接口
export const emailLoginApi = (data: EmailLoginParams) => {
    return request.post<EmailLoginResponse>("/auth/student/email_login", data);
};

// 注册的接口参数
export interface RegisterParams {
    school: string;
    studentId: string;
    email: string;
    code: string;
    vCode: string;
}

// 注册的响应结果
export interface RegisterResponse {
    code: number;
    message: string;
    data: null;
}

// 注册接口
export const registerApi = (data: RegisterParams) => {
    return request.post<RegisterResponse>("/auth/student/register", data);
};
