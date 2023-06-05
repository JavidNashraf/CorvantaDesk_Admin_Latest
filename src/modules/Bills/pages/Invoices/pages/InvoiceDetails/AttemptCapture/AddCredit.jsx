import { Input, Radio } from 'antd';
import { Modal, SimpleModal } from 'components';
import { PaymentCaptureFailed } from 'modules/Bills/pages/Clients/pages/ClientDetails/sections/PaymentCaptureFailed.section';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAddCredit } from 'store';
import { InvoiceDetails } from '../..';
import { PaymentCaptureFail } from './PaymentFailed.section';
import { PaymentCapturePending } from './PaymentPending.section';
import { PaymentCaptureSuccess } from './PaymentSuccess.section';
import * as Yup from 'yup';
import { nanoid } from 'nanoid';
import { getBalanceCredit } from 'store';
import { Close as CloseIcon } from "icons";
import { updateInvoice } from 'store';

export const AddCredit = ({ show, setShow, id }) => {
    const state = useSelector((state) => state)
    const { loading, product } = useSelector((state) => state?.products);
    const { addCredit, balanceCredit } = useSelector((state) => state?.invoices)
    const [DataCredit, setDataCredit] = useState();
    const [showFailed, setShowFailed] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPending, setShowPending] = useState(false);
    const validationSchema1 = Yup.object().shape({
        amount: Yup.number().required('Amount is required'),
    });
    const { invoice } = useSelector((state) => state?.invoices)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getBalanceCredit(invoice?.id));
    }, []);

    const onTransaction = () => {
        if (addCredit?.transactionStatus === 0) {
            setShowPending(true);
        }
        else if (addCredit?.transactionStatus === 1) {
            setShowSuccess(true);
        }
        else if (addCredit?.transactionStatus === 2) {
            setShowFailed(true);
        }
    }

    let initialValues1 = {
        Id: nanoid(),
        amount: '',
        tenant: "",
        description: '',
        ClientId: '',
        status: ''
    };
    const handleClose = () => {
        setShow(false);
    };

    const initialValues = {
        status: ""
    }
    const finalObject = {
        status : 2
    }
    const paidAssign = () => {
        setShowSuccess(true)
        dispatch(updateInvoice(invoice?.orderId, finalObject));
    }

    return (
        invoice?.status === 2 ||  invoice?.totalPrice <= balanceCredit?
            <SimpleModal
                show={show}
                setShow={setShow}
                onHide={handleClose}
                heading="Credit Not Available"
                cancelButtonText="Go Back"
            >
                <div className="text-center flex flex-col gap-[20px] mb-[8px]">
                    <div className="flex justify-center">
                        <div className="w-[60px] h-[60px] bg-[#3A2434] flex justify-center items-center rounded-[8px]">
                            <CloseIcon />
                        </div>
                    </div>
                    <h5 className="text-[16px] text-white">{`Credit Is Unavailable`}</h5>
                    <p className="text-[#474761]">
                        Invoice Already Paid
                    </p>
                </div>
            </SimpleModal>
            :

            <div className="mt-4">
                < InvoiceDetails />
                <Modal
                    heading="Add Credit"
                    cancelButtonText="Go Back"
                    btnSuccess={true}
                    btnDanger={false}
                    initialValues={initialValues1}
                    customBody={
                        <div className="mb-[32px] text-center">
                            <Radio.Group name="radiogroup" className=" text-white" defaultValue={1} buttonStyle="solid" style={{ width: "100%", color: "white", }}>
                                <div className="bg-[#3A2434] w-[80px] h-[80px] ml-[auto] mr-[auto] rounded-[8px] mt-[32px] flex items-center relative cursor-pointer">
                                    <div className=" h-[54px] w-[54px] flex items-center justify-center ml-[auto] mr-[auto]">
                                        <img src="/icon/vuesax-bulk-card-tick-add.svg" alt="edit-icon" />
                                    </div>
                                </div>
                                <div className='text-[20px] p-[20px] pb-[10px]'>
                                    Client - Paul Elliot
                                </div>
                                <div className='p-[20px] pt-[5px] pb-[10px] text-[#0BB783] text-[20px] w-[300px] ml-[auto] mr-[auto]'>
                                    Balance ${balanceCredit}
                                </div>
                                <div>
                                    <Input
                                        name="amount"
                                        className="bg-[#151521] text-white w-full h-12 px-3 text-gray-300 rounded-md placeholder:text-gray-400 placeholder:text-sm placeholder:font-light mb-0"
                                        placeholder=" $0.0"
                                        type="textarea"
                                        onChange={(e) => {
                                            initialValues1[e.target.name] = e.target.value
                                        }}
                                    />
                                </div>
                                <div className="text-start text-[14px] p-3 border-2 border-[#323248] mt-3 border-dashed rounded  flex flex-col gap-2">

                                    <Radio style={{ color: "white", }} value={1}>Credit Balance - ${balanceCredit}</Radio>
                                </div>
                                <div className="text-start text-[14px] p-3 border-2 border-[#323248] mt-3 border-dashed rounded  flex flex-col gap-2">

                                    <Radio style={{ color: "white", }} value={2}>Card Ending In 8880</Radio>
                                </div>
                                <div className="text-start text-[14px] p-3 border-2 border-[#323248] mt-3 border-dashed rounded  flex flex-col gap-2">

                                    <Radio style={{ color: "white", }} value={3}>PayPal</Radio>
                                </div>
                            </Radio.Group>
                        </div>
                    }
                    submitText="Add Credit"
                    loading={loading}
                    handleSubmit={async (values) => {
                        const newValues = {
                            amount: values?.amount,
                            Id: '00000000-0000-0000-0000-000000000000',
                            ClientId: invoice?.id,
                            tenant: "Admin",
                            description: "Positive Credit"
                        };
                        invoice?.totalPrice <= (values?.amount + balanceCredit)  && paidAssign()                           
                        await dispatch(getAddCredit(newValues));
                        await dispatch(getBalanceCredit(invoice?.id));
                        onTransaction();
                        setShow(false);
                    }}
                    show={show}
                    setShow={setShow}
                />
                <PaymentCaptureFail
                    show={showFailed}
                    backtoOpen={() => {
                        setShow(true);
                    }}
                    setShow={setShowFailed}
                    type="order"
                />
                <PaymentCapturePending
                    show={showPending}
                    setShow={setShowPending}
                    type="order"
                />
                <PaymentCaptureSuccess
                    show={showSuccess}
                    setShow={setShowSuccess}
                    type="order"
                />
            </div>
    );
};