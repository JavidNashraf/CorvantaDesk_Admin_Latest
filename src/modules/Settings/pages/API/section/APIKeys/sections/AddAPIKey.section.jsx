import * as Yup from 'yup';
import { Modal } from 'components';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { AddPermissions } from './AddPermissions.section';
import { useSelector } from 'react-redux';

const validationSchema1 = Yup.object().shape({
  userIds: Yup.string().required('You must select a user'),
  label: Yup.string().required('Label is required'),
  statusApi: Yup.string().required('Status is required'),
  tenant: Yup.string().required('Tenant is required'),
  validTill: Yup.date().required('Expiry date is required'),
  safeListIpAddresses: Yup.string().required('At least an IP Adresses is required'),
});

export const AddAPIKey = ({ show, setShow }) => {
  const [apiKeyInit, setAPIKeyInit] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

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
      disabled: true
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

  const initialValues1 = {
    applicationKey: nanoid(),
    userIds: '',
    safeListIpAddresses: '',
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
