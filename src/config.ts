// src/config.ts
export const BASE_URL = import.meta.env.VITE_BASE_URL as string;

// 拼接头像等静态资源路径
export const resolveUrl = (url?: string) => {
  if (!url) return "";
  // 如果已经是完整的URL 则直接返回
  if (url.startsWith("http")) return url;
  // 否则拼接基础URL返回完整路径
  return `${BASE_URL}${url}`;
};
