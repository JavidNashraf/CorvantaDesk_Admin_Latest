import { Modal } from "components";
import { useDispatch, useSelector } from "react-redux";
import { editOrder } from "store";
import moment from "moment";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  orderStatus: Yup.number().required("This field is required!"),
});

export const AddOrder = ({ show, setShow, record }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state?.users);
  const { loading } = useSelector((state) => state?.orders);
  const isSuperAdmin = useSelector(
    (state) => state?.auth?.user?.userRolesResponse?.userRoles
  )[1]?.enabled;

  const status = [
    "Draft",
    "Pending",
    "Paid",
    "Processing",
    "Completed",
    "Accepted",
    "Canceled",
  ];

  const fields = [
    {
      type: "text",
      name: "orderNo",
      placeholder: "Order Number",
      title: "Order Number",
      disabled: true,
    },
    {
      type: "text",
      name: "orderForClientId",
      placeholder: "",
      title: "Client",
      disabled: true,
    },
    {
      type: "text",
      name: "customerIp",
      placeholder: "154.227.25.101",
      title: "Customer IP",
      disabled: true,
    },
    {
      type: "text",
      name: "lastModifiedOn",
      placeholder: "",
      title: "Date modified",
      disabled: true,
    },

    {
      type: "select",
      name: "orderStatus",
      placeholder: "Select Status",
      title: "Status",
      options: status?.map((el, idx) => ({
        label: el,
        value: idx,
      })),
    },
  ];

  const initialValues = {
    orderNo: record?.orderNo,
    orderForClientId: record?.clientFullName,
    orderStatus: Number(record?.status),
    adminAssignedId: record?.adminAssigned,
    lastModifiedOn: moment(record?.lastModifiedOn).format(
      "DD-MM-YYYY @ HH:MM:ss"
    ),
  };

  const superAdminMenu = {
    type: "select",
    name: "adminAssignedId",
    title: "Assigned To",
    options:
      users &&
      users?.map((user) => ({
        value: user?.id,
        label: user?.fullName,
      })),
  };

  return (
    <Modal
      heading="Edit Order Status"
      submitText="Edit Order status"
      show={show}
      loading={loading}
      setShow={setShow}
      fields={isSuperAdmin ? [...fields, superAdminMenu] : fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        const data = {
          status: Number(values?.orderStatus),
          adminAssignedId: values?.adminAssigned,
        };
        await dispatch(editOrder(record?.id, data));
        setShow(false);
      }}
    />
  );
};
