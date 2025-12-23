// src/api/company.ts
import request from "./request";

export interface companyListResponse {
  code: number;
  message: string;
  data: Array<{ companyId: string | number; company: string }>;
}

/**
 * 企业搜索接口
 * GET /company?search=xxx
 */
export const fetchCompanyApi = (search: string) => {
  return request.get<companyListResponse>("/company", {
    params: { search },
  });
};
