// src/pages/Profile/Profile.tsx
import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Form, Input, message, Upload} from "antd";
import {
  ApartmentOutlined,
  BankOutlined,
  CalendarOutlined,
  ClusterOutlined,
  EditOutlined,
  FieldTimeOutlined,
  FlagOutlined,
  IdcardOutlined,
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  ManOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  UserOutlined,
  WomanOutlined
} from "@ant-design/icons";
import styles from "./profile.module.css";
import {useNavigate} from "react-router-dom";
import {changePasswordApi, getStudentInfoApi, type StudentInfoResponse} from "@/api/user.ts";
import {resolveUrl} from "@/config.ts";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  // 获取学生用户信息
  const [userInfo, setUserInfo] = useState<StudentInfoResponse["data"] | null>(null);
  useEffect(() => {
    getStudentInfoApi().then(res => {
      if (res.code === 200) {
        setUserInfo(res.data);
      } else {
        message.error("身份过期，请重新登录");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }).catch(() => {
      message.error("请先登录");
      navigate("/login");
    });
  }, []);
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
        <Avatar size={100} src={userInfo?.avatar_url
          ? resolveUrl(userInfo?.avatar_url)
          : "https://i.pravatar.cc/150?img=3"}/>
        <Upload showUploadList={false}>
          <Button
            size="small"
            shape="circle"
            icon={<EditOutlined/>}
            className={styles.avatarEdit}
          />
        </Upload>
      </div>
      {/* ------------- 个人信息展示（三列） ------------- */}
      <div className={styles.sectionTitle}>个人信息</div>
      <div className={styles.threeCols}>
        <p><UserOutlined/> 姓名：{userInfo?.name}</p>
        <p>
          {userInfo?.gender === "男" ? <ManOutlined/> : <WomanOutlined/>} 性别：{userInfo?.gender}
        </p>
        <p><CalendarOutlined/> 出生日期：{userInfo?.birthday}</p>

        <p><FlagOutlined/> 民族：{userInfo?.nation}</p>
        <p><IdcardOutlined/> 学号：{userInfo?.student_id}</p>
        <p><MailOutlined/> 邮箱：{userInfo?.email}</p>

        <p><BankOutlined/> 学校：{userInfo?.school}</p>
        <p><ReadOutlined/> 专业：{userInfo?.major}</p>
        <p><SolutionOutlined/> 层次：{userInfo?.level}</p>

        <p><FieldTimeOutlined/> 学制：{userInfo?.duration}</p>
        <p><ApartmentOutlined/> 学院：{userInfo?.college}</p>
        <p><ClusterOutlined/> 系所：{userInfo?.department}</p>

        <p><LoginOutlined/> 入学日期：{userInfo?.entrance_date}</p>
        <p><LogoutOutlined/> 预计毕业日期：{userInfo?.expected_grad}</p>
        <p><SafetyCertificateOutlined/> 学籍状态：{userInfo?.status}</p>
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

