import { Button, Tooltip } from "antd";
import { Copy } from "icons";
import moment from "moment";
import { Table } from "components";
import "./APIKeys.styles.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Add, Delete, EditAPIKey, EditPermissions } from "./sections";
import { checkModule } from "lib/checkModule";
import { useSelector, useDispatch } from "react-redux";
import { getAllAPIKeys } from "store";
import { getAPIKeyByID } from "store";
import { getUsers } from "store";

export const APIKeysList = () => {
  const [show, setShow] = useState(false);
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  // const [selectedSort, setSelectedSort] = useState('label');
  const [data, setData] = useState([]);
  // Edit Modal State Start
  const [showEdit, setShowEdit] = useState(false);
  const [editPermissions, setEditPermissions] = useState(false);
  // Delete Modal State
  const [showDelete, setShowDelete] = useState(false);
  const [recordToDel, setRecordToDel] = useState(false);

  const { userModules } = useSelector((state) => state?.modules);
  const { apiKeys, loading } = useSelector((state) => state?.apiKeys);
  const { users } = useSelector((state) => state?.users);
  const userLoading = useSelector((state) => state?.users?.loading);
  const { permissions } = checkModule({
    module: "SettingAPIKeys",
    modules: userModules,
  });

  const { t } = useTranslation("/Users/ns");

  const columns = [
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
      sorter: (a, b) => (a?.number < b?.number ? -1 : 1),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      sorter: (a, b) => (a?.user < b?.user ? -1 : 1),
    },
    {
      title: t("label"),
      dataIndex: "label",
      key: "label",
    },
    {
      title: t("apiKey"),
      dataIndex: "apiKey",
      key: "apiKey",
      render: (text) => {
        return (
          <div className="flex gap-[8px] items-center">
            <div>{text}</div>
            <Tooltip title="Copied!" trigger="click">
              <div
                onClick={() => {
                  navigator.clipboard.writeText(text);
                }}
                className="cursor-pointer"
              >
                <Copy />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "IP Address",
      dataIndex: "safeListIpAddresses",
      key: "safeListIpAddresses",
    },
    {
      title: t("validTill"),
      key: "validTill",
      dataIndex: "validTill",
      sorter: (a, b) => (moment(a?.validTill) < moment(b?.validTill) ? -1 : 1),
      render: (text) =>
        moment(text)?.isValid()
          ? moment(text)?.format(localStorage.getItem('dateFormat'))
          : "N/A",
    },
    {
      title: "Expires",
      key: "validTill",
      dataIndex: "validTill",
      sorter: (a, b) => (moment(a?.validTill) < moment(b?.validTill) ? -1 : 1),
      render: (text) => moment(text).format(localStorage.getItem('dateFormat')),
    },
    {
      title: t("status"),
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <div
          className={`${
            status
              ? "bg-[#1C3238] text-[#0BB783]"
              : "bg-[#3A2434] text-[#F64E60]"
          } px-[8px] py-[4px] w-[fit-content] rounded-[4px]`}
        >
          {status ? "ENABLED" : "DISABLED"}
        </div>
      ),
    },
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllAPIKeys());
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    if (apiKeys) {
      let dataArr = [];
      apiKeys.forEach((key, index) => {
        dataArr.push({
          key: key?.id,
          number: index + 1,
          user: users.find((x) => x?.id === key?.userIds)?.fullName || "N/A",
          label: key?.label !== null ? key?.label : "N/A",
          apiKey: key?.applicationKey,
          safeListIpAddresses: key?.safeListIpAddresses,
          createdAt: key?.createdAt ? key?.createdAt : "N/A",
          status: key?.statusApi,
          validTill: key?.validTill,
          tenant: key?.tenant,
        });
      });
      setData(dataArr);
    }
  }, [apiKeys]);

  return (
    <div className="mt-[20px] bg-[#000000] rounded-[8px] pb-[32px]">
      <h6 className="text-white text-[16px] px-[32px] pt-[32px]">API Keys</h6>
      <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[32px] mb-[32px]" />
      <div className="up-api-keys__table p-4">
        <Table
          data={data}
          columns={columns}
          loading={loading || userLoading}
          btnData={{ text: "Add API Key", onClick: () => setShow(true) }}
          fieldToFilter="label"
          pagination={{
            defaultPageSize: JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay > 0 ? (JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay) : 5,
            showSizeChanger: true,
            position: ["bottomRight"],
            pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
          }}
          editAction={(record) => (
            <>
              <Button
                onClick={async () => {
                  await dispatch(getAPIKeyByID(record?.key));
                  setShowEdit(true);
                }}
              >
                Edit
              </Button>
              <Button
                onClick={async () => {
                  await dispatch(getAPIKeyByID(record?.key));
                  setEditPermissions(true);
                }}
              >
                Edit Permissions
              </Button>
            </>
          )}
          deleteAction={(record) => {
            return (
              <Button
                onClick={async () => {
                  setRecordToDel(record?.key);
                  setShowDelete(true);
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
      {/* Modals */}
      <Add show={show} setShow={setShow} />
      <EditAPIKey show={showEdit} setShow={setShowEdit} />
      <EditPermissions show={editPermissions} setShow={setEditPermissions} />
      <Delete show={showDelete} setShow={setShowDelete} id={recordToDel} />
    </div>
  );
};
