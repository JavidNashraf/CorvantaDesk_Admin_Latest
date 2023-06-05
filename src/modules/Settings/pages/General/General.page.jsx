import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import { GeneralSettings, MFASettings } from './sections';

function General() {
  const { loading } = useSelector((state) => state.appSettings);

  return (
    <div className="p-[40px]">
      <Spin spinning={loading}>
        <GeneralSettings />
        <MFASettings />
      </Spin>
    </div>
  );
}

export default General;
