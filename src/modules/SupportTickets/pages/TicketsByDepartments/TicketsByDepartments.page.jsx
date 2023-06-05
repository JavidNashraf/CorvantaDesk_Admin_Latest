import { Navigation } from "./sections";
import { Ticket as TicketIcon } from "icons";
import { useEffect, useState } from "react";
import { Table } from "components";
import { checkModule } from "lib/checkModule";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getTicketsByAdminID } from "store";
import { getDepartments } from "store";
import { Spin } from "antd";
import "./TicketsByDepartment.styles.scss";

export const TicketsByDepartment = () => {
  const { t } = useTranslation("/Tickets/ns");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, loading } = useSelector((state) => state?.tickets);
  const { departments } = useSelector((state) => state?.departments);
  const departmentsLoading = useSelector(
    (state) => state?.departments?.loading
  );
  const { user } = useSelector((state) => state?.auth);
  const { userModules } = useSelector((state) => state?.modules);
  // const { id } = useParams();

  useEffect(() => {
    (async () => {
      await dispatch(getTicketsByAdminID({ id: user?.id }));
      await dispatch(getDepartments());
    })();
  }, [dispatch]);

  const { permissions } = checkModule({
    module: "Support",
    modules: userModules,
  });

  const columns = [
    {
      title: "",
      dataIndex: "description",
      key: "description",
      render: (description, record) => {
        return (
          <div
            className="flex cursor-pointer"
            onClick={() => {
              navigate(
                `/admin/dashboard/support/tickets/by-departments/details/${record?.id}`,
                {
                  state: {
                    departmentName: record?.departmentName,
                    departmentId: record?.departmentId,
                  },
                }
              );
            }}
          >
            <TicketIcon />
            <div className="ml-[8px]">
              <h3 className={`text-[#FFFFFF]`}>
                {record?.ticketTitle}{" "}
                {`${
                  record?.tagTitle ? (
                    <span
                      className={`uppercase ml-[12px] text-[10px] bg-[#323248] pt-[4px] pb-[4px] pl-[8px] pr-[8px]`}
                    >
                      ${record?.tagTitle}
                    </span>
                  ) : (
                    ""
                  )
                }`}
              </h3>
              <p className={"text-[#474761] text-[14px] mt-[12px]"}>
                {description}
              </p>
            </div>
          </div>
        );
      },
    },
  ];

  // Setting Departments
  const ticketsWithDepartmentName = tickets?.map((ticket) => ({
    ...ticket,
    departmentName: departments?.filter(
      (dept) => dept?.id === ticket?.departmentId
    )[0]?.name,
  }));

  const finalTickets = ticketsWithDepartmentName?.filter(
    (ticket) => ticket?.departmentName !== undefined
  );

  const counts = {};
  finalTickets.forEach(function (x) {
    counts[x?.departmentName] = (counts[x?.departmentName] || 0) + 1;
  });

  const listToDisplay = Object?.keys(counts)?.map((name) => {
    return {
      name,
      count: counts[name],
    };
  });
  const location = useLocation();
  const currentActive =
    location?.state?.activeDepartment || listToDisplay[0]?.name;
  // Set Active Department
  const [active, setActive] = useState(currentActive);
  const links = listToDisplay?.map((el) => ({
    label: el?.name,
    count: el?.count,
    onClick: () => setActive(el?.name),
  }));

  // Filter Data By Active Department
  const [data, setData] = useState([]);
  useEffect(() => {
    setData([]);
    if (finalTickets?.length) {
      const dataToSet = finalTickets?.map((b) => {
        return {
          ...b,
          key: b?.id,
        };
      });
      if (active) {
        const activeData = dataToSet?.filter(
          (data) => data?.departmentName === active
        );
        setData(activeData);
      } else {
        setData(dataToSet);
      }
    }
  }, [tickets, active]);

  // Setting Departments End

  return (
    <div className="p-[40px] dashboard-ticket custom-department-tickets-table">
      <Spin spinning={loading || departmentsLoading}>
        <Navigation active={active} links={links} />
        <div
          className={`pb-[40px] pl-[40px] pr-[40px] mt-[20px] bg-[#000000] rounded-[8px]`}
        >
          <Table
            columns={columns}
            data={data}
            fieldToFilter="ticketRelatedTo"
            permissions={permissions}
            hideActions={true}
            customFilterSort={<></>}
            t={t}
          />
        </div>
      </Spin>
    </div>
  );
};
