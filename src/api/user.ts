// src/api/user.ts
import request from "./request";

// 获取基本信息接口的响应结果
export interface StaticInfoResponse {
  code: number;
  message: string;
  data: {
    name: string;
    avatar_url: string;
    role: "student" | "company";
    verify_status: "verified" | "unverified" | "pending";
    fail_info?: string;
  };
}

// 获取基本信息接口
export const getUserStaticInfoApi = () => {
  return request.get<StaticInfoResponse>("/home/static_info");
};

// 删除企业用户的注册信息接口
export const deleteEmployerRegisterInfoApi = () => {
  return request.get("/company_user/delete");
}

// 学生修改密码接口的请求参数
export interface ChangePasswordParams {
  password: string;
}

// 学生修改密码接口
export const changePasswordApi = (data: ChangePasswordParams) => {
  return request.post("/student_user/set_password", data);
};

// 获取学生用户信息接口的响应结果
export interface StudentInfoResponse {
  code: number;
  message: string;
  data: {
    avatar_url: string;
    student_id: string;
    email: string;
    name: string;
    gender: string;
    birthday: string;
    nation: string;
    school: string;
    level: string;
    major: string;
    duration: string;
    college: string;
    department: string;
    entrance_date: string;
    status: string;
    expected_grad: string;
  };
}

// 获取学生用户信息接口
export const getStudentInfoApi = () => {
  return request.get<StudentInfoResponse>("/student_user/profile_info");
};