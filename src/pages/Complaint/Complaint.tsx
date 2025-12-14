// src/pages/Complaint/Complaint.tsx
import PageHeader from "@/components/PageHeader/PageHeader.tsx";
import StatCards from "@/components/StatCards/StatCards.tsx";
import PageTabs from "@/components/PageTabs/PageTabs.tsx";
import PageTable from "@/components/PageTable/PageTable.tsx";
import {Button, Space, Tag} from "antd";
import React from "react";
import {PlusOutlined} from "@ant-design/icons";

const Complaint: React.FC = () => {
  return (
    <>
      <PageHeader
        title="投诉维权中心"
        desc="保障兼职权益，解决劳动纠纷，提供公正处理通道"
        extra={<Button type="primary" icon={<PlusOutlined/>}>提交新投诉</Button>}
      />

      <StatCards
        list={[
          {title: "我的投诉总数", value: 3, extra: {text: "近30天新增1起", type: "info"}},
          {title: "处理中投诉", value: 1, extra: {text: "已受理，等待企业响应", type: "warning", icon: "loading"}},
          {title: "已解决投诉", value: 2, extra: {text: "满意度 100%", type: "success", icon: "check"}},
          {title: "平均处理时长", value: "2.5天", extra: {text: "较平台平均快 1.2 天", type: "info"}}
        ]}
      />

      <PageTabs tabs={["我的投诉", "维权指南", "处理流程", "投诉统计"]}/>

      <PageTable
        placeholder="搜索投诉内容"
        columns={[
          {title: "投诉标题", dataIndex: "title"},
          {title: "涉及企业", dataIndex: "company"},
          {title: "投诉类型", dataIndex: "type"},
          {title: "提交时间", dataIndex: "date"},
          {
            title: "状态",
            dataIndex: "status",
            render: (v: string) => <Tag color="orange">{v}</Tag>
          },
          {
            title: "操作", dataIndex: "operation", render: (_, record) => (
              <Space size="middle">
                <a>Invite</a>
                <a>Delete</a>
              </Space>
            ),
          },
        ]}
        dataSource={[
          {
            id: 1,
            title: "未按时发放工资",
            company: "科技创新有限公司",
            type: "薪资纠纷",
            date: "2024-05-10",
            status: "处理中"
          }
        ]}
      />

    </>
  );
};

export default Complaint;
