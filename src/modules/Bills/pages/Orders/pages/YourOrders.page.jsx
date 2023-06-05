import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "components";
import { orderList, orderList1, statusList } from "lib";
import { checkModule } from "lib/checkModule";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { getSearchOrders } from "store";
import { getYoursOrderbyId } from "store";
import { getAllAdminOrdersByID } from "store";

export const YourOrders = ({ myOrders }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("/Bills/ns");
  const dispatch = useDispatch();
  const { YoursOrders, loading, paginationProps } = useSelector(
    (state) => state?.orders
  );
  const { userModules } = useSelector((state) => state?.modules);
  const { user } = useSelector((state) => state?.auth);

  useEffect(() => {
    (async () => {
      await dispatch(getYoursOrderbyId(user?.id));
      await dispatch(getAllAdminOrdersByID(""));
    })();
  }, []);

  useEffect(() => {
    if (YoursOrders) {
      let dataArr = [];
      YoursOrders.forEach((key, index) => {
        dataArr.push({
          key: key?.id,
          orderNo: key?.orderNo !== null ? key?.orderNo : "N/A",
          fullName: key?.clientFullName,
          createdOn: key?.createdOn ? key?.createdOn : "N/A",
          customerIP: key?.customerIP ? key?.customerIP : "N/A",
          invoiceNo: key?.billNo,
          orderstatus: key?.status,
          totalPrice: key?.totalPrice,
          notes: key?.notes ? key?.notes : "N/A",
        });
      });
      setData(dataArr);
      setSearchData(dataArr);
    }
  }, [YoursOrders]);

  // Setting data properly

  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchData, setSearchData] = useState([]);
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createdDate, setCreatedDate] = useState();
  const { permissions } = checkModule({
    module: "Orders",
    modules: userModules,
  });
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;

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
            <p className="text-white">{fullName ? fullName : "N/A"}</p>
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
      dataIndex: "invoiceNo",
      key: "invoiceNo",
    },
    {
      title: "Status",
      dataIndex: "orderstatus",
      key: "orderstatus",
      render: (orderstatus) => {
        let color = "";
        let text = "";
        switch (orderstatus) {
          case 0:
            color = "bg-[#392F28] text-[#FFA800]";
            text = "DRAFT";
            break;
          case 1:
            color = "bg-[#392F28] text-[#FFA800]";
            text = "PENDING";
            break;
          case 2:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "PAID";
            break;
          case 3:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "PROCESSING";
            break;
          case 4:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "COMPLETED";
            break;
          case 5:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "ACCEPTED";
            break;
          case 6:
            color = "bg-[#3A2434] text-[#F64E60]";
            text = "CANCELLED";
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
      title: t("total"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => {
        return <>{`${totalPrice} USD`}</>;
      },
    },
    {
      title: t("admin Notes"),
      dataIndex: "notes",
      key: "notes",
    },
  ];
  // const onPaginationChange = (data) => {
  //   const { current, pageSize } = data;
  //   const paginationData = {
  //     keyword: "",
  //     pageNumber: current,
  //     pageSize: pageSize,
  //     orderBy: [""],
  //     startDate: startDate || null,
  //     endDate: endDate || null,
  //   };
  //   data && current && pageSize && dispatch(getSearchOrders(paginationData));
  // };

  // function useDebounce(value, delay) {
  //   console.log("first use of debounce");
  //   const [debouncedValue, setDebouncedValue] = useState(value);
  //   useEffect(() => {
  //     const handler = setTimeout(() => {
  //       setDebouncedValue(value);
  //     }, delay);
  //     return () => {
  //       clearTimeout(handler);
  //     };
  //   }, [value, delay]);
  //   return debouncedValue;
  // }
  // const debouncedSearchTerm = useDebounce(searchData, 500);
  // useEffect(() => {
  //   const { pageSize } = paginationData;
  //   const searchData = {
  //     advancedSearch: {
  //       fields: ["fullName"],
  //       keyword: debouncedSearchTerm,
  //     },
  //     keyword: "",
  //     pageNumber: 0,
  //     pageSize: pageSize,
  //     orderBy: [""],
  //   };
  //   paginationData && pageSize && dispatch(getSearchOrders(searchData));
  // }, [debouncedSearchTerm]);

  const onSearchHandler = (searchText, paginationData) => {
    setSearchText(searchText);
    filterOrders(searchText, status, createdDate);
  };

  const filterOrders = (searchText, values, date) => {
    if (values || searchText.length || date) {
      console.log(date, "DATA");
      var fromDate = date ? new Date(moment(date[0]._d).format()) : null;
      var toDate = date ? new Date(moment(date[1]._d).format()) : null;

      const newItem = searchData.filter((obj) => {
        var fullName = obj?.fullName?.toLowerCase();
        var orderNo = obj?.orderNo.toString();
        var orderstatus = parseInt(obj?.orderstatus);
        var filterDate = new Date(moment(obj.createdOn).format());

        return searchText && !values && !date
          ? fullName?.includes(searchText?.toLowerCase()) ||
              orderNo?.includes(searchText)
          : !searchText && values && !date
          ? orderstatus === parseInt(values)
          : !searchText && !values && date
          ? filterDate >= fromDate && filterDate <= toDate
          : searchText && values && !date
          ? (fullName?.includes(searchText?.toLowerCase()) ||
              orderNo?.includes(searchText)) &&
            orderstatus === parseInt(values)
          : searchText && values && date
          ? (fullName?.includes(searchText?.toLowerCase()) ||
              orderNo?.includes(searchText)) &&
            orderstatus === parseInt(values) &&
            filterDate >= fromDate &&
            filterDate <= toDate
          : searchText && date && !values
          ? (fullName?.includes(searchText?.toLowerCase()) ||
              orderNo?.includes(searchText)) &&
            filterDate >= fromDate &&
            filterDate <= toDate
          : values && date && !searchText
          ? orderstatus === parseInt(values) &&
            filterDate >= fromDate &&
            filterDate <= toDate
          : setData(searchData);
      });

      setData(newItem);
    } else {
      setData(searchData);
    }
  };

  return (
    <div className="">
      <div className="p-[40px] pb-[24px] mx-[20px] my-[15px]  bg-[#000000] rounded-[8px]">
        <Table
          columns={columns}
          loading={loading}
          data={data}
          pagination={
            paginationProps
              ? paginationProps
              : {
                  defaultPageSize:
                    JSON.parse(localStorage.getItem("CurrentUser"))
                      ?.recordsToDisplay > 0
                      ? JSON.parse(localStorage.getItem("CurrentUser"))
                          ?.recordsToDisplay
                      : 5,
                  showSizeChanger: true,
                  position: ["bottomRight"],
                  pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
                }
          }
          // onPaginationChange={onPaginationChange}
          onSearchHandler={onSearchHandler}
          dateRageFilter={true}
          statusFilter={orderList1()}
          onRow={(record) => {}}
          editAction={(record) => (
            <Button
              onClick={() => {
                navigate(
                  `/admin/dashboard/billing/orders/${
                    myOrders ? "your-orders" : "all-orders"
                  }/list/edit/${record?.key}`
                );
              }}
            >
              View
            </Button>
          )}
          permissions={permissions}
          btnData={{
            text: "All Orders",
            onClick: () => {
              navigate(`/admin/dashboard/billing/orders/all-orders/list`);
            },
            customClass: "px-[82px]",
          }}
          handleStatus={async (values) => {
            setStatus(values);
            filterOrders(searchText, values, createdDate);
          }}
          handleDateRange={async (date, dateString, id) => {
            filterOrders(searchText, status, date);
            setCreatedDate(date);
            // let startDate = "";
            // let endDate = "";
            // let details = {};
            // if (date) {
            //   startDate = moment(date[0]._d).toISOString();
            //   endDate = moment(date[1]._d).toISOString();
            //   console.log(moment(date[0]._d), date[0]._d, "Date1");
            //   details["startDate"] = startDate;
            //   details["endDate"] = endDate;
            // }
            // if (status) {
            //   details["status"] = status;
            // }

            // setStartDate(startDate);
            // setEndDate(endDate);
            // dispatch(getYoursOrderbyId(details));
          }}
        />
      </div>
    </div>
  );
};
