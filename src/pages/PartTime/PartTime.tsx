// src/pages/PartTime/PartTime.tsx
import React, {useEffect, useState} from "react";
import {Button, Cascader, Col, Form, Input, InputNumber, message, Modal, Row, Select, Space, Tag} from "antd";
import type {DefaultOptionType} from "antd/es/cascader";
import {PlusOutlined} from "@ant-design/icons";
import styles from "./partTime.module.css";
import {fetchLocationApi} from "@/api/location";
import PageHeader from "@/components/PageHeader/PageHeader.tsx";
import SectionCard from "@/components/SectionCard/SectionCard.tsx";
import {createJobApi, getJobDetailApi, getJobListApi, updateJobApi,deleteJobApi} from "@/api/job";

const {TextArea} = Input;

// 岗位类型单选: 兼职、实习、全职（兼岗）
const jobTypes = [
  {label: "兼职", value: "part-time"},
  {label: "实习", value: "intern"},
  {label: "全职", value: "full-time"},
];
// 薪资单位单选: 元/小时、元/天、元/月
const salaryUnits = [
  {label: "元/小时", value: "hour"},
  {label: "元/天", value: "day"},
  {label: "元/月", value: "month"},
];
// 薪资发放周期单选: 按天、按周、按月
const salaryPeriods = [
  {label: "按天", value: "day"},
  {label: "按周", value: "week"},
  {label: "按月", value: "month"},
];
// 专业要求多选: 不限专业、计算机类、设计类、金融类
const majors = [
  {label: "不限专业", value: "any"},
  {label: "计算机类", value: "cs"},
  {label: "设计类", value: "design"},
  {label: "金融类", value: "finance"},
];
// 工作时段单选: 白班、夜班、轮班
const workShifts = [
  {label: "白班", value: "day"},
  {label: "夜班", value: "night"},
  {label: "轮班", value: "shift"},
];
// 经验要求单选: 无经验、1年以内、1-3年、3年以上
const experiences = [
  {label: "无经验", value: "none"},
  {label: "1年以内", value: "<1"},
  {label: "1-3年", value: "1-3"},
  {label: "3年以上", value: ">3"},
];
// 违规关键词列表（前端检测）: 阻止提交并提示用户修改
const forbiddenKeywords = [
  "高佣金",
  "无门槛高薪",
  "刷单",
  "传销",
  "先交钱",
  "投资收益",
  "兼职刷单",
];

/**
 * PartTime 页面 — 兼职信息发布（UI）
 * 说明：此组件为 UI 实现，提交逻辑（调用后端）请在 onFinish 中实现。
 */
