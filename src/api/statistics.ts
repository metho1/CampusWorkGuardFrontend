// src/api/statistics.ts
import request from "./request";

/** =====================
 * 岗位类型占比
 * ===================== */
export interface JobTypeStatItem {
  type: string;
  value: number;
}

export interface JobTypeStatResponse {
  code: number;
  message: string;
  data: JobTypeStatItem[];
}

export const getJobTypeStatApi = () => {
  return request.get<JobTypeStatResponse>(
    "/home/job_types"
  );
};

/** =====================
 * 各专业岗位数 Top5
 * ===================== */
export interface MajorJobTopItem {
  major: string;
  value: number;
}

export interface MajorJobTopResponse {
  code: number;
  message: string;
  data: MajorJobTopItem[];
}

export const getMajorJobTopApi = () => {
  return request.get<MajorJobTopResponse>(
    "/home/top5_major_jobs"
  );
};

/** =====================
 * 各专业平均薪资排名
 * ===================== */
export interface MajorSalaryItem {
  major: string;
  value: number;
}

export interface MajorSalaryResponse {
  code: number;
  message: string;
  data: MajorSalaryItem[];
}

export const getMajorSalaryStatApi = () => {
  return request.get<MajorSalaryResponse>(
    "/home/average_salaries_by_major"
  );
};

/** =====================
 * 投诉类型占比
 * ===================== */
export interface ComplaintStatItem {
  type: string;
  value: number;
}

export interface ComplaintStatResponse {
  code: number;
  message: string;
  data: ComplaintStatItem[];
}

export const getComplaintStatApi = () => {
  return request.get<ComplaintStatResponse>(
    "/home/complaint_types"
  );
};