import { Modal } from 'components';

export const InvalidFileUpload = ({ show, setShow }) => {
  return (
    <Modal
      show={show}
      setShow={setShow}
      heading="Invalid File Type"
      submitText=""
      centered
      customBody={
        <div className="border-[#FFA800] border-[1px] border-dashed bg-[#392F28] rounded-[8px] text-[#FFA800] text-[14px] p-[20px] mb-[32px]">
          Oops! It looks like you're uploading an invalid file. Please try
          again.
        </div>
      }
    />
  );
};
