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

// 学生 和 企业 ：密码登录 / 邮箱登录 / 注册 的响应结果
export interface LoginRegisterResponse {
    code: number;
    message: string;
    data: {
        token: string;
    };
}

// 学生密码登录的接口参数
export interface PasswordLoginParams {
    schoolId: string | number;
    studentId: string;
    password: string;
}

// 学生密码登录接口
export const passwordLoginApi = (data: PasswordLoginParams) => {
    return request.post<LoginRegisterResponse>("/auth/student/login", data);
};

// 学生邮箱登录的接口参数
export interface EmailLoginParams {
    email: string;
    code: string;
}

// 学生邮箱登录接口
export const emailLoginApi = (data: EmailLoginParams) => {
    return request.post<LoginRegisterResponse>("/auth/student/email_login", data);
};

// 学生注册的接口参数
export interface RegisterParams {
    school: string;
    studentId: string;
    email: string;
    code: string;
    vCode: string;
}

// 学生注册接口
export const registerApi = (data: RegisterParams) => {
    return request.post<LoginRegisterResponse>("/auth/student/register", data);
};


// 企业密码登录的接口参数
export interface EmployerPasswordLoginParams {
    name: string;
    password: string;
}

// 企业密码登录接口
export const employerPasswordLoginApi = (data: EmployerPasswordLoginParams) => {
    return request.post<LoginRegisterResponse>("/auth/company/login", data);
};

// 企业邮箱登录的接口参数
export interface EmployerEmailLoginParams {
    email: string;
    code: string;
}

// 企业邮箱登录接口
export const employerEmailLoginApi = (data: EmployerEmailLoginParams) => {
    return request.post<LoginRegisterResponse>("/auth/company/email_login", data);
};

// 企业注册的接口参数
export interface EmployerRegisterParams {
    name: string;
    company: string;
    email: string;
    code: string;
    socialCode: string;
    licenseUrl: string;
}

// 企业注册接口
export const employerRegisterApi = (data: EmployerRegisterParams) => {
    return request.post<LoginRegisterResponse>("/auth/company/register", data);
};