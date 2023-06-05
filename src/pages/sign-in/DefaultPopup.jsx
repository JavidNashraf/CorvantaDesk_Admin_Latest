import React, { useState } from 'react';
import { SimpleModal } from "components";
import { useDispatch, useSelector } from "react-redux";
import { onLoginDispatch } from "store/Slices/authSlice";
import { Checkbox } from "antd";
import { activateUserForOrder } from "store";
import { setReceiveOrdersLoading } from "store/Slices/dashboard";
import { toast } from "react-toastify";
import { getError } from "lib";

export function DefaultPopup({
    show,
    setShow,
}) {
    const [checked, setChecked] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state?.auth);
    const handleClose = () => {
        setShow(false);
        dispatch(onLoginDispatch(false))
    };

    return (
        <SimpleModal
            show={show}
            setShow={setShow}
            onHide={handleClose}
            heading="Assigning Orders to Admin"
            cancelButtonText="Go Back"
            submitText="Receive orders"
            disabled={!checked}
            handleSubmit={async (values) => {
                try{
                    dispatch(setReceiveOrdersLoading(true))
                    await dispatch(activateUserForOrder(user?.id))
                    setShow(false)
                    dispatch(setReceiveOrdersLoading(false))
                } catch (e) {
                    toast.error(getError(e));
                    dispatch(setReceiveOrdersLoading(false));
                }
            }}
        >
            <div className="text-center flex flex-col gap-[20px] mb-[8px]">
                <div className="flex justify-center">
                </div>
                <h5 className="text-[16px] text-white">{`Please check the box below to start receiving orders`}</h5>
                <p className="text-[#474761]">
                    <Checkbox 
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                    >
                    </Checkbox>
                </p>
            </div>
        </SimpleModal>
    );
}
