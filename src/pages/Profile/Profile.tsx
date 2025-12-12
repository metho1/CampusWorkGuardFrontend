// src/pages/Profile/Profile.tsx
import React from "react";
import {Avatar, Button, Card, Form, Input, message, Upload} from "antd";
import {AuditOutlined, EditOutlined, LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import styles from "./profile.module.css";
import {useNavigate} from "react-router-dom";
import {changePasswordApi} from "@/api/user.ts";
import {resolveUrl} from "@/config.ts";

// 假设后端返回的学生信息，你在实际项目中从接口获取
const mockStudentInfo = {
  avatar_url: "https://i.pravatar.cc/150?img=3",
  student_id: "2023001234",
  email: "student@example.com",
};

const mockChsiInfo = {
  name: "王林茜",
  gender: "女",
  birthday: "2003-08-19",
  nation: "汉族",
  school: "华南理工大学",
  level: "本科",
  major: "软件工程",
  duration: "4年",
  college: "计算机学院",
  department: "软件工程系",
  entrance_date: "2021-09-01",
  status: "在籍",
  expected_grad: "2025-06-30",
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  // 修改密码
  const onChangePassword = async (values: any) => {
    const newPassword = values.newPwd;
    try {
      const res = await changePasswordApi({password: newPassword});
      if (res.code === 200) {
        message.success("密码修改成功，请重新登录");
        // 清除登录状态
        localStorage.removeItem("token");
        // 跳转到登录页
        navigate("/login");
      } else {
        // 展示后端的错误提示（密码复杂度不足等）
        message.error(res.message || "修改密码失败");
      }
    } catch (err) {
      message.error("服务器连接失败，请稍后再试");
    }
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
    <Card className={styles.cardWrapper}>
      {/* --------------- 头像区域 --------------- */}
      <div className={styles.avatarWrapper}>
        <Avatar size={100} src={mockStudentInfo?.avatar_url
          ? resolveUrl(mockStudentInfo.avatar_url)
          : "https://i.pravatar.cc/150?img=3"}/>
        <Upload showUploadList={false}>
          <Button
            size="middle"
            shape="circle"
            icon={<EditOutlined/>}
            className={styles.avatarEdit}
          />
        </Upload>
      </div>
      {/* ------------- 个人信息展示（三列） ------------- */}
      <div className={styles.sectionTitle}>个人信息</div>
      <div className={styles.threeCols}>
        <p><UserOutlined/> 姓名：{mockChsiInfo.name}</p>
        <p><MailOutlined/> 性别：{mockChsiInfo.gender}</p>
        <p><AuditOutlined/> 出生日期：{mockChsiInfo.birthday}</p>

        <p><UserOutlined/> 民族：{mockChsiInfo.nation}</p>
        <p><MailOutlined/> 学号：{mockStudentInfo.student_id}</p>
        <p><AuditOutlined/> 邮箱：{mockStudentInfo.email}</p>

        <p><UserOutlined/> 学校：{mockChsiInfo.school}</p>
        <p><MailOutlined/> 专业：{mockChsiInfo.major}</p>
        <p><AuditOutlined/> 层次：{mockChsiInfo.level}</p>

        <p><UserOutlined/> 学制：{mockChsiInfo.duration}</p>
        <p><MailOutlined/> 学院：{mockChsiInfo.college}</p>
        <p><AuditOutlined/> 系所：{mockChsiInfo.department}</p>

        <p><UserOutlined/> 入学日期：{mockChsiInfo.entrance_date}</p>
        <p><MailOutlined/> 预计毕业日期：{mockChsiInfo.expected_grad}</p>
        <p><AuditOutlined/> 学籍状态：{mockChsiInfo.status}</p>
      </div>
      {/* ------------------ 修改密码 ------------------ */}
      <div className={styles.sectionTitle}>修改密码</div>
      <Form form={form} layout="vertical" onFinish={onChangePassword}>
        <div className={styles.twoCols}>
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
        </div>
        <Button type="primary" htmlType="submit" className={styles.button}>确认修改</Button>
      </Form>
    </Card>
  );

};

export default Profile;

