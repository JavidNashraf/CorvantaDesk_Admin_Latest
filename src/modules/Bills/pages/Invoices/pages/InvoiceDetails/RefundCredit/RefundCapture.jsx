import { Input,Radio } from 'antd';
import { Modal, SimpleModal } from 'components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InvoiceDetails } from '../..';
import { getRemoveCredit } from 'store';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { getBalanceCredit } from 'store';
import { RefundCaptureFail } from './RefundFailed.section';
import { RefundCapturePending } from './RefundPending.section';
import { RefundCaptureSuccess } from './RefundSuccess.section';
import { Close as CloseIcon } from "icons";
import { toast } from 'react-toastify';

export const RefundCredit = ({ show, setShow, id }) => {
    const state = useSelector((state) => state)
    const { loading, product } = useSelector((state) => state?.products);
    const [showFailed, setShowFailed] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPending, setShowPending] = useState(false);
    const { invoice,removeCredit,balanceCredit } = useSelector((state) => state?.invoices)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBalanceCredit(invoice?.id));
      }, []);

const onTransaction = () => {
    if (removeCredit?.transactionStatus === 0) {
        setShowPending(true);
    }
    else if (removeCredit?.transactionStatus === 1) {
        setShowSuccess(true);
    }
    else if(removeCredit?.transactionStatus === 2) {
        setShowFailed(true);
    }
}
  
    let initialValues1 = {
        tenant: '',
        DecreaseAmount: '',
        Description: "",
        ClientId: '',
    };

 const handleClose = () => {
    setShow(false);
  };
    return (
        invoice?.status != 2 ?  
        <SimpleModal
        show={show}
        setShow={setShow}
        onHide={handleClose}
        heading="Refund Not Available"
        cancelButtonText="Go Back"
      >
        <div className="text-center flex flex-col gap-[20px] mb-[8px]">
          <div className="flex justify-center">
            <div className="w-[60px] h-[60px] bg-[#3A2434] flex justify-center items-center rounded-[8px]">
              <CloseIcon />
            </div>
          </div>
          <h5 className="text-[16px] text-white">{`Refund Is Unavailable`}</h5>
          <p className="text-[#474761]">
            Invoice is yet to be paid.
          </p>
        </div>
      </SimpleModal>
         :
         
        <div className="mt-4">
        < InvoiceDetails />
        <Modal
            heading="Remove Credit"
            cancelButtonText="Go Back"
            btnDanger={true}
            btnSuccess={false}
            initialValues={initialValues1}
            customBody={
                <div className="mb-[32px] text-center">
                    <Radio.Group name="radiogroup" className=" text-white" defaultValue={1} buttonStyle="solid" style={{ width: "100%", color: "white", }}>
                        <div className="bg-[#3A2434] w-[80px] h-[80px] ml-[auto] mr-[auto] rounded-[8px] mt-[32px] flex items-center relative cursor-pointer">
                            <div className="h-[54px] w-[54px] flex items-center justify-center ml-[auto] mr-[auto]">
                                <img src="/icon/vuesax-bulk-card-tick.svg" alt="edit-icon" />
                            </div>
                        </div>
                        <div className='text-[20px] p-[20px] pb-[10px]'>
                            Client - Paul Elliot
                        </div>
                        <div className='p-[20px] pt-[5px] pb-[10px] text-[#F64E60] text-[20px] w-[300px] ml-[auto] mr-[auto]'>
                            Balance ${balanceCredit}
                        </div>
                        <div>
                            <Input
                                name="DecreaseAmount"
                                className="bg-[#151521] text-white w-full h-12 px-3 text-gray-300 rounded-md placeholder:text-gray-400 placeholder:text-sm placeholder:font-light mb-0"
                                placeholder=" $0.0"
                                type="textarea"
                                onChange={(e) => {
                                    initialValues1[e.target.name] = e.target.value
                                }}
                            />
                        </div>
                        <div className="text-start text-[14px] p-3 border-2 border-[#323248] mt-3 border-dashed rounded  flex flex-col gap-2">

                            <Radio style={{ color: "white", }} value={1}>Credit Balance -${balanceCredit}</Radio>
                        </div>
                        <div className="text-start text-[14px] p-3 border-2 border-[#323248] mt-3 border-dashed rounded  flex flex-col gap-2">

                            <Radio style={{ color: "white", }} value={2}>Card Ending In 8880</Radio>
                        </div>
                        <div className="text-start text-[14px] p-3 border-2 border-[#323248] mt-3 border-dashed rounded  flex flex-col gap-2">

                            <Radio style={{ marginRight:"12px", color: "white", }} value={3}>PayPal</Radio>
                        </div>
                    </Radio.Group>
                </div>
            }
            submitText="Remove Credit"
            loading={loading}
            handleSubmit={(values) => {
                const newValues = {
                    tenant: "Admin",
                    DecreaseAmount:initialValues1.DecreaseAmount,
                    Description: "decrease Credit",
                    ClientId: invoice?.id,
                };
                dispatch(getRemoveCredit(newValues));
                dispatch(getBalanceCredit(invoice?.id))
                onTransaction();
                setShow(false);
            }}
            show={show}
            setShow={setShow}
        />
         <RefundCaptureFail
                show={showFailed}
                backtoOpen={() => {
                    setShow(true);
                }}
                setShow={setShowFailed}
                type="order"
            />
            <RefundCapturePending
                show={showPending}
                setShow={setShowPending}
                type="order"
            />
            <RefundCaptureSuccess
                show={showSuccess}
                setShow={setShowSuccess}
                type="order"
            />
       </div>
    );
};

