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
import "./styles.scss";
import * as Yup from "yup";


export const GS = ({ isView, ...props }) => {

  const { products } = useSelector((state) => state?.products);
  const [addProductList, setAddProductList] = useState([])
  const dispatch = useDispatch()
  const [subTotal, setSubTotal] = useState(0);
  const [vatTotal, setVatTotal] = useState(0);

  useEffect(() => {
    dispatch(getClients());
    dispatch(getProducts());
  }, []);

  const {
    isLoading,
  } = props;

  const validationSchema = Yup.object().shape({
    clientName: Yup.string().required("Product Name is required"),
  });

  return (
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
        name="name"
        placeholder="Product Name"
        label="Product Name"
        className="mb-[20px]"
        disabled={isView}
        required={true}
      />
      <Input
        name="description"
        placeholder="Product Description"
        label="Product Description"
        type="textarea"
        rows={4}
        disabled={isView}
        required={true}
      />
      <Formik
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const finalObject = {
            products: [
              ...addProductList
            ],
            adminAssigned: "",
            orderForClientId: "",
            customerIP: "",
            orderStatus: Number(values?.status),
            notes: values?.message,
            clientName: values?.fullName,
            billingAddress: values?.brandAddress,
            billingEmail: values?.billingEmail,
            phoneNumber: values?.phoneNumber,
            tenant: "Admin"
          };
          dispatch(createOrder(finalObject))
        }}
        enableReinitialize
      >

      </Formik>
    </div>
  );
};
