// src/hooks/useSendCode.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { SendCodeParams, SendCodeResponse } from "@/api/auth";
import { sendCodeApi } from "@/api/auth";

/**
 * useSendCode - 负责发送验证码的请求 + 倒计时管理
 *
 * 返回:
 *  - sending: 当前是否正在请求（boolean）
 *  - secondsLeft: 剩余倒计时秒数（number, 0 表示可再次发送）
 *  - send: (params) => Promise<SendCodeResponse | undefined>
 *
 * 默认倒计时：60 秒，可通过 initialSeconds 调整
 */
export function useSendCode(initialSeconds = 60) {
  const [sending, setSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  // 启动倒计时
  const startCountdown = useCallback((seconds = initialSeconds) => {
    setSecondsLeft(seconds);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialSeconds]);

  /**
   * send - 发送验证码（会阻止在倒计时期间重复发送）
   * params: { role: 'login'|'register', email: string }
   */
  const send = useCallback(
    async (params: SendCodeParams): Promise<SendCodeResponse | undefined> => {
      if (sending) return; // 正在请求
      if (secondsLeft > 0) return; // 倒计时未结束

      try {
        setSending(true);
        const res = await sendCodeApi(params); // sendCodeApi 返回 Promise<SendCodeResponse>
        if (res && res.code === 200) {
          // 成功后启动倒计时
          startCountdown();
        }
        return res;
      } catch (err) {
        // 上层会处理提示信息
        throw err;
      } finally {
        setSending(false);
      }
    },
    [sending, secondsLeft, startCountdown]
  );

  return {
    sending,
    secondsLeft,
    send,
  };
}

export default useSendCode;
