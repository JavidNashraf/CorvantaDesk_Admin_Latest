import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { editPaymentGateway } from 'store';
import * as Yup from 'yup';

const fields = [
  {
    type: 'input',
    name: 'name',
    placeholder: 'Enter Payment Gateway Name',
    title: 'Payment Gateway',
    disabled: true,
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

const validationSchema = Yup.object().shape({
  id: Yup.string().required('Id is required'),
  name: Yup.string().required('This field is required!'),
  apiKey: Yup.string().required('This field is required!'),
  status: Yup.boolean().required('This field is required!'),
});

export const EditPaymentGateway = ({ show, setShow, editValue }) => {
  const initialValues = {
    id: editValue.id,
    name: editValue.name,
    apiKey: editValue.apiKey,
    status: editValue.status,
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.paymentGateways);

  return (
    <Modal
      heading="Edit Payment Gateway"
      submitText="Edit Payment Gateway"
      show={show}
      setShow={setShow}
      fields={fields}
      loading={loading}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        await dispatch(editPaymentGateway({ data: values }));
        setShow(false);
      }}
    />
  );
};
