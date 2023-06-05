import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { editOrderTemplate } from 'store';

export const EditOrderTemplate = ({ show, setShow, orderTemplate }) => {
  const { products } = useSelector((state) => state?.products);
  const { loading } = useSelector((state) => state?.orders);

  const fields = [
    {
      type: 'text',
      name: 'templateName',
      placeholder: 'Enter Template Name...',
      title: 'Template Name',
    },
    {
      type: 'multiselect',
      mode: 'multiple',
      name: 'productIds',
      placeholder: 'Select Product',
      title: 'Product/Service',
      options: products?.map((el) => ({
        label: el?.name,
        value: el?.id,
      })),
    },
    {
      type: 'text',
      name: 'notes',
      placeholder: 'Enter Notes...',
      title: 'Notes',
    },
  ];

  const initialValues = {
    templateName: orderTemplate?.templateName,
    productIds: orderTemplate?.productIds,
    notes: orderTemplate?.notes,
    tenant: 'Admin',
  };

  const dispatch = useDispatch();
  return (
    <Modal
      heading="Edit Order Template"
      submitText="Edit Order Template"
      show={show}
      loading={loading}
      setShow={setShow}
      fields={fields}
      initialValues={initialValues}
      handleSubmit={async (values) => {
        const finalValues = {
          ...orderTemplate,
          ...values,
        };
        await dispatch(editOrderTemplate({ data: finalValues }));
        setShow(false);
      }}
    />
  );
};
