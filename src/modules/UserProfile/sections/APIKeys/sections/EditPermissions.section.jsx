import { useSelector, useDispatch } from "react-redux";
import { PermissionsModal } from "components";
import { updateAPIKeyPermissions } from "store";

export const EditPermissions = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const { userModules } = useSelector((state) => state?.modules);
  const { loading, apiKey } = useSelector((state) => state?.apiKeys);

  const getInitialModules = () => {
    if (apiKey?.userApiKeyModules) {
      const filtered = userModules.filter((module) => {
        return !apiKey?.userApiKeyModules?.some(
          (permission) => permission.name === module.name
        );
      });
      const currentModules = apiKey?.userApiKeyModules.map((module) => {
        return {
          isActive: true,
          name: module.name,
          permissionDetail: JSON.parse(module && module.permissionDetail),
        };
      });
      // console.log([...filtered, ...currentModules]);
      const final = [...filtered, ...currentModules];
      final.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      return final;
    } else {
      return userModules;
    }
  };

  const initialModules = getInitialModules();

  return (
    <PermissionsModal
      show={show}
      setShow={setShow}
      heading="Select New Permissions"
      submitText="Update Permissions"
      permissions={initialModules}
      loading={loading}
      handleSubmit={async (values) => {
        const newValues = values?.filter((value) => {
          return !userModules?.includes(value);
        });
        const valuesToPost = newValues.map(
          ({ isActive, name, permissionDetail, tenant }) => {
            return {
              isActive,
              name,
              permissionDetail: JSON.stringify(permissionDetail),
              userApiKeyId: apiKey?.id,
            };
          }
        );
        const finalObject = {
          userApiKeyModules: valuesToPost,
        };
        // console.log(finalObject);
        await dispatch(updateAPIKeyPermissions(apiKey?.id, finalObject));
        setShow(false);
      }}
    />
  );
};
