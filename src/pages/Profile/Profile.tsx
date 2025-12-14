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
  TeamOutlined,
  UserOutlined,
  WomanOutlined
} from "@ant-design/icons";
import styles from "./profile.module.css";
import {useNavigate} from "react-router-dom";
import {
  companyChangePasswordApi,
  type CompanyInfoResponse,
  getCompanyInfoApi,
  getStudentInfoApi,
  studentChangePasswordApi,
  type StudentInfoResponse
} from "@/api/user.ts";
import {resolveUrl} from "@/config.ts";
import {useUserStore} from "@/stores/userStore.ts";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {user} = useUserStore();
  const role = user?.role; // "student" 或 "company"
  const updateAvatar = useUserStore(state => state.updateAvatar);
  const [StudentInfo, setStudentInfo] = useState<StudentInfoResponse["data"] | null>(null);
  const [CompanyInfo, setCompanyInfo] = useState<CompanyInfoResponse["data"] | null>(null);
  // 获取用户信息
  useEffect(() => {
    if (!role) return;
    const fetchProfile = async () => {
      try {
        if (role === "student") {
          const res = await getStudentInfoApi();
          if (res.code === 200) setStudentInfo(res.data);
          else throw new Error();
        } else {
          const res = await getCompanyInfoApi();
          if (res.code === 200) setCompanyInfo(res.data);
          else throw new Error();
        }
      } catch {
        message.error("身份过期，请重新登录");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [role]);
  // 修改密码
  const onChangePassword = async (values: any) => {
    try {
      const api =
        role === "student" ? studentChangePasswordApi : companyChangePasswordApi;
      const res = await api({password: values.newPwd});
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

  const avatarUrl = role === "student" ? StudentInfo?.avatar_url : CompanyInfo?.avatar_url;

  return (
    <Card className={styles.cardWrapper}>
      {/* --------------- 头像区域 --------------- */}
      <div className={styles.avatarWrapper}>
        <Avatar size={100} src={avatarUrl
          ? resolveUrl(avatarUrl)
          : "https://i.pravatar.cc/150?img=3"}/>
        <Upload name="file" showUploadList={false} action='/api/home/upload_avatar'
                headers={{
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }}
                listType="picture" maxCount={1} accept="image/*"
                onChange={(info) => {
                  const {status, response} = info.file;
                  if (status === "uploading") return;
                  if (status === "done") {
                    if (response?.code === 200) {
                      const newUrl = response.data.url; // 后端返回新的头像 URL
                      // 直接更新 userInfo，不刷新页面
                      if (role === "student") {
                        setStudentInfo((prev) =>
                          prev ? {...prev, avatar_url: newUrl} : prev
                        );
                      } else if (role === "company") {
                        setCompanyInfo((prev) =>
                          prev ? {...prev, avatar_url: newUrl} : prev
                        );
                      }
                      // 更新 Home 全局 user
                      updateAvatar(newUrl);
                      message.success("头像上传成功");
                    } else {
                      message.error(response?.message || "上传失败");
                    }
                  }
                  if (status === "error") {
                    message.error("上传失败，请重试");
                  }
                }}>
          <Button size="small" shape="circle" icon={<EditOutlined/>} className={styles.avatarEdit}/>
        </Upload>
      </div>
      {/* ------------- 个人信息展示（三列） ------------- */}
      <div className={styles.sectionTitle}>个人信息</div>
      {/*学生信息*/}
      {role === "student" && (
        <div className={styles.threeCols}>
          <p><UserOutlined/> 姓名：{StudentInfo?.name}</p>
          <p>
            {StudentInfo?.gender === "男" ? <ManOutlined/> : <WomanOutlined/>} 性别：{StudentInfo?.gender}
          </p>
          <p><CalendarOutlined/> 出生日期：{StudentInfo?.birthday}</p>

          <p><FlagOutlined/> 民族：{StudentInfo?.nation}</p>
          <p><IdcardOutlined/> 学号：{StudentInfo?.student_id}</p>
          <p><MailOutlined/> 邮箱：{StudentInfo?.email}</p>

          <p><BankOutlined/> 学校：{StudentInfo?.school}</p>
          <p><ReadOutlined/> 专业：{StudentInfo?.major}</p>
          <p><SolutionOutlined/> 层次：{StudentInfo?.level}</p>

          <p><FieldTimeOutlined/> 学制：{StudentInfo?.duration}</p>
          <p><ApartmentOutlined/> 学院：{StudentInfo?.college}</p>
          <p><ClusterOutlined/> 系所：{StudentInfo?.department}</p>

          <p><LoginOutlined/> 入学日期：{StudentInfo?.entrance_date}</p>
          <p><LogoutOutlined/> 预计毕业日期：{StudentInfo?.expected_grad}</p>
          <p><SafetyCertificateOutlined/> 学籍状态：{StudentInfo?.status}</p>
        </div>
      )}
      {/*企业信息*/}
      {role === "company" && (
        <div className={styles.threeCols}>
          <p><TeamOutlined/> 企业名称：{CompanyInfo?.company}</p>
          <p><UserOutlined/> 联系人：{CompanyInfo?.name}</p>
          <p><MailOutlined/> 企业邮箱：{CompanyInfo?.email}</p>

          {/*<p><BankOutlined/> 所属行业：{userInfo?.industry}</p>*/}
          {/*<p><ApartmentOutlined/> 公司规模：{userInfo?.size}</p>*/}
          {/*<p><ClusterOutlined/> 公司类型：{userInfo?.type}</p>*/}

          {/*<p><FieldTimeOutlined/> 成立日期：{userInfo?.established_date}</p>*/}
          {/*<p><SolutionOutlined/> 注册资本：{userInfo?.registered_capital}</p>*/}
          {/*<p><SafetyCertificateOutlined/> 经营状态：{userInfo?.operation_status}</p>*/}
        </div>
      )}
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

