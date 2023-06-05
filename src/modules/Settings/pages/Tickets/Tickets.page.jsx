import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import { GeneralSettings } from './sections';

function Tickets() {
  const { loading } = useSelector((state) => state.appSettings);

  return (
    <div className="p-[40px]">
      <Spin spinning={loading}>
        <GeneralSettings />
      </Spin>
    </div>
  );
}

export default Tickets;
