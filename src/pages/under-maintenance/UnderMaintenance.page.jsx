import { Statistic } from 'antd';
import { Button } from 'components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './UnderMaintenance.styles.scss';

const { Countdown } = Statistic;

function UnderMaintenance() {
  const { t } = useTranslation('/UnderMaintenancePage/ns');
  const [finished, setFinished] = useState(false);
  const { maintenanceDetails } = useSelector((state) => state?.settings);

  useEffect(() => {
    if (moment(maintenanceDetails?.expirationDate).isBefore(moment())) {
      setFinished(true);
    }
  }, [maintenanceDetails]);

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="my-auto p-10 md:p-20">
        {/* <img
          src="/icon/logo.svg"
          alt={t('suspendedTitle')}
          className="w-20 h-20"
        /> */}
        <h3 className="text-4xl text-white mt-5">{t('title')}</h3>
        <p className="custom-text-light text-base mb-5 pb-5 border-dashed-bottom">
          {maintenanceDetails?.reason}
        </p>
        <div className="countdown">
          {finished ? (
            <div className="ant-statistic-content">
              <Link to="/admin/sign-in">
                <Button htmlType="button">
                  Login with Username & Password
                </Button>
              </Link>
            </div>
          ) : (
            <Countdown
              value={maintenanceDetails?.expirationDate}
              format="DD : HH : mm : ss"
              onFinish={() => setFinished(true)}
            />
          )}
        </div>
        {/* <div className="countdown text-4xl text-white">
          <Countdown value={maintenanceDetails?.expirationDate} />
          <span>00</span> : <span>06</span> : <span>30</span> : <span>30</span>
        </div> */}
      </div>
      <div className="bg-custom-secondary flex align-items-center justify-content">
        <img src="/icon/under-maintenance.svg" alt="" className="mx-auto" />
      </div>
    </div>
  );
}

export default UnderMaintenance;
