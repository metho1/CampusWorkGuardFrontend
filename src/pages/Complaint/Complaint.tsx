// src/pages/Complaint/Complaint.tsx
import PageHeader from "@/components/PageHeader/PageHeader.tsx";
import StatCards from "@/components/StatCards/StatCards.tsx";
import SectionCard from "@/components/SectionCard/SectionCard.tsx";
import {Button, Space, Tag} from "antd";
import React from "react";
import {PlusOutlined} from "@ant-design/icons";

const cardList = [
  {id: 1, value: 3, extra: 1},
  {id: 2, value: 1, extra: 0},
  {id: 3, value: 2, extra: 100},
  {id: 4, value: 2.5, extra: 1.2}
];

const cardMap = Object.fromEntries(
  cardList.map(item => [item.id, item])
);

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
          {
            title: "我的投诉总数",
            value: cardMap[1]?.value,
            extra: {text: `近30天新增 ${cardMap[1]?.extra} 起`, type: "info"}
          },
          {
            title: "处理中投诉",
            value: cardMap[2]?.value,
            extra: {text: "已受理，等待企业响应", type: "warning", icon: "loading"}
          },
          {
            title: "已解决投诉",
            value: cardMap[3]?.value,
            extra: {text: `满意度 ${cardMap[3]?.extra}%`, type: "success", icon: "check"}
          },
          {
            title: "平均处理时长",
            value: `${cardMap[4]?.value} 天`,
            extra: {text: `较平台平均快 ${cardMap[4]?.extra} 天`, type: "info"}
          }
        ]}
      />

      <SectionCard
        searchPlaceholder="搜索投诉内容"
        columns={[
          {title: "投诉标题", dataIndex: "title"},
          {title: "涉及企业", dataIndex: "company"},
          {title: "投诉类型", dataIndex: "type"},
          {title: "提交时间", dataIndex: "date"},
          {
            title: "状态",
            dataIndex: "status",
            render: (v: string) => {
              const colorMap: Record<string, string> = {
                pending: "orange",
                approved: "green",
              };
              const textMap: Record<string, string> = {
                pending: "处理中",
                approved: "已解决",
              };
              return <Tag color={colorMap[v]}>{textMap[v]}</Tag>;
            },
          },
          {
            title: "操作",
            render: () => (
              <Space>
                <a>查看</a>
                <a>撤销</a>
              </Space>
            )
          }
        ]}
        dataSource={[
          {
            id: 1,
            title: "未按时发放工资",
            company: "科技创新有限公司",
            type: "薪资纠纷",
            date: "2024-05-10",
            status: "pending"
          },
          {
            id: 2,
            title: "工作环境不安全",
            company: "建筑发展集团",
            type: "安全问题",
            date: "2024-04-22",
            status: "approved"
          },
          {
            id: 3,
            title: "合同条款不合理",
            company: "市场营销公司",
            type: "合同纠纷",
            date: "2024-03-15",
            status: "pending"
          },
          {
            id: 4,
            title: "无故被解雇",
            company: "零售服务企业",
            type: "劳动争议",
            date: "2024-02-28",
            status: "approved"
          },
          {
            id: 5,
            title: "加班未支付加班费",
            company: "软件开发公司",
            type: "薪资纠纷",
            date: "2024-01-30",
            status: "pending"
          },
          {
            id: 6,
            title: "歧视性待遇",
            company: "餐饮连锁企业",
            type: "工作环境",
            date: "2024-01-10",
            status: "approved"
          }
        ]}
      />
    </>
  );
};

export default Complaint;