import { useEffect, useState } from 'react';
import { UserProfileCard } from 'modules/Bills/pages/Clients/pages/ClientDetails/sections';
import { Navigation } from '../OTDetails/sections';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { getUserById } from 'store';
import { getUserModulesById } from 'store';
import { getAppModules } from 'store/Actions/moduleActions';

export const OrderAdminViewPage = () => {
  const { t } = useTranslation('/Users/ns');
  const [active, setActive] = useState(t('overview'));

  const links = [
    { label: t('overview'), onClick: () => setActive(t('overview')) },
    {
      label: t('userPermissions'),
      onClick: () => setActive(t('userPermissions')),
    },
    { label: t('apiKeys'), onClick: () => setActive(t('apiKeys')) },
    { label: t('settings'), onClick: () => setActive(t('settings')) },
    { label: t('eventLogs'), onClick: () => setActive(t('eventLogs')) },
  ];

  const { loading, user } = useSelector((state) => state?.users);
  const moduleLoading = useSelector((state) => state?.modules?.loading);

  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserById(id));
    dispatch(getUserModulesById(id));
    dispatch(getAppModules());
  }, []);

  return (
    <div className="users">
      <div className="admin-details min-w-[60vh]">
        {loading || moduleLoading || user === null ? (
          <Spin
            size="large"
            style={{ gridColumn: '1/3', alignSelf: 'center' }}
          />
        ) : (
          <>
            <div className="admin-details__left">
              <UserProfileCard />
            </div>
            <div className="admin-details__right">
              <Navigation active={active} links={links} />
              {active === t('overview') ? (
                <>
                </>
              ) : (
                <></>
              )}
              {active === t('eventLogs') ? (
                <>
                </>
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
