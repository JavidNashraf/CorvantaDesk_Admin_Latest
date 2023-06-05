import { Table } from 'components';
import { checkModule } from 'lib/checkModule';
import { useSelector } from 'react-redux';

export const Tables = () => {
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: 'WHMCS',
    modules: userModules,
  });

  const { selectedData } = useSelector((state) => state?.whmcs);

  const columns = Object?.keys(selectedData[0])?.map((key, index) => {
    if (index === 0) {
      return {
        title: key,
        dataIndex: key,
        key: key,
      };
    } else {
      return {
        title: key,
        dataIndex: key,
        key: key,
        width: 200,
      };
    }
  });

  return (
    <div className="grid grid-cols-1 gap-[20px]">
      {/* Table Selected Data */}
      <div className="bg-[#171723] p-[32px] rounded-[8px]">
        <Table
          columns={columns}
          data={selectedData}
          scroll={{ x: 1500, y: 600 }}
          theme="dark"
          permissions={permissions}
          hideActions
          emptyText="No Data Selected"
          fieldToFilter="name"
        />
      </div>
    </div>
  );
};
