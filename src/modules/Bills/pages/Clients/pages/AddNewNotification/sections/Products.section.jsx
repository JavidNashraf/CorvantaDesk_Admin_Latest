import { Input, Button } from 'components';
import { useFormikContext } from 'formik';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { findSpecificUsers } from 'store';

export const Products = () => {
  const { values } = useFormikContext();
  const dispatch = useDispatch();
  return (
    <>
      <div className="flex flex-col gap-[20px]">
        <Input
          label="Property"
          type="select"
          name="property"
          placeholder="Select Property"
          options={[
            { label: 'Show All', value: '' },
            { label: 'Bills', value: 0 },
            { label: 'Tickets', value: 1 },
            { label: 'Orders', value: 2 },
            { label: 'Products', value: 3 },
            { label: 'Refunds', value: 4 },
          ]}
        />
        <Input
          label="Operator"
          type="select"
          name="operatorType"
          placeholder="Select Operator"
          options={[
            { label: 'Show All', value: '' },
            { label: '>=', value: '>=' },
            { label: '<=', value: '<=' },
            { label: '<', value: '<' },
            { label: '>', value: '>' },
            { label: '=', value: '=' },
            { label: '!=', value: '!=' },
          ]}
        />
        <Input
          label="Value"
          type="text"
          name="value"
          placeholder="Enter Value"
        />
        <Button
          type="ghost"
          className="h-[52px] w-full"
          htmlType="button"
          onClick={async () => {
            if (values?.property && values?.operatorType && values?.value) {
              const { property, operatorType, value } = values;
              await dispatch(
                findSpecificUsers({
                  property: Number(property),
                  operatorType,
                  value,
                })
              );
            } else {
              toast.error('Please select appropriate values to proceed.');
            }
          }}
        >
          Apply
        </Button>
      </div>
    </>
  );
};
