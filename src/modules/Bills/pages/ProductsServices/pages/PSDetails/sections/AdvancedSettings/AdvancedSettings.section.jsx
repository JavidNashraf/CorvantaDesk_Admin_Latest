import { Button, DatePicker } from "components";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getModules } from "store/Actions/scripting";
import { updateProductModule } from "store/Actions/products";
import { EmailBodyInput } from "components";
import { Spin } from "antd";
const fields = [
  { label: "Next Due Date", name: "nextDueDate", disabled: false },
  { label: "Termination Date", name: "terminationDate", disabled: false },
  {
    label: "Override Suspension Date",
    name: "overrideSuspensionDate",
    disabled: false,
  },
  {
    label: "Override Termination Date",
    name: "overrideTerminationDate",
    disabled: false,
  },
];

const DateTitle = ({ title, name, disabled }) => {
  return (
    <div>
      <label className="mb-[16px] text-white text-[14px] font-normal">
        {title}
      </label>
      <DatePicker
        name={name}
        hideTime
        format="MM/DD/YYYY"
        disabled={disabled}
        className="disabled:bg-[#323248] disabled:text-[#92928F]"
      />
    </div>
  );
};

export const AdvancedSettings = ({product}) => {
  const dispatch = useDispatch();
  const { loading, scripts } = useSelector((state) => state.scripting);
  const [module, setModule] = useState(null);

  useEffect(() => {
    dispatch(getModules());
  }, []);

  useEffect(() => {
    if(product?.moduleName){
      changeModule(product?.moduleName)
    }
  }, [scripts]);

  const field = {
    name: "module",
    type: "select",
    label: "Module",
    placeholder: "Select Automation Module",
    options: scripts?.map((script) => {
      return { label: script?.name, value: script?.name };
    }) || [],
  };

  const setupField = {
    name: "productSetup",
    type: "select",
    label: "Automated Setup",
    placeholder: "Select Setup",
    options: [
      { label: "Do not setup", value: 0 },
      { label: "Setup when order is placed", value: 1 },
      { label: "Setup when first payment is received", value: 2 },
      { label: "Setup when pending order is manually accepted", value: 3}
    ],
  }

  function onChange(e) {
    const value = e.target.value;
    changeModule(value);
  }

  function changeModule(value){
    const m = scripts?.find((script) => script?.name === value);
    if (m) {
      setModule(m);
    }else{
      setModule(null);
    }
  }

  function saveChanges(values){
    const data = {
      module: module?.name || null,
      productSetup: values?.productSetup * 1,
      extraData: module?.fields?.inputFields?.reduce((acc, field) => {
        acc[field.name] = values[field.name];
        return acc;
      }, {}) || {},
    }
    dispatch(updateProductModule(product?.id, data));
  }

  return (
    <div>
    <div className="bg-[#000000] p-[32px] mt-[20px] rounded-[8px]">
      <h6 className="text-white text-[16px] font-medium mb-[32px]">
        Automation Module
      </h6>
      <div>
        <Spin spinning={loading}>
        <Formik
          initialValues={{
            module: module? module?.name : undefined,
            productSetup: product?.productSetup? product?.productSetup : 0,
            ...module?.fields?.inputFields?.reduce((acc, field) => {
              acc[field.name] = field?.defaultValue || "";
              return acc;
            }, {}),
          }}
          enableReinitialize
          onSubmit={(values) => {
            saveChanges(values);
          }}  
        >
          {({ touched, errors, submitForm}) => {
            return (
              <Form>
                <EmailBodyInput
                {...field}
                touched={touched}
                errors={errors}    
                onChange={onChange}          
                ></EmailBodyInput>
                {module && (
                  <div>
                    <h6 className="text-white text-[14px] font-medium mt-[20px]">
                      Custom Fields
                      </h6>
                  <div className="grid grid-cols-2 gap-[32px]">
                    {module?.fields?.inputFields?.map((field) => {
                      return (
                        <div className="mt-[20px]" key={field?.name}>
                          <EmailBodyInput
                            {...field}
                            touched={touched}
                            errors={errors}
                            ></EmailBodyInput>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                )}
                <div style={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }
                }>
                  <div style={
                    {
                      marginTop: '40px',
                      marginRight: '10px',
                    }
                  }>
                  <EmailBodyInput
                  {...setupField}
                  touched={touched}
                  errors={errors}
                  ></EmailBodyInput>
                  </div>
                <Button type="ghost" onClick={submitForm}  className="mt-[40px] h-[52px]">
                  Save Changes
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
        </Spin>
      </div>
    </div>
    <div className="bg-[#000000] p-[32px] mt-[20px] rounded-[8px]">
      <h6 className="text-white text-[16px] font-medium mb-[32px]">
        Advanced Settings
      </h6>
      <div className="grid grid-cols-2 gap-[32px]">
        <div className="col-span-full">
          <DateTitle
            name="registrationDate"
            title="Registration Date"
            // disabled
          />
        </div>
        {fields?.map((field) => {
          return (
            <DateTitle
              key={field?.name}
              name={field?.name}
              title={field?.label}
              disabled={field?.disabled}
            />
          );
        })}
      </div>
      <Button type="ghost" htmlType="submit" className="mt-[32px] h-[52px]">
        Save Changes
      </Button>
    </div>
    </div>
  );
};
