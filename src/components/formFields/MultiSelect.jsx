import { Select } from "antd";
import { Field } from "formik";
import "./style.scss";

export const MultiSelect = ({
  name,
  label,
  disabled,
  placeholder,
  options,
  mode = "multiple",
  onChange,
  className,
  dropdownClassName,
  defult,
}) => {
  // let a = {
  //   label: defult ? defult[0]?.adminAssignedFullName : "",
  //   value: defult ? defult[0]?.adminAssigned : "",
  // };
  // console.log(a);

  let defultData = [];

  for (let i = 0; i < defult?.length; i++) {
    let a = {
      label: defult ? defult[i]?.adminAssignedFullName : "",
      value: defult ? defult[i]?.adminAssigned : "",
    };
    defultData.push(a);
  }

  return (
    <Field name={name}>
      {({ meta, form: { setFieldValue, setFieldTouched } }) => {
        return (
          <div className="w-full custom-select-component">
            {label ? (
              <label
                htmlFor={name}
                className="mb-[16px] text-white text-[14px] mt-2"
              >
                {label}
              </label>
            ) : null}
            <Select
              disabled={disabled}
              mode={mode}
              style={{ width: "100%" }}
              placeholder={placeholder}
              className={`custom-select ${className}`}
              dropdownClassName={`custom-select__dropdown ${dropdownClassName}`}
              options={options}
              dropdownStyle={{
                zIndex: 999999999,
              }}
              defaultValue={defultData}
              value={meta?.value}
              onChange={(value, option) => {
                // console.log(value, option);
                setFieldValue(name, value);

                if (onChange) {
                  onChange(value, option);
                }
              }}
              onBlur={() => {
                setFieldTouched(name, true);
              }}
            />
            {meta?.touched && Array.isArray(meta?.error) ? (
              <>
                {meta.error.map((err, index) => (
                  <div key={`error-tag-${index}`} className="error">
                    {err}
                  </div>
                ))}
              </>
            ) : meta?.touched && meta?.error ? (
              <div className="error">{meta?.error}</div>
            ) : null}
          </div>
        );
      }}
    </Field>
  );
};
