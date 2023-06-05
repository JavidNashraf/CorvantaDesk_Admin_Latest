import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "components";
import { checkModule } from "lib/checkModule";
import { NavLink, useNavigate } from "react-router-dom";
import { ViewNotes } from "../../../sections";
import { getOrderTemplates } from "store";
import moment from "moment";
// import { OrderTemplate } from '../sections/OrderTemplate.section';
// import { EditOrderTemplate } from '../sections/EditTemplate.section';
import { Button, Popconfirm } from "antd";
import { deleteOrderTemplateByID } from "store";

export const OrderTemplates = () => {
  const { t } = useTranslation("/Bills/ns");
  const dispatch = useDispatch();
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;
  useEffect(() => {
    (async () => {
      await dispatch(getOrderTemplates());
    })();
  }, [dispatch]);

  // Setting data properly
  const [data, setData] = useState([]);
  const [notes, setNotes] = useState("");
  const [noteModalShow, setNoteModalShow] = useState(false);

  const { orderTemplates, loading } = useSelector((state) => state?.orders);
  const { userModules } = useSelector((state) => state?.modules);

  const { permissions } = checkModule({
    module: "Orders",
    modules: userModules,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setData([]);
    if (orderTemplates?.length) {
      const dataToSet = orderTemplates?.map((b) => {
        return {
          ...b,
          key: b?.id,
        };
      });
      setData(dataToSet);
    }
  }, [orderTemplates]);

  const columns = [
    {
      title: "Template Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a?.name < b?.name ? -1 : 1),
    },
    {
      title: "Created On",
      dataIndex: "createdOn",
      key: "createdOn",
      sorter: (a, b) => (moment(a?.createdOn) < moment(b?.createdOn) ? -1 : 1),
      render: (text) => moment(text).format(localStorage.getItem('dateFormat')),
    },
    {
      title: "Last Modified On",
      dataIndex: "lastModifiedOn",
      key: "lastModifiedOn",
      sorter: (a, b) =>
        moment(a?.lastModifiedOn) < moment(b?.lastModifiedOn) ? -1 : 1,
      render: (text) => moment(text).format(localStorage.getItem('dateFormat')),
    },
    {
      title: t("orderNotes"),
      dataIndex: "notes",
      key: "notes",

      render: (notes, record) => {
        return (
          <NavLink
            className="text-blue-500 text-uppercase"
            to="#"
            onClick={(e) => {
              e.stopPropagation();
              setNotes(record);
              setNoteModalShow(true);
            }}
          >
            {t("viewNotes")}
          </NavLink>
        );
      },
    },
  ];

  return (
    <div className="p-[40px]">
      <div className="p-[40px] pb-[24px] bg-[#000000] rounded-[8px]">
        <ViewNotes
          show={noteModalShow}
          setShow={setNoteModalShow}
          notesValue={notes}
        />
        {/* <OrderTemplate show={showAdd} setShow={setShowAdd} />
        <EditOrderTemplate
          show={showEdit}
          setShow={setShowEdit}
          orderTemplate={orderTemplate}
        /> */}
        <Table
          columns={columns}
          data={data}
          loading={loading}
          pagination={{
            defaultPageSize: JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay > 0 ? (JSON.parse(localStorage.getItem("CurrentUser"))?.recordsToDisplay) : 5,
            showSizeChanger: true,
            position: ["bottomRight"],
            pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
          }}
          permissions={permissions}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(
                  `/admin/dashboard/billing/orders/order-templates/list/edit/${record?.id}`
                );
              },
            };
          }}
          editAction={(record) => {
            return (
              <Button
                htmlType="button"
                onClick={() => {
                  navigate(
                    `/admin/dashboard/billing/orders/order-templates/list/edit/${record?.id}`
                  );
                }}
              >
                View/Edit
              </Button>
            );
          }}
          deleteAction={(record) => {
            return (
              <Popconfirm
                okButtonProps={{
                  className: "bg-[#40a9ff]",
                }}
                title="Are you sure you want to delete this Template?"
                onConfirm={async () => {
                  await dispatch(deleteOrderTemplateByID(record?.id));
                }}
              >
                {/* <div
                  className={
                    'text-[#616166] cursor-pointer p-[] hover:text-[#fff] hover:bg-[#27273a]'
                  }
                > */}
                <Button htmlType="button">Delete</Button>
                {/* </div> */}
              </Popconfirm>
            );
          }}
          btnData={{
            text: "Add Template",
            onClick: () => {
              navigate(
                "/admin/dashboard/billing/orders/order-templates/list/add/new"
              );
            },
          }}
          t={t}
        />
      </div>
    </div>
  );
};
