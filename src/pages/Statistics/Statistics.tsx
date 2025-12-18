// src/pages/Statistics/Statistics.tsx
import React, {useState} from "react";
import {Button, Card, DatePicker, Select, Space, Table, Tabs} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
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
const jobTypeData = [
  {type: "兼职", value: 120},
  {type: "实习", value: 80},
  {type: "全职", value: 40},
];

const salaryTrendData = [
  {month: "1月", salary: 120},
  {month: "2月", salary: 135},
  {month: "3月", salary: 150},
  {month: "4月", salary: 148},
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

/** =====================
 * 主组件
 * ===================== */
const Statistics: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [major, setMajor] = useState<string>("ANY");

  const filters = (
    <>
      <RangePicker/>
      <Space>
        <Select
          style={{width: 120}}
          placeholder="选择城市"
          value={city}
          onChange={setCity}
          options={[
            {label: "全部城市", value: ""},
            {label: "武汉", value: "武汉"},
            {label: "北京", value: "北京"},
          ]}
        />
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
          <div className={styles.toolbar}>
            {filters}
          </div>
          {/* 图表区 */}
          <Card title="岗位类型占比">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={jobTypeData} dataKey="value" nameKey="type" label>
                  {jobTypeData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip/>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </>
      ),
    },
    {
      key: "salary",
      label: "学生薪资",
      children: (
        <Card title="平均薪资趋势">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryTrendData}>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line type="monotone" dataKey="salary" name="平均薪资"/>
            </LineChart>
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
            <BarChart data={complaintData}>
              <XAxis dataKey="type"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey="value" name="投诉数量"/>
            </BarChart>
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

