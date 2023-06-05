import { Button, Checkbox } from 'antd';
import { asyncForEach, getUserModules } from 'lib';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUserModulesById } from 'store';
import { editUserPermissions } from 'store';

export const UserPermissions = () => {
  const { appModules, loading } = useSelector((state) => state?.modules);
  const { user, userModules } = useSelector((state) => state?.users);
  const dispatch = useDispatch();

  const [localLoading, setLocalLoading] = useState(false);
  const [modules, setModules] = useState([]);
  const [moduleForCompare, setModuleForCompare] = useState([]);

  const getPermissions = () => {
    setLocalLoading(true);
    const allModules = getUserModules({
      appModules,
      userModules,
    });
    setModuleForCompare(allModules);
    setModules(allModules);
    setLocalLoading(false);
  };
  useEffect(() => {
    getPermissions();
  }, [userModules]);

  const { t } = useTranslation('Users/ns');
  return (
    <div className="mt-[20px] p-[32px] bg-[#000000] rounded-[8px]">
      <h6 className="text-white text-[16px]">{t('userPermissions')}</h6>
      <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[32px] mb-[32px]" />
      {modules?.map(
        (
          { name, permissionDetail: { Create, View, Update, Remove } },
          index
        ) => {
          return (
            <div key={name}>
              <div className="flex items-center justify-between">
                <p className="text-white text-[14px]">{name}</p>
                <div className="flex items-center gap-[20px]">
                  <Checkbox
                    disabled={loading || localLoading}
                    checked={Create && View && Update && Remove}
                    onChange={(e) => {
                      const newPermissions = modules.map((permission) => {
                        return permission?.name === name
                          ? {
                              ...permission,
                              permissionDetail: {
                                Create: e.target.checked,
                                View: e.target.checked,
                                Update: e.target.checked,
                                Remove: e.target.checked,
                              },
                            }
                          : permission;
                      });
                      setModules(newPermissions);
                    }}
                  >
                    <p className="mb-0 text-[#92928F]">{t('all')}</p>
                  </Checkbox>
                  <Checkbox
                    disabled={loading || localLoading}
                    checked={Create}
                    onChange={(e) => {
                      const newPermissions = modules.map((permission) => {
                        return permission?.name === name
                          ? {
                              ...permission,
                              permissionDetail: {
                                ...permission?.permissionDetail,
                                Create: e.target.checked,
                              },
                            }
                          : permission;
                      });
                      setModules(newPermissions);
                    }}
                  >
                    <p className="mb-0 text-[#92928F]">Create</p>
                  </Checkbox>
                  <Checkbox
                    disabled={loading || localLoading}
                    checked={View}
                    onChange={(e) => {
                      const newPermissions = modules.map((permission) => {
                        return permission?.name === name
                          ? {
                              ...permission,
                              permissionDetail: {
                                ...permission?.permissionDetail,
                                View: e.target.checked,
                              },
                            }
                          : permission;
                      });
                      setModules(newPermissions);
                    }}
                  >
                    <p className="mb-0 text-[#92928F]">Read</p>
                  </Checkbox>
                  <Checkbox
                    disabled={loading || localLoading}
                    checked={Update}
                    onChange={(e) => {
                      const newPermissions = modules.map((permission) => {
                        return permission?.name === name
                          ? {
                              ...permission,
                              permissionDetail: {
                                ...permission?.permissionDetail,
                                Update: e.target.checked,
                              },
                            }
                          : permission;
                      });
                      setModules(newPermissions);
                    }}
                  >
                    <p className="mb-0 text-[#92928F]">Update</p>
                  </Checkbox>
                  <Checkbox
                    disabled={loading || localLoading}
                    checked={Remove}
                    onChange={(e) => {
                      const newPermissions = modules.map((permission) => {
                        return permission?.name === name
                          ? {
                              ...permission,
                              permissionDetail: {
                                ...permission?.permissionDetail,
                                Remove: e.target.checked,
                              },
                            }
                          : permission;
                      });
                      setModules(newPermissions);
                    }}
                  >
                    <p className="mb-0 text-[#92928F]">Remove</p>
                  </Checkbox>
                </div>
              </div>
              {modules?.length > index + 1 ? (
                <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[32px] mb-[32px]" />
              ) : (
                <></>
              )}
            </div>
          );
        }
      )}
      <div className="flex items-center gap-[10px] px-[0px] pt-[40px]">
        <button
          type="button"
          onClick={() => {
            getPermissions();
          }}
          className="bg-[#323248] text-white rounded-[8px] py-[12px] px-[24px]"
        >
          {t('discard')}
        </button>
        <Button
          htmlType="button"
          loading={loading || localLoading}
          onClick={async () => {
            setLocalLoading(true);
            const newValues = modules?.filter((value, index) => {
              return !moduleForCompare?.includes(value);
            });
            if (newValues?.length) {
              await asyncForEach(newValues, async (module) => {
                await dispatch(
                  editUserPermissions({
                    permission: module,
                    uid: user?.id,
                  })
                );
              });
              await dispatch(getUserModulesById(user?.id));
              setLocalLoading(false);
              toast.success('User Permissions Updated Successfully!');
            } else {
              toast.warning(`You didn't change anything.`);
            }
          }}
          disabled={!user}
          className="bg-[#3699FF] text-white rounded-[8px] py-[12px] px-[24px] h-[45px] border-none hover:bg-[#369bffba] hover:text-white active:bg-[#369bffba] active:text-white focus:bg-[#369bffba] focus:text-white"
        >
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
};
