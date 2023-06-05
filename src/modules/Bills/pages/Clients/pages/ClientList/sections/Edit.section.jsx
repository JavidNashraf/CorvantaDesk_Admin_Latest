import { Modal } from "components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPassword } from "store";
import { updateUser } from "store";
import * as Yup from "yup";
import { useCountries } from "use-react-countries";


const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  isActive: Yup.bool().required("Status is required"),
  // ipAddress: Yup.string().required('IP Address is required'),
  brandId: Yup.string().required("Brand is required"),
  password: Yup.string().matches(
    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    "Please use 8 or more characters with a mix of letters, numbers & symbols"
  ),
  companyName: Yup.string().required("Company Name is required"),
  address1: Yup.string().required("Address 1 is required"),
  city: Yup.string().required("City is required"),
  state_region: Yup.string().required("State/Region is required"),
  zipCode: Yup.string().required("ZIP Code is required"),
  country: Yup.string().required("Country is required"),
});

export const EditClientUser = ({ show, setShow, client }) => {
  const { t } = useTranslation("/Users/ns");
  const dispatch = useDispatch();
  const { loading, clients } = useSelector((state) => state?.users);
  // const allUsers = [...users, ...clients];
  const { brands } = useSelector((state) => state?.brands);
  const brandsLoading = useSelector((state) => state?.brands?.loading);
  // console.log(client)
  const initialValues = {
    fullName: client?.fullName,
    isActive: client?.isActive,
    parentID:
      !client?.parentID || client?.parentID === "0" ? "" : client?.parentID,
    brandId: !client?.brandId || client?.brandId === "0" ? "" : client?.brandId,
    password: "",
    confirmPassword: "",
    ipAddresses: client?.ipAddresses,
    phoneNumber: client?.phoneNumber,
    address1: client?.address1,
    address2: client?.address1,
    country: client?.country,
    state_region: client?.state_region,
    zipCode: client?.zipCode,
    city: client?.city,
    companyName: client?.companyName,
  };
  const { countries } = useCountries();
  // console.log(client)
  const editFields = [
    {
      type: "input",
      name: "fullName",
      placeholder: "Paul.Elliott",
      title: t("fullName"),
    },
    {
      type: "switch",
      name: "isActive",
      title: t("status"),
    },
    {
      type: "input",
      name: "companyName",
      placeholder: "Mind2Matter",
      title: "Company Name",
    },
    {
      type: "select",
      name: "brandId",
      title: "Select Brand",
      placeholder: "Select Brand",
      options: brands?.map((brand) => ({
        label: brand?.name,
        value: brand?.id,
      })),
    },
    {
      type: "password",
      name: "password",
      placeholder: "*******",
      title: "Change Password",
    },
    {
      type: "input",
      name: "phoneNumber",
      placeholder: "+12345678",
      title: t("Phone Number"),
    },
    {
      type: "input",
      name: "address1",
      placeholder: "Address 1",
      title: t("Address 1"),
    },
    {
      type: "input",
      name: "address2",
      placeholder: "Address 2",
      title: t("Address 2"),
    },
    {
      type: "input",
      name: "city",
      title: "City",
      placeholder: "NYC",
    },
    {
      type: "input",
      name: "state_region",
      title: "State/Region",
      placeholder: "NY",
    },
    {
      type: "input",
      name: "zipCode",
      title: "ZIP Code",
      placeholder: "38000",
    },
    {
      type: "select",
      name: "country",
      title: "Country",
      placeholder: "select country",
      options: countries
        ?.sort()
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
        .map((country) => ({
          label: country?.name,
          value: country?.name,
        })),
    },
    {
      type: "multiselect",
      name: "ipAddresses",
      placeholder: "253.205.121.39",
      title: t("ipAddress"),
      mode: "tags",
      options:
        client?.ipAddresses?.length > 0
          ? client?.ipAddresses?.map((ip) => ({
            label: ip,
            value: ip,
          }))
          : null,
    },
  ];
  return (
    <Modal
      heading="Edit Client User"
      submitText="Edit Client User"
      show={show}
      loading={loading || brandsLoading}
      setShow={setShow}
      fields={editFields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        const editData = {
          fullName: values?.fullName,
          isActive: values?.isActive,
          parentID: values?.parentID ? values?.parentID : "",
          brandId: values?.brandId,
          ipAddresses: values?.ipAddresses,
          phoneNumber: values?.phoneNumber,
          address1: values?.address1,
          address2: values?.address2,
          country: values?.country,
          state_region: values?.state_region,
          zipCode: values?.zipCode,
          city: values?.city,
          companyName: values?.companyName,
        };
        await dispatch(updateUser(client?.id, editData, true));
        if (values?.password) {
          const data = {
            userId: client?.id,
            password: values?.password,
            confirmPassword: values?.password,
          };
          await dispatch(updateUserPassword(data));
        }
        setShow(false);
      }}
    />
  );
};
