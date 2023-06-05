import { AddOrderNote, GS, LineItems, Note } from "./sub-sections";
// import { AdvancedSettings } from "../AdvancedSettings";
import { Button } from "components";
import { useFormikContext } from "formik";

export const GeneralSettings = ({ isView, index }) => {
  const { values, setFieldValue } = useFormikContext();
  let sum = 0;
  Array.isArray(values?.products) && values?.products?.length > 0 &&
    values?.products.map((data) => {
      data?.productLineItems?.forEach((item) => {
        sum += item?.price;
      });
    }
    )
  return (
    <div>
      {/* <GS /> */}
      {/* <LineItems /> */}
      <div className="mt-[32px] rounded-[8px] border-[#3699FF] border-[1px] border-dashed bg-[#212E48] flex items-center justify-between p-[32px]">
          <div className="text-white text-[20px] font-medium">
            Total - ${sum.toFixed(2)}
          </div>
          <div className="text-[#3699FF] text-[14px]">
            {values?.products?.[index]?.paymentType === 0 ? "One Time Payment" : "Payment"}
          </div>
        </div>
      <Note />
      <AddOrderNote />
      {/* <AdvancedSettings /> */}
      <div className="text-right ">
        {!isView && (
          <Button type="ghost" className="h-[52px] mt-[32px]" htmlType="submit">
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
};