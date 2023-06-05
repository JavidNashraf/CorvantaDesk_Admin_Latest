import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Table } from "components";
import { checkModule } from "lib/checkModule";
import { getNotificationType } from "lib";

export const Notifications = () => {
  const navigate = useNavigate();

  const { t } = useTranslation("/Bills/ns");
  const { userModules } = useSelector((state) => state?.modules);
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  // const { permissions } = checkModule({
  //   module: 'Users',
  //   modules: userModules,
  // });
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a?.id < b?.id ? -1 : 1),
      render: (text) => text.substring(0, 4),
    },
    {
      title: "Notification Type",
      dataIndex: "type",
      key: "type",
      render: (text) => getNotificationType({ type: text }),
    },
    {
      title: "Sent At",
      dataIndex: "sentAt",
      key: "sentAt",
      sorter: (a, b) => (moment(a?.sentAt) < moment(b?.sentAt) ? -1 : 1),
      render: (key) => moment(key).format(localStorage.getItem('dateFormat')),
    },
    {
      title: "Sent To",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => (a?.fullName < b?.fullName ? -1 : 1),
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a?.status < b?.status ? -1 : 1),
      render: (text) => {
        const getInfo = ({ type }) => {
          switch (type) {
            case 0:
              return {
                styles: "bg-[#392F28] text-[#FFA800]",
                title: "Sending...",
              };
            case 1:
              return { styles: "bg-[#1C3238] text-[#0BB783]", title: "Sent" };
            case 2:
              return {
                styles: "bg-[#3A2434] text-[#F64E60]",
                title: "Failed",
              };
            default:
              return { styles: "bg-[#1C3238] text-[#0BB783]", title: "Active" };
          }
        };

        const { styles, title } = getInfo({ type: text });
        return (
          <div
            className={`w-[fit-content] py-[4px] px-[8px] text-[12px] rounded-[4px] uppercase ${styles}`}
          >
            {title}
          </div>
        );
      },
    },
  ];

  const { notifications, loading } = useSelector(
    (state) => state?.notificationTemplates
  );

  return (
    <div className="p-[40px] pb-[24px] bg-[#000000] rounded-[8px]">
      <Table
        columns={columns}
        data={notifications}
        rowKey="id"
        loading={loading}
        fieldToFilter="title"
        btnData={{
          text: "Add New",
          onClick: () =>
            navigate(
              "/admin/dashboard/billing/clients/show-notifications/client-notifications/add/new"
            ),
          customClass: "w-[fit_content]",
        }}
        hideActions
        permissions={{
          View: true,
          Update: true,
          Remove: true,
        }}
        t={t}
      />
    </div>
  );
};
