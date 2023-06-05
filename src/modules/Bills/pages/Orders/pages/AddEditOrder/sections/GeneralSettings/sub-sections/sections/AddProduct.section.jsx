import { Button, Input } from "components";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createInvoice } from "store";
import { createOrder } from "store";
import { getClients } from "store";
import { getProducts } from "store";
import { addNewOrder } from "store/Slices/ordersSlice";
import { LineItems } from "..";
import "./styles.scss";

export const AddProduct = ({ index, isView, ...props }) => {

  const { products } = useSelector((state) => state?.products);
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(getClients());
    dispatch(getProducts());
  }, []);

  const {
    isLoading,
    productListLength,
    remove
  } = props;

  return (
    <div className="bg-[#000000] p-[32px] rounded-[8px] mt-[20px]">
      <button type="button"
        id={index}
        onClick={(e) => remove(index)} className={`bg-[#272738] h-[52px] p-[15px] border-none rounded-[8px] ${productListLength === 1 ? 'd-none' : ""}`}>
        {<img src="/img/vuesax-bulk-close-circle.svg" alt="close-icon" />}
      </button>
      <div className="bg-[#000000] p-[32px] rounded-[8px]">
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
        <Input
          name={`products.${index}.name`}
          placeholder="Product Name"
          label="Product Name"
          className="mb-[20px]"
          disabled={isView}
        />
        <Input
          name={`products.${index}.description`}
          placeholder="Product Description"
          label="Product Description"
          type="textarea"
          rows={4}
          disabled={isView}
        />
      </div>
      <div className="bg-[#000000] p-[32px] rounded-[8px] mt-[20px]">
        <LineItems index={index}/>
      </div>
    </div>
  )
}