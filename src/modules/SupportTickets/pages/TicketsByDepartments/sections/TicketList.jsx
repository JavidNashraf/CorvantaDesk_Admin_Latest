import { useDispatch, useSelector } from "react-redux";
import {
  FieldTimeOutlined,
  PushpinOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Table, TicketMenu } from "components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkModule } from "lib/checkModule";
import "./styles.scss";
import {
  getTicketsByAdminID,
  getTickets,
  getTicketsByDepartmentId,
} from "store";
import { getUsers } from "store";
import { getClients } from "store";
import { Button, message } from "antd";
import moment from "moment";
import {
  AssignTicket,
  FollowUp,
  Priority,
  Status,
} from "components/TicketModals";
import { getTicketById } from "store";
import { editTicket } from "store";
// import { Navigation } from "./Details/sections";
import { useTranslation } from "react-i18next";
import { axios, getTicketsConfig, groupBy } from "lib";
// import { useQuery } from "./Details/Details.section";
import { TicketSearch } from "modules/KnowledgeBase/pages/Articles/pages/View/sections/AdvancedSearch/AdvancedSearch";
import { useQuery } from "components/TicketDetails/sections/Details/Details.section";
import { Navigation } from "../../AllTickets/sections";

export const TicketList = ({ queueList, isSearch, AdvancedSearchOptions }) => {
  const { t } = useTranslation("/Tickets/ns");
  const location = useLocation();

  const { allTickets, departmentTickets, loading } = useSelector(
    (state) => state?.tickets
  );
  const userTickets = useSelector((state) => state?.tickets?.tickets);
  const { users } = useSelector((state) => state?.users);
  const { departments } = useSelector((state) => state?.departments);
  const usersLoading = useSelector((state) => state?.users?.loading);
  const departmentsLoading = useSelector(
    (state) => state?.departments?.loading
  );
  const query = useQuery();
  const ticket_id = query.get("tid");
  const { id, deptId } = useParams();
  const tickets = location?.pathname?.includes("show-all")
    ? allTickets
    : location?.pathname.includes("by-department")
    ? departmentTickets
    : userTickets;

  // console.log("dept", departmentTickets);

  const currentRoute = ({ deptId = "", id = "" }) =>
    location?.pathname?.includes("show-all")
      ? `/admin/dashboard/support/tickets/show-all/list/details/${id}?tid=${id}`
      : location?.pathname.includes("by-department")
      ? `/admin/dashboard/support/tickets/by-departments/${deptId}/details/${id}?tid=${id}`
      : `/admin/dashboard/support/tickets/list?tid=${id}`;

  //   useEffect(() => {
  //     if (
  //       !isSearch &&
  //       location?.pathname?.includes("show-all") &&
  //       allTickets?.length > 0
  //     ) {
  //       navigate(
  //         `/admin/dashboard/support/tickets/show-all/list/details/${allTickets[0]?.id}?tid=${allTickets[0]?.id}`
  //       );
  //     } else if (
  //       !isSearch &&
  //       location?.pathname.includes("by-department") &&
  //       departmentTickets?.length > 0 &&
  //       !ticket_id
  //     ) {
  //       navigate(
  //         `/admin/dashboard/support/tickets/by-departments/${id}?tid=${departmentTickets[0]?.id}`
  //       );
  //     }
  //     if (
  //       !isSearch &&
  //       userTickets?.length > 0 &&
  //       !location?.pathname?.includes("show-all") &&
  //       !location?.pathname.includes("by-department")
  //     ) {
  //       navigate(
  //         `/admin/dashboard/support/tickets/list/details?tid=${userTickets[0]?.id}`
  //       );
  //     }
  //   }, [departmentTickets, userTickets, allTickets, location?.pathname]);

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
      const trueFirst = dataToSet.sort(
        (a, b) => Number(b?.pinTicket) - Number(a?.pinTicket)
      );
      setData(trueFirst);
    }
  }, [tickets]);

  const navigate = useNavigate();
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;

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
            >
              <FieldTimeOutlined />
            </div>
            <div
              className={
                record?.ticketPriority === 2
                  ? "action-icon action-icon-active"
                  : "action-icon"
              }
            >
              <RiseOutlined />
            </div>
            <div
              className={
                record?.pinTicket
                  ? "action-icon action-icon-active"
                  : "action-icon"
              }
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
    },
    {
      title: "Created By",
      dataIndex: "clientFullName",
      key: "clientFullName",
      // render: (text) => {
      //   const client = clients?.find((client) => client?.id === text);
      //   const admin = users?.find((user) => user?.id === text);
      //   return client?.fullName
      //     ? client.fullName
      //     : admin?.fullName
      //     ? admin.fullName
      //     : "N/A";
      // },
    },
    {
      title: "Department",
      dataIndex: "departmentId",
      key: "departmentId",
      render: (text) => {
        const department = departments?.find((dept) => dept?.id === text);
        return department?.name ? department?.name : "N/A";
      },
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
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
      dataIndex: "ticketComments",
      key: "ticketComments",
      render: (text) => text?.length || "0",
    },
    {
      title: "Idle Time",
      dataIndex: "idleTime",
      key: "idleTime",
      render: (text) => <>{text ? 'dd' : "N/A"}</>,
    },
  ];

  const { user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    (async () => {
      if (location?.pathname.includes("show-all")) {
        await dispatch(getTickets());
      } else if (location?.pathname?.includes("by-department")) {
        await dispatch(getTicketsByDepartmentId({ id: deptId }));
      } else {
        await dispatch(getTicketsByAdminID({ id: user?.id }));
      }
      await dispatch(getUsers());
      await dispatch(getClients());
    })();
  }, [dispatch, id, deptId]);

  // Selected Rows
  const [selectedRows, setSelectedRows] = useState(false);

  // Methods to Select Rows
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };
  const [values, setValues] = useState({
    ...AdvancedSearchOptions?.searchValues,
  });
  const [searchResults, setSearchResults] = useState("");
  const [showPriority, setShowPriority] = useState(false);
  const [followup, setFollowUp] = useState(false);
  const [status, setStatus] = useState(false);
  const [assign, setAssign] = useState(false);

  let activeTicket = tickets ? groupBy(tickets, "ticketStatus") : {};
  useEffect(() => {
    (async () => {
      await dispatch(getTickets());
    })();
  }, [dispatch]);
  const [active, setActive] = useState(t("active"));

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

  const links = [
    {
      label: t("active"),
      count: activeTicket ? activeTicket[0]?.length : 0,
      showCount: true,
      onClick: () => handleActive(0, t("active")),
    },
    {
      label: t("waiting"),
      count:
        activeTicket && Object.keys(activeTicket)?.length > 2
          ? activeTicket[2].length
          : 0,
      showCount: true,
      onClick: () => handleActive(2, t("waiting")),
    },
    {
      label: t("closed"),
      count:
        activeTicket && Object.keys(activeTicket)?.length > 1
          ? activeTicket[1].length
          : 0,
      showCount: false,
      onClick: () => handleActive(1, t("closed")),
    },
  ];

  //Advanced Search
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const searchTicketHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const defaultData = {
      id: values?.id ? values?.id : null,
      keyword: values?.title ? values?.title : null,
      pageNumber: 0,
      pageSize: values?.numResult ? parseInt(values?.numResult) : 3,
      orderBy: [""],
      ticketStatus: values.status ? parseInt(values.status) : null,
      assignedTo: values?.admin ? values?.admin : null,
      ticketNo: values?.ticketNo ? parseInt(values?.ticketNo) : null,
      ticketPriority: values.priority ? parseInt(values.priority) : null,
      clientEmail: values?.email ? values?.email : null,
      clientId: values?.client ? values?.client : null,
      createdOn: values?.dateAdded ? values?.dateAdded : null,
    };
    const { url } = getTicketsConfig();
    const res = await axios.post(url, defaultData);
    setIsLoading(false);
    setSearchResults(res?.data?.data?.length);
    if (res.status === 200) {
      setData(res?.data?.data);
    }
  };

  return (
    <>
      {!isSearch && <Navigation active={active} links={links} isAdmin />}

      <div className={`p-[40px] bg-[#000000] rounded-[8px] mt-2`}>
        {searchResults !== "" && (
          <div className="text-[#fff] text-md font-medium text-right">
            {searchResults === 0
              ? "No tickets found for your search queries"
              : `
          Total tickets matching search queries found : ${searchResults}`}
          </div>
        )}
        <Priority show={showPriority} setShow={setShowPriority} />
        <FollowUp show={followup} setShow={setFollowUp} />
        <AssignTicket show={assign} setShow={setAssign} />
        <Status show={status} setShow={setStatus} />

        {isSearch && (
          <TicketSearch
            AdvancedSearchOptions={AdvancedSearchOptions}
            values={values}
            setValues={setValues}
            OnChange={inputChangeHandler}
            onSubmit={searchTicketHandler}
            isLoading={isLoading}
          />
        )}

        <div>
          <Table
            columns={columns}
            loading={isLoading || loading || departmentsLoading || usersLoading}
            data={data}
            fieldToFilter="id"
            permissions={permissions}
            pagination={{
              defaultPageSize: JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay > 0 ? (JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay) : 5,
              showSizeChanger: true,
              position: ["bottomLeft"],
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
                        editTicket({ data: { ...record, pinTicket: true } })
                      );
                      if (location?.pathname.includes("show-all")) {
                        await dispatch(getTickets());
                      } else if (
                        location?.pathname?.includes("by-department")
                      ) {
                        getTicketsByDepartmentId({
                          id: location?.state?.departmentId,
                        });
                      } else {
                        await dispatch(getTicketsByAdminID({ id: user?.id }));
                      }
                      message.success("Ticket Pinned");
                    }}
                  >
                    Pin
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
        {/* )} */}
      </div>
    </>
  );
};
