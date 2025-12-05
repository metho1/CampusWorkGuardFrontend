// src/components/LoginForm/LoginForm.tsx
import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, Input, message, Spin, Tabs, Upload} from "antd";
import {
  ApartmentOutlined,
  AuditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  emailLoginApi,
  employerEmailLoginApi,
  employerPasswordLoginApi,
  employerRegisterApi,
  passwordLoginApi,
  registerApi
} from "@/api/auth.ts";
import SchoolDebounceSelect from "@/components/SchoolDebounceSelect.tsx";
import SendCodeButton from "@/components/SendCodeButton.tsx";
import {useSearchParams} from "react-router-dom";

const {TabPane} = Tabs;

const LoginForm: React.FC = () => {
  // 当前 tab：jobSeeker / employer
  const [activeTab, setActiveTab] = useState("jobSeeker");
  // 根据 URl 中 type 参数来决定渲染哪个 Form 表单内容，请求哪个接口
  // 学生端：password / email / register 企业端：employer-password / employer-email / employer-register
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("type") || "password"; // 默认密码登录
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 表单实例
  const [form] = Form.useForm();
  // 提交表单
  const onFinish = async (values: any) => {
    if (!values.agree) {
      message.warning("请勾选用户协议和隐私政策");
      return;
    }
    try {
      setLoading(true);
      let res;
      // 学生端
      if (activeTab === "jobSeeker") {
        if (mode === "password") { // 学校 + 学号 + 密码 登录
          res = await passwordLoginApi({
            schoolId: values.school.value, // 从 Select 取 schoolId
            studentId: values.studentId,
            password: values.password,
          });
        } else if (mode === "email") { // 邮箱 + 验证码 登录
          res = await emailLoginApi({
            email: values.email,
            code: values.code,
          });
        } else if (mode === "register") {
          res = await registerApi({
            school: values.school.label, // 从 Select 取 school 名称
            studentId: values.studentId,
            email: values.email,
            code: values.code,
            vCode: values.vCode,
          });
        }
      }
      // 企业端
      if (activeTab === "employer") {
        if (mode === "employer-password") { // 姓名 + 密码 登录
          res = await employerPasswordLoginApi({
            name: values.name,
            password: values.password,
          });
        } else if (mode === "employer-email") { // 邮箱 + 验证码 登录
          res = await employerEmailLoginApi({
            email: values.email,
            code: values.code,
          });
        } else if (mode === "employer-register") {
          res = await employerRegisterApi({
            name: values.name,
            company: values.company,
            email: values.email,
            code: values.code,
            socialCode: values.socialCode,
            licenseUrl: values.licenseUrl, // 图片地址
          });
        }
      }

      // 统一处理响应结果
      if (res.code === 200) {
        message.success("登录成功");
        window.location.href = "/home"; // 跳转
        // TODO: 保存 token
      } else {
        message.error(res.message || "登录失败");
      }
      return;
    } catch (e) {
      message.error("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };
  // 切换 mode 时，重置表单
  useEffect(() => {
    form.resetFields();
  }, [mode, activeTab]);
  // 渲染学生端表单
  const renderJobSeekerForm = () => {
    return (
      <>
        {/* ---------- 密码登录模式 ---------- */}
        {mode === "password" && (
          <>
            {/* 学校 */}
            <Form.Item name="school" rules={[{required: true, message: "请选择学校"}]}>
              <SchoolDebounceSelect/>
            </Form.Item>
            {/* 学号 */}
            <Form.Item name="studentId" rules={[{required: true, message: "请输入学号"}]}>
              <Input size="large" prefix={<UserOutlined/>} placeholder=" 学号"/>
            </Form.Item>
            {/* 密码 */}
            <Form.Item name="password" rules={[{required: true, message: "请输入密码"}]}>
              <Input.Password size="large" placeholder=" 密码" prefix={<LockOutlined/>}
                              iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}/>
            </Form.Item>
            {/* 登录按钮 */}
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>登录</Button>
            {/* 表单底部操作 */}
            <div style={{marginTop: 6, display: "flex", justifyContent: "space-between"}}>
              <Button type="link" onClick={() => setSearchParams({type: "email"})} style={{padding: 0}}>
                邮箱登录
              </Button>
              <Button type="link" onClick={() => setSearchParams({type: "register"})} style={{padding: 0}}>
                没有账号？去注册
              </Button>
            </div>
          </>
        )}
        {/* ---------- 邮箱登录模式 ---------- */}
        {mode === "email" && (
          <>
            {/* 邮箱 */}
            <Form.Item name="email" rules={[
              {required: true, message: "请输入邮箱"},
              {type: "email", message: "邮箱格式不正确"},
            ]}>
              <Input size="large" prefix={<MailOutlined/>} placeholder=" 邮箱"/>
            </Form.Item>
            {/* 验证码 */}
            <Form.Item name="code" rules={[{required: true, message: "请输入验证码"}]}>
              <Input size="large" placeholder="验证码"
                     suffix={<SendCodeButton getEmail={() => form.getFieldValue("email")} role="login"/>}/>
            </Form.Item>
            {/* 登录按钮 */}
            <Button type="primary" htmlType="submit" size="large" block>邮箱登录</Button>
            {/* 返回密码登录 */}
            <div style={{marginTop: 6}}>
              <Button type="link" onClick={() => setSearchParams({type: "password"})} style={{padding: 0}}>
                密码登录
              </Button>
            </div>
          </>
        )}
        {/* ---------- 注册模式 ---------- */}
        {mode === "register" && (
          <Spin spinning={loading} tip="正在验证学信网信息..." size="large">
            <>
              {/* 学校 */}
              <Form.Item name="school" rules={[{required: true, message: "请选择学校"}]}>
                <SchoolDebounceSelect/>
              </Form.Item>
              {/* 学号 */}
              <Form.Item name="studentId" rules={[{required: true, message: "请输入学号"}]}>
                <Input size="large" prefix={<UserOutlined/>} placeholder=" 学号"/>
              </Form.Item>
              {/* 邮箱 */}
              <Form.Item name="email" rules={[
                {required: true, message: "请输入邮箱"},
                {type: "email", message: "邮箱格式不正确"},
              ]}>
                <Input size="large" prefix={<MailOutlined/>} placeholder=" 邮箱"/>
              </Form.Item>
              {/* 邮箱验证码 */}
              <Form.Item name="code" rules={[{required: true, message: "请输入验证码"}]}>
                <Input size="large" placeholder="验证码"
                       suffix={<SendCodeButton getEmail={() => form.getFieldValue("email")} role="register"/>}/>
              </Form.Item>
              {/* 学信网在线验证码 */}
              <Form.Item name="vCode" rules={[{required: true, message: "请输入学信网在线验证码"}]}>
                <Input size="large" prefix={<AuditOutlined/>} placeholder=" 学信网在线验证码"/>
              </Form.Item>
              {/*loading={loading} disabled={loading}*/}
              <Button type="primary" htmlType="submit" size="large" block>
                {/*{loading ? "正在验证中..." : "注册"}*/}
                注册
              </Button>
              {/* 用户协议勾选 */}
              <Form.Item style={{margin: 6, textAlign: "center"}} name="agree" valuePropName="checked">
                <Checkbox/>
                <span style={{marginLeft: 8, fontSize: 12, color: "#666"}}>我已阅读并同意《用户协议》《隐私政策》</span>
              </Form.Item>
              {/* 返回密码登录 */}
              <Button type="link" onClick={() => setSearchParams({type: "password"})} style={{padding: 0}}>
                已有账号？返回登录
              </Button>
            </>
          </Spin>
        )}
      </>
    );
  };

  // 渲染企业端表单
  const renderEmployerForm = () => {
    return (
      <>
        {/* ---------- 密码登录模式 ---------- */}
        {mode === "employer-password" && (
          <>
            {/* 姓名 */}
            <Form.Item name="name" rules={[{required: true, message: "请选择姓名"}]}>
              <Input size="large" prefix={<UserOutlined/>} placeholder=" 姓名"/>
            </Form.Item>
            {/* 密码 */}
            <Form.Item name="password" rules={[{required: true, message: "请输入密码"}]}>
              <Input.Password size="large" placeholder=" 密码" prefix={<LockOutlined/>}
                              iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}/>
            </Form.Item>
            {/* 登录按钮 */}
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>登录</Button>
            {/* 表单底部操作 */}
            <div style={{marginTop: 6, display: "flex", justifyContent: "space-between"}}>
              <Button type="link" onClick={() => setSearchParams({type: "employer-email"})} style={{padding: 0}}>
                邮箱登录
              </Button>
              <Button type="link" onClick={() => setSearchParams({type: "employer-register"})} style={{padding: 0}}>
                没有账号？去注册
              </Button>
            </div>
          </>
        )}
        {/* ---------- 邮箱登录模式 ---------- */}
        {mode === "employer-email" && (
          <>
            {/* 邮箱 */}
            <Form.Item name="email" rules={[
              {required: true, message: "请输入邮箱"},
              {type: "email", message: "邮箱格式不正确"},
            ]}>
              <Input size="large" prefix={<MailOutlined/>} placeholder=" 企业邮箱"/>
            </Form.Item>
            {/* 验证码 */}
            <Form.Item name="code" rules={[{required: true, message: "请输入验证码"}]}>
              <Input size="large" placeholder="验证码"
                     suffix={<SendCodeButton getEmail={() => form.getFieldValue("email")} role="login"/>}/>
            </Form.Item>
            {/* 登录按钮 */}
            <Button type="primary" htmlType="submit" size="large" block>邮箱登录</Button>
            {/* 返回密码登录 */}
            <div style={{marginTop: 6}}>
              <Button type="link" onClick={() => setSearchParams({type: "employer-password"})} style={{padding: 0}}>
                密码登录
              </Button>
            </div>
          </>
        )}
        {/* ---------- 注册模式 ---------- */}
        {mode === "employer-register" && (
          <Spin spinning={loading} tip="正在验证企业信息..." size="large">
            <>
              {/* 姓名 */}
              <Form.Item name="name" rules={[{required: true, message: "请输入姓名"}]}>
                <Input size="large" prefix={<UserOutlined/>} placeholder=" 姓名"/>
              </Form.Item>
              {/* 公司名称 */}
              <Form.Item name="company" rules={[{required: true, message: "请输入公司名称"}]}>
                <Input size="large" prefix={<ApartmentOutlined/>} placeholder=" 公司"/>
              </Form.Item>
              {/* 企业邮箱 */}
              <Form.Item name="email" rules={[
                {required: true, message: "请输入企业邮箱"},
                {type: "email", message: "邮箱格式不正确"},
              ]}>
                <Input size="large" prefix={<MailOutlined/>} placeholder=" 企业邮箱"/>
              </Form.Item>
              {/* 邮箱验证码 */}
              <Form.Item name="code" rules={[{required: true, message: "请输入验证码"}]}>
                <Input size="large" placeholder="验证码"
                       suffix={<SendCodeButton getEmail={() => form.getFieldValue("email")} role="register"/>}/>
              </Form.Item>
              {/* 统一社会信用代码 */}
              <Form.Item name="socialCode" rules={[{required: true, message: "请输入统一社会信用代码"}]}>
                <Input size="large" prefix={<AuditOutlined/>} placeholder=" 统一社会信用代码"/>
              </Form.Item>
              {/* 营业执照 */}
              <Form.Item name="licenseUrl" rules={[{required: true, message: "请上传营业执照"}]}>
                <Upload name="file" action='https://10.83.173.178:8080/api/auth/company/upload_license'
                        listType="picture" maxCount={1} accept="image/*"
                        onChange={(info) => {
                          const {status, response} = info.file;
                          if (status === "uploading") return;
                          if (status === "done") {
                            if (response?.code === 200) {
                              const url = response.data; // 后端返回的图片地址
                              message.success("上传成功");
                              // 填入表单字段 licenseUrl（存 URL）
                              form.setFieldsValue({
                                licenseUrl: url
                              });
                            } else {
                              message.error("上传失败：" + (response?.message || ""));
                            }
                          }
                          if (status === "error") {
                            message.error("上传失败，请重试");
                          }
                        }}>
                  <Button icon={<UploadOutlined/>}>上传营业执照</Button>
                </Upload>
              </Form.Item>
              {/*loading={loading} disabled={loading}*/}
              <Button type="primary" htmlType="submit" size="large" block>
                {/*{loading ? "正在验证中..." : "注册"}*/}
                注册
              </Button>
              {/* 用户协议勾选 */}
              <Form.Item style={{margin: 6, textAlign: "center"}} name="agree" valuePropName="checked">
                <Checkbox/>
                <span style={{marginLeft: 8, fontSize: 12, color: "#666"}}>我已阅读并同意《用户协议》《隐私政策》</span>
              </Form.Item>
              {/* 返回密码登录 */}
              <Button type="link" onClick={() => setSearchParams({type: "employer-password"})} style={{padding: 0}}>
                已有账号？返回登录
              </Button>
            </>
          </Spin>
        )}
      </>
    );
  };


  return (
    <>
      {/* 顶部 tab */}
      {/*defaultActiveKey="jobSeeker"*/}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          // 切换 Tab 时，切换到对应默认模式
          setSearchParams(
            key === "jobSeeker"
              ? {type: "password"}
              : {type: "employer-password"}
          );
        }}
        centered
      >
        <TabPane tab="我要找工作" key="jobSeeker"/>
        <TabPane tab="我要招聘" key="employer"/>
      </Tabs>

      <Form form={form} onFinish={onFinish} layout="vertical">
        {activeTab === "jobSeeker" && renderJobSeekerForm()}
        {activeTab === "employer" && renderEmployerForm()}
      </Form>
    </>
  );
};

export default LoginForm;
