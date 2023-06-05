import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PermissionsModal } from 'components';
import { asyncForEach, getGroupModules } from 'lib';
import { clearGroup } from 'store';
import { editGroupPermissions } from 'store';
import { toast } from 'react-toastify';

export const EditPermissions = ({
  appModules,
  groupPermissions,
  activeEditGroup,
  setActiveEditGroup,
  t,
  loading,
}) => {
  const [editPermissions, setEditPermissions] = useState({
    show: false,
    values: [],
  });
  useEffect(() => {
    const setEditModal = () => {
      if (activeEditGroup !== null) {
        const allModules = getGroupModules({
          appModules,
          groupModules: groupPermissions,
        });
        setEditPermissions({
          show: true,
          values: allModules,
        });
      }
    };
    setEditModal();
  }, [activeEditGroup]);

  const dispatch = useDispatch();

  return (
    <PermissionsModal
      show={editPermissions?.show}
      setShow={setEditPermissions}
      heading={t('configurePermissions')}
      submitText={t('editPermissionsShort')}
      permissions={editPermissions?.values}
      loading={loading}
      handleSubmit={async (values) => {
        const newValues = values?.filter((value) => {
          return !editPermissions?.values?.includes(value);
        });
        if (newValues?.length) {
          await asyncForEach(newValues, async (module) => {
            await dispatch(
              editGroupPermissions({
                permission: module,
                gid: activeEditGroup?.id,
              })
            );
          });
          setEditPermissions({ show: false, values: [] });
          setActiveEditGroup(null);
          dispatch(clearGroup());
          toast.success('Group Permissions Updated Successfully!');
        } else {
          setEditPermissions({ show: false, values: [] });
          setActiveEditGroup(null);
          dispatch(clearGroup());
          toast.warning(`You didn't change anything.`);
        }
      }}
      handleCancel={() => {
        dispatch(clearGroup());
        setEditPermissions({ show: false, values: [] });
        setActiveEditGroup(null);
      }}
    />
  );
};
