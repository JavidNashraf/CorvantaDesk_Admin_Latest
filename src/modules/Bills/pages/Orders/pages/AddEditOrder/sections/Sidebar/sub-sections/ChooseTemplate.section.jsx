import { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { Input } from "components";
import { useSelector } from "react-redux";

export const ChooseTemplate = ({ selected, setSelected }) => {
  const { orderTemplates } = useSelector((state) => state?.orders);
  const { products, product } = useSelector((state) => state?.products)
  const { setFieldValue } = useFormikContext();
  const nail = products?.[0]?.thumbnail
  const orderTemplatesHandler = (selected) => {
    if (selected) {
      const template = orderTemplates?.find(
        (template) => template?.id === selected
      );
      const index = 0
      setFieldValue(`products.${index}.preview`, template?.base64Image);
      setFieldValue(`products.${index}.name`, template?.productName);
      setFieldValue(`products.${index}.description`, template?.productDescription);
      setFieldValue(`products.${index}.status`, template?.status);
      setFieldValue(
        `products.${index}.paymentType`,
        template?.paymentType ? template?.paymentType : 0
      );
      setFieldValue(`products.${index}.billingCycle`, template?.billingCycle);
      setFieldValue(`products.${index}.productCategories`, template?.orderTemplateCategories);
      setFieldValue(`products.${index}.productDepartments`, template?.orderTemplateDepartments);
      setFieldValue(`products.${index}.productLineItems`, template?.orderTemplateLineItems);
    }
  };

  return (
    <div className="p-[32px] bg-[#000000] rounded-[8px]">
      <div className="flex justify-between items-center">
        <h6 className="text-white font-medium text-[16px]">Order Template</h6>
      </div>
      <p className="text-[#474761] text-[14x] mt-[8px] mb-[32px]">
        Select Order Template
      </p>
      <Input
        name="orderTemplate"
        placeholder="Choose Template"
        type="select"
        options={orderTemplates?.map((template) => ({
          label: template?.name,
          value: template?.id,
        }))}
        customOnChange={(e) => {
          setSelected(e?.target?.value);
          orderTemplatesHandler(e?.target?.value)
        }}
        values={{ orderTemplate: selected }}
      />
    </div>
  );
};
