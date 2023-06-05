import { Button } from 'components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectData } from 'store';
import { SelectData, Tables } from './sub-sections';

export const WhatToImport = ({ setStep }) => {
  const dispatch = useDispatch();
  const [selectedData, setSelectedData] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  return (
    <div className="w-full rounded-[8px] bg-[#000000] min-h-[75vh] flex flex-col justify-between">
      <SelectData show={showSelect} setShow={setShowSelect} />
      {/* Top Section */}
      <div>
        <h6 className="text-white text-[16px] font-medium my-[32px] px-[32px]">
          What To Import
        </h6>
        <div className="px-[32px]">
          <Tables
            selectedData={selectedData}
            setSelectedData={setSelectedData}
          />
        </div>
      </div>
      {/* Footer Section */}
      <div className="p-[32px] border-t-[1px] border-t-[#323248] border-dashed flex gap-[12px]">
        <Button
          type="secondary"
          htmlType="button"
          onClick={async () => {
            setStep(1);
          }}
        >
          Go Back
        </Button>
        <Button
          type="primary"
          htmlType="button"
          onClick={async () => {
            if (selectedData?.length) {
              await dispatch(selectData({ data: selectedData }));
              setStep(3);
            } else {
              setShowSelect(true);
            }
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
