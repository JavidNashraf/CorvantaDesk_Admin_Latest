import { Modal } from "components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addClientUser } from "store";
import { useCountries } from "use-react-countries";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Please use 8 or more characters with a mix of letters, numbers & symbols"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  status: Yup.bool().required("Status is required"),
  companyName: Yup.string().required("Company Name is required"),
  address1: Yup.string().required("Address 1 is required"),
  city: Yup.string().required("City is required"),
  state_region: Yup.string().required("State/Region is required"),
  zipCode: Yup.string().required("ZIP Code is required"),
  country: Yup.string().required("Country is required"),
  brandId: Yup.string().required("Brand is required"),
});

export const AddClientUser = ({ show, setShow }) => {
  const { t } = useTranslation("/Users/ns");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.users);
  const { countries } = useCountries();
  const { brands } = useSelector((state) => state?.brands);
  const brandsLoading = useSelector((state) => state?.brands?.loading);
  const { id } = useParams();

  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: true,
    // ipAddresses: "",
    companyName: "",
    brandId: "",
    address1: "",
    address2: "",
    city: "",
    state_region: "",
    zipCode: "",
    country: "",
    parentID: id ? id : "",
  };

  const addFields = [
    {
      type: "email",
      name: "email",
      placeholder: "Paul.Elliott@Fakemail.com",
      title: t("email"),
    },
    {
      type: "input",
      name: "fullName",
      placeholder: "Paul.Elliott",
      title: t("fullName"),
    },
    {
      type: "input",
      name: "companyName",
      placeholder: "Mind2Matter",
      title: "Company Name",
    },
    {
      type: "password",
      name: "password",
      placeholder: "*******",
      title: t("password"),
    },
    {
      type: "password",
      name: "confirmPassword",
      placeholder: "*******",
      title: t("confirmPassword"),
    },
    {
      type: "switch",
      name: "status",
      title: t("status"),
    },
    // {
    //   type: "multiselect",
    //   name: "ipAddresses",
    //   placeholder: "253.205.121.39",
    //   title: t("ipAddress"),
    //   mode: "tags",
    //   options: [],
    // },
    {
      type: "input",
      name: "address1",
      title: "Address 1",
      placeholder: "St 213, SF, US",
    },
    {
      type: "input",
      name: "address2",
      title: "Address 2",
      placeholder: "St 213, SF, US",
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
      type: "select",
      name: "brandId",
      title: "Select Brand",
      placeholder: "Select Brand",
      options: brands?.map((brand) => ({
        label: brand?.name,
        value: brand?.id,
      })),
    },
    // {
    //   type: "select",
    //   name: "parentID",
    //   placeholder: "Select Parent User",
    //   title: "Parent User",
    //   options: clients?.map((user) => ({
    //     label: user?.userName,
    //     value: user?.id,
    //   })),
    // },
  ];
  return (
    <Modal
      heading="Add Client User"
      submitText="Add Client User"
      show={show}
      loading={loading || brandsLoading}
      setShow={setShow}
      fields={addFields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        await dispatch(addClientUser(values));
        setShow(false);
      }}
    />
  );
};
