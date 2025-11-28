// src/api/school.ts
import request from "./request";

export interface SchoolListResponse {
  code: number;
  message: string;
  data: Array<{ Id: string | number; Name: string }>;
}

/**
 * 学校搜索接口
 * GET /school?search=xxx
 */
export const fetchSchoolApi = (search: string) => {
  return request.get<SchoolListResponse>("/school", {
    params: { search },
  });
};
