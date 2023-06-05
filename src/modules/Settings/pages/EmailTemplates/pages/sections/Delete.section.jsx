import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEmailTemplate } from 'store';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  id: Yup.string().required('ID is required'),
});

export const Delete = ({ show, setShow, record }) => {
  const initialValues = {
    id: record?.id,
  };
  const { loading } = useSelector((state) => state?.emailTemplates);
  const dispatch = useDispatch();
  return (
    <Modal
      heading="Delete Email Template"
      customBody={
        <div className="mb-[32px]">
          Are you sure you wish to delete this email template? This action is
          permanent and can not be undone.
        </div>
      }
      loading={loading}
      initialValues={initialValues}
      validationSchema={validationSchema}
      submitText="Delete Template"
      handleSubmit={async (values) => {
        await dispatch(deleteEmailTemplate({ id: values.id }));
        setShow(false);
      }}
      show={show}
      setShow={setShow}
    />
  );
};
