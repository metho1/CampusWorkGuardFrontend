// src/api/application.ts
import request from "./request";

//获取/筛选 担保岗位列表接口的请求参数
export interface getApplicationListParams {
  search: string; // 企业搜索岗位名称 / 管理员搜索企业名称
  status: string; // 担保状态
  page: number; // 页码，从1开始
  pageSize: number; // 每页数量
}

// 获取/筛选 担保岗位列表接口的响应结果
export interface getApplicationListResponse {
  code: number;
  message: string;
  data: {
    total: number; // 总岗位数
    applications: Array<{
      id: number; // 申请信息ID
      name: string; // 岗位名称
      company?: string; // 企业名称（管理员接口返回）
      major: string; // 专业要求
      studentName: string; // 学生姓名
      studentId: string; // 学号
      studentMajor: string; // 学生专业
      salary: number; // 薪资标准
      salaryUnit: string; //薪资单位
      total: number; // 缴纳金额 = 总金额 * 0.5
      salaryPeriod: string; // 薪资发放周期
      status: "unpaid"|"ongoing"|"completed"|"appointment"; // 担保状态
    }>;
  };
}

//企业 获取/筛选 担保岗位列表接口
export const getApplicationListApi = (data: getApplicationListParams) => {
  return request.post<getApplicationListResponse>("/company_user/job_application_list", data);
};

//管理员 获取/筛选 担保岗位列表接口
export const adminGetApplicationListApi = (data: getApplicationListParams) => {
  return request.post<getApplicationListResponse>("/admin_user/job_application_list", data);
}

// 企业 缴纳保障金、支付剩余薪资 接口的请求参数
export interface payDepositParams {
  jobId: number; // 申请信息ID
  deposit: number; // 缴纳金额
}

// 企业 缴纳保障金、支付剩余薪资 接口的响应结果
export interface payDepositResponse {
  code: number;
  message: string;
  data: null;
}

// 企业 缴纳保障金、支付剩余薪资 接口
export const payDepositApi = (data: payDepositParams) => {
  return request.post<payDepositResponse>("/company_user/pay_deposit", data);
};
