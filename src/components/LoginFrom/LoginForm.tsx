// src/components/LoginForm/LoginForm.tsx
import React, {useState} from "react";
import {Button, Checkbox, Form, Input, message, Tabs} from "antd";
import {EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined, UserOutlined} from '@ant-design/icons';
import {loginApi} from "@/api/auth.ts";
import SchoolDebounceSelect from "@/components/SchoolDebounceSelect.tsx";
import SendCodeButton from "@/components/SendCodeButton.tsx";

const {TabPane} = Tabs;

const LoginForm: React.FC = () => {
  // 根据 mode 来决定：渲染哪个 Form 表单内容，渲染哪些按钮（忘记密码 / 去注册 / 返回登录）
  const [mode, setMode] = useState<"login" | "forgot" | "register">("login");
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 表单实例
  const [form] = Form.useForm();

  // 提交表单
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await loginApi(values);
      message.success("登录成功");
      // TODO: 保存 token、跳转
    } catch (e) {
      message.error("登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 顶部 tab */}
      <Tabs defaultActiveKey="jobSeeker" centered>
        <TabPane tab="我要找工作" key="jobSeeker"/>
        <TabPane tab="我要招聘" key="employer"/>
      </Tabs>

      <Form form={form} onFinish={onFinish} layout="vertical">
        {/* ---------- 登录模式 ---------- */}
        {mode === "login" && (
          <>
            {/* 学校 */}
            <Form.Item
              name="school"
              rules={[{required: true, message: "请选择学校"}]}
            >
              <SchoolDebounceSelect/>
            </Form.Item>
            {/* 学号 */}
            <Form.Item
              name="studentId"
              rules={[
                {required: true, message: "请输入学号"}
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined/>}
                placeholder=" 学号"
              />
            </Form.Item>
            {/* 密码 */}
            <Form.Item
              name="password"
              rules={[{required: true, message: "请输入密码"}]}
            >
              <Input.Password
                size="large"
                placeholder=" 密码"
                prefix={<LockOutlined/>}
                iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
              />
            </Form.Item>
            {/* 登录按钮 */}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              登录
            </Button>
            {/* 表单底部操作 */}
            <div
              style={{
                marginTop: 6,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button type="link" onClick={() => setMode("forgot")} style={{padding: 0}}>
                邮箱登录
              </Button>
              <Button type="link" onClick={() => setMode("register")} style={{padding: 0}}>
                没有账号？去注册
              </Button>
            </div>
            {/* 用户协议勾选 */}
            <div style={{marginTop: 16, textAlign: "center"}}>
              <Checkbox/>
              <span style={{marginLeft: 8, fontSize: 12, color: "#666"}}>
            我已阅读并同意《用户协议》《隐私政策》
          </span>
            </div>
          </>
        )}
        {/* ---------- 忘记密码模式 ---------- */}
        {mode === "forgot" && (
          <>
            {/* 邮箱 */}
            <Form.Item
              name="email"
              rules={[
                {required: true, message: "请输入邮箱"},
                {type: "email", message: "邮箱格式不正确"},
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined/>}
                placeholder=" 邮箱"
              />
            </Form.Item>
            {/* 验证码 */}
            <Form.Item name="code" rules={[{required: true, message: "请输入验证码"}]}>
              <Input
                size="large"
                placeholder="验证码"
                suffix={
                  <SendCodeButton
                    getEmail={() => form.getFieldValue("email")}
                    role={mode === "register" ? "register" : "login"}
                  />
                }
              />
            </Form.Item>
            {/* 登录按钮 */}
            <Button type="primary" htmlType="submit" size="large" block>
              邮箱登录
            </Button>
            {/* 返回密码登录 */}
            <div style={{marginTop: 6}}>
              <Button type="link" onClick={() => setMode("login")} style={{padding: 0}}>
                密码登录
              </Button>
            </div>
          </>
        )}
        {/* ---------- 注册模式 ---------- */}
        {mode === "register" && (
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
              <Input
                size="large"
                placeholder="验证码"
                suffix={
                  <SendCodeButton
                    getEmail={() => form.getFieldValue("email")}
                    role={mode === "register" ? "register" : "login"}
                  />
                }
              />
            </Form.Item>
            {/* 学信网在线验证码 */}
            <Form.Item name="vCode" rules={[{required: true, message: "请输入学信网在线验证码"}]}>
              <Input size="large" placeholder="学信网在线验证码"/>
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              注册
            </Button>
            <div style={{marginTop: 6}}>
              <Button type="link" onClick={() => setMode("login")} style={{padding: 0}}>
                已有账号？返回登录
              </Button>
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default LoginForm;
