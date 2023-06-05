// import * as Yup from 'yup';
import { Spin } from 'antd';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { Left, Right } from './sections';
import { convertHTMLToDraftState } from 'lib';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { editNotificationTemplate, getNotificationTemplateByID } from 'store';
import { useEffect } from 'react';

// const validationSchema = Yup.object().shape({});

export const EditNotification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { specificUsers } = useSelector((state) => state?.users);
  const { template, loading } = useSelector(
    (state) => state?.notificationTemplates
  );

  const { id } = useParams();
  useEffect(() => {
    dispatch(getNotificationTemplateByID({ id }));
  }, []);

  const initialValues = {
    property: template?.property,
    operatorType: template?.operatorType,
    value: template?.value,
    // address: template?.address,
    body: template?.body,
    bodyHolder: convertHTMLToDraftState(template?.body),
    // clientName: template?.clientName,
    // company: template?.company,
    startDate: moment(template?.startDate),
    endDate: moment(template?.endDate),
    title: template?.title,
    targetUserType: template?.targetUserType,
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values) => {
          if (specificUsers?.length) {
            const finalValues = {
              title: values?.title,
              startDate: moment(values?.startDate).toISOString(),
              endDate: moment(values?.endDate).toISOString(),
              body: values?.body,
              status: 0,
              targetUserType: values?.targetUserType,
              property: values?.property,
              operatorType: values?.operatorType,
              value: values?.value,
            };

            await dispatch(
              editNotificationTemplate({
                data: { ...finalValues, id },
              })
            );
            navigate(
              '/admin/dashboard/billing/clients/show-notifications/client-notifications'
            );
          } else {
            toast.error(
              'Please select and apply targeted users or check if users list is empty.'
            );
          }
        }}
      >
        {() => {
          return (
            <Form>
              <Spin spinning={loading}>
                <div className="grid grid-cols-[1fr_3fr] gap-[20px] px-[32px] py-[40px]">
                  <Left />
                  <Right />
                </div>
              </Spin>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
