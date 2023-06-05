import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { deleteWebhook } from 'store/Actions/webhooks';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  id: Yup.string().required('Id is required'),
});

export const DeleteWebhook = ({ show, setShow, id }) => {
  const initialValues = {
    id,
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.webhooks);

  return (
    <Modal
      heading="Delete Webhook"
      submitText="Delete Webhook"
      show={show}
      setShow={setShow}
      customBody={
        <div className="mb-[32px]">
          Are you sure you wish to delete this webhook? This action is permanent
          and can not be undone.
        </div>
      }
      loading={loading}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async ({ id }) => {
        await dispatch(deleteWebhook({ id }));
        setShow(false);
      }}
    />
  );
};
