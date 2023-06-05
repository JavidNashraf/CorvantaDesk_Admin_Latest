import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSMTP } from 'store';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  id: Yup.string().required('ID is required'),
});

export const Delete = ({ show, setShow, record }) => {
  const initialValues = {
    id: record?.id,
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.smtps);

  return (
    <Modal
      heading="Delete Configuration"
      customBody={
        <div className="mb-[32px]">
          Are you sure you wish to delete this configuration? This action is
          permanent and can not be undone.
        </div>
      }
      initialValues={initialValues}
      validationSchema={validationSchema}
      loading={loading}
      submitText="Delete Configuration"
      handleSubmit={async (values) => {
        await dispatch(deleteSMTP({ id: values?.id }));
        setShow(false);
      }}
      show={show}
      setShow={setShow}
    />
  );
};
