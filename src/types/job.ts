// src/types/job.ts

// 岗位类型单选: 兼职、实习、全职（兼岗）
export const jobTypes = [
  {label: "兼职", value: "part-time"},
  {label: "实习", value: "intern"},
  {label: "全职", value: "full-time"},
];

// 薪资单位单选: 元/小时、元/天、元/月
export const salaryUnits = [
  {label: "元/小时", value: "hour"},
  {label: "元/天", value: "day"},
  {label: "元/月", value: "month"},
];

// 薪资发放周期单选: 按天、按月
export const salaryPeriods = [
  {label: "按天", value: "day"},
  {label: "按月", value: "month"},
];

// 工作时段单选: 白班、夜班、轮班
export const workShifts = [
  {label: "白班", value: "day"},
  {label: "夜班", value: "night"},
  {label: "轮班", value: "shift"},
];

// 经验要求单选: 无经验、1年以内、1-3年、3年以上
export const experiences = [
  {label: "无经验", value: "none"},
  {label: "1年以内", value: "<1"},
  {label: "1-3年", value: "1-3"},
  {label: "3年以上", value: ">3"},
];

// 专业要求单选
export const majors = [
  {label: "不限专业", value: "ANY"},
  {label: "计算机类", value: "CS"},
  {label: "电子信息类", value: "EI"},
  {label: "机械类", value: "ME"},
  {label: "土木类", value: "CE"},
  {label: "自动化类", value: "AU"},
  {label: "电气类", value: "EE"},
  {label: "化工与制药类", value: "CEP"},
  {label: "材料类", value: "MT"},
  {label: "数学类", value: "MA"},
  {label: "物理类", value: "PH"},
  {label: "化学类", value: "CH"},
  {label: "生物科学类", value: "BS"},
  {label: "工商管理类", value: "BA"},
  {label: "经济学类", value: "EC"},
  {label: "金融学类", value: "FN"},
  {label: "会计学类", value: "AC"},
  {label: "中国语言文学类", value: "CL"},
  {label: "新闻传播学类", value: "JC"},
  {label: "历史学类", value: "HS"},
  {label: "法学类", value: "LW"},
  {label: "临床医学类", value: "CM"},
  {label: "护理学类", value: "NS"},
  {label: "药学类", value: "PHAR"},
  {label: "农学类", value: "AG"},
  {label: "林学类", value: "FO"},
  {label: "美术学类", value: "FA"},
  {label: "音乐与舞蹈学类", value: "MD"},
  {label: "戏剧与影视学类", value: "TF"}
];

// 专业映射表
export const majorMap: Record<string, string> = majors.reduce((map, item) => {
  map[item.value] = item.label;
  return map;
}, {} as Record<string, string>);