import * as Yup from "yup";
import { Formik, Form } from "formik";

import { Input, Button } from "components";
import "./styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import EmailEditor from "react-email-editor";
import { updateEmailTemplate, getEmailTemplateByID } from "store";
import { getTemplateVariables } from "lib";

const validationSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  smtpConfigurationId: Yup.string().required("Configuration is required"),
  status: Yup.boolean().required("Status is required"),
  emailTemplateType: Yup.number().required("This field is required"),
});

export const EditTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, emailTemplate } = useSelector(
    (state) => state?.emailTemplates
  );
  const { smtps } = useSelector((state) => state?.smtps);

  const smtpOptions = smtps.map((smtp) => {
    return {
      value: smtp.id,
      label: smtp.host,
    };
  });

  let { id } = useParams();
  useEffect(() => {
    dispatch(getEmailTemplateByID({ id }));
  }, [id, dispatch]);

  // Email Editor Settings Start
  const emailEditorRef = useRef(null);

  const onReady = () => {
    // console.log("onReady");
  };
  // Email Editor Settings End

  // Load Template
  useEffect(() => {
    if (emailTemplate?.id && emailTemplate?.jsonBody) {
      const templateJson = JSON.parse(emailTemplate && emailTemplate?.jsonBody);
      if (emailEditorRef !== null) {
        emailEditorRef?.current?.editor?.loadDesign(templateJson);
      }
    }
  }, [emailTemplate, emailEditorRef?.current]);

  const initialValues = {
    subject: emailTemplate?.subject || "",
    tenant: "Admin",
    status: emailTemplate?.status || true,
    smtpConfigurationId: emailTemplate?.smtpConfigurationId || "",
    emailTemplateType: emailTemplate?.emailTemplateType || 0,
  };

  const { user } = useSelector((state) => state?.auth);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values) => {
        emailEditorRef.current.editor.exportHtml(async (data) => {
          const { design, html } = data;
          const finalValues = {
            ...values,
            variables: "[fullName], [company], [address]",
            createdBy: user?.id,
            emailTemplateType: Number(values?.emailTemplateType),
            isSystem: Number(values?.emailTemplateType) === 0 ? false : true,
            jsonBody: JSON.stringify(design),
            body: html,
          };

          await dispatch(
            updateEmailTemplate({
              id: emailTemplate?.id,
              data: finalValues,
            })
          );

          navigate("/admin/dashboard/settings/email-templates");
        });
      }}
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched }) => {
        return (
          <Form>
            <Spin spinning={loading}>
              <div className="grid grid-cols-[1fr_3fr] gap-[20px] px-[32px] py-[40px]">
                {/* SMTP Configuration Side */}
                <div className="bg-[#000000] p-[32px] rounded-[8px]">
                  <h6 className="text-white mb-[32px]">New Template</h6>
                  <div className="flex flex-col gap-[20px]">
                    <Input
                      name="subject"
                      label="Subject"
                      placeholder="Email Subject"
                    />
                    <Input
                      name="smtpConfigurationId"
                      label="SMTP Configuration"
                      placeholder="Select SMTP Configuration"
                      type="select"
                      options={smtpOptions}
                    />
                    <Input
                      name="emailTemplateType"
                      label="Template Type"
                      placeholder="Select Template Type"
                      type="select"
                      // [ 0 = General, 1 = EmailConfirmation, 2 = EmailOTP, 3 = ProductCancellation, 4 = ResetPassword, 5 = TicketUpdate ]
                      options={[
                        "General",
                        "Email Confirmation",
                        "Email OTP",
                        "Product Cancellation",
                        "Reset Password",
                        "Ticket Update",
                        "Ticket Create",
                        "Ticket Assignment",
                        "Orders",
                        "Invoice",
                        "Product Status Updated",
                      ].map((el, idx) => {
                        return {
                          value: idx,
                          label: el,
                        };
                      })}
                    />
                    <Input name="status" label="Status" type="switch" />
                  </div>
                  <Button className="mt-[32px]" htmlType="submit">
                    Edit Template
                  </Button>
                </div>
                <div>
                  <div className="bg-[#000000] p-[18px] rounded-[8px]">
                    <h4 className="text-white mb-[12px] text-[24px]">
                      Variables
                    </h4>
                    <p className="text-white">
                      {getTemplateVariables(Number(values?.emailTemplateType))}
                    </p>
                  </div>
                  <div className="bg-[#000000] p-[32px] rounded-[8px] mt-[20px]">
                    <EmailEditor
                      appearance={{ theme: "dark" }}
                      ref={emailEditorRef}
                      onReady={onReady}
                      minHeight={600}
                    />
                  </div>
                </div>
              </div>
            </Spin>
          </Form>
        );
      }}
    </Formik>
  );
};
