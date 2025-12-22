// src/pages/Attendance/Attendance.tsx
import React, {useEffect, useState} from "react";
import {Button, Calendar, message, Modal, Select, Tag,ConfigProvider} from "antd";
import PageHeader from "@/components/PageHeader/PageHeader";
import SectionCard from "@/components/SectionCard/SectionCard";
import {
  attendApi,
  getApplicationListApi,
  getAttendanceCalendarApi,
  studentGetApplicationListApi,
  endJobApi
} from "@/api/application";
import {FilterOutlined} from "@ant-design/icons";
import {majorMap} from "@/types/job.ts";
import {useUserStore} from "@/stores/userStore.ts";
import dayjs from "dayjs";
import zhCN from "antd/locale/zh_CN";
import { Tooltip } from "antd";

interface AttendanceRecord {
  attendance_date: string;
  location: string;
}

const Attendance: React.FC = () => {
  // 日历弹窗状态
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
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

  const handleAttend = async (jobApplicationId: number) => {
    if (!navigator.geolocation) {
      message.error("浏览器不支持定位");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = `${pos.coords.longitude},${pos.coords.latitude}`;
        const res = await attendApi({
          jobApplicationId,
          location,
        });
        if (res.code === 200) {
          message.success("打卡成功");
        } else {
          message.error(res.message || "打卡失败");
        }
      },
      () => {
        message.error("获取定位失败，请检查浏览器权限");
      }
    );
  };

  const handleViewAttendance = async (jobApplicationId: number) => {
    setCalendarOpen(true);
    const res = await getAttendanceCalendarApi(jobApplicationId);
    if (res.code === 200) {
      setAttendanceRecords(res.data);
    } else {
      message.error("获取打卡记录失败");
    }
  };

  const handleFinish = (jobApplicationId: number) => {
    Modal.confirm({
      title: `确认结束工作？`,
      content: `结束工作后，学生将无法继续打卡，请确认无误后继续。`,
      okText: "确认结束",
      cancelText: "取消",
      async onOk() {
        const res = await endJobApi(jobApplicationId);
        if (res.code === 200) {
          message.success("工作已结束");
          await fetchApplicationList(page);
        } else {
          message.error(res.message || "结束工作失败");
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

      <Modal
        title="打卡记录"
        open={calendarOpen}
        footer={null}
        onCancel={() => setCalendarOpen(false)}
      >
        <ConfigProvider locale={zhCN}>
          <Calendar
            fullscreen={false}
            dateCellRender={(date) => {
              const formatted = dayjs(date).format("YYYY-MM-DD");
              const record = attendanceRecords.find(
                item => item.attendance_date === formatted
              );
              if (record) {
                return (
                  <Tooltip title={record.location}>
                    <Tag color="green">已打卡</Tag>
                  </Tooltip>
                );
              }
              return null;
            }}
          />
        </ConfigProvider>
      </Modal>

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
                    <Button type="link" onClick={() => handleAttend(row.id)}>
                      打卡
                    </Button>
                  )}
                  <Button type="link" onClick={() => handleViewAttendance(row.id)}>
                    查看
                  </Button>
                </>
              ) : (
                <>
                  {row.status === "ongoing" && (
                    <Button type="link" onClick={() => handleFinish(row.id)}>
                      结束
                    </Button>
                  )}
                  <Button type="link" onClick={() => handleViewAttendance(row.id)}>
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

