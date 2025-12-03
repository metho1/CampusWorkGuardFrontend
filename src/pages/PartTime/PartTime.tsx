// src/pages/PartTime/PartTime.tsx
import React, {useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Space, Tag, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import type {UploadFile} from "antd/es/upload/interface";
import styles from "./partTime.module.css";

const {TextArea} = Input;

// 岗位类型单选: 兼职/临时、实习、全职（兼岗）
const jobTypes = [
  {label: "兼职/临时", value: "part-time"},
  {label: "实习", value: "intern"},
  {label: "全职", value: "full-time"},
];
// 薪资单位单选: 元/小时、元/天、元/月
const salaryUnits = [
  {label: "元/小时", value: "yuan/hour"},
  {label: "元/天", value: "yuan/day"},
  {label: "元/月", value: "yuan/month"},
];
// 薪资发放周期单选: 按小时、按天、按周、按月
const salaryPeriods = [
  {label: "按小时", value: "hour"},
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
// 专业要求多选: 不限专业、计算机类、设计类、金融类
const majors = [
  {label: "不限专业", value: "any"},
  {label: "计算机类", value: "cs"},
  {label: "设计类", value: "design"},
  {label: "金融类", value: "finance"},
];
// 经验要求单选: 无经验、1年以内、1-3年、3年以上
const experiences = [
  {label: "无经验", value: "none"},
  {label: "1年以内", value: "1"},
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
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  // 打开/关闭 Modal
  const showModal = () => setOpen(true);
  const hideModal = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
  };

  // 图片上传处理（这里只做本地预览，不上传）
  const handleUploadChange = ({fileList: nextFileList}: { fileList: UploadFile[] }) => {
    setFileList(nextFileList);
  };

  // 前端关键词检测
  const checkForbiddenKeywords = (values: any) => {
    const combinedText = `${values.title ?? ""} ${values.content ?? ""}`.toLowerCase();
    return forbiddenKeywords.find((kw) => combinedText.includes(kw.toLowerCase()));
  };

  const onFinish = async (values: any) => {
    // values: { title, type, content, headcount, major, location, shift, salary, salaryUnit, salaryPeriod, ... }
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

    // 组装图片（这里只返回本地 base64 或服务器 URL）
    // TODO: 如果需要上传到服务器，请在这里实现上传逻辑并替换图片 URL 列表
    // const images = (fileList || []).map((f) => f.url || f.thumbUrl || f.name);

    // 模拟提交
    try {
      setSubmitting(true);
      // TODO: 调用后端 API，示例：
      // await api.createJob({ ...values, images });
      await new Promise((res) => setTimeout(res, 1200)); // simulate latency

      message.success("岗位发布提交成功（后台将在 24 小时内审核）");
      hideModal();
    } catch (err) {
      console.error(err);
      message.error("提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  // 上传前检查文件类型/大小（示例：限制 5MB）
  const beforeUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("仅支持图片文件");
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 >= 5) {
      message.error("图片必须小于 5MB");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <>
      <div className={styles.header}>
        <Button type="primary" onClick={showModal}>
          发布新岗位
        </Button>
      </div>

      {/* TODO: 在这里放置岗位列表、筛选、审核等 UI（后续实现） */}
      <div className={styles.listBox}>
        兼职岗位列表（后续实现）
      </div>

      <Modal
        title="发布新岗位"
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
              <Form.Item name="title" label="岗位名称" rules={[{required: true, message: "请输入岗位名称"}]}>
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
              <Form.Item name="salary" label="薪资标准" rules={[{required: true, message: "请输入薪资标准"}]}>
                <Space.Compact style={{width: "100%"}}>
                  <InputNumber style={{width: "70%"}} min={0} placeholder="请输入薪资数额"/>
                  {/*<Input defaultValue="Xihu District, Hangzhou" />*/}
                  <Select style={{width: "30%"}} defaultValue="元/小时" options={salaryUnits}/>
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
            <Col span={8}>
              <Form.Item name="headcount" label="招聘人数" rules={[{required: true, message: "请输入招聘人数"}]}>
                <InputNumber placeholder="请输入招聘人数" min={1} style={{width: "100%"}}/>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="major" label="专业要求" rules={[{required: true, message: "请选择专业要求"}]}>
                <Select defaultValue="不限专业" options={majors}/>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="location" label="工作地点" rules={[{required: true, message: "请输入工作地点"}]}>
                <Input placeholder="例如：武汉市洪山区某某街道"/>
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
              <Form.Item name="experience" label="经验要求">
                <Select placeholder="请选择经验要求" options={experiences}/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="岗位相关图片（最多 6 张）">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              multiple
              accept="image/*"
              onPreview={async (file) => {
                const src = file.url || (file.thumbUrl as string);
                const imgWindow = window.open(src);
                imgWindow?.document.write(`<img src="${src}" />`);
              }}
            >
              {fileList.length >= 6 ? null : (
                <div>
                  <PlusOutlined/>
                  <div style={{marginTop: 8}}>上传</div>
                </div>
              )}
            </Upload>
            <div className={styles.uploadTip}>
              建议宽 1200px，支持 jpg / png，单张不超过 5MB
            </div>
          </Form.Item>

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
                发布岗位
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PartTime;