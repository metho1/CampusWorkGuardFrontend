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
  regionName: string; // 工作地点名称
  address: string; // 详细地址
  shift: string; // 工作时段
  experience: string; // 经验要求
}

// 发布岗位、修改岗位、删除岗位、审核岗位 接口的响应结果
export interface createJobResponse {
  code: number;
  message: string;
  data: null;
}

// 发布岗位接口
export const createJobApi = (data: createJobParams) => {
  return request.post<createJobResponse>("/company_user/add_job", data);
};

// 修改岗位接口的请求参数
export interface updateJobParams extends createJobParams {
  id: number; // 岗位ID
}

// 修改岗位接口
export const updateJobApi = (data: updateJobParams) => {
  return request.post<createJobResponse>("/company_user/update_job", data);
};

// 获取/筛选 岗位列表接口的请求参数
export interface getJobListParams {
  search: string; // 搜索岗位名称/企业名称
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

// 获取某个岗位详细信息接口的响应数据
export interface jobDetailParams extends createJobParams {
  status: string; // 审核状态
  failInfo: string; // 驳回原因
}

// 获取某个岗位详细信息接口的响应结果
export interface getJobDetailResponse {
  code: number;
  message: string;
  data: jobDetailParams;
}

// 获取某个岗位详细信息接口
export const getJobDetailApi = (id: number) => {
  return request.get<getJobDetailResponse>("/company_user/job_info", {
    params: {id},
  });
};

// 删除某个岗位信息接口
export const deleteJobApi = (id: number) => {
  return request.get<createJobResponse>("/company_user/delete_job", {
    params: {id},
  });
};

// 管理员获取/筛选 岗位列表接口的响应结果
export interface adminGetJobListResponse {
  code: number;
  message: string;
  data: {
    total: number; // 总岗位数
    jobs: Array<{
      id: number; // 岗位ID
      company: string; // 企业名称
      name: string; // 岗位名称
      type: string; // 岗位类型
      salary: number; // 薪资标准
      salaryUnit: string; //薪资单位
      status: string; // 岗位状态
      createdAt: string; // 创建时间
    }>;
  };
}

// 管理员获取/筛选 岗位列表接口
export const adminGetJobListApi = (data: getJobListParams) => {
  return request.post<adminGetJobListResponse>("/admin_user/job_list", data);
}

// 管理员审核岗位接口的请求参数
export interface auditJobParams {
  id: number; // 岗位ID
  status: "approved" | "rejected"; // 审核操作
  failInfo: string; // 驳回原因，action为approved时为空，rejected时必填
}

// 管理员审核岗位接口
export const auditJobApi = (data: auditJobParams) => {
  return request.post<createJobResponse>("/admin_user/review_job", data);
};

// 学生 获取/筛选 工作岗位列表接口的请求参数
export interface studentGetJobListParams {
  search: string; // 搜索岗位名称
  region: string; // 工作地点
  major: string; // 专业要求
  salaryOrder: string; // 薪资排序 ASC/DESC/空
  page: number; // 页码，从1开始
  pageSize: number; // 每页数量
}

// 学生 获取/筛选 工作岗位列表接口的响应结果
export interface studentGetJobListResponse {
  code: number;
  message: string;
  data: {
    total: number; // 总岗位数
    jobs: Array<{
      id: number; // 岗位ID
      company: string; // 企业名称
      name: string; // 岗位名称
      type: string; // 岗位类型
      salary: number; // 薪资标准
      salaryUnit: string; //薪资单位
      regionName: string; // 工作地点名称
      major: string; // 专业要求
    }>;
  };
}

// 学生 获取/筛选 工作岗位列表接口
export const studentGetJobListApi = (data: studentGetJobListParams) => {
  return request.post<studentGetJobListResponse>("/student_user/job_match_list", data);
};

// 学生申请某个岗位接口
export const applyJobApi = (id: number) => {
  return request.get<createJobResponse>("/student_user/apply_job", {
    params: {id},
  });
};