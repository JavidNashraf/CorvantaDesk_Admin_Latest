import './AdminDetails.styles.scss';
import { useEffect, useState } from 'react';
import {
  UserProfileCard,
  Navigation,
  // Overview
  AssignedTickets,
  // User Permissions
  UserPermissions,
  // API Keys
  APIKeys,
  // Settings
  Settings,
  LoginSessions,
  Logs,
} from './sections';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { getUserById } from 'store';
import { getUserModulesById } from 'store';
import { getAppModules } from 'store/Actions/moduleActions';

export const AdminDetails = () => {
  const { t } = useTranslation('/Users/ns');

  const [active, setActive] = useState(t('overview'));

  

  const { loading, user } = useSelector((state) => state?.users);
  const moduleLoading = useSelector((state) => state?.modules?.loading);

  const { id } = useParams();
  
  var links = [
    { label: t('overview'), onClick: () => setActive(t('overview')) },
    { label: t('apiKeys'), onClick: () => setActive(t('apiKeys')) },
    { label: t('settings'), onClick: () => setActive(t('settings')) },
    { label: t('eventLogs'), onClick: () => setActive(t('eventLogs')) },
  ]

  if (JSON.parse(localStorage.getItem("CurrentUser")).id !== id) {
    links = [
      { label: t('overview'), onClick: () => setActive(t('overview')) },
      {
        label: t('userPermissions'),
        onClick: () => setActive(t('userPermissions')),
      },
      { label: t('apiKeys'), onClick: () => setActive(t('apiKeys')) },
      { label: t('settings'), onClick: () => setActive(t('settings')) },
      { label: t('eventLogs'), onClick: () => setActive(t('eventLogs')) },
    ]
  }

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
              {/* USER PROFILE CARD */}
              <UserProfileCard />
              {/* <div className="mt-4">
                <SubUsers />
              </div> */}
            </div>
            <div className="admin-details__right">
              <Navigation active={active} links={links} />
              {active === t('overview') ? (
                <>
                  <AssignedTickets />
                  {/* <PastEmails /> */}
                </>
              ) : (
                <></>
              )}
              {active === t('userPermissions') && JSON.parse(localStorage.getItem("CurrentUser")).id !== id  ? <UserPermissions /> : <></>}
              {active === t('apiKeys') ? <APIKeys /> : <></>}
              {active === t('settings') ? <Settings /> : <></>}
              {active === t('eventLogs') ? (
                <>
                  <LoginSessions />
                  <Logs />
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
