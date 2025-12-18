// src/pages/Match/Match.tsx
import React, {useEffect, useState} from "react";
import {Button, Cascader, Col, Form, Input, InputNumber, message, Modal, Row, Select, Space, Tag} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import PageHeader from "@/components/PageHeader/PageHeader";
import SectionCard from "@/components/SectionCard/SectionCard";
import {getJobDetailApi, studentGetJobListApi} from "@/api/job";
import type {DefaultOptionType} from "antd/es/cascader";
import {fetchLocationApi} from "@/api/location";
import styles from "@/pages/PartTime/partTime.module.css";

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

// 专业要求单选
const majors = [
  {label: "不限专业", value: "ANY"},
  {label: "计算机类", value: "CS"},
  {label: "电子信息类", value: "EI"},
  {label: "机械类", value: "ME"},
  {label: "土木类", value: "CE"},
  {label: "自动化类", value: "AU"},
  {label: "电气类", value: "EE"},
  {label: "化工与制药类", value: "CEP"},
  {label: "材料类", value: "MT"},
  {label: "数学类", value: "MA"},
  {label: "物理类", value: "PH"},
  {label: "化学类", value: "CH"},
  {label: "生物科学类", value: "BS"},
  {label: "工商管理类", value: "BA"},
  {label: "经济学类", value: "EC"},
  {label: "金融学类", value: "FN"},
  {label: "会计学类", value: "AC"},
  {label: "中国语言文学类", value: "CL"},
  {label: "新闻传播学类", value: "JC"},
  {label: "历史学类", value: "HS"},
  {label: "法学类", value: "LW"},
  {label: "临床医学类", value: "CM"},
  {label: "护理学类", value: "NS"},
  {label: "药学类", value: "PHAR"},
  {label: "农学类", value: "AG"},
  {label: "林学类", value: "FO"},
  {label: "美术学类", value: "FA"},
  {label: "音乐与舞蹈学类", value: "MD"},
  {label: "戏剧与影视学类", value: "TF"}
];
// 专业映射表
const majorMap: Record<string, string> = majors.reduce((map, item) => {
  map[item.value] = item.label;
  return map;
}, {} as Record<string, string>);

