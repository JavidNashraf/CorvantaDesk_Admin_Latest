import { useFormikContext } from "formik";

import { EmailBodyInput, Button } from "components";
import { axios, getError } from "lib";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import EmailEditor from "react-email-editor";

export function Right() {
  const [loading, setLoading] = useState(false);
  const { values, touched, errors } = useFormikContext();

  // Email Editor Settings Start
  const emailEditorRef = useRef(null);

  const onReady = () => {
    // console.log("onReady");
  };
  // Email Editor Settings End

  // Load Template
  useEffect(() => {
    if (
      values?.emailTemplateContent?.id &&
      values?.emailTemplateContent?.jsonBody
    ) {
      const templateJson = JSON.parse(
        values && values?.emailTemplateContent?.jsonBody
      );
      if (emailEditorRef?.current) {
        emailEditorRef.current.editor.loadDesign(templateJson);
      }
    }
  }, [values?.emailTemplateContent, emailEditorRef?.current]);

  return (
    <>
      {/* Header, Footer, and Signature Side */}
      <div className="flex flex-col gap-[20px]">
        <div className="bg-[#000000] rounded-[8px]">
          <EmailBodyInput
            name="numberOfEmails"
            label="Number of Email"
            placeholder="[numbers]"
            touched={touched}
            errors={errors}
            type="number"
            darkBg
          />
          <EmailBodyInput
            name="intervalInSeconds"
            label="Interval In Seconds"
            placeholder="[seconds]"
            touched={touched}
            errors={errors}
            type="number"
            darkBg
          />
        </div>

        <div className="bg-[#000000] p-[32px] rounded-[8px] mt-[20px]">
          <EmailEditor
            appearance={{ theme: "dark" }}
            ref={emailEditorRef}
            onReady={onReady}
            minHeight={600}
          />
          <Button
            onClick={async () => {
              setLoading(true);
              emailEditorRef.current.editor.exportHtml(async (data) => {
                const { html } = data;
                const finalValues = {
                  productIds: values?.productIds,
                  clientIds: values?.clientIds,
                  headerContent: values?.headerContent,
                  footerConent: values?.footerContent,
                  signatureContent: values?.signatureContent,
                  emailBody: `${html} <br /> <br /> ${values?.signatureContent}`,
                  numberOfEmails: values?.numberOfEmails,
                  intervalInSeconds: values?.intervalInSeconds,
                  smtpConfigId: values?.smtpConfigId,
                  name: values?.name,
                  emailAddress: values?.emailAddress,
                  companyAddress: values?.companyAddress,
                  cssStyle: values?.cssStyle,
                };
                try {
                  await axios.post("/api/v1/admin/massemails", finalValues, {
                    modulename: "Users",
                    moduleactionname: "Create",
                  });
                  toast.success("Email Sent Successfully!");
                } catch (e) {
                  toast.error(getError(e));
                }
                setLoading(false);
              });
            }}
            htmlType="button"
            className="mt-[32px]"
            loading={loading}
          >
            Send Email
          </Button>
        </div>
      </div>
    </>
  );
}
