import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function Loading() {
  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
}
