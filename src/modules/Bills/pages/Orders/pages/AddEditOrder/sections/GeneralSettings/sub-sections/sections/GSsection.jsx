import { Button, Input } from "components";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getOrderDetails } from "store";
import { updateInvoice } from "store";
import { editOrder } from "store";

export const GSsection = ({ isView, ...props }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { order } = useSelector((state) => state?.orders);
  const { invoice } = useSelector((state) => state?.invoices);
  const { products } = useSelector((state) => state?.products);
  const initialValues2 = {
    notes: order?.notes,
    status: 6,
    adminAssignedId: [order?.adminAssignedString],
    notify: true,
  };
  const initialValues1 = {
    notes: order?.notes,
    status: 5,
    adminAssignedId: [order?.adminAssignedString],
    notify: true,
  };
  const initialValues = {
    productId: "",
    price: "",
  };
  const { isLoading } = props;

  return (
    <div className="bg-[#000000] p-[32px] rounded-[8px]">
      <div className="flex gap-[20px]">
        <Button
          className="h-[52px] mt-[32px] text-white "
          onClick={async () => {
            await dispatch(editOrder(id, initialValues1));
            await dispatch(getOrderDetails(id));
          }}
        >
          Accept & Notify Client
        </Button>

        <Button
          className="h-[52px] mt-[32px] text-white"
          onClick={async () => {
            await dispatch(editOrder(id, initialValues2));
            await dispatch(getOrderDetails(id));
          }}
        >
          Cancel & Notify Client
        </Button>
      </div>
      {props?.actionLink ? (
        <div className="flex gap-3 justify-end">
          {props?.actionLink.map((action) => (
            <Link
              to={action?.link}
              className="text-[#3699FF] text-[16px] hover:text-[#0BB783]"
            >
              {action?.text}
            </Link>
          ))}
        </div>
      ) : null}

      <Formik initialValues={initialValues} enableReinitialize>
        <Form>
          <div className="grid grid-cols-3 gap-[40px] mt-[40px] items-end"></div>
          <div className="mt-5">
            {order?.products &&
            Array.isArray(order.products) &&
            order.products.length > 0
              ? order?.products.map((product) => {
                  return (
                    <div className="w-full bg-[#323248] rounded-[8px] text-white grid grid-cols-2 gap-[20px] mb-[35px] p-[20px]">
                      <h6 className="text-[#fff] text-[14px] text-left">
                        <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#494B74] mr-[5px] mt-4"></span>
                        {product?.name}
                      </h6>
                      <div className="text-right">
                        <h4 className="text-[#fff] text-[14px]"></h4>
                      </div>
                      <div className="w-[204%] bg-[#000000] rounded-[8px] p-[20px]">
                        {order?.orderProductLineItems &&
                        Array.isArray(order?.orderProductLineItems) &&
                        order?.orderProductLineItems?.length > 0
                          ? order.orderProductLineItems.map(
                              (productLineItem) => {
                                return (
                                  <>
                                    <h6 className=" text-left text-[#92928F]">
                                      {productLineItem?.lineItem}
                                    </h6>
                                    <h4 className=" text-right text-[#92928F]">
                                      {" "}
                                      ${productLineItem?.price}
                                    </h4>
                                    <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                                  </>
                                );
                              }
                            )
                          : null}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="mt-5">
            <div className="flex gap-[20px]">
              <div className="text-left p-[3px] text-[24px] text-[#494B74] ">
                <span className="w-[10px] h-[10px] mr-[5px] mt-4">
                  Sub Total
                </span>
                <div className="text-[14px] text-[#FFFFFF] ml-[5px]">
                  ${order?.subTotal}
                </div>
              </div>
              <div className="text-left px-[10px] text-[24px] text-[#494B74] border-dashed border-x-[1px] border-[#323248]">
                <span className="w-[10px] h-[10px] mr-[5px] mt-4">Vat</span>
                <div className="text-[14px] text-[#FFFFFF] ml-[5px]">
                  ${order?.vat ? order?.vat : "0"}
                </div>
              </div>
              <div className="text-left px-[10px] text-[24px] text-[#494B74]">
                <span className="w-[10px] h-[10px] mr-[5px] mt-4">
                  Total Value
                </span>
                <div className="text-[14px] text-[#0BB783] ml-[5px]">
                  ${order?.totalPrice}
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
