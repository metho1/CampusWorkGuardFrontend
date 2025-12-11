// src/components/SendCodeButton.tsx
import React from "react";
import {Button, message} from "antd";
import useSendCode from "@/hooks/useSendCode";
import type {SendCodeParams} from "@/api/auth";

interface Props {
  /** 获取当前需要发送的 email 值（建议传入 form.getFieldValue 的回调） */
  getEmail: () => string | undefined | null,
  /** login | register */
  role: SendCodeParams["role"],
  /** 可选：倒计时秒数，默认 60 */
  seconds?: number,
  /** 可选：额外在发送前进行校验（例如必须输入 email） */
  validate?: () => boolean,
  className?: string,
}

/**
 * SendCodeButton - 可直接放在 Input 的 suffix 里
 */
const SendCodeButton: React.FC<Props> = ({getEmail, role, seconds = 60, validate, className}) => {
  const {sending, secondsLeft, send} = useSendCode(seconds);

  const handleClick = async () => {
    // 先做本地校验（如果有）
    if (validate && !validate()) {
      return;
    }

    const email = getEmail?.();
    if (!email) {
      message.warning("请先输入邮箱");
      return;
    }

    try {
      const res = await send({role, email});
      if (!res) {
        message.error("发送失败");
        return;
      }

      if (res.code === 200) {
        message.success("验证码发送成功");
      } else {
        // 显示后端 message
        message.error(res.message || "发送失败");
      }
    } catch (err) {
      console.error(err);
      message.error("发送失败，请稍后重试");
    }
  };

  return (
    <Button
      type="link"
      size="small"
      onClick={handleClick}
      disabled={secondsLeft > 0 || sending}
      className={className}
      style={{padding: 0, margin: 0}}
    >
      {secondsLeft > 0 ? `${secondsLeft}s后重发` : (sending ? "发送中..." : "发送验证码")}
    </Button>
  );
};

export default SendCodeButton;
