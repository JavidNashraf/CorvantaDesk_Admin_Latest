/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import { Button } from "antd";
import * as Yup from "yup";
import { Modal, Table } from "components";
import "./UsersList.styles.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "store";
import { checkModule } from "lib/checkModule";
import { EditUser } from "../sections";
import { getUserGroups } from "store";
import { addUser } from "store";
import moment from "moment";
import { Delete } from "modules/Bills/pages/Clients/pages/ClientDetails/sections/APIKeys/sections/Delete.section";

const initialAddValues = {
  userName: "",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  status: true,
  ipAddress: "",
  adminGroupId: "",
};

const addValidationSchema = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Please use 8 or more characters with a mix of letters, numbers & symbols"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  status: Yup.bool().required("Status is required"),
  // ipAddress: Yup.string().required('IP Address is required'),
  adminGroupId: Yup.string().required("Group is required"),
});

export const UsersList = () => {
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const [showAdd, setShowAdd] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [recordToDel, setRecordToDel] = useState(false);


  const { t } = useTranslation("/Users/ns");

  const navigate = useNavigate();

  const { userGroups } = useSelector((state) => state?.userGroups);
  const addFields = [
    {
      type: "input",
      name: "userName",
      placeholder: "Paul.Elliott",
      title: t("username"),
    },
    {
      type: "input",
      name: "fullName",
      placeholder: "Paul.Elliott",
      title: t("fullName"),
    },
    {
      type: "email",
      name: "email",
      placeholder: "Paul.Elliott@Fakemail.com",
      title: t("email"),
    },
    {
      type: "password",
      name: "password",
      placeholder: "*******",
      title: t("password"),
    },
    {
      type: "password",
      name: "confirmPassword",
      placeholder: "*******",
      title: t("confirmPassword"),
    },
    {
      type: "switch",
      name: "status",
      title: t("status"),
    },
    // {
    //   type: "input",
    //   name: "ipAddress",
    //   placeholder: "253.205.121.39",
    //   title: t("ipAddress"),
    // },
    {
      type: "select",
      options: userGroups?.length
        ? userGroups?.map((group) => ({
          label: group?.groupName,
          value: group?.id,
        }))
        : [],
      name: "adminGroupId",
      placeholder: "Select Admin Group...",
      title: t("adminGroup"),
    },
  ];

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => (a?.userName < b?.userName ? -1 : 1),
    },
    {
      title: t("adminName"),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a?.name < b?.name ? -1 : 1),
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a?.email < b?.email ? -1 : 1),
    },
    {
      title: t("createDate"),
      key: "createdOn",
      dataIndex: "createdOn",
      sorter: (a, b) => (moment(a?.createdOn) < moment(b?.createdOn) ? -1 : 1),
      render: (text) =>
        moment(text)?.isValid()
          ? moment(text)?.format(localStorage.getItem("dateFormat"))
          : "N/A",
    },
  ];

  // Users Logic Start
  const { loading, users } = useSelector((state) => state?.users);
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Admin",
    modules: userModules,
  });
  const [tableUsers, setTableUsers] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(getUsers());
      await dispatch(getUserGroups());
    })();
  }, [dispatch]);

  useEffect(() => {
    if (users?.length) {
      let usersData = [];
      users?.forEach((user) => {
        usersData.push({
          key: user?.id,
          id: user?.id,
          name: user?.fullName,
          email: user?.email,
          ...user,
          // TODO: Check with back-end dev for these two fields
          companyName: user?.companyName ? user?.companyName : "N/A",
          createdAt: user?.createdAt ? user?.createdAt : "N/A",
        });
      });
      setTableUsers(usersData);
    }
  }, [users]);
  // Users Logic End

  // Edit User Logic
  const [editUser, setEditUser] = useState(null);


  const onSearchHandler = (data, paginationData) => {
    const filteredArray = tableUsers.filter((obj) =>
      obj.name.toLowerCase().includes(data.toLowerCase()) ||
      obj.userName.toLowerCase().includes(data.toLowerCase())
    );
    setTableUsers(filteredArray)
    if (!data) {
      (async () => {
        await dispatch(getUsers());
        await dispatch(getUserGroups());
      })();
    }
  }

  return (
    <div className="users">
      <div className="users__inner">
        <div className="users-list">
          <Modal
            show={showAdd}
            setShow={setShowAdd}
            heading={t("addNewUser")}
            submitText={t("addAdminUser")}
            initialValues={initialAddValues}
            validationSchema={addValidationSchema}
            fields={addFields}
            loading={loading}
            handleSubmit={async (values) => {
              await dispatch(addUser(values));
              setShowAdd(false);
            }}
          />
          <EditUser
            show={editModal}
            setShow={setEditModal}
            t={t}
            user={editUser}
          />
          <Delete
            show={showDelete}
            setShow={setShowDelete}
            record={record}
            id={recordToDel}
            type={"admin"}
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
            onSearchHandler={onSearchHandler}
            btnData={{
              text: t("addAdminUser"),
              onClick: () => setShowAdd(true),
            }}
            loading={loading}
            viewAction={(record) => {
              return (
                <>
                  {" "}
                  {/* TODO: Replace with UID */}
                  <Button
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/settings/users/list/admin-details/${record?.id}`
                      )
                    }
                  >
                    {t("view")}
                  </Button>
                </>
              );
            }}
            editAction={(record) => (
              <Button
                onClick={() => {
                  setEditUser(record);
                  setEditModal(true);
                }}
              >
                Edit
              </Button>
            )}
            deleteAction={(record) => (
              <Button
                onClick={() => {
                  setRecordToDel(record?.id);
                  setShowDelete(true);
                }}
              >
                Delete
              </Button>
            )}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};
