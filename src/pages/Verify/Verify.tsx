// src/pages/Verify/Verify.tsx
import React, {useEffect, useState} from "react";
import {Button, Image, Input, message, Modal, Select, Space, Tag} from "antd";
import PageHeader from "@/components/PageHeader/PageHeader";
import SectionCard from "@/components/SectionCard/SectionCard";
import {getCompanyListApi, reviewCompanyApi} from "@/api/admin";
import {resolveUrl} from "@/config.ts";
import {FilterOutlined} from "@ant-design/icons";

const Verify: React.FC = () => {
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

  // 获取企业列表
  const fetchCompanyList = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await getCompanyListApi({search, status, page: pageNo, pageSize,});
      if (res.code === 200) {
        setList(res.data.companys);
        setTotal(res.data.total);
        setPage(pageNo);
      } else {
        message.error(res.message || "获取企业列表失败");
      }
    } catch {
      message.error("获取企业列表失败");
    } finally {
      setLoading(false);
    }
  };
  // 初始获取企业列表
  useEffect(() => {
    fetchCompanyList(1);
  }, []);

  // 审核通过
  const handleApprove = (id: number) => {
    Modal.confirm({
      title: "确认通过该企业认证？",
      content: "通过后企业将获得完整功能权限。",
      okText: "确认通过",
      cancelText: "取消",
      async onOk() {
        const res = await reviewCompanyApi({
          id,
          status: "verified",
          failInfo: "",
        });
        if (res.code === 200) {
          message.success("企业认证已通过");
          await fetchCompanyList(page);
        } else {
          message.error(res.message || "操作失败");
        }
      },
    });
  };

  // 审核不通过
  const handleReject = (id: number) => {
    let reason = "";
    Modal.confirm({
      title: "请输入驳回原因",
      content: (
        <Input.TextArea
          autoFocus
          rows={3}
          placeholder="请输入认证失败原因"
          onChange={(e) => (reason = e.target.value)}
        />
      ),
      okText: "确认驳回",
      cancelText: "取消",
      async onOk() {
        if (!reason) {
          message.error("请输入驳回原因");
          return Promise.reject();
        }
        const res = await reviewCompanyApi({
          id,
          status: "unverified",
          failInfo: reason,
        });
        if (res.code === 200) {
          message.success("已驳回企业认证");
          await fetchCompanyList(page);
        } else {
          message.error(res.message || "操作失败");
        }
      },
    });
  };

  return (
    <>
      <PageHeader
        title="企业认证审核"
        desc="管理员审核企业注册信息，确保平台企业真实性"
      />

      <SectionCard
        searchPlaceholder="搜索企业名称"
        searchValue={search}
        onSearchChange={setSearch}
        onFilter={() => fetchCompanyList(1)}
        loading={loading}
        filters={
          <>
            <Select
              style={{width: 120}}
              value={status}
              onChange={setStatus}
              options={[
                {label: "所有状态", value: ""},
                {label: "审核中", value: "pending"},
                {label: "已通过", value: "verified"},
                {label: "已驳回", value: "unverified"},
              ]}
            />
            <Button icon={<FilterOutlined/>} onClick={() => fetchCompanyList(1)}>
              筛选
            </Button>
          </>
        }
        columns={[
          {title: "企业名称", dataIndex: "company"},
          {title: "注册人姓名", dataIndex: "name"},
          {title: "企业邮箱", dataIndex: "email"},
          {title: "社会信用代码", dataIndex: "socialCode"},
          {
            title: "营业执照",
            dataIndex: "licenseUrl",
            render: (url: string) =>
              url ? (
                <Image
                  src={resolveUrl(url)}
                  width={60}
                  preview={{mask: "查看"}}
                />
              ) : (
                "-"
              ),
          },
          {
            title: "状态",
            dataIndex: "verifyStatus",
            render: (v: string) => (
              <Tag color={{pending: "orange", verified: "green", unverified: "red"}[v]}>
                {{pending: "审核中", verified: "已通过", unverified: "已驳回"}[v]}
              </Tag>
            ),
          },
          {
            title: "操作",
            render: (_: any, row: any) =>
              row.verifyStatus === "pending" ? (
                <Space>
                  <a onClick={() => handleApprove(row.id)}>通过</a>
                  <a style={{color: "#ff4d4f"}} onClick={() => handleReject(row.id)}>
                    不通过
                  </a>
                </Space>
              ) : (
                "-"
              ),
          },
        ]}
        dataSource={list}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: fetchCompanyList,
        }}
      />
    </>
  );
};

export default Verify;
