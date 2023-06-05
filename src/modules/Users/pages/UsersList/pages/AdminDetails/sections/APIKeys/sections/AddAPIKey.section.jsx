import * as Yup from 'yup';
import { Modal } from 'components';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { AddPermissions } from './AddPermissions.section';
import { useSelector } from 'react-redux';

const fields = [
  {
    name: 'label',
    type: 'input',
    title: 'Label',
    placeholder: 'Navitare',
  },
  {
    name: 'statusApi',
    type: 'switch',
    title: 'Status',
  },
  {
    name: 'tenant',
    type: 'select',
    options: [{ label: 'Admin', value: 'admin' }],
    title: 'Tenant',
  },
  {
    name: 'validTill',
    type: 'date',
    title: 'Expires',
    disableDate: (current) => current && current.valueOf() < Date.now(),
  },
];

const validationSchema1 = Yup.object().shape({
  label: Yup.string().required('Label is required'),
  statusApi: Yup.string().required('Status is required'),
  tenant: Yup.string().required('Tenant is required'),
  validTill: Yup.date().required('Expiry date is required'),
});

export const AddAPIKey = ({ show, setShow }) => {
  const [apiKeyInit, setAPIKeyInit] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const { user } = useSelector((state) => state?.users);

  const initialValues1 = {
    applicationKey: nanoid(),
    userIds: user?.id,
    safeListIpAddresses: user?.restrictAccessIPAddress,
    validTill: '',
    statusApi: true,
    tenant: 'admin',
    label: '',
  };

  return (
    <>
      <Modal
        show={show}
        setShow={setShow}
        fields={fields}
        initialValues={initialValues1}
        validationSchema={validationSchema1}
        heading="Add API Key"
        submitText="Configure Permissions"
        handleSubmit={(values) => {
          const newValues = {
            ...values,
            validTill: values.validTill.toISOString(),
          };
          setShow(false);
          setAPIKeyInit(newValues);
          setShowPermissions(true);
        }}
      />
      <AddPermissions
        show={showPermissions}
        setShow={setShowPermissions}
        apiKeyInit={apiKeyInit}
      />
    </>
  );
};
