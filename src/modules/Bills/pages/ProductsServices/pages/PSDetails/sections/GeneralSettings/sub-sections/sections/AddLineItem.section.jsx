import { Modal } from 'components';
import * as Yup from 'yup';

const fields = [
  {
    type: 'input',
    name: 'lineItem',
    placeholder: 'Enter Line Item Name',
    title: 'Line Item Name',
  },
  {
    type: 'number',
    name: 'price',
    placeholder: 'Enter Price',
    title: 'Price',
  },
];

const initialValues = {
};

const validationSchema = Yup.object().shape({
  lineItem: Yup.string().required('This field is required!'),
  price: Yup.number().required('This field is required!'),
});

export const AddLineItem = ({ show, setShow, handleAdd }) => {
  return (
    <Modal
      heading="Add Line Item"
      submitText="Add Line Item"
      show={show}
      setShow={setShow}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        handleAdd(values);
        setShow(false);
      }}
    />
  );
};
