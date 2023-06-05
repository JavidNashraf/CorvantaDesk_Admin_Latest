import { List } from 'components';
import { Button } from 'antd'
import { useEffect, useState, useCallback, useMemo } from 'react';
import moment from 'moment';
import { AddCredit } from './AddCredit.section'
import { RemoveCredit } from './RemoveCredit.section'
import { PaymentCaptureSuccess } from './PaymentCaptureSuccess.section';
import { PaymentCaptureFailed } from './PaymentCaptureFailed.section';
import { PaymentCapturePending } from './PaymentCapturePending.section';
import { useDispatch, useSelector } from 'react-redux';
import {
  increaseCredit,
  decreaseCredit,
  getCredits,
  getUserSettingsById,
} from "store";
import { CREDIT_DECREASE, CREDIT_INCREASE } from 'lib/types';
import { getProductsByClientID } from 'store';

export const AccountStatement = () => {
  const dispatch = useDispatch()
  // Updated state
  const { settings } = useSelector((state) => state);
  const { userSettings } = useSelector((state) => state.users);
  const { credits } = useSelector((state) => state?.credits)
  const users = useSelector((state) => state.users);
  const { products } = useSelector((state) => state?.products);
  const [showAddCredit, setShowAddCredit] = useState(false)
  const [showRemoveCredit, setShowRemoveCredit] = useState(false)
  const [showPaymentSucceed, setShowPaymentSucceed] = useState(false)
  const [showPaymentFailed, setShowPaymentFailed] = useState(false)
  const [showPaymentPending, setShowPaymentPending] = useState(false)

  const isEnableAddOrRemoveCredit = useMemo(() => {
    if (!userSettings?.isActiveOrPendingProduct) {
      const maxCreditAmount = !!userSettings ?
        userSettings?.maxCreditAmount :
        settings?.billingSettings?.maxCreditAmount;

      return users?.user?.creditBalance < maxCreditAmount;
    }  

    return userSettings?.isActiveOrPendingProduct && products.length > 0;
  }, [settings, userSettings, users, products]);

  const onAddCredit = useCallback((amount, description, cb) => {
    dispatch(increaseCredit({
      data: {
        amount,
        description,
        tenant: users?.user.tenant,
        clientId: users?.user.id,
      },
      onSuccess: () => {
        dispatch(getCredits(users?.user.id));
        setShowAddCredit(false);
        setShowPaymentSucceed(true);
        cb && cb();
      },
      onFail: () => {
        setShowPaymentFailed(true);
      }
    }));
  }, [getCredits, increaseCredit])

  const onRemoveCredit = useCallback((amount, description, cb) => {
    dispatch(decreaseCredit({
      data: {
        decreaseAmount: amount,
        description,
        tenant: users?.user.tenant,
        clientId: users?.user.id,
      },
      onSuccess: () => {
        dispatch(getCredits(users?.user.id));
        setShowRemoveCredit(false);
        setShowPaymentSucceed(true);
        cb && cb();
      },
      onFail: () => {
        setShowPaymentFailed(true);
      }
    }));
  }, [getCredits, decreaseCredit])

  useEffect(() => {
    (async () => {
      await dispatch(getCredits(users?.user.id));
      await dispatch(getUserSettingsById(users?.user.id));
      await dispatch(getProductsByClientID({ clientId: users?.user.id }));
    })();
  }, [users?.user])

  return (
    <div className="mt-[20px] p-[32px] bg-[#000000] rounded-[8px]">
      {/* Header Section */}
      <div className="flex items-center mb-[32px] gap-[20px]">
        <h6 className="text-white text-[16px] flex-grow">Account Statement</h6>

        <div className='flex gap-[10px] justify-between'>
          <Button
            type="primary"
            className='rounded custom-btn-primary h-[50px] px-[32px]'
            onClick={() => setShowAddCredit(true)}
            disabled={!isEnableAddOrRemoveCredit}
          >
            Add Credit
          </Button>
          <Button
            type="danger"
            className='rounded custom-btn-danger h-[50px] px-[32px]'
            onClick={() => setShowRemoveCredit(true)}
            disabled={!isEnableAddOrRemoveCredit}
          >
            Remove Credit
          </Button>
        </div>
      </div>
      {/* List Section */}
      <List
        data={credits}
        header={
          <div className="grid grid-cols-[3fr_6fr_1fr] gap-[30px] items-center w-full">
            <div className="col-[1/2]">DUE DATE</div>
            <div className="col-[2/3]">DESCRIPTION</div>
            <div className="col-[3/3]">AMOUNT</div>
          </div>
        }
        renderFn={(item) => {
          return (
            <div className="grid grid-cols-[3fr_5fr_2fr] gap-[30px] items-center w-full">
              <div className="text-white text-[14px] col-[1/2]">
                {moment(item?.dueDate).format(settings?.dateFormat)}
              </div>
              <div className="text-white text-[14px] col-[2/3]">
                {item?.description}
              </div>
              <div
                className={`${
                  item?.creditTransactionType === CREDIT_INCREASE ? 'text-[#0BB783]' : 'text-[#F64E60]'
                } text-[14px] col-[3/3] text-right text-nowrap`}
              >
                {item.creditTransactionType === CREDIT_DECREASE ? "-" : ""} ${item?.amount.toFixed(2)}
              </div>
            </div>
          );
        }}
      />

      <AddCredit
        show={showAddCredit}
        setShow={setShowAddCredit}
        handleSubmit={onAddCredit}
      />
      <RemoveCredit
        show={showRemoveCredit}
        setShow={setShowRemoveCredit}
        handleSubmit={onRemoveCredit}
      />
      <PaymentCaptureSuccess
        show={showPaymentSucceed}
        setShow={setShowPaymentSucceed}
      />
      <PaymentCaptureFailed
        show={showPaymentFailed}
        setShow={setShowPaymentFailed}
      />
      <PaymentCapturePending
        show={showPaymentPending}
        setShow={setShowPaymentPending}
      />
    </div>
  );
};
