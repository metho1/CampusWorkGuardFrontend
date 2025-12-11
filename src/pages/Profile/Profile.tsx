// src/pages/Profile/Profile.tsx
import React from "react";
import {Avatar, Button, Card, Form, Input, message} from "antd";
import {AuditOutlined, LockOutlined, MailOutlined, UserOutlined,} from "@ant-design/icons";
import styles from "./profile.module.css";

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  // 修改密码
  const onChangePassword = (values: any) => {
    message.success("密码修改成功（示例）");
    form.resetFields();
  };
  /** 校验新密码规则 */
  const validateNewPassword = (_: any, value: string) => {
    if (!value) return Promise.reject("请输入新密码");
    if (value.length < 8 || value.length > 64) {
      return Promise.reject("密码长度需在 8 - 64 位之间");
    }
    if (!/[a-zA-Z]/.test(value)) {
      return Promise.reject("密码必须包含字母");
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject("密码必须包含数字");
    }
    return Promise.resolve();
  };

  return (
    <div>
      <div className={styles.row}>
        {/* 左侧：基本信息 */}
        <div className={styles.left}>
          <Card title="基本信息" bordered={false}>
            <div className={styles.avatarBox}>
              <Avatar size={100} src="https://i.pravatar.cc/150?img=3"/>
              <div className={styles.name}>小米科技有限公司</div>
            </div>

            <div className={styles.infoList}>
              <p><UserOutlined/> 用户类型：企业用户</p>
              <p><MailOutlined/> 邮箱：example@company.com</p>
              <p><AuditOutlined/> 社会信用代码：913xxxxxxxxxxxx</p>
            </div>
          </Card>
        </div>

        {/* 右侧：修改密码 */}
        <div className={styles.right}>
          <Card title="修改密码" bordered={false}>
            <Form form={form} layout="vertical" onFinish={onChangePassword}>
              <Form.Item label="新密码" name="newPwd" rules={[{validator: validateNewPassword}]}>
                <Input.Password placeholder="请输入新密码" prefix={<LockOutlined/>}/>
              </Form.Item>

              <Form.Item label="确认新密码" name="confirmPwd" dependencies={["newPwd"]}
                         rules={[
                           {required: true, message: "请再次输入新密码"},
                           ({getFieldValue}) => ({
                             validator(_, value) {
                               if (value && value !== getFieldValue("newPwd")) {
                                 return Promise.reject("两次输入的密码不一致！");
                               }
                               return Promise.resolve();
                             },
                           }),
                         ]}>
                <Input.Password placeholder="请确认新密码" prefix={<LockOutlined/>}/>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  确认修改
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

