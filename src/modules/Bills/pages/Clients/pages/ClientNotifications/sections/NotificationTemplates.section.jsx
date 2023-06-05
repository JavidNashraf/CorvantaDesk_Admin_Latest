import { useState } from "react";
import { Button } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Table } from "components";
import { checkModule } from "lib/checkModule";
import { Delete, Send } from ".";
import { getNotificationTemplateByID } from "store";
import { findSpecificUsers } from "store";
import { toast } from "react-toastify";
import {
  axios,
  getNotificationTemplateByIDConfig,
  getSpecificConfig,
} from "lib";

export const NotificationTemplates = () => {
  const navigate = useNavigate();
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const { t } = useTranslation("/Bills/ns");
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Users",
    modules: userModules,
  });
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a?.id < b?.id ? -1 : 1),
      render: (text) => text.substring(0, 4),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a?.title < b?.title ? -1 : 1),
    },
    {
      title: "Starts",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => (moment(a?.startDate) < moment(b?.startDate) ? -1 : 1),
      render: (key) => moment(key).format(localStorage.getItem('dateFormat')),
    },
    {
      title: "Ends",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) => (moment(a?.endDate) < moment(b?.endDate) ? -1 : 1),
      render: (key) => moment(key).format(localStorage.getItem('dateFormat')),
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const getInfo = ({ type }) => {
          switch (type) {
            case 0:
              return { styles: "bg-[#1C3238] text-[#0BB783]", title: "Active" };
            case 1:
              return {
                styles: "bg-[#392F28] text-[#FFA800]",
                title: "Disabled",
              };
            case 2:
              return {
                styles: "bg-[#3A2434] text-[#F64E60]",
                title: "Expired",
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

  const { templates, loading } = useSelector(
    (state) => state?.notificationTemplates
  );

  const dispatch = useDispatch();

  const [del, setDel] = useState(false);
  const [id, setId] = useState("");
  const [showSend, setShowSend] = useState(false);

  return (
    <div className="p-[40px] pb-[24px] bg-[#000000] rounded-[8px]">
      <Delete show={del} setShow={setDel} id={id} />
      <Send show={showSend} setShow={setShowSend} id={id} />
      <Table
        columns={columns}
        data={templates}
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
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(
                `/admin/dashboard/billing/clients/show-notifications/client-notifications/edit/${record?.id}`
              );
            },
          };
        }}
        editAction={(record) => {
          return (
            <>
              <Button
                onClick={async () => {
                  // Get Notification Templates
                  await dispatch(
                    getNotificationTemplateByID({ id: record?.id })
                  );
                  // Notification Template By ID
                  const { url, config } = getNotificationTemplateByIDConfig({
                    id: record?.id,
                  });
                  const response = await axios.get(url, config);
                  // Check Users Length
                  const specificBody = {
                    property: response?.data?.data?.property,
                    operatorType: response?.data?.data?.operatorType,
                    value: response?.data?.data?.value,
                  };

                  const getSpecificUrl = getSpecificConfig().url;
                  const getSpecificConf = getSpecificConfig().config;

                  const res = await axios.post(
                    getSpecificUrl,
                    specificBody,
                    getSpecificConf
                  );
                  // Get Specific Users
                  await dispatch(findSpecificUsers(specificBody));
                  if (res?.data?.data?.length) {
                    setId(record?.id);
                    setShowSend(true);
                  } else {
                    toast.error(
                      "This template does not have users. Please edit to proceed."
                    );
                  }
                }}
              >
                Send Notification Using Template
              </Button>
              <Button
                onClick={() =>
                  navigate(
                    `/admin/dashboard/billing/clients/show-notifications/client-notifications/edit/${record?.id}`
                  )
                }
              >
                Edit
              </Button>
            </>
          );
        }}
        deleteAction={(record) => {
          return (
            <Button
              onClick={() => {
                setId(record?.id);
                setDel(true);
              }}
            >
              Delete
            </Button>
          );
        }}
        permissions={permissions}
        t={t}
      />
    </div>
  );
};
