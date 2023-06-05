import { Formik, Form } from 'formik';
import { Button, Card, Input, MultiSelect } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { deepEqual } from 'lib';
import { toast } from 'react-toastify';
import { updateAppSettings } from 'store';

export function GeneralSettings() {
  // Fields
  const fields = [
    {
      name: 'blockedTicketEmails',
      label: 'Blocked Emails',
      type: 'text',
      options: [
        { label: 'sam@gmail.com', value: '123' },
        { label: 'paul@gmail.com', value: '345' },
        { label: 'beri@gmail.com', value: '789' },
      ],
    },
    {
      name: 'allowCustomersToCreateTicketsOnly',
      label: 'Allow Only Current Customers to Create Tickets',
      type: 'switch',
    },
    {
      name: 'ticketImportInvervalMinutes',
      label: 'Import Interval (Minutes)',
      type: 'number',
    },
  ];

  const { settings } = useSelector((state) => state?.appSettings);
  const dispatch = useDispatch();
  const initialValues = {
    blockedTicketEmails: settings?.blockedTicketEmails,
    allowCustomersToCreateTicketsOnly: settings?.allowCustomersToCreateTicketsOnly,
    ticketImportInvervalMinutes: settings?.ticketImportInvervalMinutes,
  };

  return (
    <Card heading="General Settings">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          if (deepEqual(values, initialValues)) {
            toast.info('No changes were made');
          } else {
            await dispatch(
              updateAppSettings({ tenant: 'Admin', data: values })
            );
          }
        }}
        enableReinitialize
      >
        <Form>
          <div className="grid grid-cols-4 gap-[20px] mb-[32px] items-end">
            {fields.map((field) => (
              <div className="flex items-end" key={field?.name}>
                {field?.type === 'multiselect' ? (
                  <MultiSelect
                    name={field.name}
                    label={field?.label}
                    placeholder={field.placeholder}
                    mode="multiple"
                    options={field?.options}
                  />
                ) : (
                  <Input
                    name={field.name}
                    label={field?.label}
                    placeholder={field.placeholder}
                    type={field.type}
                    options={field.options}
                  />
                )}
              </div>
            ))}
          </div>
          <Button htmlType="submit" type="ghost" className="px-[32px] h-[52px]">
            Save Changes
          </Button>
        </Form>
      </Formik>
    </Card>
  );
}
