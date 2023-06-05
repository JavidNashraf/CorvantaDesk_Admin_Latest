import React from 'react';
import { useTranslation } from 'react-i18next';

function AccountSuspended() {
  const { t } = useTranslation('/AccountSuspendedPage/ns');
  return (
    <div className="d-flex h-screen">
      <div className="col-md-6 my-auto p-10 md:p-20">
        <div>
          <img src="/icon/logo.svg" alt={t('title')} className="w-20 h-20" />
          <h3 className="text-4xl text-white font-normal mt-5">{t('title')}</h3>
          <p className=" mb-5 custom-text-light text-base border-dashed-bottom pb-5">
            {t('description1')}
          </p>
        </div>
        <div>
          <h3 className="text-sm text-white">{t('subTitle')}</h3>
          <p className="mb-5 text-base custom-text-light">
            {t('description2')}
          </p>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 ease-in duration-200 py-3 px-20 rounded-lg text-white"
          >
            {t('btnSupport')}
          </button>
        </div>
      </div>
      <div className="col d-none bg-custom-secondary d-md-flex items-center justify-center">
        <img src="/icon/account-suspended.svg" alt={t('title')} />
      </div>
    </div>
  );
}

export default AccountSuspended;
