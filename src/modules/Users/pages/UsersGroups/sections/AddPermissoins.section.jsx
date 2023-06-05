import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PermissionsModal } from 'components';
import { asyncForEach, getGroupModules } from 'lib';
import { clearGroup } from 'store';
import { editGroupPermissions } from 'store';
import { toast } from 'react-toastify';

export const AddPermissions = ({
  t,
  loading,
  addPermissions,
  setAddPermissions,
  activeGroup,
}) => {
  const dispatch = useDispatch();
  return (
    <PermissionsModal
      show={addPermissions?.show}
      setShow={setAddPermissions}
      heading={t('configurePermissions')}
      submitText={t('addGroup')}
      permissions={addPermissions?.values}
      loading={loading}
      handleSubmit={async (values) => {
        const newValues = values?.filter((value) => {
          return !addPermissions?.values?.includes(value);
        });
        if (newValues?.length) {
          await asyncForEach(newValues, async (module) => {
            await dispatch(
              editGroupPermissions({
                permission: module,
                gid: activeGroup?.id,
              })
            );
          });
          setAddPermissions({ show: false, values: [] });
          dispatch(clearGroup());
          toast.success('Group Permissions Updated Successfully!');
        } else {
          setAddPermissions({ show: false, values: [] });
          dispatch(clearGroup());
          toast.warning(`You didn't add permissions.`);
        }
      }}
      handleCancel={() => {
        dispatch(clearGroup());
        setAddPermissions({ show: false, values: [] });
      }}
    />
  );
};
