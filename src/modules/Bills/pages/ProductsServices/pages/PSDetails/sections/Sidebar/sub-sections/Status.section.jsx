import { Input } from "components";
import { SearchableField } from "modules/Bills/pages/Orders/pages/AddEditOrder/sections/Sidebar/sub-sections";
import { useSelector } from "react-redux";

export const Status = ({ defaulValue }) => {
  const { clients } = useSelector((state) => state?.users);

  return (
    <div className="p-[32px] bg-[#000000] rounded-[8px] mt-[20px]">
      {/* <div className="flex justify-between items-center">
        <h6 className="text-white font-medium text-[16px]">Status</h6>
        <div className="w-[11px] h-[11px] rounded-[50%] bg-[#0BB783]" />
      </div>
      <p className="text-[#474761] text-[14x] mt-[8px] mb-[32px]">
        Set The Product Status
      </p> */}
      <SearchableField
        name="assignedToClientId"
        placeholder="Search client"
        label="Client"
        data={clients}
        defaultValue={defaulValue}
        // disabled
      />
      <Input
        name="dedicatedIP"
        placeholder="154.227.25.101"
        type="text"
        label="Customer IP"
        // disabled={true}
        className="mb-[20px]"
        value="154.227.25.101"
      />
      <Input
        name="status"
        // disabled={true}
        placeholder="Status"
        type="select"
        label="Status"
        className="mb-[20px]"
        options={[
          { label: "Draft", value: 0 },
          { label: "Pending", value: 1 },
          { label: "Paid", value: 2 },
          { label: "Processing", value: 3 },
          { label: "Accepted", value: 4 },
          { label: "Completed", value: 5 },
          { label: "Canceled", value: 6 },
        ]}
      />
      <Input
        name="paymentType"
        // disabled={true}
        placeholder="Payment Type"
        type="select"
        label="Payment Type"
        className="mb-[20px]"
        options={[
          { label: "One Time", value: 0 },
          { label: "Recurring", value: 1 },
        ]}
      />
      <Input
        name="billingCycle"
        // disabled={true}
        placeholder="Billing Cycle"
        type="select"
        label="Billing Cycle"
        options={[
          { label: "Hourly", value: 0 },
          { label: "Monthly", value: 1 },
          { label: "Quarterly", value: 2 },
          { label: "SemiAnnually", value: 3 },
          { label: "Annually", value: 4 },
          { label: "Biennially", value: 5 },
          { label: "Triennially", value: 6 },
        ]}
      />
    </div>
  );
};
