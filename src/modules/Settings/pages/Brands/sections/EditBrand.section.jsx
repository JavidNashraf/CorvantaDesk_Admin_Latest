import { Modal } from "components";
import { useDispatch, useSelector } from "react-redux";
import { editBrand } from "store";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { createServerImage } from "lib";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  companyName: Yup.string().required("Company Name is required"),
  address: Yup.string().required("Address is required"),
  //logo: Yup.mixed().required('Logo is required'),
  // clientAssigned: Yup.array().required("Client Assigned is required"),
  status: Yup.bool().required("Status is required"),
});

export const EditBrand = ({ show, setShow, editValue, users }) => {
  const initialValues = {
    id: editValue.id,
    name: editValue.name,
    companyName: editValue.companyName,
    address: editValue.address,
    logoUrl: !!editValue.base64Logo ? "data:image/png;base64," + editValue.base64Logo : '',
    clientAssigned: editValue?.clientAssigned?.split(","),
    status: editValue.status,
    termsOfServiceAgreement: editValue?.termsOfServiceAgreement,
    termsOfServiceURL: editValue?.termsOfServiceURL,
  };
  const { t } = useTranslation("/Settings/ns");
  const dispatch = useDispatch();
  const fields = [
    {
      type: "input",
      name: "name",
      placeholder: "Brand Name",
      title: t("Name"),
    },
    {
      type: "input",
      name: "companyName",
      placeholder: "Mind2Matter",
      title: t("Company"),
    },
    {
      type: "textarea",
      name: "address",
      placeholder: "6546 West Philmont Rd",
      title: t("Address"),
    },
    {
      type: "file",
      name: "logoUrl",
      title: t("logo"),
      subText: t("browseLogo"),
    },
    {
      type: "switch",
      name: "status",
      title: t("status"),
    },
    {
      name: "termsOfServiceAgreement",
      title: "Terms of Service Agreement",
      type: "switch",
    },
    {
      name: "termsOfServiceURL",
      title: "Terms of Service",
      type: "text",
    }, 
    {
      type: "userList",
      name: "clientAssigned",
      placeholder: "Client Assigned",
      title: t("clientAssigned"),
      users: users?.filter((client) => client?.isDeleted === false && client?.brandId == editValue.id),
    },
  ];

  const { loading } = useSelector((state) => state?.brands);

  return (
    <Modal
      heading={t("editBrand")}
      submitText={t("editBrand")}
      show={show}
      showCheckbox={false}
      isClients={true}
      setShow={setShow}
      fields={fields}
      loading={loading}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        const img = values?.image ? await createServerImage(values?.image) : [];
        const newValues = {
          image: Object.keys(img).length ? img : undefined,
          name: values?.name,
          companyName: values?.companyName,
          address: values?.address,
          logoUrl: values?.logoUrl,
          clientAssigned: values?.clientAssigned.toString(),
          status: values?.status,
          termsOfServiceAgreement: values?.termsOfServiceAgreement,
          termsOfServiceURL: values?.termsOfServiceURL,
          id: values?.id,
        };
        await dispatch(editBrand({ data: newValues }));
        setShow(false);
      }}
    />
  );
};
