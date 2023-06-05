import { Modal } from "components";
import { useDispatch, useSelector } from "react-redux";
import { editDepartment } from "store";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const validationSchema = Yup.object().shape({
  deptNumber: Yup.string().required("Number is required"),
  name: Yup.string().required("Name is required"),
  deptStatus: Yup.string().required("Status is required"),
  brandId: Yup.string().required("Brand is required"),
});

export const EditDepartment = ({ show, setShow, editValue, users }) => {
  const { brands } = useSelector((state) => state?.brands);
  const departmentAdmins = [];

  editValue?.departmentAdmins?.map((b) => {
    return departmentAdmins.push(b?.adminUserId);
  });

  const initialValues = {
    id: editValue.id,
    deptNumber: editValue.deptNumber,
    name: editValue.name,
    deptStatus: editValue.deptStatus,
    departmentAdmins: editValue?.departmentAdminsList,
    brandId: editValue?.brandId,
  };

  const { t } = useTranslation("/Settings/ns");
  const dispatch = useDispatch();
  const fields = [
    {
      type: "input",
      name: "deptNumber",
      placeholder: "1",
      title: t("number"),
    },
    {
      type: "input",
      name: "name",
      placeholder: "Department Name",
      title: t("Name"),
    },
    {
      type: "switch",
      name: "deptStatus",
      title: t("status"),
    },
    {
      type: "select",
      name: "brandId",
      title: "Select Brand",
      placeholder: "Select a brand",
      options: brands?.map((brand) => ({
        label: brand?.name,
        value: brand?.id,
      })),
    },
    {
      type: "userList",
      name: "departmentAdmins",
      placeholder: "Admin Assigned",
      title: t("adminAssigned"),
      users: users,
    },
  ];

  const { loading } = useSelector((state) => state?.paymentGateways);

  return (
    <Modal
      heading={t("editDepartment")}
      submitText={t("editDepartment")}
      show={show}
      setShow={setShow}
      fields={fields}
      loading={loading}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        await dispatch(editDepartment({ data: values }));
        setShow(false);
      }}
    />
  );
};