const PartTime: React.FC = () => {
  // 列表数据及状态
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  // 筛选条件
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  // 分页
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Modal相关状态
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [regionOptions, setRegionOptions] = useState<DefaultOptionType[]>([]);

  // 获取岗位列表
  const fetchJobList = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await getJobListApi({search, type, status, page: pageNo, pageSize,});
      if (res.code === 200) {
        setList(res.data.jobs);
        setTotal(res.data.total);
        setPage(pageNo);
      } else {
        message.error(res.message || "获取岗位列表失败");
      }
    } catch (err) {
      console.error(err);
      message.error("获取岗位列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取初始列表
  useEffect(() => {
    fetchJobList(1);
  }, []);

  // 在 Modal 打开时加载省份数据
  const loadProvinces = async () => {
    const res = await fetchLocationApi(""); // keywords 为空，返回全国省份
    if (res.code === 200) {
      setRegionOptions(
        res.data.districts.map((p) => ({
          label: p.name,
          value: p.adcode,
          isLeaf: false,
        }))
      );
    }
  };
  // 加载省/市/区的子级数据
  const loadRegionData = async (selectedOptions: any[]) => {
    const target = selectedOptions[selectedOptions.length - 1];
    target.loading = true;

    const res = await fetchLocationApi(target.label);
    target.loading = false;

    if (res.code === 200) {
      target.children = res.data.districts.map((item) => ({
        label: item.name,
        value: item.adcode,
        isLeaf: selectedOptions.length === 2, // 第三层为区 → 叶子
      }));
    } else {
      target.children = [];
    }

    setRegionOptions([...regionOptions]);
  };

  // 打开/关闭 Modal
  const showCreateModal = async () => {
    setMode("create");
    setEditingJobId(null);
    form.resetFields();
    setOpen(true);
    await loadProvinces(); // 加载省份数据
  };
  const hideModal = () => {
    setOpen(false);
    form.resetFields();
  };

  // 回填省市区（编辑时使用）
  const fillRegionForEdit = async (regionStr: string) => {
    const codes = regionStr.split(",");
    // 加载省
    const provinceRes = await fetchLocationApi("");
    const provinces = provinceRes.data.districts.map((p) => ({
      label: p.name,
      value: p.adcode,
      isLeaf: false,
    }));
    const province = provinces.find(p => p.value === codes[0]);
    // 加载市
    const cityRes = await fetchLocationApi(province!.label);
    province!.children = cityRes.data.districts.map((c) => ({
      label: c.name,
      value: c.adcode,
      isLeaf: false,
    }));

    const city = province!.children.find(c => c.value === codes[1]);

    // 加载区
    const districtRes = await fetchLocationApi(city!.label);
    city!.children = districtRes.data.districts.map((d) => ({
      label: d.name,
      value: d.adcode,
      isLeaf: true,
    }));

    setRegionOptions([...provinces]);

    // 回填表单
    form.setFieldValue("region", codes);
  };


  // 编辑岗位时加载岗位详情
  const handleEdit = async (id: number) => {
    try {
      setMode("edit");
      setEditingJobId(id);
      setOpen(true);

      const res = await getJobDetailApi(id);
      if (res.code === 200) {
        const data = res.data;
        form.setFieldsValue({
          ...data,
        });
        await fillRegionForEdit(data.region); // 回填省市区
      } else {
        message.error(res.message || "获取岗位详情失败");
      }
    } catch (e) {
      message.error("获取岗位详情失败");
    }
  };

  // 删除岗位
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "确认删除该岗位？",
      content: "删除后将无法恢复，请谨慎操作。",
      okText: "确认删除",
      cancelText: "取消",
      okType: "danger",
      async onOk() {
        try {
          const res = await deleteJobApi(id);
          if (res.code === 200) {
            message.success("岗位删除成功");
            // 删除后刷新当前页
            // 如果当前页只剩一条，删完后回到上一页（防止空页）
            const nextPage = list.length === 1 && page > 1 ? page - 1 : page;
            await fetchJobList(nextPage);
          } else {
            message.error(res.message || "删除失败");
          }
        } catch (err) {
          message.error("删除失败，请稍后重试");
        }
      },
    });
  };

  // 前端关键词检测
  const checkForbiddenKeywords = (values: any) => {
    const combinedText = `${values.name ?? ""} ${values.content ?? ""}`.toLowerCase();
    return forbiddenKeywords.find((kw) => combinedText.includes(kw.toLowerCase()));
  };

  const onFinish = async (values: any) => {

    // 违规关键词校验
    const found = checkForbiddenKeywords(values);
    if (found) {
      message.error(`检测到疑似违规关键词：${found}，请修改后再提交`);
      return;
    }

    // 薪资校验（前端占位） — 实际规则会更复杂并由后端判断
    if (values.salary <= 0) {
      message.error("薪资异常");
      return;
    }

    const params = {
      name: values.name,
      type: values.type,
      salary: Number(values.salary),
      salaryUnit: values.salaryUnit,       // hour / day / month
      salaryPeriod: values.salaryPeriod,   // day / week / month
      content: values.content,
      headcount: values.headcount,
      major: values.major,
      region: values.region.toString(), // 处理省 / 市 / 区（Cascader 返回的是数组)
      // 如： ["420000", "420100", "420111"]  转成 "420000,420100,420111"
      address: values.address,
      shift: values.shift,
      experience: values.experience,
    };

    // 提交表单
    try {
      setSubmitting(true);
      const res = mode === "create"
        ? await createJobApi(params)
        : await updateJobApi({id: editingJobId!, ...params});
      if (res.code === 200) {
        message.success(mode === "create" ? "岗位发布提交成功（后台将在 24 小时内审核）" : "岗位修改成功");
        hideModal();
        await fetchJobList(page);
      } else {
        message.error(res.message || "发布失败");
      }
    } catch (err) {
      message.error("提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="兼职信息管理"
        desc="支持企业发布岗位，系统自动校验违规信息，管理员将在 24 小时内完成审核"
        extra={<Button type="primary" icon={<PlusOutlined/>} onClick={showCreateModal}>发布新岗位</Button>}
      />

      <SectionCard
        searchPlaceholder="搜索岗位名称"
        searchValue={search}
        statusValue={status}
        typeValue={type}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTypeChange={setType}
        onFilter={() => fetchJobList(1)}
        loading={loading}
        columns={[
          {title: "岗位名称", dataIndex: "name"},
          {
            title: "岗位类型", dataIndex: "type", render: (v: string) => {
              const map: Record<string, string> = {
                "part-time": "兼职",
                "intern": "实习",
                "full-time": "全职",
              };
              return map[v] || "-";
            },
          },
          {
            title: "薪资", dataIndex: "salary", render: (_: any, row: any) => {
              const map: Record<string, string> = {
                "hour": "元/小时",
                "day": "元/天",
                "month": "元/月",
              };
              return `${row.salary} ${map[row.salaryUnit] || ""}`;
            },
          },
          {title: "创建时间", dataIndex: "createdAt", render: (v: string) => v?.slice(0, 10)},
          {
            title: "状态",
            dataIndex: "status",
            render: (v: string) => {
              const colorMap: Record<string, string> = {
                pending: "orange",
                approved: "green",
                rejected: "red",
              };
              const textMap: Record<string, string> = {
                pending: "审核中",
                approved: "已通过",
                rejected: "已驳回",
              };
              return <Tag color={colorMap[v]}>{textMap[v]}</Tag>;
            },
          },
          {
            title: "操作",
            render: (_: any, row: any) => (
              <Space>
                <a onClick={() => handleEdit(row.id)}>编辑</a>
                <a onClick={() => handleDelete(row.id)}>删除</a>
              </Space>
            )
          }
        ]}
        dataSource={list}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: fetchJobList,
        }}
      />

      <Modal
        title={mode === "create" ? "发布新岗位" : "编辑岗位"}
        open={open} // 控制显示隐藏
        onCancel={hideModal} // 点击取消按钮或遮罩层的回调
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
        className={styles.modal}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="岗位名称" rules={[{required: true, message: "请输入岗位名称"}]}>
                <Input placeholder="请输入清晰的岗位名称" maxLength={80}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="type" label="岗位类型" rules={[{required: true, message: "请选择岗位类型"}]}>
                <Select placeholder="请选择岗位类型" options={jobTypes}/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="薪资标准" rules={[{required: true, message: "请输入薪资标准"}]}>
                <Space.Compact style={{width: "100%"}}>
                  <Form.Item name="salary" noStyle>
                    <InputNumber style={{width: "70%"}} min={0} placeholder="请输入薪资数额"/>
                  </Form.Item>
                  <Form.Item name="salaryUnit" noStyle initialValue="hour">
                    <Select
                      style={{width: "30%"}}
                      options={salaryUnits}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="salaryPeriod" label="薪资发放周期" rules={[{required: true, message: "请选择发放周期"}]}>
                <Select placeholder="请选择发放周期" options={salaryPeriods}/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="content" label="工作内容" rules={[{required: true, message: "请填写工作内容和职责"}]}>
            <TextArea rows={6} placeholder="请详细描述工作内容、职责、注意事项等"/>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="headcount" label="招聘人数" rules={[{required: true, message: "请输入招聘人数"}]}>
                <InputNumber placeholder="请输入招聘人数" min={1} style={{width: "100%"}}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="major" label="专业要求" rules={[{required: true, message: "请选择专业要求"}]}>
                <Select defaultValue="不限专业" options={majors}/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="region"
                label="工作地点（省 / 市 / 区）"
                rules={[{required: true, message: "请选择省市区"}]}
              >
                <Cascader
                  options={regionOptions}
                  loadData={loadRegionData}
                  placeholder="请选择省 / 市 / 区"
                  style={{width: "100%"}}
                  changeOnSelect={false}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="address"
                label="详细地址"
                rules={[{required: true, message: "请输入详细地址"}]}
              >
                <Input placeholder="例如 xx街道 xx大厦"/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="shift" label="工作时段" rules={[{required: true, message: "请选择工作时段"}]}>
                <Select placeholder="请选择工作时段" options={workShifts}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="experience" label="经验要求" rules={[{required: true, message: "请选择经验要求"}]}>
                <Select placeholder="请选择经验要求" options={experiences}/>
              </Form.Item>
            </Col>
          </Row>

          {/* 提示条：前端可提示已检测到的可疑项（占位） */}
          <Form.Item>
            <Space>
              <Tag color="warning">系统将自动进行违规关键词检测</Tag>
              <Tag color="processing">薪资会比对同类平均值</Tag>
              <Tag>管理员将在 24 小时内审核</Tag>
            </Space>
          </Form.Item>

          <Form.Item>
            <div className={styles.footer}>
              <Button onClick={hideModal}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {mode === "create" ? "发布岗位" : "保存修改"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PartTime;