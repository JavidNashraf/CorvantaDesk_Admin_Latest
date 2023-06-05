import { useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getClients, getUsers, getBrands } from "store";
import { checkModule } from "lib/checkModule";
import { Table } from "components";
import { AddClientUser, EditClientUser } from "./sections";
import { useQuery } from "components/TicketDetails/sections/Details/Details.section";

export const ClientList = () => {
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.settings?.dateFormat;
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const navigate = useNavigate();

  const { clients, loading } = useSelector((state) => state?.users);
  const brandsLoading = useSelector((state) => state?.brands?.loading);
  const brands = useSelector((state) => state?.brands?.brands);

  const query = useQuery();
  const brandIdParam = query.get("brandId");

  const { t } = useTranslation("/Bills/ns");
  const { user } = useSelector((state) => state?.auth);
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Users",
    modules: userModules,
  });
  const roles = user.userRolesResponse.userRoles;
  const isAdmin = roles && (roles[0].enabled || roles[1].enabled);
  const columns = [
    {
      title: "Client Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => (a?.fullName < b?.fullName ? -1 : 1),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a?.email < b?.email ? -1 : 1),
    },
    {
      title: "Brand",
      dataIndex: "brandId",
      key: "brandId",
      sorter: (a, b) => (a?.brandId < b?.brandId ? -1 : 1),
      render: (brandId) => {
        var brandLink = "#";
        const brandCompanyName = brands?.length > 0 && !!brandId   ? brands?.filter((brand) => brand?.id == brandId)?.[0]?.companyName : "";
        if (brandCompanyName?.length > 0) {
          brandLink = `/admin/dashboard/settings/brands`;
        }
        return (
          <a href={brandLink}> {brandCompanyName} </a>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      sorter: (a, b) => (a?.isActive < b?.isActive ? -1 : 1),
      render: (isActive) => {
        let color = "";
        let text = "";
        switch (isActive) {
          case true:
            color = "bg-[#392F28] text-[#0BB783]";
            text = "ACTIVE";
            break;
          case false:
            color = "bg-[#3A2434] text-[#F64E60]";
            text = "INACTIVE";
            break;
          default:
            color = "";
            text = "UNKNOWN";
        }

        return (
          <div
            className={`${color} px-[8px] py-[4px] w-[fit-content] rounded-[4px]`}
          >
            {text}
          </div>
        );
      },
    },
  ];

  let filtered = useMemo(() => {
    const clientList = brandIdParam != "" ? clients?.filter((client) => client?.isDeleted === false && client?.brandId == brandIdParam) : clients?.filter((client) => client?.isDeleted === false);
    if (isAdmin) return clientList;
    return clientList?.filter((client) => !client.parentID);
  }, [clients, isAdmin]);

  const [filterData, setfilterData] = useState([]);
  const onSearchHandler = (data, paginationData) => {
    const filterData = filtered.filter(
      (obj) =>
        obj?.fullName?.toLowerCase().includes(data.toLowerCase()) ||
        obj?.userName?.toLowerCase().includes(data.toLowerCase())
    );
    setfilterData(filterData);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(getBrands());
      await dispatch(getUsers());
      await dispatch(getClients());
    })();
  }, []); 

  return (
    <div className="p-[40px]">
      <AddClientUser show={showAdd} setShow={setShowAdd} />
      <EditClientUser
        show={showEdit}
        setShow={setShowEdit}
        client={clientDetails}
      />
      <div className="p-[40px] pb-[24px] bg-[#000000] rounded-[8px]">
        <Table
          columns={columns}
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
          rowKey={(record) => record?.id}
          data={filterData.length ? filterData : filtered}
          loading={loading || brandsLoading }
          onSearchHandler={onSearchHandler}
          fieldToFilter="fullName"
          btnData={{
            text: "Add Client",
            onClick: () => setShowAdd(true),
            customClass: "px-[82px]",
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(
                  `/admin/dashboard/billing/clients/list/details/${record?.id}`
                );
              },
            };
          }}
          viewAction={(record) => (
            <Button
              onClick={() => {
                navigate(
                  `/admin/dashboard/billing/clients/list/details/${record?.id}`
                );
              }}
            >
              View
            </Button>
          )}
          editAction={(record) => (
            <>
              <Button
                onClick={() => {
                  setShowEdit(true);
                  setClientDetails(record);
                }}
              >
                Edit
              </Button>
              {/* <Button onClick={() => {}}>Login As Client</Button> */}
            </>
          )}
          // deleteAction={(record) => (
          //   <>
          //     <Button
          //       onClick={() => {
          //         setShowEdit(true);
          //         setClientDetails(record);
          //       }}
          //     >
          //       Delete
          //     </Button>
          //     {/* <Button onClick={() => {}}>Login As Client</Button> */}
          //   </>
          // )}
          permissions={permissions}
          t={t}
        />
      </div>
    </div>
  );
};
