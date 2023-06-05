import { Products, Users } from '.';

export const Left = () => {
  return (
    <div>
      {/* Products + Other Fields Configuration Side */}
      <div className="bg-[#000000] p-[32px] rounded-[8px]">
        <Products />
        <Users />
      </div>
      {/* <div className="bg-[#000000] pb-[32px] pt-[32px] rounded-[8px] mt-[20px]"> */}
      {/* </div> */}
    </div>
  );
};
