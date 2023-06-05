import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "components";
import { Button } from "antd";
import { statusList } from "lib";
import { checkModule } from "lib/checkModule";
import { getOrders } from "store";
import moment from "moment";
import { NavLink, useNavigate } from "react-router-dom";
import { AddOrder } from "./sections/AddOrder.section";
import { getClients } from "store";
import { getProducts } from "store";
import { getOrderTemplates } from "store";
import { ViewNotes, ViewOrderNotes } from "./sections";
import { getSearchOrders } from "store";
import OrderName from "layout/components/navbar/OrderProfileCard/OrderName";
import {} from "store";
import { ClientList } from "../../Clients/pages";
import { getAllAdminOrdersByID } from "store";
import { getUsers } from "store";

export const AllOrders = ({ myOrders }) => {
  const navigate = useNavigate();
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const [showAdd, setShowAdd] = useState(false);
  const { t } = useTranslation("/Bills/ns");
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [imgError, setImgError] = useState(false);
  const dispatch = useDispatch();
  const { allOrders, loading, paginationProps } = useSelector(
    (state) => state?.orders
  );
  const [paginationData, setPaginationData] = useState({});
  const [searchData, setSearchData] = useState("");
  const { userModules } = useSelector((state) => state?.modules);
  const { user } = useSelector((state) => state?.auth);
  const { users, onlineUsers } = useSelector((state) => state?.users);
  const { clients } = useSelector((state) => state?.users);
  const { orders } = useSelector((state) => state?.orders);
  const [orderNotes, setOrderNotes] = useState("");
  const [noteModalShow, setNoteModalShow] = useState(false);
  const [productsShow, setProductsShow] = useState(false);
  const { products } = useSelector((state) => state?.products);

  const filtered = useMemo(() => {
    const clientList = clients?.filter((client) => client?.isDeleted === false);
    return clientList?.filter(
      (client) => !client.parentID && client.fullName != null
    );
  }, [clients]);

  useEffect(() => {
    (async () => {
      await dispatch(getOrders());
      await dispatch(getUsers());
      await dispatch(getAllAdminOrdersByID(""));
      await dispatch(getClients());
    })();
  }, []);

  useEffect(() => {
    if (allOrders) {
      let dataArr = [];
      allOrders.forEach((key, index) => {
        dataArr.push({
          key: key?.id,
          orderNo: key?.orderNo !== null ? key?.orderNo : "N/A",
          fullName: key?.clientFullName,
          createdOn: key?.createdOn ? key?.createdOn : "N/A",
          customerIP: key?.customerIP ? key?.customerIP : "N/A",
          invoiceNo: key?.billNo,
          status: key?.status ? key?.status : "N/A",
          totalPrice: key?.totalPrice,
          orderNotes: key?.orderNotes ? key?.orderNotes : "N/A",
        });
      });
      setData(dataArr);
    }
  }, [allOrders]);

  // Setting Data Properly

  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { permissions } = checkModule({
    module: "Orders",
    modules: userModules,
  });

  let usersData = [{ label: "Any", value: "" }];
  if (users?.length) {
    users?.forEach((user) => {
      const isOnline = onlineUsers?.find((admin) => admin?.userId === user?.id)
        ? true
        : false;
      usersData.push({
        value: user?.id,
        label: user?.fullName
          ? `${user?.fullName}${isOnline ? "   (Online)" : ""}`
          : "N/A",
        isActive: isOnline ? true : false,
      });
    });
  }

  const AdvancedSearchOptions = {
    searchValues: {
      orderId: "",
      dateAdded: "",
      status: "",
      total: "",
      client: "",
      admin: "",
      numResult: 100,
      title: "",
    },

    fields: [
      {
        label: "Order No",
        name: "orderId",
        type: "text",
        variant: "text",
        placeholder: "36",
      },
      {
        label: "Amount",
        name: "total",
        type: "number",
        variant: "text",
        placeholder: "100",
      },
      {
        label: "Date",
        name: "dateAdded",
        type: "date",
        variant: "dateRange",
        placeholder: "12-13-2022",
      },
      {
        label: "Client",
        name: "client",
        type: "text",
        variant: "searchable",
        options: filtered,
      },
      {
        label: "Status",
        name: "status",
        type: "select",
        variant: "select",
        options: [
          { label: "Any", value: "" },
          { label: "Draft", value: 0 },
          { label: "Pending", value: 1 },
          { label: "Paid", value: 2 },
          { label: "Processing", value: 3 },
          { label: "Accepted", value: 4 },
          { label: "Completed", value: 5 },
          { label: "Canceled", value: 6 },
        ],
      },
      {
        label: "Admin",
        name: "admin",
        type: "select",
        placeholder: "Select Admin",
        variant: "select",
        options: usersData,
      },
      {
        label: "Max Results",
        name: "numResult",
        type: "number",
        variant: "text",
      },
      {
        label: "Search string",
        name: "title",
        type: "text",
        variant: "text",
      },
    ],
  };

  const columns = [
    {
      title: t("orderId"),
      dataIndex: "orderNo",
      key: "orderNo",
    },
    {
      title: t("client"),
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName, record) => {
        return (
          <div className="flex items-center gap-[12px]">
            <p className="text-white">
              {record?.clientFullName ? record?.clientFullName : "N/A"}
            </p>
          </div>
        );
      },
    },
    {
      title: t("Order Date"),
      dataIndex: "createdOn",
      key: "createdOn",
      sorter: (a, b) => (moment(a?.createdOn) < moment(b?.createdOn) ? -1 : 1),
      render: (text, record) =>
        record?.createdOn !== "N/A"
          ? moment(record?.createdOn).format(localStorage.getItem("dateFormat"))
          : "N/A",
    },
    {
      title: t("Customer IP"),
      dataIndex: "customerIP",
      key: "customerIP",
    },
    {
      title: t("Invoice Number"),
      dataIndex: "billNo",
      key: "billNo",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        let text = "";
        switch (status) {
          case 0:
            color = "bg-[#392F28] text-[#FFA800]";
            text = "Draft";
            break;
          case 1:
            color = "bg-[#392F28] text-[#FFA800]";
            text = "Pending";
            break;
          case 2:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "Paid";
            break;
          case 3:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "Processing";
            break;
          case 4:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "Accepted";
            break;
          case 5:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "Completed";
            break;
          case 6:
            color = "bg-[#3A2434] text-[#F64E60]";
            text = "Cancelled";
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
    {
      title: t("View Products"),
      dataIndex: "products",
      key: "products",

      render: (notes, record) => {
        return (
          <NavLink
            className="text-blue-500 text-uppercase"
            to="/admin/dashboard/billing/products-services/list/show"
          >
            {t("view Products")}
          </NavLink>
        );
      },
    },
    {
      title: t("total"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => {
        return <>{`${totalPrice} USD`}</>;
      },
    },
    {
      title: t("orderNotes"),
      dataIndex: "orderNotes",
      key: "orderNotes",

      render: (notes, record) => {
        return (
          <NavLink
            className="text-blue-500 text-uppercase"
            to="#"
            onClick={(e) => {
              e.stopPropagation();
              setOrderNotes(record);
              setNoteModalShow(true);
            }}
          >
            {t("Order Notes")}
          </NavLink>
        );
      },
    },
  ];

  const onPaginationChange = (data) => {
    const { current, pageSize } = data;
    const paginationData = {
      keyword: "",
      pageNumber: current,
      pageSize: pageSize,
      orderBy: [""],
    };
    data && current && pageSize && dispatch(getSearchOrders(paginationData));
  };

  return (
    <div className="p-[40px]">
      <div className="p-[40px] pb-[24px] bg-[#000000] rounded-[8px]">
        <ViewOrderNotes
          show={noteModalShow}
          setShow={setNoteModalShow}
          notesValue={orderNotes}
        />
        <Table
          AdvancedSearchOptions={AdvancedSearchOptions}
          columns={columns}
          data={
            myOrders
              ? orders?.filter((order) => order?.adminAssigned === user?.id)
              : orders
          }
          btnData={{
            text: "Add Order",
            onClick: () =>
              navigate(
                `/admin/dashboard/billing/orders/${
                  myOrders ? "your-orders" : "all-orders"
                }/list/add/new`
              ),
          }}
          loading={loading}
          pagination={
            paginationProps
              ? paginationProps
              : {
                  defaultPageSize: 5,
                  showSizeChanger: true,
                  position: ["bottomRight"],
                  pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
                }
          }
          editAction={(record) => (
            <Button
              onClick={() => {
                navigate(
                  `/admin/dashboard/billing/orders/${
                    myOrders ? "your-orders" : "all-orders"
                  }/list/edit/${record?.id}`
                );
              }}
            >
              View
            </Button>
          )}
          onPaginationChange={onPaginationChange}
          dateRageFilter={true}
          statusFilter={statusList()}
          fieldToFilter="orderNo"
          handleStatus={async (values) => {
            setStatus(values);
            let details = {
              status: values,
              userId: user?.id,
            };

            if (startDate && endDate) {
              details["startDate"] = startDate;
              details["endDate"] = endDate;
            }
            await dispatch(getOrders(details));
          }}
          handleDateRange={async (date, dateString, id) => {
            let startDate = "";
            let endDate = "";
            let details = {
              userId: user?.id,
            };
            if (date) {
              startDate = date[0]._d;
              endDate = date[1]._d;
              details["startDate"] = startDate;
              details["endDate"] = endDate;
            }

            if (status) {
              details["status"] = status;
            }

            setStartDate(startDate);
            setEndDate(endDate);
            await dispatch(getOrders(details));
          }}
          permissions={permissions}
          t={t}
        />
      </div>
    </div>
  );
};
