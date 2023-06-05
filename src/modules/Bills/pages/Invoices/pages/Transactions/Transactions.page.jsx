import { useEffect, useState } from "react";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Formik, Form } from "formik";

import { checkModule } from "lib/checkModule";
import { getTransactions } from "store";
import { Table, DateRangePicker } from "components";
import { getName } from "lib";
import { Details } from "./sections/Details.section";

export const Transactions = () => {
  const { t } = useTranslation("/Bills/ns");
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Invoices",
    modules: userModules,
  });

  const dispatch = useDispatch();
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const { loading, transactions } = useSelector((state) => state?.transactions);
  useEffect(() => {
    (async () => {
      await dispatch(getTransactions());
    })();
  }, []);

  // Set Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a?.id < b?.id ? -1 : 1),
      render: (text) => <>{text.substring(0, 6)}</>,
    },
    {
      title: "Client",
      dataIndex: "transactionBy",
      key: "transactionBy",
      sorter: (a, b) => (a?.transactionBy < b?.transactionBy ? -1 : 1),
      width: "20%",
      render: (text, record) => {
        const { fullName, userImagePath } = record;
        return (
          <div className="flex items-center gap-[12px]">
            {/* {userImagePath ? (
              <img
                src={userImagePath}
                alt={fullName}
                className="h-[40px] w-[40px] object-cover rounded-[8px]"
              />
            ) : (
              <div className="bg-[#171723] h-[40px] w-[40px] rounded-[8px] text-[#0BB783] font-medium text-[20px] flex items-center justify-center">
                {getName({ user: { fullName } })}
              </div>
            )} */}
            <div>{fullName ? fullName : "N/A"}</div>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (text) => (
        <div className="text-white text-center text-[12px] w-[fit-content] font-medium rounded-[4px] px-[8px] py-[4px] bg-[#323248]">
          {text === 0 ? "ORDER" : "REFUND"}
        </div>
      ),
    },
    {
      title: "Reference ID",
      dataIndex: "referenceId",
      key: "referenceId",
      sorter: (a, b) => (a?.referenceId < b?.referenceId ? -1 : 1),
      render: (text) => <>{text.substring(0, 6)}</>,
    },
    {
      title: "Status",
      dataIndex: "transactionStatus",
      key: "transactionStatus",
      render: (text) => (
        <div
          className={`${
            text === 0
              ? "text-[#FFA800] bg-[#392F28]"
              : text === 1
              ? "text-[#0BB783] bg-[#1C3238]"
              : "text-[#F64E60] bg-[#3A2434]"
          } px-[8px] py-[4px] text-center rounded-[4px] w-[fit-content] text-[12px] font-medium`}
        >
          {text === 0 ? "PENDING" : text === 1 ? "COMPLETED" : "CANCELLED"}
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => (a?.total < b?.total ? -1 : 1),
      render: (text) => <>{Number(text).toFixed(2)} USD</>,
    },
    {
      title: "Date Added",
      dataIndex: "createdOn",
      key: "createdOn",
      sorter: (a, b) => (moment(a?.createdOn) < moment(b?.createdOn) ? -1 : 1),
      render: (text) => <>{moment(text).format(localStorage.getItem('dateFormat'))}</>,
    },
    {
      title: "Date Modified",
      dataIndex: "lastModifiedOn",
      key: "lastModifiedOn",
      sorter: (a, b) =>
        moment(a?.lastModifiedOn) < moment(b?.lastModifiedOn) ? -1 : 1,
      render: (text) => <>{moment(text).format(localStorage.getItem('dateFormat'))}</>,
    },
  ];

  // Filter Data
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    const filteredData = transactions.filter((transaction) => {
      if (dateRange?.length) {
        const startDate = dateRange[0];
        const endDate = dateRange[1];
        const compareDate = transaction?.createdOn;
        return moment(compareDate).isBetween(startDate, endDate);
      } else {
        return false;
      }
    });

    setFilteredData(filteredData);
  }, [dateRange]);

  // Set Data with Client Name for Filter
  const [data, setData] = useState([]);
  useEffect(() => {
    if (transactions?.length) {
      const dataHolder = transactions.map((transaction) => {
        return {
          key: transaction?.id,
          ...transaction,
        };
      });
      setData(dataHolder);
    }
  }, [transactions]);

  const [transaction, setTransaction] = useState(null);
  const [show, setShow] = useState(false);

  return (
    <Formik initialValues={{ dateRange: [] }}>
      {() => {
        return (
          <Form>
            <div className="p-[40px]">
              <Details show={show} setShow={setShow} details={transaction} />
              <div className="p-[40px] pb-[24px] bg-[#000000] rounded-[8px]">
                <Table
                  columns={columns}
                  data={filteredData.length ? filteredData : data}
                  loading={loading}
                  pagination={{
                    defaultPageSize: JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay > 0 ? (JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay) : 5,
                    showSizeChanger: true,
                    position: ["bottomRight"],
                    pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
                  }}
                  fieldToFilter="name"
                  editAction={(record) => (
                    <>
                      <Button onClick={() => {}}>View</Button>
                    </>
                  )}
                  permissions={permissions}
                  dateRangeSelector={
                    <>
                      <DateRangePicker
                        name="dateRange"
                        onChange={(date) => setDateRange(date)}
                      />
                    </>
                  }
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        event.preventDefault();
                        setShow(true);
                        setTransaction(record);
                      }, // click row
                      onDoubleClick: (event) => {}, // double click row
                      onContextMenu: (event) => {}, // right button click row
                      onMouseEnter: (event) => {}, // mouse enter row
                      onMouseLeave: (event) => {}, // mouse leave row
                    };
                  }}
                  t={t}
                />
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