const Match: React.FC = () => {
  // ===== 列表状态 =====
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  // ===== 筛选条件 =====
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [major, setMajor] = useState("");
  const [salaryOrder, setSalaryOrder] = useState<"" | "ASC" | "DESC">("");
  // ===== 分页 =====
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // ===== 详情 Modal =====
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [regionOptions, setRegionOptions] = useState<DefaultOptionType[]>([]);

  // ===== 获取岗位列表 =====
  const fetchList = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await studentGetJobListApi({search, region, major, salaryOrder, page: pageNo, pageSize,});
      if (res.code === 200) {
        setList(res.data.jobs);
        setTotal(res.data.total);
        setPage(pageNo);
      } else {
        message.error(res.message || "获取岗位失败");
      }
    } catch {
      message.error("获取岗位失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(1);
  }, []);

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
    console.log([...provinces]);
    console.log(codes);

    // 回填表单
    form.setFieldValue("region", codes);
  };

  // ===== 查看详情 =====
  const handleView = async (id: number) => {
    try {
      setOpen(true);
      const res = await getJobDetailApi(id);
      if (res.code === 200) {
        const data = res.data;
        form.setFieldsValue({
          name: data.name,
          type: data.type,
          salary: data.salary,
          salaryUnit: data.salaryUnit,
          salaryPeriod: data.salaryPeriod,
          content: data.content,
          headcount: data.headcount,
          major: data.major,
          address: data.address,
          shift: data.shift,
          experience: data.experience,
        });
        await fillRegionForEdit(data.region); // 回填省市区
      } else {
        message.error(res.message);
      }
    } catch {
      message.error("获取岗位详情失败");
    }
  };

  return (
    <>
      <PageHeader
        title="智能匹配"
        desc="根据你的条件筛选最合适的工作岗位"
      />

      {/* ===== 筛选区（扩展 SectionCard）===== */}
      <SectionCard
        searchPlaceholder="搜索岗位名称"
        searchValue={search}
        onSearchChange={setSearch}
        onFilter={() => fetchList(1)}
        loading={loading}
        columns={[
          {title: "企业名称", dataIndex: "company"},
          {title: "岗位名称", dataIndex: "name"},
          {
            title: "岗位类型",
            dataIndex: "type",
            render: (v: string) =>
              ({"part-time": "兼职", intern: "实习", "full-time": "全职"}[v] || "-"),
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
          {title: "工作地点", dataIndex: "region"},
          {title: "专业要求", dataIndex: "major", render: (v: string) => majorMap[v] || "-"},
          {
            title: "操作",
            render: (_: any, row: any) => (
              <a onClick={() => handleView(row.id)}>查看详情</a>
            ),
          },
        ]}
        dataSource={list}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: fetchList,
        }}
      />

      {/* ===== 额外筛选控件（城市 / 专业 / 薪资排序）===== */}
      <Space style={{marginTop: 12}}>
        <Select
          placeholder="选择城市"
          value={region}
          onChange={setRegion}
          style={{width: 140}}
        />
        <Select
          placeholder="选择专业"
          value={major}
          onChange={setMajor}
          options={majors}
          style={{width: 140}}
        />
        <Button
          icon={<ArrowUpOutlined/>}
          type={salaryOrder === "ASC" ? "primary" : "default"}
          onClick={() => setSalaryOrder("ASC")}
        >
          薪资升序
        </Button>
        <Button
          icon={<ArrowDownOutlined/>}
          type={salaryOrder === "DESC" ? "primary" : "default"}
          onClick={() => setSalaryOrder("DESC")}
        >
          薪资降序
        </Button>
        <Button onClick={() => {
          setSalaryOrder("");
          fetchList(1);
        }}>
          清除排序
        </Button>
      </Space>

      {/* ===== 岗位详情 Modal（只读）===== */}
      <Modal
        title="岗位详情"
        open={open}
        onCancel={() => setOpen(false)}
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
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="岗位名称" rules={[{required: true, message: "请输入岗位名称"}]}>
                <Input placeholder="请输入清晰的岗位名称" maxLength={80} disabled/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="type" label="岗位类型" rules={[{required: true, message: "请选择岗位类型"}]}>
                <Select placeholder="请选择岗位类型" options={jobTypes} disabled/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="薪资标准" rules={[{required: true, message: "请输入薪资标准"}]}>
                <Space.Compact style={{width: "100%"}}>
                  <Form.Item name="salary" noStyle>
                    <InputNumber style={{width: "70%"}} min={0} placeholder="请输入薪资数额" disabled/>
                  </Form.Item>
                  <Form.Item name="salaryUnit" noStyle initialValue="hour">
                    <Select style={{width: "30%"}} options={salaryUnits} disabled/>
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="salaryPeriod" label="薪资发放周期" rules={[{required: true, message: "请选择发放周期"}]}>
                <Select placeholder="请选择发放周期" options={salaryPeriods} disabled/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="content" label="工作内容" rules={[{required: true, message: "请填写工作内容和职责"}]}>
            <TextArea rows={6} placeholder="请详细描述工作内容、职责、注意事项等" disabled/>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="headcount" label="招聘人数" rules={[{required: true, message: "请输入招聘人数"}]}>
                <InputNumber placeholder="请输入招聘人数" min={1} style={{width: "100%"}} disabled/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="major" label="专业要求" rules={[{required: true, message: "请选择专业要求"}]}>
                <Select defaultValue="不限专业" options={majors} disabled/>
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
                  disabled
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="address"
                label="详细地址"
                rules={[{required: true, message: "请输入详细地址"}]}
              >
                <Input placeholder="例如 xx街道 xx大厦" disabled/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="shift" label="工作时段" rules={[{required: true, message: "请选择工作时段"}]}>
                <Select placeholder="请选择工作时段" options={workShifts} disabled/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="experience" label="经验要求" rules={[{required: true, message: "请选择经验要求"}]}>
                <Select placeholder="请选择经验要求" options={experiences} disabled/>
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
              <Button onClick={() => setOpen(false)}>取消</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Match;
