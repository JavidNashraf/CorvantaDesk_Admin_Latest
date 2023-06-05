import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, Card, Input } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { deepEqual } from 'lib';
import { toast } from 'react-toastify';
import { updateBillingSettings } from 'store';

const validationSchema = Yup.object().shape({
  maxNumberOfRefunds: Yup.number().required('This is a required field'),
  minOrderAmount: Yup.number().required('This is a required field'),
});

export default function Billing() {
  // Fields
  const fields = [
    {
      name: 'maxNumberOfRefunds',
      label: 'Max Number of Refunds',
      type: 'number',
    },
    {
      name: 'minOrderAmount',
      label: 'Minimum Order Amount',
      type: 'number',
    },
    {
      name: 'refundRetainPercentage',
      label: 'Refund Retain Percentage',
      type: 'number',
    },
    {
      name: 'autoInvoiceGeneration',
      label: 'Auto Invoice Generation',
      type: 'switch',
    },
    {
      name: 'autoInvoicePriorToDueDateInDays',
      label: 'Auto Invoice Prior To Due Date In Days',
      type: 'number',
    },
    {
      name: 'enableProductlevelInvoiceGen',
      label: 'Enable Product Level Invoice Generation',
      type: 'switch',
    },
    {
      name: 'productLevelInvoiceGenPriorToDueDateInDays',
      label: 'Product Level Invoice Generation Prior To Due Date In Days',
      type: 'number',
    },
    {
      name: 'isActiveOrPendingProducts',
      label: 'Credits only for Active/Pending Products',
      type: 'switch',
    },
    {
      name: 'maxCreditAmount',
      label: 'Maximum Credit Amount',
      type: 'number',
    },
  ];

  const dispatch = useDispatch();
  const { billingSettings, loading } = useSelector((state) => state?.appSettings);
  const initialValues = {
    maxNumberOfRefunds: billingSettings?.maxNumberOfRefunds,
    minOrderAmount: billingSettings?.minOrderAmount,
    refundRetainPercentage: billingSettings?.refundRetainPercentage,
    autoInvoiceGeneration: billingSettings?.autoInvoiceGeneration,
    autoInvoicePriorToDueDateInDays:
      billingSettings?.autoInvoicePriorToDueDateInDays,
    enableProductlevelInvoiceGen: billingSettings?.enableProductlevelInvoiceGen,
    productLevelInvoiceGenPriorToDueDateInDays:
      billingSettings?.productLevelInvoiceGenPriorToDueDateInDays,
    isActiveOrPendingProducts:
      billingSettings?.isActiveOrPendingProducts,
    maxCreditAmount:
      billingSettings?.maxCreditAmount,
  };

  return (
    <div className="p-[40px]">
      <Card heading="Billing Settings" loading={loading}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values) => {
            if (deepEqual(values, initialValues)) {
              toast.info('No changes were made');
            } else {
              await dispatch(
                updateBillingSettings({ tenant: 'Admin', data: values })
              );
            }
          }}
        >
          <Form>
            <div className="grid grid-cols-4 gap-[20px] mb-[32px] items-end">
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
