// src/api/admin.ts
import request from "./request";

// 获取/筛选 企业列表接口的请求参数
export interface getCompanyListParams {
  search: string; // 搜索企业名称
  status: string; // 认证状态
  page: number; // 页码，从1开始
  pageSize: number; // 每页数量
}

// 获取/筛选 企业列表接口的响应结果
export interface getCompanyListResponse {
  code: number;
  message: string;
  data: {
    total: number; // 总企业数
    companys: Array<{
      id: number; // 企业ID
      company: string; // 企业名称
      name: string; // 注册人姓名
      email: string; // 注册人邮箱
      socialCode: string; // 社会信用代码
      licenseUrl: string; // 营业执照URL
      verifyStatus: string; // 认证状态 pending/verified/unverified
    }>;
  };
}

// 获取/筛选 企业列表接口
export const getCompanyListApi = (data: getCompanyListParams) => {
  return request.post<getCompanyListResponse>("/admin_user/company_list", data);
};

// 评审公司认证状态接口的请求参数
export interface reviewCompanyParams {
  id: number; // 公司ID
  status: "verified" | "unverified"; // 审核操作
  failInfo: string; // 驳回原因，action为approved时为空，rejected时必填
}

// 评审公司认证状态接口的响应结果
export interface reviewCompanyResponse {
  code: number;
  message: string;
  data: null;
}

// 评审公司认证状态接口
export const reviewCompanyApi = (data: reviewCompanyParams) => {
  return request.post<reviewCompanyResponse>("/admin_user/review_company", data);
};