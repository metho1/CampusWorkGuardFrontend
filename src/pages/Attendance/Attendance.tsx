// src/pages/Attendance/Attendance.tsx
import React, {useEffect, useState} from "react";
import {Button, message, Modal, Select, Tag} from "antd";
import PageHeader from "@/components/PageHeader/PageHeader";
import SectionCard from "@/components/SectionCard/SectionCard";
import {getApplicationListApi, payDepositApi, studentGetApplicationListApi} from "@/api/application";
import {FilterOutlined} from "@ant-design/icons";
import {majorMap} from "@/types/job.ts";
import {useUserStore} from "@/stores/userStore.ts";

const Attendance: React.FC = () => {
  const {user} = useUserStore();
  const isStudent = user?.role === "student";
  // 列表数据
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  // 筛选条件
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  // 分页
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // 获取岗位列表
  const fetchApplicationList = async (pageNo = 1) => {
    try {
      setLoading(true);
      const role = user?.role;
      if (!role) return;
      const api = role === "student" ? studentGetApplicationListApi : getApplicationListApi;
      const res = await api({search, status, page: pageNo, pageSize,});
      if (res.code === 200) {
        setList(res.data.applications);
        setTotal(res.data.total);
        setPage(pageNo);
      } else {
        message.error(res.message || "获取岗位列表失败");
      }
    } catch {
      message.error("获取岗位列表失败");
    } finally {
      setLoading(false);
    }
  };
  // 初始获取岗位列表
  useEffect(() => {
    fetchApplicationList(1);
  }, []);

  // 缴纳担保金 / 支付薪资
  const handlePay = (jobId: number, deposit: number, status: string) => {
    const text = status === "unpaid" ? "缴纳担保金" : "支付薪资";
    Modal.confirm({
      title: `确认${text}？`,
      content: `本次操作将${text} ￥${deposit}, 请确认无误后继续。`,
      okText: "确认支付",
      cancelText: "取消",
      async onOk() {
        const res = await payDepositApi({
          jobId,
          deposit,
        });
        if (res.code === 200) {
          message.success("支付成功");
          await fetchApplicationList(page);
        } else {
          message.error(res.message || "支付失败");
        }
      },
    });
  };

  return (
    <>
      <PageHeader
        title="考勤与工作记录"
        desc="记录学生的考勤情况与工作完成情况"
      />

      <SectionCard
        searchPlaceholder={isStudent ? "搜索企业名称" : "搜索岗位名称"}
        searchValue={search}
        onSearchChange={setSearch}
        onFilter={() => fetchApplicationList(1)}
        loading={loading}
        filters={
          <>
            <Select
              style={{width: 120}}
              value={status}
              onChange={setStatus}
              options={[
                {label: "所有状态", value: ""},
                {label: "未缴纳", value: "unpaid"},
                {label: "工作进行中", value: "ongoing"},
                {label: "工作完成", value: "completed"},
                {label: "履约完成", value: "appointment"},
              ]}
            />
            <Button icon={<FilterOutlined/>} onClick={() => fetchApplicationList(1)}>
              筛选
            </Button>
          </>
        }
        columns={[
          ...(isStudent
            ? [{title: "企业名称", dataIndex: "company"}]
            : []),
          {
            title: "岗位名称", dataIndex: "name", render: (_: any, row: any) =>
              <>
                <div>{row.name}</div>
                <div style={{color: "#888", fontSize: 12}}>
                  {majorMap[row.major]}优先
                </div>
              </>,
          },
          {
            title: "学生信息", dataIndex: "studentName", render: (_: any, row: any) =>
              <>
                <div>{row.studentName}({row.studentId})</div>
                <div style={{color: "#888", fontSize: 12}}>
                  {row.studentMajor}
                </div>
              </>,
          },
          {
            title: "状态", dataIndex: "status", render: (v: string) => (
              <Tag color={{unpaid: "orange", ongoing: "green", completed: "green", appointment: "green"}[v]}>
                {{unpaid: "未缴纳", ongoing: "工作进行中", completed: "工作完成", appointment: "履约完成"}[v]}
              </Tag>
            ),
          },
          {
            title: "操作",
            render: (_: any, row: any) =>
              isStudent ? (
                <>
                  {row.status === "ongoing" && (
                    <Button type="link" onClick={() => handlePay(row.id, row.total, row.status)}>
                      打卡
                    </Button>
                  )}
                  <Button type="link" onClick={() => handlePay(row.id, row.total, row.status)}>
                    查看
                  </Button>
                </>
              ) : (
                <>
                  {row.status === "ongoing" && (
                    <Button type="link" onClick={() => handlePay(row.id, row.total, row.status)}>
                      结束
                    </Button>
                  )}
                  <Button type="link" onClick={() => handlePay(row.id, row.total, row.status)}>
                    查看
                  </Button>
                </>
              ),
          },
        ]}
        dataSource={list}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: fetchApplicationList,
        }}
      />
    </>
  );
};

export default Attendance;

