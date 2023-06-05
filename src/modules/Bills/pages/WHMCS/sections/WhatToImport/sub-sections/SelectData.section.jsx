import { Modal } from 'components';

export const SelectData = ({ show, setShow }) => {
  return (
    <Modal
      show={show}
      setShow={setShow}
      heading="Please select some data"
      submitText=""
      centered
      customBody={
        <div className="border-[#FFA800] border-[1px] border-dashed bg-[#392F28] rounded-[8px] text-[#FFA800] text-[14px] p-[20px] mb-[32px]">
          Oops! It looks like you didn't select any data. Please select some
          data and try again. again.
        </div>
      }
    />
  );
};
