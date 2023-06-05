import { Close as CloseIcon } from "icons";
import { SimpleModal } from "components";
import { useState } from "react";
import { getAddCredit } from "store";
import { useDispatch } from "react-redux";

export function RefundCaptureFail({
  show,
  setShow,
  handleCancel,
  backtoOpen,
}) {
  const handleClose = () => {
    setShow(false);
  };
  const [showAdd, setShowAdd] = useState(false);

const dispatch = useDispatch();
  return (
    <SimpleModal
      show={show}
      setShow={setShow}
      onHide={handleClose}
      heading="Refund Capture Failed"
      cancelButtonText="Continue"
      submitText="Choose Different Payment Method"
      handleCancel={handleCancel}
      handleSubmit={async () => {
        backtoOpen();
        setShow(false);
     }}
    >
       {/* <AddCredit
  show={showAdd}
  setShow={setShowAdd}
/> */}
      <div className="text-center flex flex-col gap-[20px] mb-[8px]">
        <div className="flex justify-center">
          <div className="w-[60px] h-[60px] bg-[#3A2434] flex justify-center items-center rounded-[8px]">
            <CloseIcon />
          </div>
        </div>
        <h5 className="text-[16px] text-white">{`Something Went Wrong`}</h5>
        <p className="text-[#474761]">
          Oops! It looks something went wrong. Please choose another refund method or try again later.
        </p>
      </div>
    </SimpleModal>
  );
}
