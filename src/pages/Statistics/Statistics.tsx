// src/pages/Statistics/Statistics.tsx
import React, {useState} from "react";
import {Button, Card, DatePicker, Select, Space, Table, Tabs} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {majors} from "@/types/job.ts";
import PageHeader from "@/components/PageHeader/PageHeader.tsx";
import styles from "@/pages/statistics/statistics.module.css";

const {RangePicker} = DatePicker;

/** =====================
 * 模拟数据（后续由后端替换）
 * ===================== */

/** 各专业岗位数 Top5 */
const majorJobTop5Data = [
  {major: "计算机科学", value: 160},
  {major: "软件工程", value: 140},
  {major: "信息管理", value: 110},
  {major: "电子信息", value: 95},
  {major: "人工智能", value: 80},
];

/** 各专业平均薪资排名 */
const majorSalaryData = [
  {major: "人工智能", salary: 180},
  {major: "计算机科学", salary: 165},
  {major: "软件工程", salary: 155},
  {major: "电子信息", salary: 145},
  {major: "信息管理", salary: 130},
];

const jobTypeData = [
  {type: "兼职", value: 120},
  {type: "实习", value: 80},
  {type: "全职", value: 40},
];

const complaintData = [
  {type: "拖欠薪资", value: 12},
  {type: "虚假招聘", value: 6},
  {type: "强制加班", value: 4},
];

const reportTableData = [
  {key: 1, name: "月度兼职市场分析报告", time: "2025-04", creator: "系统自动"},
  {key: 2, name: "学生兼职权益保障报告", time: "2025-04", creator: "系统自动"},
];

const COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff4d4f"];
const JOB_BAR_COLORS = [
  "#1677ff",
  "#3c9ae8",
  "#69b1ff",
  "#91caff",
  "#bae0ff",
];
const SALARY_BAR_COLORS = [
  "#722ed1",
  "#9254de",
  "#b37feb",
  "#d3adf7",
  "#efdbff",
];

/** =====================
 * 主组件
 * ===================== */
const Statistics: React.FC = () => {
  const [major, setMajor] = useState<string>("ANY");

  const filters = (
    <>
      <RangePicker/>
      <Space>
        <Select
          style={{width: 120}}
          value={major}
          onChange={setMajor}
          options={majors}
        />
        <Button type="primary">筛选</Button>
      </Space>
    </>
  );

  const tabs = [
    {
      key: "job",
      label: "岗位统计",
      children: (
        <>
          {/* 筛选区 */}
          <div className={styles.toolbar}>{filters}</div>
          {/* 图表区 */}
          <div className={styles.jobCharts}>
            {/* 岗位类型占比 */}
            <Card title="岗位类型占比">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={jobTypeData} dataKey="value" nameKey="type" label>
                    {jobTypeData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            {/* 各专业岗位数 Top5 */}
            <Card title="各专业岗位数 Top5">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={majorJobTop5Data}>
                  <XAxis dataKey="major" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="岗位数量">
                    {majorJobTop5Data.map((_, index) => (
                      <Cell key={index} fill={JOB_BAR_COLORS[index % JOB_BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      ),
    },
    {
      key: "salary",
      label: "学生薪资",
      children: (
        <Card title="各专业平均薪资排名">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={majorSalaryData} layout="vertical">
              <XAxis type="number"/>
              <YAxis type="category" dataKey="major"/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey="salary" name="平均薪资（元/月）">
                {majorSalaryData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={SALARY_BAR_COLORS[index % SALARY_BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      ),
    },
    {
      key: "complaint",
      label: "投诉统计",
      children: (
        <Card title="投诉类型占比">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={complaintData} dataKey="value" nameKey="type" label>
                {complaintData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      ),
    },
    {
      key: "report",
      label: "报表管理",
      children: (
        <Card
          title="统计报表"
          extra={<Button icon={<DownloadOutlined/>}>导出报表</Button>}
        >
          <Table
            columns={[
              {title: "报表名称", dataIndex: "name"},
              {title: "统计周期", dataIndex: "time"},
              {title: "生成方式", dataIndex: "creator"},
              {
                title: "操作",
                render: () => (
                  <Space>
                    <a>导出 Excel</a>
                    <a>导出 PDF</a>
                  </Space>
                ),
              },
            ]}
            dataSource={reportTableData}
            pagination={false}
          />
        </Card>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="数据统计分析"
        desc="对平台核心数据进行汇总统计与可视化分析，辅助管理决策"
      />

      <Card>
        <Tabs items={tabs} className={styles.tabs}/>
      </Card>

    </>

  );
};

export default Statistics;

