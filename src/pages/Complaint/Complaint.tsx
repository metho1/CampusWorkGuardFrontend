// src/pages/Complaint/Complaint.tsx
import PageHeader from "@/components/PageHeader/PageHeader.tsx";
import StatCards from "@/components/StatCards/StatCards.tsx";
import SectionCard from "@/components/SectionCard/SectionCard.tsx";
import {Button, Col, Form, Input, message, Modal, Row, Select, Space, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {useUserStore} from "@/stores/userStore.ts";
import styles from "@/pages/PartTime/partTime.module.css";
import {complaintTypeMap, complaintTypes} from "@/types/complaint.ts";
import CompanyDebounceSelect from "@/components/CompanyDebounceSelect.tsx";
import {
  complaintReplyApi,
  deleteComplaintApi,
  getComplaintListApi,
  processComplaintApi,
  resolveComplaintApi,
  submitComplaintApi
} from "@/api/complaint.ts";

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
  const {user} = useUserStore();
  const isStudent = user?.role === "student";
  const role = user?.role || "";
  // 列表数据及状态
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  // 筛选条件
  const [search, setSearch] = useState("");
  // 分页
  const [page, setPage] = useState(1);
  const pageSize = 5;
  // Modal相关状态
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  // 查看回复 Modal
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyData, setReplyData] = useState<{
    companyDefense?: string;
    resultInfo?: string;
  }>({});

  // 获取投诉列表
  const fetchComplaintList = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await getComplaintListApi({search, page: pageNo, pageSize,});
      if (res.code === 200) {
        setList(res.data.complaints);
        setTotal(res.data.total);
        setPage(pageNo);
      } else {
        message.error(res.message || "获取投诉列表失败");
      }
    } catch (err) {
      message.error("获取投诉列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取初始列表
  useEffect(() => {
    fetchComplaintList(1);
  }, []);

  const onFinish = async (values: any) => {
    const params = {
      title: values.title,
      companyId: values.company.value,
      complaintType: values.type,
    };
    // 提交表单
    try {
      setSubmitting(true);
      const res = await submitComplaintApi(params);
      if (res.code === 200) {
        message.success("投诉提交成功（等待企业和管理员处理）");
        setOpen(false);
        await fetchComplaintList(page);
      } else {
        message.error(res.message || "提交失败");
      }
    } catch (err) {
      message.error("提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  // 撤销投诉
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "确认撤销该投诉？",
      content: "撤销后将无法恢复，请谨慎操作。",
      okText: "确认撤销",
      cancelText: "取消",
      okType: "danger",
      async onOk() {
        try {
          const res = await deleteComplaintApi(id);
          if (res.code === 200) {
            message.success("投诉撤销成功");
            const nextPage = list.length === 1 && page > 1 ? page - 1 : page;
            await fetchComplaintList(nextPage);
          } else {
            message.error(res.message || "撤销失败");
          }
        } catch (err) {
          message.error("撤销失败，请稍后重试");
        }
      },
    });
  };

  // 查看投诉回复
  const handleView = async (id: number) => {
    setReplyOpen(true);
    setReplyData({});
    try {
      const res = await complaintReplyApi(id);
      if (res.code === 200) {
        setReplyData({
          companyDefense: res.data.companyDefense,
          resultInfo: res.data.resultInfo,
        });
      } else {
        message.error(res.message || "获取回复信息失败");
      }
    } catch (err) {
      message.error("获取回复信息失败");
    }
  };

  // 企业答辩
  const handleProcess = (id: number) => {
    Modal.confirm({
      title: "请输入答辩内容",
      content: (
        <Input.TextArea
          autoFocus
          rows={3}
          placeholder="请输入答辩内容"
          onChange={(e) => (window as any)._failInfo = e.target.value}
        />
      ),
      okText: "确认回复",
      cancelText: "取消",
      onOk: async () => {
        const reason = (window as any)._failInfo;
        if (!reason) {
          message.error("请输入答辩内容");
          return Promise.reject();
        }
        const res = await processComplaintApi({
          id,
          companyDefense: reason,
        });
        if (res.code === 200) {
          message.success("已回复投诉");
          setOpen(false);
          fetchComplaintList(page);
        } else {
          message.error(res.message);
        }
      },
    });
  };

  // 管理员判定
  const handleResolve = (id: number) => {
    Modal.confirm({
      title: "请输入判定结果",
      content: (
        <Input.TextArea
          autoFocus
          rows={3}
          placeholder="请输入判定结果"
          onChange={(e) => (window as any)._resultInfo = e.target.value}
        />
      ),
      okText: "确认判定",
      cancelText: "取消",
      onOk: async () => {
        const resultInfo = (window as any)._resultInfo;
        if (!resultInfo) {
          message.error("请输入判定结果");
          return Promise.reject();
        }
        const res = await resolveComplaintApi({
          id,
          resultInfo: resultInfo,
        });
        if (res.code === 200) {
          message.success("已判定投诉");
          setOpen(false);
          fetchComplaintList(page);
        } else {
          message.error(res.message);
        }
      },
    });
  };

  return (
    <>
      <PageHeader
        title="投诉维权中心"
        desc="保障兼职权益，解决劳动纠纷，提供公正处理通道"
        extra={isStudent && (
          <Button type="primary" icon={<PlusOutlined/>} onClick={() => setOpen(true)}>提交新投诉</Button>)}
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
        searchValue={search}
        onSearchChange={setSearch}
        onFilter={() => fetchComplaintList(1)}
        loading={loading}
        columns={[
          {title: "投诉内容", dataIndex: "title"},
          {title: "涉及企业", dataIndex: "company"},
          {
            title: "投诉类型", dataIndex: "complaintType", render: (v: string) => {
              return complaintTypeMap[v] || v;
            },
          },
          {title: "提交时间", dataIndex: "complaintDate"},
          {
            title: "状态",
            dataIndex: "status",
            render: (v: string) => {
              const colorMap: Record<string, string> = {
                submitted: "blue",
                processed: "orange",
                resolved: "green",
              };
              const textMap: Record<string, string> = {
                submitted: "已提交",
                processed: "已受理",
                resolved: "已解决",
              };
              return <Tag color={colorMap[v]}>{textMap[v]}</Tag>;
            },
          },
          {
            title: "操作",
            render: (_: any, row: any) => (
              <Space>
                <a onClick={() => handleView(row.id)}>查看</a>
                {role === "student" && row.status === "submitted" && (
                  <a onClick={() => handleDelete(row.id)}>撤销</a>
                )}
                {role === "company" && row.status === "submitted" && (
                  <a onClick={() => handleProcess(row.id)}>答辩</a>
                )}
                {role === "admin" && row.status === "processed" && (
                  <a onClick={() => handleResolve(row.id)}>判定</a>
                )}
              </Space>
            )
          }
        ]}
        dataSource={list}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: fetchComplaintList,
        }}
      />

      <Modal
        title="提交新投诉"
        open={open} // 控制显示隐藏
        onCancel={() => {
          setOpen(false)
        }} // 点击取消按钮或遮罩层的回调
        footer={null} // 使用表单内按钮替代默认按钮
        mask={{blur: false}} // 遮罩效果
        width={700}
        destroyOnHidden // 关闭时销毁内容，重开时重置表单
        maskClosable={false} // 点击蒙层不关闭
        /* Modal 内容内部滚动，而不是页面滚动 */
        bodyStyle={{
          maxHeight: '60vh',
          overflowY: 'auto',
          paddingRight: 12,
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="投诉内容" rules={[{required: true, message: "请输入投诉内容"}]}>
            <Input placeholder="请输入投诉内容" maxLength={80} disabled={!isStudent}/>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="company" label="投诉企业" rules={[{required: true, message: "请选择投诉企业"}]}>
                <CompanyDebounceSelect/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="type" label="投诉类型" rules={[{required: true, message: "请选择投诉类型"}]}>
                <Select placeholder="请选择投诉类型" options={complaintTypes} disabled={!isStudent}/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <div className={styles.footer}>
              <Button onClick={() => setOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交投诉
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="投诉回复详情"
        open={replyOpen}
        onCancel={() => setReplyOpen(false)}
        footer={null}
        mask={{blur: false}}
        width={600}
        destroyOnHidden
        maskClosable={false}
      >
        <Form layout="vertical">
          <Form.Item label="企业回复">
            <div style={{whiteSpace: "pre-wrap"}}>
              {replyData.companyDefense || "暂未回复"}
            </div>
          </Form.Item>

          <Form.Item label="管理员回复">
            <div style={{whiteSpace: "pre-wrap"}}>
              {replyData.resultInfo || "暂未回复"}
            </div>
          </Form.Item>
        </Form>
      </Modal>


    </>
  );
};

export default Complaint;