import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { messageNotifications } from 'store';
import { forgotPassword } from 'store/Actions/AuthActions';
import Recaptcha from 'pages/Google-Recaptcha/Recaptcha';
import { useTranslation } from 'react-i18next';

const initialValues = {
  email: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required!')
    .email('Please enter a valid email!'),
});

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const refRecaptcha = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('/ForgotPasswordPage/ns');
  return (
    <div className="h-screen w-full flex items-center justify-content-center">
      <div className="col" style={{ maxWidth: '536px' }}>
        <div className="flex items-center justify-center mb-5">
          {/* <img src="/icon/logo.svg" alt="" className="h-20 w-20" /> */}
        </div>
        <div className="col mx-4 md:mx-auto bg-custom-secondary rounded-lg p-8 ">
          <div className="text-center">
            <h2 className="text-md text-2xl text-white font-normal">
              {t('title')}
            </h2>
            <p className="custom-text-light">{t('subTitle')}</p>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);
                await dispatch(forgotPassword(values.email));
                localStorage.setItem('userEmail', values.email);
                toast.success(
                  'A Link has been sent to your email to reset password',
                  {
                    ...messageNotifications,
                  }
                );
                setIsLoading(false);
              } catch (err) {
                toast.error('Failed to reset Password', {
                  ...messageNotifications,
                });
                setIsLoading(false);
              }
            }}
          >
            {({ errors, touched }) => {
              return (
                <Form>
                  <div className="mt-4 md:mb-8">
                    <label
                      htmlFor="forgotPassword"
                      className="form-label text-white font-light text-sm"
                    >
                      {t('emailAddress')}
                    </label>
                    <Field
                      id="forgotPassword"
                      type="email"
                      name="email"
                      className="w-full h-12 bg-custom-main rounded-md placeholder:text-gray-400 text-gray-400 focus:outline-none placeholder:text-sm px-3  placeholder:font-light"
                      placeholder={t('placeholder')}
                    />
                    {errors.email && touched.email ? (
                      <div className="text-red-600 text-sm">{errors.email}</div>
                    ) : null}
                  </div>
                  <div className="flex mt-4 md:mt-5">
                    <Recaptcha refRecaptcha={refRecaptcha} />
                    <button
                      type="button"
                      className="bg-blue-900/[.3] w-full mb-2 rounded-md h-12 text-blue-500 hover:bg-blue-900/[.1] ease-in duration-200"
                      onClick={() => navigate('/admin/sign-in')}
                    >
                      {t('cancelBtn')}
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 w-full h-12 rounded-md text-white font-light ml-2 ease-in duration-200"
                    >
                      {isLoading ? t('Sending') : t('submitBtn')}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
