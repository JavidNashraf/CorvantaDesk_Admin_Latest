import { Spin } from 'antd';
import { Button, ImageUpload, Input } from 'components';
import { Formik, Form } from 'formik';
import { createServerImage } from 'lib';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateWHMCSData } from 'store';
import { InvalidFileUpload } from '.';

const initialValues = {
  whmcsFileType: 0,
  jsonFile: null,
};

const whmcsFileTypeOptions = [
  { label: 'Clients', value: 0 },
  { label: 'Domains', value: 1 },
  { label: 'Invoices', value: 2 },
  { label: 'Transactions', value: 3 },
  { label: 'Services', value: 4 },
];

export const ValidateForm = ({ setStep }) => {
  const [showInvalid, setShowInvalid] = useState(false);

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state?.whmcs);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        const jsonFile = await createServerImage(values?.jsonFile);
        const final = {
          whmcsFileType: Number(values?.whmcsFileType),
          jsonFile,
        };
        const res = await dispatch(validateWHMCSData({ data: final }));
        if (res?.status !== 200 || res?.data?.rowValidationErrors?.length) {
          setShowInvalid(true);
        } else {
          setStep(2);
        }
      }}
      enableReinitialize
    >
      {({ values }) => (
        <Form>
          <Spin spinning={loading}>
            <div className="w-full rounded-[8px] bg-[#000000] min-h-[75vh] flex flex-col justify-between">
              {/* Invalid Modal */}
              <InvalidFileUpload show={showInvalid} setShow={setShowInvalid} />
              {/* Top Section */}
              <div>
                <h6 className="text-white text-[16px] font-medium my-[32px] px-[32px]">
                  What Do You Want To Import?
                </h6>
                <div className="px-[32px] grid grid-cols-2 gap-[20px]">
                  <Input
                    type="select"
                    label="Select Table"
                    options={whmcsFileTypeOptions}
                    name="whmcsFileType"
                  />
                  <div className="w-full">
                    <label
                      htmlFor="jsonFile"
                      className="mb-[16px] text-white text-[14px]"
                    >
                      Upload JSON File
                    </label>
                    <ImageUpload
                      name="jsonFile"
                      accept=".csv"
                      hidePreview
                      placeholder="Select CSV File"
                    />
                  </div>
                </div>
              </div>
              {/* Footer Section */}
              <div className="p-[32px] border-t-[1px] border-t-[#323248] border-dashed flex gap-[12px]">
                <Button type="secondary" htmlType="button">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!values?.jsonFile}
                >
                  Next
                </Button>
              </div>
            </div>
          </Spin>
        </Form>
      )}
    </Formik>
  );
};
