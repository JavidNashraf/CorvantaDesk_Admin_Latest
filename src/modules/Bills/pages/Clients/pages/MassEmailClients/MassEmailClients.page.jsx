import { EditorState } from "draft-js";
import * as Yup from "yup";
import { Spin } from "antd";
import { Formik, Form } from "formik";
import { Left, Right } from "./sections";

const initialValues = {
  productIds: [],
  clientIds: [],
  headerContent: "",
  footerConent: "",
  signatureContent: "",
  emailBody: "",
  numberOfEmails: 0,
  intervalInSeconds: 0,
  smtpConfigId: "",
  name: "",
  emailAddress: "",
  companyAddress: "",
  cssStyle: "",
  emailTemplate: "",
  bodyHolder: EditorState.createEmpty(),
  headerContentHolder: EditorState.createEmpty(),
  signatureHolder: EditorState.createEmpty(),
  footerContentHolder: EditorState.createEmpty(),
  operatorType: "",
  property: "",
};

const validationSchema = Yup.object().shape({
  headerContent: Yup.string().required("This field is required"),
  footerConent: Yup.string().required("This field is required"),
  signatureContent: Yup.string().required("This field is required"),
  emailBody: Yup.string().required("This field is required"),
  numberOfEmails: Yup.number().required("This field is required"),
  intervalInSeconds: Yup.number().required("This field is required"),
  smtpConfigId: Yup.string().required("This field is required"),
  name: Yup.string().required("This field is required"),
  emailAddress: Yup.string().required("This field is required"),
  companyAddress: Yup.string().required("This field is required"),
  cssStyle: Yup.string().required("This field is required"),
});

export const MassEmailClients = () => {
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values) => {
          const finalValues = {
            productIds: values?.productIds,
            clientIds: values?.clientIds,
            headerContent: values?.headerContent,
            footerConent: values?.footerConent,
            signatureContent: values?.signature,
            emailBody: values?.emailBody,
            numberOfEmails: values?.numberOfEmails,
            intervalInSeconds: values?.intervalInSeconds,
            smtpConfigId: values?.smtpConfigId,
            name: values?.name,
            emailAddress: values?.emailAddress,
            companyAddress: values?.companyAddress,
            cssStyle: values?.cssStyle,
          };
          // navigate('/admin/dashboard/settings/smtp');
          // console.log(finalValues);
        }}
      >
        {({ setFieldTouched, values, setFieldValue, touched, errors }) => {
          return (
            <Form>
              <Spin spinning={false}>
                <div className="grid grid-cols-[1fr_3fr] gap-[20px] px-[32px] py-[40px]">
                  <Left />
                  <Right />
                </div>
              </Spin>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
