import { Button } from "antd";
import { Table } from "components";
import { checkModule } from "lib/checkModule";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSMTPs } from "store";
import { Delete } from "./sections";
import moment from "moment";

export const List = () => {
  const [show, setShow] = useState(false);
  const [record, setRecord] = useState(null);
  const navigate = useNavigate();
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  // Check for permissions Start
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "SmtpConfigurations",
    modules: userModules,
  });
  // Check for permissions End

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllSMTPs());
  }, []);
  // Settigns Table Data
  const { loading, smtps } = useSelector((state) => state?.smtps);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!!smtps?.length) {
      const dataToSet = smtps.map((smtp) => {
        return {
          ...smtp,
          key: smtp?.id,
        };
      });
      setData(dataToSet);
    }
  }, [smtps]);

  const columns = [
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
      sorter: (a, b) => (a?.host < b?.host ? -1 : 1),
    },
    {
      title: "Port",
      dataIndex: "port",
      key: "port",
      sorter: (a, b) => (a?.port < b?.port ? -1 : 1),
    },
    {
      title: "Protocol",
      dataIndex: "httpsProtocol",
      key: "httpsProtocol",
      sorter: (a, b) => (a?.httpsProtocol < b?.httpsProtocol ? -1 : 1),
      render: (text) => (text ? "HTTPS" : "HTTP"),
      width: "40%",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => (moment(a?.createdAt) < moment(b?.createdAt) ? -1 : 1),
      render: (createdOn) => moment(createdOn).format(localStorage.getItem('dateFormat')),
    },
  ];

  return (
    <div className="m-[40px] p-[40px] bg-[#000000] rounded-[8px]">
      <Delete show={show} setShow={setShow} record={record} />
      <Table
        columns={columns}
        data={data}
        loading={loading}
        permissions={permissions}
        fieldToFilter="host"
        btnData={{
          text: "Add New Configuration",
          onClick: () => {
            navigate("/admin/dashboard/settings/smtp/configuration/add");
          },
        }}
        // loading={loading}
        editAction={(record) => (
          <Button
            onClick={() => {
              navigate(`/admin/dashboard/settings/smtp/edit/${record.id}`, {
                state: {
                  smtp: record,
                },
              });
            }}
          >
            Edit
          </Button>
        )}
        deleteAction={(record) => {
          return (
            <Button
              onClick={() => {
                setRecord(record);
                setShow(true);
              }}
            >
              Delete
            </Button>
          );
        }}
      />
    </div>
  );
};
