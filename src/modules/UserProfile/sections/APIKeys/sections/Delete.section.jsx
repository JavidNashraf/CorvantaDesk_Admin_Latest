import { Modal } from "components";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteOrderByID } from "store";
import { deleteAPIKey } from "store";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  id: Yup.string().required("ID is required"),
});

export const Delete = ({ show, setShow, id, type, record }) => {
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Modal
      heading={
        type === "order"
          ? "Delete Order"
          : type === "Cancel"
          ? "Confirm Cancel"
          : "Delete API Key"
      }
      customBody={
        <div className="mb-[32px]">
          {type === "Cancel"
            ? "Are you sure you want to cancel the chnages made to this template?"
            : `Are you sure you wish to delete this
          ${
            type === "order" ? "Order" : "API Key"
          }? This action is permanent and
          can not be undone.`}
        </div>
      }
      initialValues={{ id: record?.id }}
      validationSchema={type === "Cancel" ? null : validationSchema}
      submitText={`${
        type === "order"
          ? "Delete Order"
          : type === "Cancel"
          ? "Cancel & Close"
          : "Delete API Key"
      }`}
      loading={loading}
      handleSubmit={async (values) => {
        if (type === "Cancel") {
          await navigate(
            "/admin/dashboard/billing/orders/order-templates/list"
          );
          setShow(false);
          return;
        }
        setIsLoading(true);
        await dispatch(
          type === "order"
            ? deleteOrderByID(values?.id)
            : deleteAPIKey(values?.id)
        );
        setIsLoading(false);
        setShow(false);
      }}
      show={show}
      setShow={setShow}
    />
  );
};
