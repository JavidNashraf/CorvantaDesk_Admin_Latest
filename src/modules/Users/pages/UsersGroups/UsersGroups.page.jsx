import { Button, Switch } from "antd";
import * as Yup from "yup";
import { Modal, Table } from "components";
import "./UsersGroups.styles.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { checkModule } from "lib/checkModule";
import { getGroupPermissions, getUserGroups } from "store";
import {
  AddGroup,
  AddPermissions,
  EditGroup,
  EditPermissions,
} from "./sections";
import { deleteGroup } from "store";
import moment from "moment";

export const UsersGroups = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [addPermissions, setAddPermissions] = useState({
    show: false,
    values: [],
  });
  const [editModal, setEditModal] = useState({ show: false, values: {} });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [activeEditGroup, setActiveEditGroup] = useState(null);
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;

  const { t } = useTranslation("/Users/ns");

  //Integration Logic
  // Getting User Level and App Level Modules and Checking If user has permissions for group management
  const { userModules, appModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Admin",
    modules: userModules,
  });
  // Setting Module Fields Dynamically

  // Get User Groups
  const { userGroups, loading, groupPermissions, group } = useSelector(
    (state) => state?.userGroups
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserGroups());
  }, [dispatch]);
  useEffect(() => {
    if (userGroups?.length) {
      let dataArr = [];
      userGroups.forEach((group) => {
        dataArr.push({
          key: group?.id,
          id: group?.id,
          name: group?.groupName,
          isDefault: group?.isDefault,
          isSuperAdmin: group?.isSuperAdmin,
          status: group?.status,
          userCount: group?.userCount ? Number(group?.userCount) : 0,
          createdAt: group?.createdOn
            ? moment(group?.createdOn)?.format(localStorage.getItem('dateFormat'))
            : "N/A",
        });
      });
      setDataSource(dataArr);
    }
  }, [userGroups]);
  // Group Permissions
  // End Integration Logic

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a?.name < b?.name ? -1 : 1),
    },
    {
      title: t("numberOfUsers"),
      dataIndex: "userCount",
      key: "userCount",
      sorter: (a, b) => (a?.userCount < b?.userCount ? -1 : 1),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return <Switch checked={record?.status} disabled />;
      },
    },
    {
      title: "is Default",
      dataIndex: "isDefault",
      key: "isDefault",
      render: (text, record) => {
        return <Switch checked={record?.isDefault} disabled />;
      },
    },
    {
      title: "is Super Admin",
      dataIndex: "isSuperAdmin",
      key: "isSuperAdmin",
      render: (text, record) => {
        return <Switch checked={record?.isSuperAdmin} disabled />;
      },
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
  ];

  return (
    <div className="users">
      <div className="users__inner">
        <div className="users-groups">
          {/* Add Modal (first in adding a group) */}
          <AddGroup
            t={t}
            appModules={appModules}
            showAdd={showAdd}
            loading={loading}
            setShowAdd={setShowAdd}
            setPermissionsShow={setAddPermissions}
          />
          {/* Permissions Modal (second in adding a group) */}
          <AddPermissions
            t={t}
            loading={loading}
            activeGroup={group}
            addPermissions={addPermissions}
            setAddPermissions={setAddPermissions}
          />
          {/* Permissions Edit */}
          <EditPermissions
            groupPermissions={groupPermissions}
            appModules={appModules}
            activeEditGroup={activeEditGroup}
            setActiveEditGroup={setActiveEditGroup}
            loading={loading}
            t={t}
          />
          {/* Edit Modal */}
          <EditGroup
            editModal={editModal}
            setEditModal={setEditModal}
            t={t}
            loading={loading}
          />
          {/* Delete Modal */}
          <Modal
            show={deleteModal?.show}
            setShow={setDeleteModal}
            heading={t("deleteGroup")}
            loading={loading}
            customBody={
              <div>
                <p style={{ marginBottom: "32px" }}>{t("deleteWarning")}</p>
              </div>
            }
            fields={[]}
            validationSchema={Yup.object().shape({})}
            initialValues={{}}
            submitText={t("deleteGroup")}
            handleSubmit={async () => {
              await dispatch(deleteGroup(deleteModal?.id));
              setDeleteModal({ show: false, id: null });
            }}
          />
          <Table
            columns={columns}
            data={dataSource}
            loading={loading}
            pagination={{
              defaultPageSize: JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay > 0 ? (JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay) : 5,
              showSizeChanger: true,
              position: ["bottomRight"],
              pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
            }}
            fieldToFilter="name"
            btnData={{ text: t("addGroup"), onClick: () => setShowAdd(true) }}
            editAction={(record) => (
              <>
                <Button
                  onClick={() =>
                    setEditModal({
                      show: true,
                      values: record,
                    })
                  }
                >
                  {t("editSettings")}
                </Button>
                <Button
                  onClick={async () => {
                    await dispatch(getGroupPermissions(record?.id));
                    setActiveEditGroup(record);
                  }}
                >
                  {t("editPermissions")}
                </Button>
              </>
            )}
            deleteAction={(record) => (
              <Button
                onClick={() => setDeleteModal({ show: true, id: record?.id })}
              >
                Delete Group
              </Button>
            )}
            permissions={permissions}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};
