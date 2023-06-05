import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { editDepartment } from 'store';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object().shape({
  departmentAdmins: Yup.array().required('Admin Assigned is required'),
});

export const AdminAssigned = ({ show, setShow, editValue, users }) => {

  const initialValues = {
    id: editValue.id,
    deptNumber: editValue.deptNumber,
    name: editValue.name,
    deptStatus: editValue.deptStatus,
    brandId: editValue.brandId,
    departmentAdmins: editValue?.departmentAdminsList,
  };

  const { t } = useTranslation('/Settings/ns');
  const dispatch = useDispatch();
  const fields = [
    {
      type: 'userList',
      name: 'departmentAdmins',
      placeholder: 'Admin Assigned',
      title: t('Admins'),
      users: users,
    },
  ];

  const { loading } = useSelector((state) => state?.paymentGateways);
  return (
    <Modal
      heading={t('assignedAdmin')}
      submitText={t('saveChanges')}
      show={show}
      setShow={setShow}
      fields={fields}
      loading={loading}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        await dispatch(editDepartment({ data: values }));
        setShow(false);
      }}
    />
  );
};
