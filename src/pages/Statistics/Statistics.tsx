// src/pages/Statistics/Statistics.tsx
import React, {useEffect, useState} from "react";
import {getJobTypeStatApi, getMajorJobTopApi, getMajorSalaryStatApi} from "@/api/statistics";
import {Button, Card, message, Space, Table, Tabs} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {jobTypeMap, majorMap} from "@/types/job";

import PageHeader from "@/components/PageHeader/PageHeader.tsx";
import styles from "@/pages/statistics/statistics.module.css";

// 投诉类型占比
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


const Statistics: React.FC = () => {

  const [jobTypeData, setJobTypeData] = useState<any[]>([]);
  const [majorJobTop5Data, setMajorJobTop5Data] = useState<any[]>([]);
  const [majorSalaryData, setMajorSalaryData] = useState<any[]>([]);
  // const [complaintData, setComplaintData] = useState<any[]>([]);

  const fetchStatistics = async () => {
    try {
      const majorJobRes = await getMajorJobTopApi();
      if (majorJobRes.code === 200) {
        const formattedData = majorJobRes.data.map(item => ({
          ...item,
          major: majorMap[item.major] || item.major,
        }));
        setMajorJobTop5Data(formattedData);
      }
      const jobTypeRes = await getJobTypeStatApi();
      if (jobTypeRes.code === 200) {
        const formattedData = jobTypeRes.data.map(item => ({
          ...item,
          type: jobTypeMap[item.type] || item.type,
        }));
        setJobTypeData(formattedData);
      }
      const majorSalaryRes = await getMajorSalaryStatApi();
      if (majorSalaryRes.code === 200) {
        const formattedData = majorSalaryRes.data.map(item => ({
          ...item,
          major: majorMap[item.major] || item.major,
        }));
        setMajorSalaryData(formattedData);
      }
      // const complaintRes =  await getComplaintStatApi();
      // if (complaintRes.code === 200) {
      //   setComplaintData(complaintRes.data);
      // }
    } catch {
      message.error("数据加载失败");
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const tabs = [
    {
      key: "job",
      label: "岗位统计",
      children: (
        <>
          {/* 图表区 */}
          <div className={styles.jobCharts}>
            {/* 岗位类型占比 */}
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
            {/* 各专业岗位数 Top5 */}
            <Card title="各专业岗位数 Top5">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={majorJobTop5Data}>
                  <XAxis dataKey="major"/>
                  <YAxis/>
                  <Tooltip/>
                  <Legend/>
                  <Bar dataKey="value" name="岗位数量">
                    {majorJobTop5Data.map((_, index) => (
                      <Cell key={index} fill={JOB_BAR_COLORS[index % JOB_BAR_COLORS.length]}/>
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
              <Bar dataKey="value" name="平均薪资（元/月）">
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
                  <Cell key={index} fill={COLORS[index % COLORS.length]}/>
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

