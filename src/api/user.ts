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