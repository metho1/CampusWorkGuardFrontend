// src/types/complaint.ts

// 投诉类型单选:
export const complaintTypes = [
  {label: "薪资纠纷", value: "salary_dispute"},
  {label: "安全问题", value: "security_issue"},
  {label: "合同纠纷", value: "contract_violation"},
  {label: "劳动争议", value: "labor_dispute"},
  {label: "其他", value: "other"},
];

// 投诉类型映射表
export const complaintTypeMap: Record<string, string> = complaintTypes.reduce((map, item) => {
  map[item.value] = item.label;
  return map;
}, {} as Record<string, string>);