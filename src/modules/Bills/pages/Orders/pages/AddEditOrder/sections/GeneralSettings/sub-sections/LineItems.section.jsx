import { useEffect, useState } from "react";
import { Button } from "components";
import { AddLineItem, DeleteItem, EditLineItem } from "./sections";
import { useFormikContext } from "formik";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const LineItem = ({ item, setDel, setId, setEdit, setEditData }) => {
  return (
    <div className="border-b-[1px] border-b-[#323248] border-dashed pb-[16px] pt-[16px] flex items-center justify-between">
      <div className="flex gap-[16px]">
        <div className="h-[52px] w-[3px] bg-[#8950FC] rounded-[8px]" />
        <div>
          <div className="text-white text-[16px] font-normal">
            {item?.lineItem}
          </div>
          <div className="text-[#474761] text-[14px] font-normal">
            ${item?.price}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[12px]">
        <div
          className="bg-[#323248] rounded-[8px] p-[8px] cursor-pointer"
          onClick={() => {
            setEditData(item);
            setEdit(true);
          }}
        >
          <img src="/img/edit.png" alt="edit" />
        </div>
        <div
          className="bg-[#323248] rounded-[8px] p-[8px] cursor-pointer"
          onClick={() => {
            setId(item?.id);
            setDel(true);
          }}
        >
          <img src="/img/delete.svg" alt="edit" className="w-[24px]" />
        </div>
      </div>
    </div>
  );
};

export const LineItems = ({ index, isView }) => {
  const [add, setAdd] = useState(false);
  const [del, setDel] = useState(false);
  const [id, setId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [total, setTotal] = useState(0);
  const { order } = useSelector((state) => state?.orders)
  const { values, setFieldValue } = useFormikContext();

  const addLineItem = (item) => {
    const currentLineItems = values?.products?.[index]?.productLineItems;
    const newLineItems = currentLineItems?.length
      ? [...currentLineItems, item]
      : [{ ...item }];
    setFieldValue(`products.${index}.productLineItems`, newLineItems);
  };
  const editLineItem = (id, editItem) => {
    const newItems = values?.products?.[index]?.productLineItems?.map((item) => {
      if (item.id === id) {
        return editItem;
      }
      return item;
    });
    setFieldValue(`products.${index}.productLineItems`, newItems);
  };

  const deleteLineItem = (id) => {
    const newItems = values?.products?.[index]?.productLineItems?.filter(
      (item) => item.id !== id && !item?.isDeleted
    );
    const lineItemDeleted = values?.products?.[index]?.productLineItems?.filter(
      (item) => item?.id === id || item?.isDeleted === true
    );
    const newItemsFinal = newItems?.map((item) => {
      return {
        ...item,
        isDeleted: false,
      };
    });
    const deletedItemsFinal = lineItemDeleted?.map((item) => {
      return {
        ...item,
        isDeleted: true,
      };
    });
    if (newItems?.length < 1) {
      toast.error("At least one item is required");
    } else {
      setFieldValue(`products.${index}.productLineItems`, [
        ...newItemsFinal,
        ...deletedItemsFinal,
      ]);
    }
  };

  useEffect(() => {
    let sum = 0;
    values?.products?.[index]?.productLineItems?.length > 0 &&
      values?.products?.[index]?.productLineItems?.forEach((item) => {
        if (!item?.isDeleted) {
          sum += item?.price;
        }
      });
    setTotal(sum);
  }, [values?.products?.[index]?.productLineItems]);

  return (
    <>
      <div className="bg-[#000000] p-[32px] rounded-[8px] mt-[20px]">
        <div className="flex items-center justify-between mb-[16px]">
          <h6 className="text-white text-[16px]">Line Items and Price</h6>
          {!isView && (
            <Button onClick={() => setAdd(true)}>Add New Item</Button>
          )}
        </div>
        {values?.products?.[index]?.productLineItems?.length > 0 &&
          values?.products?.[index]?.productLineItems?.map((item, idx) => {
            if (!item?.isDeleted) {
              return (
                <LineItem
                  key={`item-${idx}`}
                  item={item}
                  setDel={setDel}
                  setId={setId}
                  setEdit={setEdit}
                  setEditData={setEditData}
                />
              );
            } else {
              return null;
            }
          })}
        <div className="mt-[32px] rounded-[8px] border-[#3699FF] border-[1px] border-dashed bg-[#212E48] flex items-center justify-between p-[32px]">
          <div className="text-white text-[20px] font-medium">
            Total - ${total.toFixed(2)}
          </div>
          <div className="text-[#3699FF] text-[14px]">
            {values?.products?.[index]?.paymentType === 0 ? "One Time Payment" : "Payment"}
          </div>
        </div>
      </div>

      <AddLineItem show={add} setShow={setAdd} handleAdd={addLineItem} />
      <EditLineItem
        show={!isView && edit}
        setShow={setEdit}
        handleEdit={editLineItem}
        editValue={editData}
      />
      <DeleteItem
        show={!isView && del}
        setShow={setDel}
        handleDelete={deleteLineItem}
        id={id}
      />
    </>
  );
};
