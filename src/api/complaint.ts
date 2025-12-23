// src/api/complaint.ts
import request from "./request";

// 提交投诉接口的请求参数
export interface submitComplaintParams {
  title: string;
  companyId: number; // 企业ID
  complaintType: string; // 投诉类型
}

// 提交投诉 接口的响应结果
export interface normalResponse {
  code: number;
  message: string;
  data: null;
}

// 提交投诉接口
export const submitComplaintApi = (data: submitComplaintParams) => {
  return request.post<normalResponse>("/student_user/submit_complaint", data);
};


// 获取/筛选 投诉列表接口的请求参数
export interface getComplaintListParams {
  search: string; // 投诉内容
  page: number; // 页码，从1开始
  pageSize: number; // 每页数量
}

// 获取/筛选 投诉列表接口的响应结果
export interface getComplaintListResponse {
  code: number;
  message: string;
  data: {
    total: number; // 总岗位数
    complaints: Array<{
      id: number; // 投诉ID
      title: string; // 投诉标题
      company: string; // 企业名称
      complaintType: string; // 投诉类型
      complaintDate: string; // 投诉日期
      status: string; // 投诉状态
    }>;
  };
}

// 获取/筛选 投诉列表接口
export const getComplaintListApi = (data: getComplaintListParams) => {
  return request.post<getComplaintListResponse>("/home/complaint_list", data);
};

// 撤销投诉接口
export const deleteComplaintApi = (id: number) => {
  return request.get<normalResponse>("/student_user/delete_complaint", {
    params: {id},
  });
};

// 查看某条投诉的回复信息接口的响应结果
export interface complaintReplyResponse {
  code: number;
  message: string;
  data: {
      id: number; // 投诉ID
      companyDefense?: string; // 企业答辩内容
      resultInfo?: string; // 管理员回复的结果信息
  };
}

// 查看某条投诉的回复信息接口
export const complaintReplyApi = (id: number) => {
  return request.get<complaintReplyResponse>("/home/complaint_reply", {
    params: {id},
  });
};

// 企业处理学生的维权投诉接口的请求参数
export interface processComplaintResponse {
    id: number; // 投诉ID
    companyDefense: string; // 企业答辩内容
}

// 企业处理学生的维权投诉接口
export const processComplaintApi = (data: processComplaintResponse) => {
  return request.post<normalResponse>("/company_user/process_complaint", data);
};

// 管理员处理申诉，返回结果接口的请求参数
export interface resolveComplaintResponse {
  id: number; // 投诉ID
  resultInfo: string; // 管理员判定回复
}

// 管理员处理申诉，返回结果接口
export const resolveComplaintApi = (data: resolveComplaintResponse) => {
  return request.post<normalResponse>("/admin_user/resolve_complaint", data);
};
