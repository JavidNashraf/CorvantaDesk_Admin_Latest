import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNotificationTemplate } from 'store';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  id: Yup.string().required('ID is required'),
});

export const Delete = ({ show, setShow, id }) => {
  const { loading } = useSelector((state) => state?.notificationTemplates);

  const initialValues = {
    id,
  };

  const dispatch = useDispatch();

  return (
    <Modal
      heading="Delete Notification Template"
      customBody={
        <div className="mb-[32px]">
          Are you sure you wish to delete this notification template? This
          action is permanent and can not be undone.
        </div>
      }
      initialValues={initialValues}
      validationSchema={validationSchema}
      loading={loading}
      submitText="Delete Template"
      handleSubmit={async (values) => {
        await dispatch(deleteNotificationTemplate({ id: values?.id }));
        setShow(false);
      }}
      show={show}
      setShow={setShow}
    />
  );
};
