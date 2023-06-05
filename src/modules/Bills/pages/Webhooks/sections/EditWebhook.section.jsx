import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { editWebhook } from 'store/Actions/webhooks';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  webHookUrl: Yup.string().required('This field is required!'),
  moduleId: Yup.string().required('This field is required!'),
  action: Yup.string().required('This field is required!'),
});

export const EditWebhook = ({ show, setShow, editValue }) => {
  const initialValues = {
    id: editValue?.id,
    webHookUrl: editValue?.webHookUrl,
    moduleId: editValue?.moduleId,
    action: editValue?.action,
    isActive: editValue?.isActive,
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.webhooks);
  const { appModules } = useSelector((state) => state?.modules);

  const fields = [
    {
      type: 'input',
      name: 'webHookUrl',
      placeholder: 'Enter Web Hook URL',
      title: 'Web Hook URL',
    },
    {
      type: 'select',
      name: 'moduleId',
      placeholder: 'Select Module Name',
      title: 'Module',
      options: appModules?.map((module) => ({
        label: module?.name,
        value: module?.name,
      })),
    },
    {
      type: 'switch',
      name: 'isActive',
      title: 'Status',
    },
    {
      type: 'select',
      name: 'action',
      placeholder: 'Select Action',
      title: 'Action',
      options: ['Create', 'Update', 'Delete']?.map((option, idx) => ({
        label: option,
        value: idx,
      })),
    },
  ];

  return (
    <Modal
      heading="Edit Webhook"
      submitText="Edit Webhook"
      show={show}
      setShow={setShow}
      fields={fields}
      loading={loading}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={async (values) => {
        await dispatch(
          editWebhook({
            data: {
              ...values,
              action: Number(values?.action),
            },
          })
        );
        setShow(false);
      }}
    />
  );
};
