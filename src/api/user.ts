// src/api/user.ts
import request from "./request";

// 获取基本信息接口的响应结果
export interface StaticInfoResponse {
  code: number;
  message: string;
  data: {
    name: string;
    avatar_url: string;
  };
}

// 获取基本信息接口
export const getUserStaticInfoApi = () => {
  return request.post<StaticInfoResponse>("/home/static_info");
};