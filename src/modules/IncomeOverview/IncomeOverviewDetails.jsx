import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "components";
import { checkModule } from "lib/checkModule";
import moment from "moment";
import { statusList, orderList } from "lib";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getIncomeOverviewList, getSearchIncomeOverviewList } from "store/Actions/dashboard";
import IncomeOverviewName from "layout/components/navbar/IncomeOverviewProfileCard/IncomeOverviewName";

export const InvoiceOverviewList = ({ myOrders }) => {
  const navigate = useNavigate()
  const para = useParams();
  const { t } = useTranslation("/Bills/ns");
  const { userModules } = useSelector((state) => state?.modules);
  const [imgError, setImgError] = useState(false);
  const { users, onlineUsers } = useSelector((state) => state);
  const { incomeOverviewList, loading, paginationProps } = useSelector((state) => state?.incomeOverview);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state?.auth);
  const { product } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState("")
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useState({})
  const [searchData, setSearchData] = useState("")
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const { permissions } = checkModule({
    module: "Orders",
    modules: userModules,
  });

  useEffect(() => {
    (async () => {
      await dispatch(getIncomeOverviewList());
    })();
  }, [dispatch]);

  useEffect(() => {
    if (incomeOverviewList) {
      let dataArr = [];
      incomeOverviewList.forEach((key, index) => {
        dataArr.push({
          id: key?.id,
          fullname: key?.fullName,
          type: key?.transactionType,
          referenceID: key?.referenceId ? key?.referenceId : "N/A",
          transactionStatus: key?.transactionStatus,
          totalPrice: key?.total,
          dateAdded: key?.createdOn ? key?.createdOn : "N/A",
          dateModified: key?.lastModifiedOn ? key?.lastModifiedOn : "N/A",
        });
      });
      setData(dataArr);
    }
  }, [incomeOverviewList]);

  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;


  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "Id",
      key: "id",
      sorter: (a, b) => (a?.id < b?.id ? -1 : 1),
      render: (text, record) => <>{record?.id?.substr(record?.id?.length - 5)}</>,
      width: "20rem",
    },
    {
      title: "Client",
      dataIndex: "fullname",
      key: "fullname",
      sorter: (a, b) => (a?.name < b?.name ? -1 : 1),
      render: (text, record) => {
        return (
          <div className="flex items-center gap-[10px] ">
            {record && record.base64Image && !imgError ? (
              <div className="bg-[#171723] flex items-center justify-center w-[47px] h-[47px] rounded-lg p-[4px]">
                <img
                  className="w-full h-full rounded-lg"
                  src={record?.base64Image}
                  alt="user"
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="bg-[#171723] flex items-center justify-center min-w-[47px] h-[47px] rounded-lg p-[4px] text-[#0BB783] text-[18px] font-bold">
                <>{record && <IncomeOverviewName isLoggedIn={isLoggedIn} incomeOverviewList={record} />}</>
              </div>
            )}
            <p className="text-white text-[14px]">{record?.fullName}</p>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => (a?.type > b?.type ? 0 : 3),
      render: (type) => {
        let color = "";
        let text = "";
        switch (type) {
          case 0:
            color = "bg-[#323248] text-[#FFFFFF]";
            text = "ORDER";
            break;
          case 1:
            color = "bg-[#323248] text-[#FFFFFF]";
            text = "ACTIVE";
            break;
          case 2:
            color = "bg-[#323248] text-[#FFFFFF]";
            text = "REFUND";
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
      title: "Reference ID",
      dataIndex: "referenceID",
      key: "referenceID",
      sorter: (a, b) => (a?.id < b?.id ? -1 : 1),
      render: (text, record) => <>{record?.id?.substr(record?.id?.length - 5)}</>,
      width: "20rem",
    },
    {
      title: "Status",
      dataIndex: "transactionStatus",
      key: "transactionStatus",
      sorter: (a, b) => (a?.transactionStatus > b?.transactionStatus ? 0 : 3),
      render: (transactionStatus) => {
        let color = "";
        let text = "";
        switch (transactionStatus) {
          case 0:
            color = "bg-[#392F28] text-[#FFA800]";
            text = "PENDING";
            break;
          case 1:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "ACTIVE";
            break;
          case 2:
            color = "bg-[#323248] text-[#FFFFFF]";
            text = "CANCELLED";
            break;
          case 3:
            color = "bg-[#3A2434] text-[#F64E60]";
            text = "SUSPENDED";
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
      width: "20rem",
    },
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      key: "dateAdded",
      width: "100rem",
      sorter: (a, b) => (moment(a?.dateAdded) < moment(b?.dateAdded) ? -1 : 1),
      render: (text, record) => record?.dateAdded !== "N/A" ? moment(record?.dateAdded).format(localStorage.getItem('dateFormat')) : "N/A",
      width: "70rem",
    },
    {
      title: "Date Modified",
      dataIndex: "dateModified",
      key: "dateModified",
      sorter: (a, b) => (moment(a?.dateModified) < moment(b?.dateModified) ? -1 : 1),
      render: (text, record) => record?.dateModified !== "N/A" ? moment(record?.dateModified).format(localStorage.getItem('dateFormat')) : "N/A",
      width: "70rem",
    },
  ];
  const onPaginationChange = (data) => {
    const { current, pageSize } = data
    const paginationData = {
      keyword: '',
      pageNumber: current,
      pageSize: pageSize,
      orderBy: [''],
      startDate: startDate || null,
      endDate: endDate || null,
    };
    data &&
      current &&
      pageSize &&
      dispatch(getSearchIncomeOverviewList(paginationData));
  }

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay]
    );
    return debouncedValue;
  }
  const debouncedSearchTerm = useDebounce(searchData, 500);
  useEffect(
    () => {
      const { pageSize,current } = paginationData
      const searchData = {
        advancedSearch: {
          fields: [
            "fullName",
          ],
          keyword: debouncedSearchTerm
        },
        keyword: '',
        pageNumber: current,
        pageSize: pageSize,
        orderBy: [''],
      };
      paginationData &&
        pageSize &&
        dispatch(getSearchIncomeOverviewList(searchData));
    },
    [debouncedSearchTerm]
  );

  const onSearchHandler = (data, paginationData) => {
    setSearchData(data)
    setPaginationData(paginationData)
  }

  return (
    <div className="pt-[30px]">
      <div className="p-[40px] pb-[24px] mx-[20px] my-[15px]  bg-[#000000] rounded-[8px]">
        <Table
          columns={columns}
          loading={loading}
          data={data}
          pagination={
            paginationProps ?
              paginationProps :
              {
                defaultPageSize: JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay > 0 ? (JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay) : 5,
                showSizeChanger: true,
                position: ["bottomRight"],
                pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
              }}
          onPaginationChange={onPaginationChange}
          onSearchHandler={onSearchHandler}
          dateRageFilter={true}
          statusFilter={orderList()}
          onRow={(record) => {
          }}
          editAction={(record) => (
            <Button
              onClick={() => {
              }
              }
            >
              View
            </Button>
          )}

          permissions={permissions}
          handleStatus={async (values) => {
            setStatus(values);
            let details = {
              transactionStatus: values,
            };
            if (startDate && endDate) {
              details["startDate"] = startDate;
              details["endDate"] = endDate;
            }
            await dispatch(getIncomeOverviewList(details));
          }}
          handleDateRange={async (date, dateString, id) => {
            let startDate = "";
            let endDate = "";
            let details = {
              userId: incomeOverviewList?.id,
            };
            if (date) {
              startDate = moment(date[0]._d).toISOString();
              endDate = moment(date[1]._d).toISOString();
              details["startDate"] = startDate;
              details["endDate"] = endDate;
            }
            if (status) {
              details["status"] = status;
            }
            
            setStartDate(startDate);
            setEndDate(endDate);
            dispatch(getIncomeOverviewList(details));
          }}
        />
      </div>
    </div>
  );
};