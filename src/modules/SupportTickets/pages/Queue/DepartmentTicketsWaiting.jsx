import { useDispatch, useSelector } from "react-redux";
import {
  FieldTimeOutlined,
  PushpinOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Table, TicketMenu } from "components";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkModule } from "lib/checkModule";
import "../../../../components/TicketDetails/sections/styles.scss";
import { getTickets } from "store";
import { getUsers } from "store";
import { getClients } from "store";
import { Button, message, Spin } from "antd";
import moment from "moment";
import {
  AssignTicket,
  FollowUp,
  Priority,
  Status,
} from "components/TicketModals";
import { getTicketById } from "store";
import { editTicket } from "store";
import { useTranslation } from "react-i18next";
import { getTimeDiff, groupBy } from "lib";
import { deleteTicket } from "store";
import { Navigation } from "../AllTickets/sections";
import { useQuery } from "components/TicketDetails/sections/Details/Details.section";
import { getDepartments } from "store";

export const DepartmentListWaiting = () => {
  const { t } = useTranslation("/Tickets/ns");

  const { allTickets, loading } = useSelector((state) => state?.tickets);
  const { users } = useSelector((state) => state?.users);
  const { user } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state?.departments);
  const departmentsLoading = useSelector(
    (state) => state?.departments?.loading
  );
  const query = useQuery();
  const ticket_id = query.get("tid");
  // const deptId = query.get("deptId");
  const { deptId } = useParams();
  const tickets = allTickets?.filter(
    (ticket) =>
      ticket?.assignedTo === user?.id && ticket?.departmentId === deptId
  );

  const currentRoute = ({ id = "" }) =>
    `/admin/dashboard/support/tickets/waiting/${deptId}?tid=${id}`;

  const { userModules } = useSelector((state) => state?.modules);

  const { permissions } = checkModule({
    module: "Support",
    modules: userModules,
  });

  // Setting data properly
  const [data, setData] = useState([]);
  useEffect(() => {
    setData([]);
    if (tickets?.length) {
      const dataToSet = tickets?.map((b) => {
        return {
          ...b,
          key: b?.id,
        };
      });
      const trueFirst = dataToSet
        ?.sort(
          (a, b) =>
            new Date(b?.lastModifiedOn).getTime() -
            new Date(a?.lastModifiedOn).getTime()
        )
        ?.sort((a, b) =>
          a?.pinTicket === b?.pinTicket ? 0 : a?.pinTicket ? -1 : 1
        );

      setData(trueFirst);
    }
  }, [allTickets, deptId]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getDepartments());
    dispatch(getClients());
    dispatch(getTickets());
  }, []);

  // Selected Rows
  const [selectedRows, setSelectedRows] = useState(false);

  // Methods to Select Rows
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  const [showPriority, setShowPriority] = useState(false);
  const [followup, setFollowUp] = useState(false);
  const [status, setStatus] = useState(false);
  const [assign, setAssign] = useState(false);

  let activeTicket = tickets ? groupBy(tickets, "ticketStatus") : {};

  // const [active, setActive] = useState("");
  // const selectedTicket = tickets?.find(
  //   (ticket) => ticket?.id === ticket_id
  // )?.ticketStatus;
  
  const selectedTicket = tickets && tickets[0]?.ticketStatus;
  const [active, setActive] = useState(
    `${
      selectedTicket === 1
        ? t("waiting")
        : selectedTicket === 2
        ? t("closed")
        : t("active")
    }`
  );

  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;

  useEffect(() => {
    setActive(
      `${
        selectedTicket === 1
          ? t("waiting")
          : selectedTicket === 2
          ? t("closed")
          : t("active")
      }`
    );
    handleActive(
      active === "Active" ? 0 : active === "Waiting" ? 1 : 2,
      active
    );
  }, [allTickets]);

  const handleActive = (v, text) => {
    setActive(text);
    if (tickets?.length) {
      const dataToSet = tickets
        ?.filter(function (el) {
          return el.ticketStatus === v;
        })
        .map((b) => {
          return {
            ...b,
            key: b?.id,
          };
        });
      setData(dataToSet);
    }
  };

  useEffect(() => {
    if (data?.length) {
      navigate(
        `/admin/dashboard/support/tickets/waiting/${deptId}?tid=${data[0]?.id}`
      );
    } else {
      navigate(`/admin/dashboard/support/tickets/waiting/${deptId}`);
    }
  }, [data]);

  const columns = [
    {
      title: "Follow Up | High Priority | Pinned",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => {
        return (
          <div className="flex items-center gap-[12px]">
            <div
              className={
                record?.followUpOn
                  ? "action-icon action-icon-active"
                  : "action-icon"
              }
              onClick={async () => {
                setFollowUp(true);
                await dispatch(getTicketById(record?.id));
              }}
            >
              <FieldTimeOutlined />
            </div>
            <div
              className={
                record?.ticketPriority === 2
                  ? "action-icon action-icon-active"
                  : "action-icon"
              }
              onClick={async () => {
                setShowPriority(true);
                await dispatch(getTicketById(record?.id));
              }}
            >
              <RiseOutlined />
            </div>
            <div
              className={
                record?.pinTicket
                  ? "action-icon action-icon-active"
                  : "action-icon"
              }
              onClick={async () => {
                await dispatch(
                  editTicket({
                    data: {
                      ...record,
                      pinTicket: record?.pinTicket ? false : true,
                    },
                  })
                );
                message.success(
                  `Ticket${record?.pinTicket ? " Unpinned" : " Pinned"}`
                );
              }}
            >
              <PushpinOutlined />
            </div>
          </div>
        );
      },
    },
    {
      title: "Subject",
      dataIndex: "ticketTitle",
      key: "ticketTitle",
      sorter: (a, b) => (a?.ticketTitle < b?.ticketTitle ? -1 : 1),
    },
    {
      title: "Created By",
      dataIndex: "clientFullName",
      key: "clientFullName",
      sorter: (a, b) => (a?.clientFullName < b?.clientFullName ? -1 : 1),
    },
    {
      title: "Department",
      dataIndex: "departmentId",
      key: "departmentId",
      sorter: (a, b) => (a?.departmentId < b?.departmentId ? -1 : 1),
      render: (text) => {
        const department = departments?.find((dept) => dept?.id === text);
        return department?.name ? department?.name : "N/A";
      },
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      sorter: (a, b) => (a?.assignedTo < b?.assignedTo ? -1 : 1),
      render: (text) => {
        const admin = users?.find((user) => user?.id === text);
        return admin?.fullName ? admin?.fullName : "N/A";
      },
    },
    {
      title: "Follow-Up",
      dataIndex: "followUpOn",
      key: "followUpOn",
      render: (text) => <>{text ? moment(text).format(localStorage.getItem('dateFormat')) : "N/A"}</>,
    },
    {
      title: "No. of Messages",
      dataIndex: "ticketCommentsCount",
      key: "ticketCommentsCount",
      // render: (text) => text || "0",
    },
    {
      title: "Idle Time",
      dataIndex: "lastModifiedOn",
      key: "lastModifiedOn",
      render: (date) => (date ? getTimeDiff(date) : "N/A"),
    },
  ];
  const links = [
    {
      label: t("active"),
      count: allTickets?.filter(
        (el) =>
          el.ticketStatus === 0 &&
          el?.assignedTo === user?.id &&
          el?.departmentId === deptId
      )?.length,
      showCount: true,
      onClick: () => handleActive(0, t("active")),
    },
    {
      label: t("waiting"),
      count: allTickets?.filter(
        (el) =>
          el.ticketStatus === 1 &&
          el?.assignedTo === user?.id &&
          el?.departmentId === deptId
      )?.length,
      showCount: true,
      onClick: () => handleActive(1, t("waiting")),
    },
    {
      label: t("closed"),
      count: activeTicket ? activeTicket[2]?.length : 0,
      showCount: false,
      onClick: () => handleActive(2, t("closed")),
    },
  ];

  return (
    <>
      <Navigation active={active} links={links} isAdmin />

      <div className={`p-[40px] bg-[#000000] rounded-[8px] mt-2`}>
        <Priority show={showPriority} setShow={setShowPriority} />
        <FollowUp show={followup} setShow={setFollowUp} />
        <AssignTicket show={assign} setShow={setAssign} />
        <Status show={status} setShow={setStatus} />
        {loading || departmentsLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spin spinning={loading || departmentsLoading} />
          </div>
        ) : (
          <div>
            <Table
              columns={columns}
              loading={loading || departmentsLoading}
              data={data}
              fieldToFilter="id"
              permissions={permissions}
              pagination={{
                defaultPageSize: JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay > 0 ? (JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay) : 5,
                showSizeChanger: true,
                position: ["bottomRight"],
                pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
              }}
              rowClassName={(record) =>
                record?.id === ticket_id ? "isActive" : ""
              }
              additionalBtns={
                selectedRows?.length
                  ? [
                      { text: "Pin", onClick: () => {} },
                      { text: "Assign", onClick: () => {} },
                      { text: "Delete", onClick: () => {} },
                    ]
                  : []
              }
              rowSelection={rowSelection}
              editAction={(record) => {
                return (
                  <>
                    {/* <Button>Reply</Button> */}
                    <Button
                      onClick={async () => {
                        setAssign(true);
                        await dispatch(getTicketById(record?.id));
                      }}
                    >
                      Transfer
                    </Button>
                    <Button
                      onClick={async () => {
                        setShowPriority(true);
                        await dispatch(getTicketById(record?.id));
                      }}
                    >
                      Priority
                    </Button>
                    <Button
                      onClick={async () => {
                        setFollowUp(true);
                        await dispatch(getTicketById(record?.id));
                      }}
                    >
                      Follow-Up
                    </Button>
                    <Button
                      onClick={async () => {
                        await dispatch(
                          editTicket({
                            data: {
                              ...record,
                              pinTicket: record?.pinTicket ? false : true,
                            },
                          })
                        );
                        message.success(
                          `Ticket${record?.pinTicket ? " Unpinned" : " Pinned"}`
                        );
                      }}
                    >
                      Pin
                    </Button>
                    <Button
                      onClick={async () => {
                        await dispatch(deleteTicket(record?.id));
                      }}
                    >
                      Delete
                    </Button>
                  </>
                );
              }}
              customFilterSort={<></>}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    navigate(
                      `${currentRoute({
                        deptId: record?.departmentId,
                        id: record?.id,
                      })}`
                    );
                  }, // click row
                  onDoubleClick: (event) => {}, // double click row
                  onContextMenu: (event) => {
                    event.preventDefault();
                    if (!visible) {
                      document.addEventListener(
                        `click`,
                        function onClickOutside() {
                          setVisible(false);
                          document.removeEventListener(`click`, onClickOutside);
                        }
                      );
                    }
                    setVisible(true);
                    setPopup({
                      record,
                      x: event.clientX,
                      y: event.clientY,
                    });
                  }, // right button click row
                  onMouseEnter: (event) => {}, // mouse enter row
                  onMouseLeave: (event) => {}, // mouse leave row
                };
              }}
              // headingTitle={}
              // t={t}
            />
            {<TicketMenu {...popup} visible={visible} />}
          </div>
        )}
      </div>
    </>
  );
};
