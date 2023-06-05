import { Note } from "../GeneralSettings/sub-sections";
import { Status, Thumbnail } from "./sub-sections";

export const Sidebar = () => {
  return (
    <div>
      {/* <Thumbnail /> */}
      <Status />
      <Note />
      {/* <ProductDetails /> */}
    </div>
  );
};
