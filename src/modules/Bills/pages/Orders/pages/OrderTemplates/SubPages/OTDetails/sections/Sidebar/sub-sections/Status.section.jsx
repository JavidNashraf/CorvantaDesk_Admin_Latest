import { Input } from "components";
// import { useSelector } from 'react-redux';

export const Status = () => {
  // const { clients } = useSelector((state) => state?.users);

  return (
    <div className="p-[32px] bg-[#000000] rounded-[8px] mt-[20px]">
      <div className="flex justify-between items-center">
        <h6 className="text-white font-medium text-[16px] mb-[32px]">
          Payments
        </h6>
        {/* <div className="w-[11px] h-[11px] rounded-[50%] bg-[#0BB783]" /> */}
      </div>
      {/* <p className="text-[#474761] text-[14x] mt-[8px] mb-[32px]">
        Set The Product Status
      </p> */}
      {/* <Input
        name="assignedToClientId"
        placeholder="Client"
        type="select"
        label="Assign To"
        className="mb-[20px]"
        options={clients?.map((client) => ({
          label: client?.fullName ? client?.fullName : client?.email,
          value: client?.id,
        }))}
      /> */}
      {/* <Input
        name="status"
        placeholder="Status"
        type="select"
        label="Status"
        className="mb-[20px]"
        options={[
          { label: "Pending", value: 0 },
          { label: "Active", value: 1 },
          { label: "Cancelled", value: 2 },
          { label: "Suspended", value: 3 },
        ]}
      /> */}
      <Input
        name="paymentType"
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
