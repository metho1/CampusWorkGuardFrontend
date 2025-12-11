// src/api/location.ts
import request from "./request";

export interface LocationItem {
  adcode : string;// 行政区划代码
  name : string;// 行政区划名称
  level : string;// 行政区划级别（country / province / city / district）
}

export interface LocationResponse {
  code: number;
  message: string;
  data: {
    adcode : string;// 行政区划代码
    name : string;// 行政区划名称
    level : string;// 行政区划级别（country / province / city / district）
    districts: LocationItem[];// 省 / 市 / 区 列表
  };
}

/**
 * 查询行政区划（省 / 市 / 区）
 * GET /location?keywords=xxx
 */
export const fetchLocationApi = (keywords: string) => {
  return request.get<LocationResponse>("/location", {
    params: {keywords},
  });
};
