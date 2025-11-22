// 带防抖的远程搜索下拉选择框

// useState：管理组件内部状态，如 loading、options
// useRef：用于处理异步请求的顺序
// useMemo：缓存防抖后的函数
import React, {useMemo, useRef, useState} from 'react';
import type {SelectProps} from 'antd';
import {Select, Spin} from 'antd'; // Select：Ant Design 下拉选择框
import debounce from 'lodash/debounce'; // debounce：lodash 的防抖函数

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> { // 继承 Antd SelectProps，但排除 options 和 children 属性
  fetchOptions: (search: string) => Promise<ValueType[]>; // API 根据关键字查询数据
  debounceTimeout?: number; // 防抖时间，默认 300ms
}

function DebounceSelect<
  // 泛型，定义Select选项的类型
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({fetchOptions, debounceTimeout = 300, ...props}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false); // 显示loading动画
  const [options, setOptions] = useState<ValueType[]>([]); // 下拉选项数据
  const fetchRef = useRef(0); // 用于标识当前请求，避免异步请求乱序问题

  // 防抖处理的搜索函数
  const debounceFetcher = useMemo(() => {
    // 防抖加载选项函数
    const loadOptions = (value: string) => {
      fetchRef.current += 1; // 每发起一次搜索，计数 +1
      const fetchId = fetchRef.current;

      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) return; // 请求已过期，丢弃
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout); // 返回防抖处理后的函数
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      size="large"
      labelInValue //选择返回 {value, label} 结构
      filterOption={false} //关闭本地过滤，启用远程搜索
      onSearch={debounceFetcher} //输入触发防抖搜索
      notFoundContent={fetching ? <Spin size="small"/> : '请输入'}
      {...props} //填入异步数据
      options={options}
      // optionRender={(option) => (
      //   <div style={{display: 'flex', alignItems: 'center'}}>
      //     {option.label}
      //   </div>
      // )}
    />
  );
}

interface UserValue {
  label: string;
  value: string;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log('fetching user', username);
  return fetch(`https://660d2bd96ddfa2943b33731c.mockapi.io/api/users/?search=${username}`)
    .then((res) => res.json())
    .then((res) => {
      const results = Array.isArray(res) ? res : [];
      return results.map((user) => ({
        label: user.name,
        value: user.id,
      }));
    });
}

const SchoolDebounceSelect: React.FC = () => {
  const [value, setValue] = useState<UserValue[]>([]);

  return (
    <DebounceSelect
      mode="multiple"
      value={value}
      placeholder="学校"
      fetchOptions={fetchUserList}
      onChange={(newValue) => {
        if (Array.isArray(newValue)) {
          setValue(newValue);
        }
      }}
    />
  );
};

export default SchoolDebounceSelect;