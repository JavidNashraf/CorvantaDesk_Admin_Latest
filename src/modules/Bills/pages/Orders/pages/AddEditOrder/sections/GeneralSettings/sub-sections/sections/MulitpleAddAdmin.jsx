import { Button, Modal } from 'components';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from "moment";

export const MulitpleAddAdmin = () => {
  const [show, setShow] = useState(false);
  const { user } = useSelector((state) => state?.auth)
  const { order } = useSelector((state) => state?.orders)
  const { values, setFieldValue } = useFormikContext();
  return (
    <div className="bg-[#000000] p-[32px] rounded-[8px] mt-[20px]">
      {/* Edit Note Modal */}
      <Modal
        show={show}
        setShow={setShow}
        heading="Edit Notes"
        submitText="Edit Notes"
        fields={[
          {
            label: 'Enter Notes Here',
            name: 'notes1',
            type: 'input',
            placeholder: 'Enter Notes',
          },
        ]}
        initialValues={{
          notes: values?.notes1,
        }}
        handleSubmit={(values) => {
          setFieldValue('notes1', values?.notes1);
          setShow(false);
        }}
      />
      <h6 className="text-[16px] text-white font-medium mb-[32px]">
        Admin Notes
      </h6>
      <div className="text-[14px] text-[#FFFFFF]">Admin : {user?.fullName}</div>
      <div className="text-[14px] text-[#FFFFFF] mb-[32px]">Created Date : {order?.createdOn ? moment(order?.createdOn).format(localStorage.getItem('dateFormat')) : "N/A"}</div>
      <p className="text-[14px] text-[#474761] mb-[32px]">{values?.notes1}</p>
      <Button
        type="ghost"
        className="h-[52px] px-[32px]"
        onClick={() => setShow(true)}
      >
        Edit Notes
      </Button>
    </div>
  );
};
