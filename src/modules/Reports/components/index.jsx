import { Checkbox } from 'antd';

export const FilterCheck = ({ label, setFilters, name, checked }) => {
  return (
    <Checkbox
      checked={checked}
      className="text-white text-[14px]"
      onChange={(e) => {
        setFilters((filters) => ({ ...filters, [name]: e.target.checked }));
      }}
    >
      {label}
    </Checkbox>
  );
};

export const FilterIndicator = ({ title, bg }) => {
  return (
    <div className="flex items-center gap-[12px]">
      <div className={`${bg} rounded-[10px] w-[30px] h-[20px]`} />
      <div className="text-white text-[14px]">{title}</div>
    </div>
  );
};
