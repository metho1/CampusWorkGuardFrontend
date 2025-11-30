// src/components/LoginForm/LoginForm.tsx
import React, {useState} from "react";
import {Button, Checkbox, Form, Input, message, Tabs} from "antd";
import {EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined, UserOutlined} from '@ant-design/icons';
import {emailLoginApi, passwordLoginApi,registerApi} from "@/api/auth.ts";
import SchoolDebounceSelect from "@/components/SchoolDebounceSelect.tsx";
import SendCodeButton from "@/components/SendCodeButton.tsx";
import {useSearchParams} from "react-router-dom";

const {TabPane} = Tabs;

const LoginForm: React.FC = () => {
  // 根据 URl 中 type 参数来决定渲染哪个 Form 表单内容，请求哪个接口（password / email / register）
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("type") || "password"; // 默认密码登录
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 表单实例
  const [form] = Form.useForm();

  // 提交表单
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      let res;

      if (mode === "email") { // 邮箱 + 验证码 登录
        res = await emailLoginApi({
          email: values.email,
          code: values.code,
        });
      } else if (mode === "password") { // 学校 + 学号 + 密码 登录
        res = await passwordLoginApi({
          schoolId: values.school.value, // 从 Select 取 schoolId
          studentId: values.studentId,
          password: values.password,
        });
      }else if(mode === "register"){
        res = await registerApi({
          school: values.school.label, // 从 Select 取 school 名称
          studentId: values.studentId,
          email: values.email,
          code: values.code,
          vCode: values.vCode,
        });
      }

      // 统一处理响应结果
      if (res.code === 200) {
        message.success(mode === "register" ? "注册成功" : "登录成功");
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

  return (
    <>
      {/* 顶部 tab */}
      <Tabs defaultActiveKey="jobSeeker" centered>
        <TabPane tab="我要找工作" key="jobSeeker"/>
        <TabPane tab="我要招聘" key="employer"/>
      </Tabs>

      <Form form={form} onFinish={onFinish} layout="vertical">
        {/* ---------- 密码登录模式 ---------- */}
        {mode === "password" && (
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
              <Button type="link" onClick={() => setSearchParams({type: "email"})} style={{padding: 0}}>
                邮箱登录
              </Button>
              <Button type="link" onClick={() => setSearchParams({type: "register"})} style={{padding: 0}}>
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
        {/* ---------- 邮箱登录模式 ---------- */}
        {mode === "email" && (
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
                    role="login"
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
              <Button type="link" onClick={() => setSearchParams({type: "password"})} style={{padding: 0}}>
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
                    role="register"
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
              <Button type="link" onClick={() => setSearchParams({type: "password"})} style={{padding: 0}}>
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
