// src/api/job.ts
import request from "./request";

// 发布岗位接口的请求参数
export interface createJobParams {
  name: string; // 岗位名称
  type: string; // 岗位类型
  salary: number; // 薪资标准
  salaryUnit: string; //薪资单位
  salaryPeriod: string; //薪资发放周期
  content: string; // 工作内容
  headcount: number; //招聘人数
  major: string; // 专业要求
  region: string; // 工作地点
  address: string; // 详细地址
  shift: string; // 工作时段
  experience: string; // 经验要求
  // pictureList: string //岗位图片列表
}

// 发布岗位接口的响应结果
export interface createJobResponse {
  code: number;
  message: string;
  data: null;
}

// 发布岗位接口
export const createJobApi = (data: createJobParams) => {
  return request.post<createJobResponse>("/company_user/post_job", data);
};

// 获取/筛选 岗位列表接口的请求参数
export interface getJobListParams {
  search: string; // 搜索岗位名称关键字
  type: string; // 岗位类型
  status: string; // 岗位状态
  page: number; // 页码，从1开始
  pageSize: number; // 每页数量
}

// 获取/筛选 岗位列表接口的响应结果
export interface getJobListResponse {
  code: number;
  message: string;
  data: {
    total: number; // 总岗位数
    jobs: Array<{
      id: number; // 岗位ID
      name: string; // 岗位名称
      type: string; // 岗位类型
      salary: number; // 薪资标准
      salaryUnit: string; //薪资单位
      status: string; // 岗位状态
      createdAt: string; // 创建时间
    }>;
  };
}

// 获取/筛选 岗位列表接口
export const getJobListApi = (data: getJobListParams) => {
  return request.post<getJobListResponse>("/company_user/job_list", data);
};