import { Spin } from "antd";
import moment from "moment";
import { Button, Table } from "components";
import { checkModule } from "lib/checkModule";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getInvoices, getCreditBalanceByClient } from "store";
import { statusList } from "lib";

export const Invoices = ({ clientTab }) => {
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  const { id } = useParams();
  const { t } = useTranslation("/Bills/ns");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await dispatch(getInvoices());
      await dispatch(getCreditBalanceByClient(id));
    })();
  }, [dispatch]);
  const { invoices, loading } = useSelector((state) => state?.invoices);
  const { user } = useSelector((state) => state?.users);
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Invoices",
    modules: userModules,
  });

  const userInvoices = invoices?.filter((invoice) => invoice?.userId === id);

  const columns = [
    {
      title: t("invoiceId"),
      dataIndex: "billNo",
      key: "billNo",
      sorter: (a, b) => (a?.billNo < b?.billNo ? -1 : 1),
    },
    {
      title: t("issueDate"),
      dataIndex: "createdOn",
      key: "createdOn",
      sorter: (a, b) => (moment(a?.createdOn) < moment(b?.createdOn) ? -1 : 1),
      render: (createdOn) => moment(createdOn).format(localStorage.getItem('dateFormat')),
    },
    {
      title: t("dueDate"),
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => (moment(a?.dueDate) < moment(b?.dueDate) ? -1 : 1),
      render: (dueDate) => moment(dueDate).format(localStorage.getItem('dateFormat')),
    },
    {
      title: t("issuedFor"),
      dataIndex: "issuedFor",
      key: "issuedFor",
      sorter: (a, b) => (a?.issuedFor < b?.issuedFor ? -1 : 1),
      render: (issuedFor, record) => {
        return (
          <div className="flex items-center gap-[12px]">
            {record?.issueForImage && (
              <img
                src={record?.issueForImage}
                alt="card"
                className="w-[32px] h-[20px] object-cover rounded-[4px]"
              />
            )}
            <p className="text-white">{issuedFor}</p>
          </div>
        );
      },
    },
    // {
    //   title: t("issuedBy"),
    //   dataIndex: "issuedBy",
    //   key: "issuedBy",
    //   sorter: (a, b) => (a?.issuedBy < b?.issuedBy ? -1 : 1),
    //   render: (issuedBy, record) => {
    //     return (
    //       <div className="flex items-center gap-[12px]">
    //         {record?.issueByImage && (
    //           <img
    //             src={record?.issueByImage}
    //             alt="card"
    //             className="w-[32px] h-[20px] object-cover rounded-[4px]"
    //           />
    //         )}
    //         <p className="text-white">{issuedBy}</p>
    //       </div>
    //     );
    //   },
    // },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusValue = statusList(status);
        return (
          <div
            className={`bg-[${statusValue.bg}] px-[8px] py-[4px] text-[${statusValue.text}] w-[fit-content] rounded-[4px]`}
          >
            {statusValue.name}
          </div>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Link
          to={`/admin/dashboard/billing/orders/all-orders/list/edit/${id}`}
          onClick={(event) => event.stopPropagation()}
          className="text-[#3699FF] hover:text-[#0BB783]"
        >
          View Invoice
        </Link>
      ),
    },
  ];

  const [data, setData] = useState([]);
  useEffect(() => {
    setData([]);
    if (userInvoices?.length) {
      const dataToSet = userInvoices?.map((b) => {
        return {
          ...b,
          key: b?.id,
          id: b?.id,
        };
      });

      setData(dataToSet);
    }
  }, [invoices]);

  return (
    <div className="mt-4 p-[32px] bg-[#000000] rounded-lg">
      <Spin spinning={loading}>
        <div className="flex items-center justify-between">
          <h6 className="text-white mb-[32px] text-[16px]">Invoices/Billing</h6>
          <h6 className="text-white mb-[32px] text-[16px]">
            Account Credit: $<strong>{user.creditBalance.toFixed(2)}</strong>
          </h6>
        </div>
        <div className="h-0 w-full border-t-[1px] border-dashed border-[#323248] " />
        <div className="flex justify-start gap-4 mt-2 mb-4">
          <Button type="ghost" onClick={() => {
            clientTab('ACCOUNT STATEMENT')
            window.scrollTo(0, 0)
          }}>Manage Credit</Button>
          <Button type="ghost">Generate Due Invoices</Button>
        </div>
        {/* {userInvoices?.length ? ( */}
        <Table
          columns={columns}
          rowKey={(record) => record?.id}
          data={data}
          emptyText="No Invoices issued Yet"
          searchText="Search invoices here"
          loading={loading}
          hideActions
          permissions={permissions}
          btnData={{
            text: "Create Invoice",
            //   onClick: () =>
            //     navigate(
            //       `/admin/dashboard/support/tickets/show-all/list/generate-ticket?client=${id}`
            //     ),
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(
                  `/admin/dashboard/billing/invoices/list/details/${record.id}`
                );
              },
            };
          }}
        />
        {/* ) : (
        <h4 className="text-white mt-[16px] text-center w-full">
          No Invoices issued Yet!
        </h4>
        )} */}
      </Spin>
    </div>
  );
};
