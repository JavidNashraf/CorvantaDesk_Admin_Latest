import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, Card, Input } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSupportSettingsByTenant, updateSupportSettings } from 'store';
import { deepEqual } from 'lib';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  maxNumberOfSubCategories: Yup.number().required('This is a required field'),
  autoApproveNewArticles: Yup.boolean(),
});

export default function Support() {
  // Fields
  const fields = [
    {
      name: 'maxNumberOfSubCategories',
      label: 'Max Number of Sub Categories',
      type: 'number',
    },
    // {
    //   name: 'refundRetainPercentage',
    //   label: 'Refund Retain Percentage',
    //   type: 'number',
    // },
    {
      name: 'autoApproveNewArticles',
      label: 'Auto Approve New Articles',
      type: 'switch',
    },
  ];

  const { settings, loading, supportSettings } = useSelector(
    (state) => state?.appSettings
  );
  const dispatch = useDispatch();
  const initialValues = {
    maxNumberOfSubCategories: supportSettings?.maxNumberOfSubCategories,
    autoApproveNewArticles: supportSettings?.autoApproveNewArticles,
    // refundRetainPercentage: supportSettings?.refundRetainPercentage,
  };

  useEffect(() => {
    dispatch(getSupportSettingsByTenant());
  }, []);
  return (
    <div className="p-[40px]">
      <Card heading="Support Settings" loading={loading}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            if (deepEqual(values, initialValues)) {
              toast.info('No changes were made');
            } else {
              await dispatch(
                updateSupportSettings({ id: supportSettings?.id, data: values })
              );
              await dispatch(getSupportSettingsByTenant());
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
            <Button
              htmlType="submit"
              type="ghost"
              className="px-[32px] h-[52px]"
            >
              Save Changes
            </Button>
          </Form>
        </Formik>
      </Card>
    </div>
  );
}
