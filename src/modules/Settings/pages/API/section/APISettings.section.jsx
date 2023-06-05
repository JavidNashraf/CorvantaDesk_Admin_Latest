import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { Button, Input, Card } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { deepEqual } from 'lib';
import { toast } from 'react-toastify';
import { updateAppSettings } from 'store';

const validationSchema = Yup.object().shape({
  enableThirdPartyAPIkeys: Yup.boolean().required('Status is required'),
  numberofRequestsPerIpApiKey: Yup.number().required('TTL is required'),
  intervalBeforeNextAPIkeyRequestInSeconds:
    Yup.number().required('Reason is required'),
});

// Fields
const fields = [
  {
    name: 'enableThirdPartyAPIkeys',
    label: 'Enable 3rd Party API Keys',
    type: 'switch',
  },
  {
    name: 'numberofRequestsPerIpApiKey',
    label: 'Number of Requests Per IP API Key',
    type: 'number',
  },
  {
    name: 'intervalBeforeNextAPIkeyRequestInSeconds',
    label: 'Interval Before Next API Request in Seconds',
    type: 'number',
  },
  {
    name: 'enableAPIAccessAdmin',
    label: 'Enable API Access (Admin)',
    type: 'switch',
  },
  {
    name: 'enableAPIAccessClient',
    label: 'Enable API Access (Client)',
    type: 'switch',
  },
];

export const APISettings = () => {
  const { settings, loading } = useSelector((state) => state?.appSettings);

  const initialValues = {
    enableThirdPartyAPIkeys: settings?.enableThirdPartyAPIkeys,
    numberofRequestsPerIpApiKey: settings?.numberofRequestsPerIpApiKey,
    intervalBeforeNextAPIkeyRequestInSeconds:
      settings?.intervalBeforeNextAPIkeyRequestInSeconds,
    enableAPIAccessAdmin: settings?.enableAPIAccessAdmin,
    enableAPIAccessClient: settings?.enableAPIAccessClient,
  };

  const dispatch = useDispatch();
  return (
    <Card heading="API Keys" loading={loading}>
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
        <Form>
          <div className="grid grid-cols-4 gap-[20px] mb-[32px]">
            {fields.map((field) => (
              <Input
                key={field.name}
                name={field.name}
                label={field?.label}
                placeholder={field.placeholder}
                type={field.type}
                options={field.options}
              />
            ))}
          </div>
          <Button htmlType="submit" type="ghost" className="px-[32px] h-[52px]">
            Save Changes
          </Button>
        </Form>
      </Formik>
    </Card>
  );
};
