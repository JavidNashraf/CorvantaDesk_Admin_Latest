import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Input, Table } from "components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { checkModule } from "lib/checkModule";
import { useEffect, useState } from "react";
import { getProducts } from "store";
import { Form, Formik } from "formik";
import {
  Cancel,
  Delete,
  Renew,
  Suspend,
  Terminate,
  Unsuspend,
} from "./sections";
import { getSearchProductList } from "store";
import { orderList } from "lib";

export const PSList = () => {
  // const [showAdd, setShowAdd] = useState(false);
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  // const { clients } = useSelector((state) => state?.users);
  const { t } = useTranslation("/Bills/ns");
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Products",
    modules: userModules,
  });

  const Options = [
    { label: "Hourly", value: 0 },
    { label: "Monthly", value: 1 },
    { label: "Quarterly", value: 2 },
    { label: "SemiAnnually", value: 3 },
    { label: "Annually", value: 4 },
    { label: "Biennially", value: 5 },
    { label: "Triennially", value: 6 },
  ];


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a?.id < b?.id ? -1 : 1),
      render: (text) => <>{text.substr(text.length - 5)}</>,
    },
    {
      title: "Summary",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a?.name < b?.name ? -1 : 1),
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        let text = "";
        switch (status) {
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
            text = "ACCEPTED";
            break;
          case 5:
            color = "bg-[#1C3238] text-[#0BB783]";
            text = "COMPLETED";
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
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(getProducts());
    })();
  }, [dispatch]);
  
  const { products, loading, paginationProps } = useSelector((state) => state?.products);
  const categoriesLoading = useSelector((state) => state?.categories?.loading);
  const [showDelete, setShowDelete] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [showTerminate, setShowTerminate] = useState(false);
  const [showRenew, setShowRenew] = useState(false);
  const [showUnsuspend, setShowUnsuspend] = useState(false);
  const [record, setRecord] = useState(null);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [paginationData, setPaginationData] = useState({})
  const [searchData, setSearchData] = useState("")

  useEffect(() => {
    if (products) {
      let dataArr = [];
      products.forEach((key, index) => {
        dataArr.push({
          id: key?.id,
          name: key?.name,
          summary: key?.description,
          totalPrice: key?.totalPriceOfLineItems,
          status: key?.status,
        });
      });
      setData(dataArr);
    }
  }, [products]);

  const onPaginationChange = (data) => {
    const { current, pageSize } = data
    const paginationData = {
      keyword: '',
      pageNumber: current,
      pageSize: pageSize,
      orderBy: [''],
    };
    data &&
      current &&
      pageSize &&
      dispatch(getSearchProductList(paginationData));
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
            "Name",
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
        dispatch(getSearchProductList(searchData));
    },
    [debouncedSearchTerm]
  );

  const onSearchHandler = (data, paginationData) => {
    setSearchData(data)
    setPaginationData(paginationData)
  }


  return (
    <div className="p-[40px]">
      {/* <Add show={showAdd} setShow={setShowAdd} /> */}
      <Delete show={showDelete} setShow={setShowDelete} record={record} />
      <Cancel show={showCancel} setShow={setShowCancel} record={record} />
      <Suspend show={showSuspend} setShow={setShowSuspend} record={record} />
      <Terminate
        show={showTerminate}
        setShow={setShowTerminate}
        record={record}
      />
      <Renew show={showRenew} setShow={setShowRenew} record={record} />
      <Unsuspend
        show={showUnsuspend}
        setShow={setShowUnsuspend}
        record={record}
      />
      <div className="p-[40px] pb-[24px] bg-[#000000] rounded-[8px]">
        <Formik initialValues={{ selectFilter: "name" }}>
          {({ values }) => (
            <Form>
              <Table
                columns={columns}
                pagination={
                   paginationProps?
                       paginationProps:{
                  defaultPageSize: JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay > 0 ? (JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay) : 5,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
                  position: ["bottomRight"],
                }}
                onPaginationChange={onPaginationChange}
                onSearchHandler={onSearchHandler}
                data={data}
                statusFilter={orderList()}
                loading={categoriesLoading || loading}
                fieldToFilter={values?.selectFilter}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      navigate(
                        `/admin/dashboard/billing/products-services/list/details/${record?.id}`
                      );
                    },
                  };
                }}
                handleStatus={async (values) => {
                  setStatus(values);
                  let details = {
                    status: values,
                  };
                  await dispatch(getProducts(details));
                }}
                editAction={(record) => (
                  <Button
                    onClick={() => {
                      navigate(
                        `/admin/dashboard/billing/products-services/list/details/${record?.id}`
                      );
                    }}
                  >
                    View
                  </Button>
                )}
                deleteAction={(record) => (
                  <>
                    <Button
                      onClick={() => {
                        setRecord(record);
                        setShowDelete(true);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => {
                        setRecord(record);
                        if (record?.status === 4) {
                          setShowUnsuspend(true);
                        } else {
                          setShowSuspend(true);
                        }
                      }}
                    >
                      {record?.status === 4 ? "Un-Suspend" : "Suspend"}
                    </Button>
                    <Button
                      onClick={() => {
                        setRecord(record);
                        setShowTerminate(true);
                      }}
                    >
                      Terminate
                    </Button>
                    <Button
                      onClick={() => {
                        setRecord(record);
                        setShowRenew(true);
                      }}
                    >
                      Renew
                    </Button>
                    <Button
                      onClick={() => {
                        setRecord(record);
                        setShowCancel(true);
                      }}
                    >
                      Cancel
                    </Button>
                    {/* <Button>Termiate</Button> */}
                  </>
                )}
                permissions={permissions}
                t={t}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
