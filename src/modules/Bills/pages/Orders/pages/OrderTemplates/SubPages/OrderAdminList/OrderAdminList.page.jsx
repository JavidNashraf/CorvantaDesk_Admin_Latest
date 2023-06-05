import { Button, Switch } from "antd";
import { Modal, Table } from "components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { checkModule } from "lib/checkModule";
import { useParams } from "react-router-dom";
import {
  enableTakeOrders,
  disableTakeOrders,
  enableautoassignOrders,
  disableautoassignOrders,
  addUser,
  activateOrderUser,
  deactivateOrderUser,
  getUsers,
} from "store";

export const OrderAdminsPage = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedRows, setSelectedRows] = useState(false);
  const { t } = useTranslation("/Users/ns");
  const navigate = useNavigate();
  const { id } = useParams();

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  const columns = [
    {
      title: t("adminName"),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a?.name < b?.name ? -1 : 1),
    },
    {
      // title: "Status",
      title: t("Assigned To Admin"),
      dataIndex: "status",
      type: "switch",
      key: "status",
      render: (text, record) => {
        return (
          <div>
            <Switch
              // autoFocus
              checkedChildren="Enable"
              unCheckedChildren="Disable"
              checked={record?.canTakeOrders}
              // defaultChecked={record?.canTakeOrders}
              onChange={(e) => orderStatusUpdate(e, record)}
            ></Switch>
          </div>
        );
      },
      // render: (value) => <Switch checked={value} disabled={false} />,
    },
    {
      // title: "Status",
      title: t("Auto Assign Orders"),
      dataIndex: "status",
      type: "switch",
      key: "status",
      render: (text, record) => {
        return (
          <div>
            <Switch
              // autoFocus
              checkedChildren="Enable"
              unCheckedChildren="Disable"
              checked={record?.autoAssignOrders}
              // defaultChecked={record?.status}
              onChange={(e) => autoAssignOrderUpdate(e, record)}
            ></Switch>
          </div>
        );
      },
      // render: (value) => <Switch checked={value} disabled={false} />,
    },
  ];

  const { users, loading } = useSelector((state) => state?.users);
  const allUsers = users;
  const { userModules } = useSelector((state) => state?.modules);
  // const { orderAdminID, orders } = useSelector((state) => state?.orders);
  const { permissions } = checkModule({
    module: "Admin",
    modules: userModules,
  });
  const [tableUsers, setTableUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getUsers());
      await dispatch();
    })();
  }, []);

  const orderStatusUpdate = (value, rowData) => {
    const { key } = rowData;
    value ? dispatch(enableTakeOrders(key)) : dispatch(disableTakeOrders(key));
  };

  const autoAssignOrderUpdate = (value, rowData) => {
    const { key } = rowData;
    value
      ? dispatch(enableautoassignOrders(key))
      : dispatch(disableautoassignOrders(key));
  };

  useEffect(() => {
    let usersData = [];
    if (allUsers?.length > 0) {
      for (let index = 0; index < allUsers.length; index++) {
        let user = allUsers[index];
        usersData.push({
          key: user?.id,
          id: user?.id,
          name: user?.fullName,
          canTakeOrders: user?.canTakeOrders,
          autoAssignOrders: user?.autoAssignOrders,
        });
      }
      setTableUsers(usersData);
    }
  }, []);

  return (
    <div className="users">
      <div className="users__inner">
        <div className="users-list">
          <Modal
            show={showAdd}
            setShow={setShowAdd}
            heading={t("addNewUser")}
            submitText={t("addAdminUser")}
            loading={loading}
            handleSubmit={async (values) => {
              await dispatch(addUser(values));
              setShowAdd(false);
            }}
          />

          <Table
            columns={columns}
            data={tableUsers}
            permissions={permissions}
            pagination={{
              defaultPageSize:
                JSON.parse(localStorage.getItem("CurrentUser"))
                  ?.recordsToDisplay > 0
                  ? JSON.parse(localStorage.getItem("CurrentUser"))
                      ?.recordsToDisplay
                  : 5,
              showSizeChanger: true,
              position: ["bottomRight"],
              pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
            }}
            fieldToFilter="name"
            loading={loading}
            rowSelection={rowSelection}
            additionalBtns={
              selectedRows?.length
                ? [
                    {
                      text: "Take Orders",
                      onClick: () => {
                        Array.isArray(selectedRows) &&
                          selectedRows.map((data) => {
                            dispatch(
                              activateOrderUser(
                                data?.id,
                                selectedRows[selectedRows?.length - 1]?.id
                              )
                            );
                            data?.id ===
                              selectedRows[selectedRows?.length - 1]?.id &&
                              setSelectedRows([]);
                          });
                      },
                    },
                    {
                      text: "Do Not Take Orders",
                      onClick: () => {
                        Array.isArray(selectedRows) &&
                          selectedRows.map((data) => {
                            dispatch(
                              deactivateOrderUser(
                                data?.id,
                                selectedRows[selectedRows?.length - 1]?.id
                              )
                            );
                            data?.id ===
                              selectedRows[selectedRows?.length - 1]?.id &&
                              setSelectedRows([]);
                          });
                      },
                    },
                  ]
                : []
            }
            viewAction={(record) => {
              return (
                <>
                  {" "}
                  {/* TODO: Replace with UID */}
                  <Button
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/billing/orders/order-admins/list/view/${record?.id}`
                      )
                    }
                  >
                    {t("view")}
                  </Button>
                </>
              );
            }}
            editAction={(record) => ""}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};
