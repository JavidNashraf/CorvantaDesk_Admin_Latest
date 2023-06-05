import { Modal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { sendNotification } from 'store';
import * as Yup from 'yup';

const notificationOptions = [
  { label: 'New User Registered', value: 0 },
  { label: 'Ticket', value: 1 },
  { label: 'Ticket Created', value: 2 },
  { label: 'Ticket Updated', value: 3 },
  { label: 'Order', value: 4 },
  { label: 'Order Created', value: 5 },
  { label: 'Order Updated', value: 6 },
  { label: 'Ticket New Comments', value: 7 },
  { label: 'Ticket New Comments Reply', value: 8 },
  { label: 'Category', value: 9 },
  { label: 'Category Generated', value: 10 },
  { label: 'Bills', value: 11 },
  { label: 'Bills Created', value: 12 },
  { label: 'Added to Admin Group', value: 13 },
];

export const Send = ({ show, setShow, id }) => {
  const { template, loading } = useSelector(
    (state) => state?.notificationTemplates
  );
  const { specificUsers } = useSelector((state) => state?.users);
  const usersLoading = useSelector((state) => state?.users?.loading);

  const initialValues = {
    notificationType: 0,
    notificationTemplateId: id,
    targetUserTypes: template?.targetUserType,
    toUserIds: specificUsers.map((user) => user?.id),
  };

  const validationSchema = Yup.object().shape({
    notificationType: Yup.string().required('Notification Type is Required'),
  });

  const fields = [
    {
      type: 'select',
      options: notificationOptions,
      title: 'Select Notification Type',
      placeholder: 'Select Notification Type',
      name: 'notificationType',
    },
  ];

  const dispatch = useDispatch();

  return (
    <Modal
      heading="Send Notification"
      initialValues={initialValues}
      fields={fields}
      validationSchema={validationSchema}
      loading={loading || usersLoading}
      submitText="Send Notification"
      handleSubmit={async (values) => {
        const finalValues = {
          ...values,
          notificationType: Number(values?.notificationType),
        };
        await dispatch(sendNotification({ data: finalValues }));
        setShow(false);
      }}
      show={show}
      setShow={setShow}
    />
  );
};
