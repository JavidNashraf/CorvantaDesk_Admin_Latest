import React from 'react';
import ReactGoogleInvisibleRecaptcha from 'react-google-invisible-recaptcha';
import { useSelector } from 'react-redux';

const Recaptcha = ({ refRecaptcha }) => {
  const { settings } = useSelector((state) => state?.appSettings);
  return (
    <>
      {settings?.enableAdminRecaptcha ? (
        <ReactGoogleInvisibleRecaptcha
          sitekey={process.env.REACT_APP_SITE_KEY}
          ref={refRecaptcha}
          onResolved={() => console.log('Human detected.')}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Recaptcha;
