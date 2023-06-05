import { Button, Switch } from "antd";
import { Table } from "components";
import { checkModule } from "lib/checkModule";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWebHooks } from "store/Actions/webhooks";
import { AddWebhook, DeleteWebhook, EditWebhook } from "./sections";

const columns = [
  {
    title: "Webhook URL",
    dataIndex: "webHookUrl",
    key: "webHookUrl",
    width: "20%",
    sorter: (a, b) => (a?.webHookUrl < b?.webHookUrl ? -1 : 1),
  },
  {
    title: "Module Name",
    dataIndex: "moduleId",
    key: "moduleId",
    sorter: (a, b) => (a?.moduleId < b?.moduleId ? -1 : 1),
  },
  {
    title: "Status",
    dataIndex: "isActive",
    key: "isActive",
    render: (value) => <Switch checked={value} disabled={true} />,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (events) => {
      return events === 0 ? "Create" : events === 1 ? "Update" : "Delete";
    },
  },
];

const WebHooks = () => {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editValue, setEditValue] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWebHooks());
  }, []);

  const { webhooks, loading } = useSelector((state) => state.webhooks);

  // Check for permissions Start
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Webhooks",
    modules: userModules,
  });
  // Check for permissions End

  return (
    <div className="m-[40px] p-[40px] bg-[#000000] rounded-[8px]">
      <AddWebhook show={addModalShow} setShow={setAddModalShow} />
      <EditWebhook
        show={editModalShow}
        setShow={setEditModalShow}
        editValue={editValue}
      />
      <DeleteWebhook
        show={deleteModalShow}
        setShow={setDeleteModalShow}
        id={deleteID}
      />
      <Table
        columns={columns}
        data={webhooks}
        permissions={permissions}
        loading={loading}
        fieldToFilter="name"
        btnData={{
          text: "Add WebHook",
          onClick: () => setAddModalShow(true),
        }}
        editAction={(record) => (
          <Button
            onClick={() => {
              setEditValue(record);
              setEditModalShow(true);
            }}
          >
            Edit
          </Button>
        )}
        deleteAction={(record) => (
          <Button
            className="focus:bg-[unset]"
            onClick={() => {
              setDeleteID(record?.id);
              setDeleteModalShow(true);
            }}
          >
            Delete
          </Button>
        )}
        rowKey={(record) => record?.id}
      />
    </div>
  );
};

export default WebHooks;
