import * as Yup from 'yup';
import { Modal } from 'components';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateGroup } from 'store';

const editValidationSchema = Yup.object().shape({
  groupName: Yup.string().required('This field is required!'),
  status: Yup.boolean().required('This field is required!'),
  isDefault: Yup.boolean().required('This field is required!'),
  isSuperAdmin: Yup.boolean().required('This field is required!'),
});

export const EditGroup = ({ editModal, setEditModal, t, loading }) => {
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    const {
      values: { name, isDefault, isSuperAdmin, status, id },
    } = editModal;
    const init = {
      groupName: name,
      isDefault,
      isSuperAdmin,
      status,
      id: id,
    };
    setInitialValues(init);
  }, [editModal?.values]);

  const editFields = [
    {
      type: 'input',
      name: 'groupName',
      placeholder: 'Group Name',
      title: t('name'),
    },
    {
      type: 'switch',
      name: 'status',
      title: t('status'),
    },
    // {
    //   type: 'switch',
    //   name: 'isDefault',
    //   title: t('makeDefault'),
    // },
    // {
    //   type: 'switch',
    //   name: 'isSuperAdmin',
    //   title: 'Make Super Admin',
    // },
  ];
  const dispatch = useDispatch();

  return (
    <Modal
      show={editModal?.show}
      initialValues={initialValues}
      fields={editFields}
      setShow={setEditModal}
      loading={loading}
      submitText="Edit Group"
      validationSchema={editValidationSchema}
      heading={t('editGroup')}
      handleSubmit={async (values) => {
        await dispatch(updateGroup(values));
        setEditModal({ show: false, values: {} });
      }}
      handleCancel={() => {
        setEditModal({ show: false, values: {} });
      }}
    />
  );
};
