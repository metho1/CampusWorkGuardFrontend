// src/components/LoginForm/LoginForm.tsx
import React, {useState} from "react";
import {Button, Checkbox, Form, Input, message, Tabs} from "antd";
import {PhoneOutlined} from "@ant-design/icons";
import {loginApi, sendCodeApi} from "@/api/auth.ts";

const {TabPane} = Tabs;

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
        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            {required: true, message: "请输入手机号"},
            {pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确"},
          ]}
        >
          <Input
            size="large"
            prefix={<PhoneOutlined/>}
            placeholder="请输入手机号"
          />
        </Form.Item>

        <Form.Item
          name="code"
          label="验证码"
          rules={[{required: true, message: "请输入验证码"}]}
        >
          <Input
            size="large"
            placeholder="短信验证码"
            suffix={
              <Button type="link" onClick={sendCode}>
                发送验证码
              </Button>
            }
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          登录
        </Button>

        <div style={{marginTop: 16, textAlign: "center"}}>
          <Checkbox/>
          <span style={{marginLeft: 8}}>
						    我已阅读并同意《用户协议》《隐私政策》
           </span>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
