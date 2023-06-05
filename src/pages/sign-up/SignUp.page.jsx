import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signup } from 'store/Actions/AuthActions';
import { messageNotifications } from 'store';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const initialValues = {
  username: '',
  fullName: '',
  emailAddress: '',
  password: '',
  confirmPassword: '',
};

const SignUpSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required.')
    .min(6, 'UserName must be atleast 6 characters'),
  fullName: Yup.string().required('Full Name is required.'),
  emailAddress: Yup.string()
    .required('Email Address is required.')
    .email('Please enter a valid email.'),
  password: Yup.string()
    .required('password is required.')
    .min(6, 'Password must be atleast 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required.')
    .min(6, 'Password must be atleast 6 characters')
    .oneOf(
      [Yup.ref('password'), null],
      'Confirm Password must matches with Password'
    ),
});

const fields = [
  { name: 'username', label: 'Username', placeholder: 'paul123456' },
  { name: 'fullName', label: 'Full Name', placeholder: 'Paul Elliot' },
  { name: 'emailAddress', label: 'Email Address', placeholder: 'paul@abz.com' },
  { name: 'password', label: 'Password', placeholder: '**********' },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: '**********',
  },
];

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [ipAddress, setIpAddress] = useState('');
  //creating function to load ip address from the API
  const getData = async () => {
    try {
      const res = await fetch(`https://api.ipify.org?format=json`, {
        method: 'GET',
      });
      const data = await res.json();
      setIpAddress(data.ip);
    } catch (error) {}
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
  }, []);

  const { t } = useTranslation('/SignupPage/ns');
  return (
    <div className="w-screen mx-auto my-5 " style={{ maxWidth: '536px' }}>
      <div className="col mx-4 md:mx-auto mb-5">
        {/* <img src="/icon/logo.svg" className="h-20 w-20 mx-auto" alt="" /> */}
      </div>
      <div className=" bg-custom-secondary rounded-lg p-4 md:p-5 ">
        <div className="text-center">
          <h2 className="text-md text-2xl text-white font-normal">
            {t('admin')}
          </h2>
          <p className="custom-text-light mb-4">{t('formHeading')}</p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              setIsLoading(true);
              await dispatch(
                signup(
                  values.username,
                  values.password,
                  values.confirmPassword,
                  values.emailAddress,
                  values.fullName,
                  '1',
                  ipAddress
                )
              );
              toast.success(
                'Account Created Successfully, Pending email verification',
                {
                  ...messageNotifications,
                }
              );
              resetForm();
              setIsLoading(false);
            } catch (error) {
              setIsLoading(false);
              toast.error('Error. Check all fields and try again', {
                ...messageNotifications,
              });
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              {fields.map((field) => {
                return (
                  <div className="mt-4 mb-3" key={field?.name}>
                    <label
                      htmlFor={field?.name}
                      className="form-label text-white font-light text-sm"
                    >
                      {field?.label}
                    </label>
                    <Field
                      type={
                        field?.name === 'password' ||
                        field?.name === 'confirmPassword'
                          ? 'password'
                          : 'text'
                      }
                      className="w-full h-12 bg-custom-main rounded-md placeholder:text-gray-400 text-gray-400 placeholder:text-sm px-3 placeholder:font-light focus:outline-none"
                      id={field?.name}
                      name={field?.name}
                      placeholder={field?.placeholder}
                    />
                    {errors[field?.name] && touched[field?.name] ? (
                      <div className="text-red-600 text-sm">
                        {errors[field?.name]}
                      </div>
                    ) : null}
                  </div>
                );
              })}
              <button
                type="submit"
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white w-full mb-2 rounded-md h-14 hover:bg-sky-600/[.8] ease-in duration-200"
              >
                {isLoading ? t('creatingAccount') : t('createAccountBtn')}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignUp;
