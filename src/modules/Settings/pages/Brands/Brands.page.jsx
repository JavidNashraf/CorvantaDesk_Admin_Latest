import { Button } from "antd";
import { Table } from "components";
import { checkModule } from "lib/checkModule";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBrands, getClients } from "store";
import { useTranslation } from "react-i18next";
import { AddBrand, DeleteBrand, EditBrand } from "./sections";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "components/TicketDetails/sections/Details/Details.section";

const Brands = () => {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editValue, setEditValue] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [clientsModalShow, setClientsModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const query = useQuery();
  const brandId = query.get("brandId");
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getBrands());
      await dispatch(getClients());
    })();
  }, [dispatch]);

  const { brands, loading } = useSelector((state) => state.brands);
  const { clients,users } = useSelector((state) => state?.users);

  const { t } = useTranslation("/Settings/ns");
  
  const navigate = useNavigate();
  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a?.name < b?.name ? -1 : 1),
    },
    {
      title: t("companyName"),
      dataIndex: "companyName",
      key: "companyName",
      sorter: (a, b) => (a?.companyName < b?.companyName ? -1 : 1),
    },
    {
      title: t("logo"),
      dataIndex: "logo",
      key: "logo",
      render: (logoUrl, record) => {
        let name = "";
        let userN = record.name.split(" ");
        if (userN.length < 2) {
          name = userN[0].charAt(0);
        } else {
          name = userN[0].charAt(0) + userN[1].charAt(0);
        }
        return record.base64Logo ? (
          <img
            src={'data:image/png;base64,' + record.base64Logo}
            alt={record.name}
            className="h-full w-[40px] rounded-[5px] object-cover text-[8px]"
          />
        ) : (
          <div className="bg-[#1C3238] px-[8px] py-[4px] uppercase w-[40px] h-[40px] rounded-[4px] flex justify-center items-center">
            {name}
          </div>
        );
      },
    },
    {
      title: t("clientAssignedTable"),
      key: "clientAssigned",
      dataIndex: "clientAssigned",
      render: (clientAssigned, record) => {
        const rowClients = clients?.filter((client) => client?.isDeleted === false && client?.brandId == record.id);
        return (
          <NavLink
            to={rowClients?.length > 0 ? `/admin/dashboard/billing/clients/list/show?brandId=${record.id}` : "#"}
          >
            {`${rowClients?.length} Clients Assigned`}
          </NavLink>
        );
      },
    },
    {
      title: t("status"),
      key: "status",
      dataIndex: "status",
      render: (status) =>
        status ? (
          <div className="bg-[#1C3238] px-[8px] py-[4px] text-[#0BB783] w-[fit-content] rounded-[4px]">
            {"ENABLED"}
          </div>
        ) : (
          <div className="bg-[#3A2434] px-[8px] py-[4px] text-[#F64E60] w-[fit-content] rounded-[4px]">
            {"DISABLED"}
          </div>
        ),
    },
  ];

  // Check for permissions Start
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "Brands",
    modules: userModules,
  });
  // Check for permissions End

  // Setting data properly
  const [data, setData] = useState([]);
  useEffect(() => {
    if (brands.length) {
      const dataToSet = brands.map((b) => {
        return {
          ...b,
          key: b?.id,
        };
      });
      setData(dataToSet);
    }
  }, [brands]);

  return (
    <div className="brands-table m-[40px] p-[40px] bg-[#000000] rounded-[8px]">
      <AddBrand show={addModalShow} setShow={setAddModalShow} users={clients} />
      <EditBrand
        show={editModalShow}
        setShow={setEditModalShow}
        editValue={editValue}
        users={clients}
      />
      {/* <ClientsAssigned
        show={clientsModalShow}
        setShow={setClientsModalShow}
        editValue={editValue}
        users={clients}
      /> */}
      <DeleteBrand
        show={deleteModalShow}
        setShow={setDeleteModalShow}
        id={deleteID}
      />
      <Table
        columns={columns}
        data={data}
        permissions={permissions}
        loading={loading}
        fieldToFilter="name"
        btnData={{
          text: t("addNewBrand"),
          onClick: () => setAddModalShow(true),
        }}
        rowClassName={(record) => (record?.id === brandId ? "isActive" : "")}
        editAction={(record) => (
          <Button
            onClick={() => {
              setEditValue(record);
              setEditModalShow(true);
            }}
          >
            Edit
          </Button>
        )}
        deleteAction={(record) => (
          <Button
            className="focus:bg-[unset]"
            onClick={() => {
              setDeleteID(record?.id);
              setDeleteModalShow(true);
            }}
          >
            Delete
          </Button>
        )}
      />
    </div>
  );
};

export default Brands;
