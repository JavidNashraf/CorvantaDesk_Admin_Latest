import { DatePicker } from "components";

const fields = [
  { label: "Next Due Date", name: "nextDueDate" },
  { label: "Termination Date", name: "terminationDate" },
  { label: "Override Suspension Date", name: "overrideSuspensionDate" },
  { label: "Override Termination Date", name: "overrideTerminationDate" },
];

const DateTitle = ({ title, name }) => {
  return (
    <div>
      <label className="mb-[16px] text-white text-[14px] font-normal">
        {title}
      </label>
      <DatePicker name={name} hideTime format="MM/DD/YYYY" />
    </div>
  );
};

export const AdvancedSettings = () => {
  return (
    <div className="bg-[#000000] p-[32px] mt-[20px] rounded-[8px]">
      <h6 className="text-white text-[16px] font-medium mb-[32px]">
        Advanced Settings
      </h6>
      <div className="grid grid-cols-2 gap-[32px]">
        <div className="col-span-full">
          <DateTitle name="registrationDate" title="Registration Date" />
        </div>
        {fields?.map((field) => {
          return (
            <DateTitle key={field.name} name={field.name} title={field.label} />
          );
        })}
      </div>
    </div>
  );
};
