// src/components/LoginForm/LoginForm.tsx
import React, {useState} from "react";
import {Button, Checkbox, Form, Input, message, Select, Tabs, Upload} from "antd";
// import {PhoneOutlined} from "@ant-design/icons";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import {loginApi, sendCodeApi} from "@/api/auth.ts";

const {TabPane} = Tabs;

const LoginForm: React.FC = () => {
  // 根据 mode 来决定：渲染哪个 Form 表单内容，渲染哪些按钮（忘记密码 / 去注册 / 返回登录）
  const [mode, setMode] = useState<"login" | "forgot" | "register">("login");

  // 加载状态
  const [loading, setLoading] = useState(false);

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

  // 发送验证码
  const sendCode = async () => {
    message.success("验证码已发送");
    await sendCodeApi();
  };

  return (
    <>
      {/* 顶部 tab */}
      <Tabs defaultActiveKey="jobSeeker" centered>
        <TabPane tab="我要找工作" key="jobSeeker"/>
        <TabPane tab="我要招聘" key="employer"/>
      </Tabs>

      <Form onFinish={onFinish} layout="vertical">
        {/* ---------- 登录模式 ---------- */}
        {mode === "login" && (
          <>
        {/* 学校 */}
          <Form.Item
            name="school"
            rules={[{required: true, message: "请选择学校"}]}
          >
            <Select
              showSearch
              size="large"
              placeholder="学校"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                {
                  value: 'whut',
                  label: '武汉理工大学',
                },
                {
                  value: 'whu',
                  label: '武汉大学',
                },
                {
                  value: 'hust',
                  label: '华中科技大学',
                },
                {
                  value: 'ccnu',
                  label: '华中师范大学',
                },
                {
                  value: 'thu',
                  label: '清华大学',
                },
                {
                  value: 'pku',
                  label: '北京大学',
                },
                {
                  value: 'zju',
                  label: '浙江大学',
                },
              ]}
            />
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
              忘记密码？
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
                  <Button type="link" onClick={sendCode}>
                    发送验证码
                  </Button>
                }
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              邮箱验证码登录
            </Button>
            <div style={{marginTop: 6}}>
              <Button type="link" onClick={() => setMode("login")} style={{padding: 0}}>
                返回登录
              </Button>
            </div>
          </>
        )}
        {/* ---------- 注册模式 ---------- */}
        {mode === "register" && (
          <>
            {/* 学校 */}
            <Form.Item name="school" rules={[{required: true, message: "请选择学校"}]}>
              <Select size="large" placeholder="学校">
              </Select>
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
            <Form.Item name="code" rules={[{required: true,message: "请输入验证码"}]}>
              <Input
                size="large"
                placeholder="验证码"
                suffix={
                  <Button type="link" onClick={sendCode}>
                    发送验证码
                  </Button>
                }
              />
            </Form.Item>
            {/* 上传证件 */}
            <Form.Item name="certificationCode">
              <Upload>
                <Button icon={<UploadOutlined/>}>上传学生证/身份证</Button>
              </Upload>
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
