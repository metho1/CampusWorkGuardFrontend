// src/components/LoginForm/LoginForm.tsx
import React, {useState} from "react";
import {Button, Checkbox, Form, Input, message, Select, Tabs} from "antd";
// import {PhoneOutlined} from "@ant-design/icons";
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {loginApi, sendCodeApi} from "@/api/auth.ts";

const {TabPane} = Tabs;
const {Option} = Select;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

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

  const sendCode = async () => {
    message.success("验证码已发送");
    await sendCodeApi();
  };

  return (
    <>
      <Tabs defaultActiveKey="jobSeeker" centered>
        <TabPane tab="我要找工作" key="jobSeeker"/>
        <TabPane tab="我要招聘" key="employer"/>
      </Tabs>

      <Form onFinish={onFinish} layout="vertical">
        {/* 选择学校 */}
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
          <Input
            size="large"
            placeholder=" 密码"
            prefix={<LockOutlined/>}
            type="password"
            // suffix={
            //   <Button type="link" onClick={sendCode}>
            //     发送验证码
            //   </Button>
            // }
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
        {/* 邮箱验证码登录 / 去注册 */}
        <div
          style={{
            marginTop: 6,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button type="link" style={{padding: 0}}>
            忘记密码？
          </Button>
          <Button type="link" style={{padding: 0}}>
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
      </Form>
    </>
  );
};

export default LoginForm;
