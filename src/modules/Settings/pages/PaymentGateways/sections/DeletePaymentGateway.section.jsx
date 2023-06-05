import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { deletePaymentGateway } from 'store';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  id: Yup.string().required('Id is required'),
});

export const DeletePaymentGateway = ({ show, setShow, id }) => {
  const initialValues = {
    id,
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.paymentGateways);

  return (
    <Modal
      heading="Delete Payment Gateway"
      submitText="Delete Payment Gateway"
      show={show}
      setShow={setShow}
      customBody={
        <div className="mb-[32px]">
          Are you sure you wish to delete this payment gateway? This action is
          permanent and can not be undone.
        </div>
      }
      loading={loading}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async ({ id }) => {
        await dispatch(deletePaymentGateway({ id }));
        setShow(false);
      }}
    />
  );
};
