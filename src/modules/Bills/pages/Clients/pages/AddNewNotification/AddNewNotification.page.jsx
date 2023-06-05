import { EditorState } from 'draft-js';
// import * as Yup from 'yup';
import { Spin } from 'antd';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Left, Right } from './sections';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addNotificationTemplate } from 'store';

const initialValues = {
  property: 3,
  operatorType: '<=',
  value: '10',
  address: '',
  body: '',
  bodyHolder: EditorState.createEmpty(),
  clientName: '',
  company: '',
  startDate: moment(),
  endDate: moment(),
  title: '',
  targetUserType: 0,
};

// const validationSchema = Yup.object().shape({});

export const AddNewNotification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { specificUsers } = useSelector((state) => state?.users);
  const { loading } = useSelector((state) => state?.notificationTemplates);
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

            await dispatch(addNotificationTemplate({ data: finalValues }));
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
