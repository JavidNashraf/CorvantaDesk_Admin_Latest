import * as Yup from 'yup';
import moment from 'moment';
import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { getAPIKeysByUID, updateAPIKeySettings } from 'store';
import { deepEqual } from 'lib';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  label: Yup.string().required('Label is required'),
  statusApi: Yup.string().required('Status is required'),
  tenant: Yup.string().required('Tenant is required'),
  validTill: Yup.date().required('Expiry date is required'),
  safeListIpAddresses: Yup.string().required('At least an IP Adresses is required'),
});

export const EditAPIKey = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);
  const { loading, apiKey } = useSelector((state) => state?.apiKeys);
  const { users } = useSelector((state) => state?.users);

  const fields = [
    {
      name: 'userIds',
      type: 'select',
      title: 'Select User',
      options: users.map((user) => {
        const userName = user?.fullName || user?.email;
        return {
          value: user.id,
          label: userName,
        };
      }),
    },
    {
      name: 'applicationKey',
      type: 'input',
      title: 'API Key',
    },
    {
      name: 'label',
      type: 'input',
      title: 'Label',
      placeholder: 'Navitare',
    },
    {
      name: 'safeListIpAddresses',
      type: 'input',
      title: 'IP Addresses',
      placeholder: '192.168.8.1,255.255.255.125',
    },
    {
      name: 'validTill',
      type: 'date',
      title: 'Expires',
      disableDate: (current) => current && current.valueOf() < Date.now(),
    },
    {
      name: 'statusApi',
      type: 'switch',
      title: 'Status',
    },
  ];

  const initialValues = {
    validTill: moment(apiKey?.validTill),
    statusApi: apiKey?.statusApi,
    tenant: apiKey?.tenant,
    label: apiKey?.label,
    applicationKey: apiKey?.applicationKey,
    userIds: apiKey?.userIds,
    safeListIpAddresses: apiKey?.safeListIpAddresses,
  };
  return (
    <>
      <Modal
        show={show}
        setShow={setShow}
        fields={fields}
        initialValues={initialValues}
        loading={loading}
        validationSchema={validationSchema}
        heading="Edit API Key"
        submitText="Update"
        handleSubmit={async (values) => {
          if (deepEqual(values, initialValues)) {
            toast.info('No changes made');
            setShow(false);
          } else {
            const newValues = {
              ...values,
              validTill: values.validTill.toISOString(),
            };
            await dispatch(updateAPIKeySettings(apiKey?.id, newValues));
            await dispatch(getAPIKeysByUID(user?.id));
            setShow(false);
          }
        }}
      />
    </>
  );
};
