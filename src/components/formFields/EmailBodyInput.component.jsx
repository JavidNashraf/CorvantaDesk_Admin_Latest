import { Field } from 'formik';
import { MultiSelect, Input, DatePicker, ImageUpload } from '.';

const getInputEl = ({ options, name, placeholder, type, darkBg, onChange }) => {
  switch (type) {
    case 'multiselect':
      return (
        <div
          className={`custom-multiselect-email-body-input ${
            darkBg ? 'darkBg' : ''
          } w-full`}
        >
          <MultiSelect
            name={name}
            options={options}
            mode="multiple"
            placeholder={placeholder}
          />
        </div>
      );
    case 'text':
      return (
        <Field
          name={name}
          placeholder={placeholder}
          className={`h-[52px] w-[60%] pl-[12px] text-[#FFFFFF] placeholder:text-[#FFFFFF] focus-visible:outline-none ${
            darkBg ? 'bg-[#000000]' : 'bg-[transparent]'
          }`}
        />
      );
    case 'number':
      return (
        <Field
          name={name}
          type="number"
          placeholder={placeholder}
          className={`h-[52px] w-[60%] pl-[12px] text-[#FFFFFF] placeholder:text-[#FFFFFF] focus-visible:outline-none ${
            darkBg ? 'bg-[#000000]' : 'bg-[transparent]'
          }`}
        />
      );
    case 'readOnly':
      return (
        <input
          placeholder={placeholder}
          className="h-[52px] w-[60%] text-[#FFFFFF] pl-[12px] placeholder:text-[#FFFFFF] bg-[transparent] focus-visible:outline-none"
          readOnly
        />
      );
    case 'select':
      return (
        <div className="custom-select-email-body-input w-full">
          <Input
            type={type}
            placeholder={placeholder}
            name={name}
            options={options}
            customOnChange={onChange}
          />
        </div>
      );
    case 'image':
      return (
        <div className="custom-select-kba w-full">
          <ImageUpload name={name} />
        </div>
      );
    case 'date':
      return <DatePicker name={name} />;
    default:
      break;
  }
};

export const EmailBodyInput = ({
  touched,
  errors,
  name,
  placeholder,
  label,
  options,
  type,
  darkBg,
  onChange,
}) => {
  return (
    <div
      className={`grid grid-cols-[1fr_4fr] items-center ${
        darkBg
          ? 'bg-[#000000] border-b-[1px] border-b-[#323248] border-dashed'
          : 'bg-[#000000]'
      }`}
    >
      <h6 className="pl-[32px] w-[20%] text-white whitespace-nowrap">
        {label}
      </h6>
      {getInputEl({ options, name, placeholder, type, darkBg, onChange })}
      {touched[name] && errors[name] && (
        <div className="error whitespace-nowrap mr-[12px] mt-[0px] w-[20%]">
          {errors[name]}
        </div>
      )}
    </div>
  );
};

export {getInputEl};