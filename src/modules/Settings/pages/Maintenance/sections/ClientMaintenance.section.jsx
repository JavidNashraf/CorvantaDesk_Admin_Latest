import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { Button, Card, Input } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getMaintenanceSettingsByTenant } from 'store';
import { updateMaintenanceSettings } from 'store';

const validationSchema = Yup.object().shape({
  isMaintenanceOn: Yup.boolean().required('Status is required'),
  tllInSeconds: Yup.number().required('TTL is required'),
  message: Yup.string().required('Reason is required'),
});

export const ClientMaintenance = () => {
  // Fields
  const fields = [
    {
      name: 'isMaintenanceOn',
      label: 'Status',
      type: 'switch',
    },
    {
      name: 'tllInSeconds',
      label: 'TLL in Seconds',
      type: 'number',
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMaintenanceSettingsByTenant());
  }, []);

  const { loading, maintenanceSettings } = useSelector(
    (state) => state.appSettings
  );

  const initialValues = {
    isMaintenanceOn: maintenanceSettings?.isMaintenanceOn,
    tllInSeconds: 0,
    message: maintenanceSettings?.message,
  };

  return (
    <Card heading="Client Maintenance Settings" loading={loading}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values) => {
          const finalObject = {
            expirationDateTime: moment()
              .add(values.tllInSeconds, 'seconds')
              .toISOString(),
            status: values.isMaintenanceOn,
            message: values.message,
          };
          await dispatch(updateMaintenanceSettings({ data: finalObject }));
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
          <div className="grid grid-cols-2 gap-[20px] mb-[32px]">
            <Input
              name="message"
              label="Reason"
              placeholder="Enter Reason"
              type="textarea"
              rows={10}
            />
          </div>
          <Button
            htmlType="submit"
            type="ghost"
            className="px-[32px] mt-[32px] h-[52px]"
          >
            Save Changes
          </Button>
        </Form>
      </Formik>
    </Card>
  );
};
