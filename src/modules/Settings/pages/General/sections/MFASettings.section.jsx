import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, Card, Input } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { deepEqual } from 'lib';
import { toast } from 'react-toastify';
import { updateAppSettings } from 'store';

const validationSchema = Yup.object().shape({
  googleAuthenticator: Yup.boolean().required('This is a required field'),
  microsoftAuthenticator: Yup.boolean().required('This is a required field'),
});

export function MFASettings() {
  const { settings } = useSelector((state) => state?.appSettings);
  const dispatch = useDispatch();

  const initialValues = {
    enableAdminMFA: settings?.enableAdminMFA,
    enableClientMFA: settings?.enableClientMFA,
    forceAdminMFA: settings?.forceAdminMFA,
    forceClientMFA: settings?.forceClientMFA,
    googleAuthenticator: settings?.googleAuthenticator,
    microsoftAuthenticator: settings?.microsoftAuthenticator,
  };

  // Fields
  // Admin MFA Fields
  const adminMFAFields = [
    {
      name: 'enableAdminMFA',
      label: 'Enable Admin MFA/OTP',
      type: 'switch',
    },
    {
      name: 'forceAdminMFA',
      label: 'Force Admin MFA/OTP',
      type: 'switch',
    },
  ];
  const clientMFAFields = [
    {
      name: 'enableClientMFA',
      label: 'Enable Client MFA/OTP',
      type: 'switch',
    },
    {
      name: 'forceClientMFA',
      label: 'Force Client MFA/OTP',
      type: 'switch',
    },
  ];
  const fields = [
    {
      name: 'googleAuthenticator',
      label: 'Google Authentication',
      type: 'switch',
    },
    {
      name: 'microsoftAuthenticator',
      label: 'Microsoft Authentication',
      type: 'switch',
    },
  ];

  return (
    <Card heading="MFA Settings" className="mt-[40px]">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values) => {
          if (deepEqual(values, initialValues)) {
            toast.info('No changes were made');
          } else {
            await dispatch(
              updateAppSettings({ tenant: 'Admin', data: values })
            );
          }
        }}
      >
        {({ values }) => {
          return (
            <Form>
              <div className="grid grid-cols-4 gap-[20px] mb-[32px]">
                <div className="flex flex-col gap-[20px]">
                  {adminMFAFields?.map((field) => {
                    if (
                      field?.name === 'forceAdminMFA' &&
                      !values?.enableAdminMFA
                    ) {
                      return <></>;
                    } else {
                      return (
                        <Input
                          key={field.name}
                          name={field.name}
                          label={field?.label}
                          placeholder={field.placeholder}
                          type={field.type}
                          options={field.options}
                        />
                      );
                    }
                  })}
                </div>
                <div className="flex flex-col gap-[20px]">
                  {clientMFAFields?.map((field) => {
                    if (
                      field?.name === 'forceClientMFA' &&
                      !values?.enableClientMFA
                    ) {
                      return <></>;
                    } else {
                      return (
                        <Input
                          key={field.name}
                          name={field.name}
                          label={field?.label}
                          placeholder={field.placeholder}
                          type={field.type}
                          options={field.options}
                        />
                      );
                    }
                  })}
                </div>
                {fields?.map((field) => {
                  return (
                    <Input
                      key={field.name}
                      name={field.name}
                      label={field?.label}
                      placeholder={field.placeholder}
                      type={field.type}
                      options={field.options}
                    />
                  );
                })}
              </div>
              <Button
                htmlType="submit"
                type="ghost"
                className="px-[32px] h-[52px]"
              >
                Save Changes
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
}
