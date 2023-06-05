import { Alert } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserProfile } from 'store/Actions/AuthActions';
import { messageNotifications } from 'store';
import { Formik, Form, Field } from 'formik';
import { Close as CloseIcon } from "icons";
import * as Yup from 'yup';
import {
  ChangeMfaStatus,
  initAuthenticationFail,
  initAuthenticationPending,
  initAuthenticationSuccess,
  onLoginDispatch,
} from 'store/Slices/authSlice';
import { accountSuspended, closeLockScreen } from 'store/Slices/settingSlice';
import Recaptcha from 'pages/Google-Recaptcha/Recaptcha';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { getIPData, getDeviceName } from 'lib';

const initialValues = {
  username: '',
  password: '',
};

const SignInSchema = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  password: Yup.string()
    .min(6, 'Password must be atleast 6 characters')
    .required('Password is required'),
});

function SignIn() {
  const { t } = useTranslation('/LoginPage/ns');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies();
  const [show, setShow] = useState(true);
  const isTrustDevice = cookies.admin_days ? true : false;
  const refRecaptcha = useRef();
  let hasMFAEnabled = false;
  const login = (userName, password, TrustDevice) => {
    return async (dispatch) => {
      dispatch(initAuthenticationPending());
      const { ip, location } = await getIPData();
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL}/api/tokens`,
        {
          method: 'POST',
          body: JSON.stringify({
            userName,
            password,
            TrustDevice,
          }),
          headers: new Headers({
            'Content-type': 'application/json',
            'gen-api-key': process.env.REACT_APP_GEN_APIKEY,
            tenant: 'admin',
            'X-Forwarded-For': ip,
            location,
            devicename: getDeviceName(),
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        if (error.exception === 'User Not Found.') {
          setError('User Not found, Please check your credentials');
        }
        if (error.exception.includes('User Not Active')) {
          hasMFAEnabled = true;
          // localStorage.setItem("Account-Suspended", true);
          dispatch(accountSuspended());
          navigate('/admin/account-suspended');

          toast.error(
            'Account has been suspended, Please contact administration',
            {
              ...messageNotifications,
            }
          );
        }
        dispatch(initAuthenticationFail(error));
      }
      const res = await response.json();
      if (res.messages[0]) {
        hasMFAEnabled = true;
        navigate('/admin/one-time-password');
        localStorage.setItem('userId', res.messages[1]);
        localStorage.setItem('userName', res.messages[3]);
        if (res.messages[4] === 'true') {
          dispatch(ChangeMfaStatus());
          toast.success('Please enter the 6 figure code from you MFA App', {
            ...messageNotifications,
          });
        } else {
          toast.success('Please verify otp to login', {
            ...messageNotifications,
          });
        }
      }
      dispatch(initAuthenticationSuccess(res.data));
      dispatch(closeLockScreen());
      dispatch(getUserProfile(res.data.token));
      localStorage.setItem('AuthToken', JSON.stringify(res.data));
    };
  };

  return (
    <div>
      <div className="h-screen flex items-center ">
        <div className="w-screen flex items-center justify-center">
          <div className="col" style={{ maxWidth: '536px' }}>
            <div className="flex items-center justify-center mb-5">
              {/* <img src="/icon/logo.svg" alt="" className="h-20 w-20" /> */}
            </div>
            <div
              className="col mx-4 md:mx-auto bg-custom-secondary rounded-lg p-4 md:p-5"
              style={{ maxWidth: '536px' }}
            >
              <div className="text-center">
                {error && <Alert variant="danger">{error}</Alert>}
                <h2 className="text-md text-2xl text-white font-normal mb-2">
                  {t('title')}
                </h2>
              </div>
              <Formik
                initialValues={initialValues}
                validationSchema={SignInSchema}
                onSubmit={async (values, { resetForm }) => {
                  setIsLoading(true);
                  try {
                    await dispatch(
                      login(values.username, values.password, isTrustDevice)
                    );
                    toast.success('You have logged in successfuly', {
                      ...messageNotifications,
                    });
                    dispatch(onLoginDispatch(true))
                    setIsLoading(false);
                    resetForm();
                  } catch (err) {
                    setIsLoading(false);
                    if (!hasMFAEnabled) {
                      toast.error('Failed to Login', {
                        ...messageNotifications,
                      });
                    }
                  }
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="mt-4 mb-3">
                      <label
                        htmlFor="username"
                        className="form-label text-white font-light text-sm"
                      >
                        {t('username')}
                      </label>
                      <Field
                        name="username"
                        className="w-full h-12 bg-custom-main rounded-md text-gray-300 placeholder:text-gray-400 placeholder:text-sm px-3  placeholder:font-light focus:outline-none"
                        id="username"
                        placeholder={t('placeholder')}
                      />
                      {errors.username && touched.username ? (
                        <div className="text-red-600 text-sm">
                          {errors.username}
                        </div>
                      ) : null}
                    </div>
                    <div className="md:mb-8">
                      <div className="flex justify-between">
                        <label
                          htmlFor="exampleInputPassword1"
                          className="form-label text-white font-light text-sm"
                        >
                          {t('password')}
                        </label>
                        <Link
                          to="/admin/forgot-password"
                          className="text-blue-400 font-light text-sm cursor-pointer"
                        >
                          {t('ForgotPassword')}
                        </Link>
                      </div>
                      <Field
                        type="password"
                        name="password"
                        className="w-full h-14 bg-custom-main rounded-md text-gray-300 placeholder:text-gray-300 px-3 placeholder:text-sm placeholder:font-light focus:outline-none"
                        id="exampleInputPassword1"
                        placeholder="**********"
                      />
                      {errors.password && touched.password ? (
                        <div className="text-red-600 text-sm">
                          {errors.password}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-4 md:mt-5 ">
                      <Recaptcha refRecaptcha={refRecaptcha} />
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 ease-in duration-200 text-white w-full mb-2 rounded-md h-14"
                      >
                        {isLoading ? t('loggin-in') : t('loginButton')}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
