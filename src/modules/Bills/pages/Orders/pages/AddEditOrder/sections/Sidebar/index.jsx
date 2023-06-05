import {
  // ProductDetails,
  Status,
  Thumbnail,
  ChooseTemplate,
} from "./sub-sections";

export const Sidebar = ({selected, setSelected}) => {
  return (
    <div className=" items-center justify-between mt-[10px] ">
      <ChooseTemplate selected={selected} setSelected={setSelected}/>
      {/* <Thumbnail /> */}
      <Status />
      {/* <ProductDetails /> */}
    </div>
  );
};
