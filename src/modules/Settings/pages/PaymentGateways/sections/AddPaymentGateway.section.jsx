import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentGateway } from 'store';
import * as Yup from 'yup';

const fields = [
  {
    type: 'input',
    name: 'name',
    placeholder: 'Enter Payment Gateway Name',
    title: 'Payment Gateway',
  },
  {
    type: 'input',
    name: 'apiKey',
    placeholder: 'Enter Payment Gateway API Key',
    title: 'API Key',
  },
  {
    type: 'switch',
    name: 'status',
    title: 'Status',
  },
];

const initialValues = {
  name: '',
  apiKey: '',
  status: true,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('This field is required!'),
  apiKey: Yup.string().required('This field is required!'),
  status: Yup.boolean().required('This field is required!'),
});

export const AddPaymentGateway = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.paymentGateways);
  return (
    <Modal
      heading="Add Payment Gateway"
      submitText="Add Payment Gateway"
      show={show}
      loading={loading}
      setShow={setShow}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        await dispatch(addPaymentGateway({ data: values }));
        setShow(false);
      }}
    />
  );
};
