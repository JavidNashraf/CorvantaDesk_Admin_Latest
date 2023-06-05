import { useSelector, useDispatch } from 'react-redux';
import { PermissionsModal } from 'components';
import { addAPIKey } from 'store';

export const AddPermissions = ({ show, setShow, apiKeyInit }) => {
  const dispatch = useDispatch();
  const { appModules } = useSelector((state) => state?.modules);
  const { loading } = useSelector((state) => state?.apiKeys);
  const { user } = useSelector((state) => state?.auth);
  return (
    <PermissionsModal
      show={show}
      setShow={setShow}
      heading="API Keys Permissions"
      submitText="Create"
      permissions={appModules}
      loading={loading}
      handleSubmit={async (values) => {
        const newValues = values?.filter((value) => {
          return !appModules?.includes(value);
        });
        const valuesToPost = newValues.map(
          ({ isActive, name, permissionDetail, tenant }) => {
            return {
              isActive,
              name,
              permissionDetail: JSON.stringify(permissionDetail),
              tenant,
              userApiKeyId: '',
            };
          }
        );
        const finalObject = {
          ...apiKeyInit,
          userApiKeyModules: valuesToPost,
        };
        // console.log(finalObject);
        await dispatch(addAPIKey(user?.id, finalObject));
        setShow(false);
      }}
    />
  );
};
