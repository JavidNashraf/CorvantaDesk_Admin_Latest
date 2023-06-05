import { useState, useCallback } from 'react';
import { Radio } from "antd";
import { Close as CloseIcon } from "icons";
import { SimpleModal } from "components";

export function RemoveCredit({
  show,
  setShow,
  handleSubmit,
  handleCancel,
}) {
  const [currentType, setCurrentType] = useState(0);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  
  const onSubmit = useCallback(() => {
    handleSubmit(amount, description, () => {
      setAmount(0);
      setDescription(''); 
    });
  });

  const handleClose = useCallback(() => {
    setAmount(0);
    setDescription('');
    setShow(false);
  }, [amount]);

  return (
    <SimpleModal
      show={show}
      setShow={setShow}
      onHide={handleClose}
      heading="Remove Credit"
      submitText="Remove Credit"
      submitButtonType="danger"
      cancelButtonText="Go Back"
      handleSubmit={onSubmit}
      handleCancel={handleCancel}
    >
      <div className="text-center flex flex-col gap-[20px] mb-[8px]">
        <div className="flex justify-center">
          <div className="w-[60px] h-[60px] bg-[#3A2434] flex justify-center items-center rounded-[8px]">
            <CloseIcon />
          </div>
        </div>
        <h2 className="text-[20px] text-white ">Client - {`Paul Elliott`}</h2>
        <h5 className="text-[16px] text-[#F64E60]">Balance ${amount.toFixed(2)}</h5>
      </div>
      <div>
        <input
          type="number"
          name="amount"
          className="bg-[#151521] w-full h-12 px-3 mb-3 text-gray-300 rounded-md placeholder:text-gray-400 placeholder:text-sm placeholder:font-light"
          id="amount"
          placeholder="Amount"
          value={amount}
          min={0}
          onChange={(e) => {
            // console.log(e)
            setAmount(parseInt(e.target.value))
          }}
        />
      </div>
      <div>
        <input
          type="text"
          name="description"
          className="bg-[#151521] w-full h-12 px-3 mb-3 text-gray-300 rounded-md placeholder:text-gray-400 placeholder:text-sm placeholder:font-light"
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-[10px]">
        <div className="flex justify-between border-dashed border-[#323248] border-1 rounded-[8px] p-[16px]">
          <span>Credit Balance - $200.00</span>
          <Radio className="custom-radio" name="paymentType" id="paymentType1" checked={currentType === 0} onChange={() => setCurrentType(0)}/>
        </div>
        <div className="flex justify-between border-dashed border-1 roundeed border-[#323248] rounded-[8px] p-[16px]">
          <span>Card Ending in 8880</span>
          <Radio className="custom-radio" name="paymentType" id="paymentType2" checked={currentType === 1} onChange={() => setCurrentType(1)} />
        </div>
        <div className="flex justify-between border-dashed border-1 roundeed border-[#323248] rounded-[8px] p-[16px]">
          <span>PayPal</span>
          <Radio className="custom-radio" name="paymentType" id="paymentType3" checked={currentType === 2} onChange={() => setCurrentType(2)} />
        </div>
      </div>
    </SimpleModal>
  );
}
