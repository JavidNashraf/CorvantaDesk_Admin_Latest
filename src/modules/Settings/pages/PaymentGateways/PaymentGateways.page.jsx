import { Button, Switch } from "antd";
import { Table } from "components";
import { checkModule } from "lib/checkModule";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPaymentGateways } from "store";
import {
  AddPaymentGateway,
  DeletePaymentGateway,
  EditPaymentGateway,
} from "./sections";

const columns = [
  {
    title: "Payment Gateway",
    dataIndex: "name",
    key: "name",
    width: "20%",
    sorter: (a, b) => (a?.name < b?.name ? -1 : 1),
  },
  {
    title: "API Key",
    dataIndex: "apiKey",
    key: "apiKey",
    sorter: (a, b) => (a?.apiKey < b?.apiKey ? -1 : 1),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) => <Switch checked={value} disabled={true} />,
  },
];

const PaymentGateways = () => {
  const [addModalShow, setAddModalShow] = useState(false);
  const [editValue, setEditValue] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPaymentGateways());
  }, []);

  const { paymentGateways, loading } = useSelector(
    (state) => state.paymentGateways
  );

  // Check for permissions Start
  const { userModules } = useSelector((state) => state?.modules);
  const { permissions } = checkModule({
    module: "PaymentGateways",
    modules: userModules,
  });
  // Check for permissions End

  // Setting data properly
  const [data, setData] = useState([]);
  useEffect(() => {
    if (paymentGateways.length) {
      const dataToSet = paymentGateways.map((pg) => {
        return {
          ...pg,
          key: pg?.id,
        };
      });
      setData(dataToSet);
    }
  }, [paymentGateways]);

  return (
    <div className="m-[40px] p-[40px] bg-[#000000] rounded-[8px]">
      <AddPaymentGateway show={addModalShow} setShow={setAddModalShow} />
      <EditPaymentGateway
        show={editModalShow}
        setShow={setEditModalShow}
        editValue={editValue}
      />
      <DeletePaymentGateway
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
          text: "Add Payment Gateway",
          onClick: () => setAddModalShow(true),
        }}
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

export default PaymentGateways;
