import { Modal } from 'components';
import { getGroupModules } from 'lib';
import { useDispatch } from 'react-redux';
import { addGroup } from 'store';
import * as Yup from 'yup';

const initialAddValues = {
  groupName: '',
  status: false,
  isDefault: false,
  isSuperAdmin: false,
  tenant: 'Admin',
};

const addValidationSchema = Yup.object().shape({
  groupName: Yup.string().required('This field is required!'),
  status: Yup.boolean().required('This field is required!'),
  isDefault: Yup.boolean().required('This field is required!'),
  isSuperAdmin: Yup.boolean().required('This field is required!'),
});

export const AddGroup = ({
  t,
  showAdd,
  setShowAdd,
  setPermissionsShow,
  loading,
  appModules,
}) => {
  const dispatch = useDispatch();
  const addFields = [
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
  return (
    <Modal
      show={showAdd}
      setShow={setShowAdd}
      heading={t('addGroup')}
      submitText={t('configurePermissions')}
      initialValues={initialAddValues}
      validationSchema={addValidationSchema}
      fields={addFields}
      loading={loading}
      handleSubmit={async (values) => {
        await dispatch(addGroup(values));
        const allModules = getGroupModules({
          appModules,
          groupModules: [],
        });
        setShowAdd(false);
        setPermissionsShow({ show: true, values: allModules });
      }}
    />
  );
};
