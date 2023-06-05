import { Button, Modal } from "components";
import { useFormikContext } from "formik";
import { useState } from "react";

export const OrderNote = () => {
  const [show, setShow] = useState(false);
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
            label: "Enter Notes Here",
            name: "orderNotes",
            type: "input",
            placeholder: "Enter Notes",
          },
        ]}
        initialValues={{
          orderNotes: values?.orderNotes,
        }}
        handleSubmit={(values) => {
          setFieldValue("orderNotes", values?.orderNotes);
          setShow(false);
        }}
      />
      <h6 className="text-[16px] text-white font-medium mb-[32px]">
        Order Notes
      </h6>
      <p className="text-[14px] text-[#474761] mb-[32px]">{values?.orderNotes}</p>
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
