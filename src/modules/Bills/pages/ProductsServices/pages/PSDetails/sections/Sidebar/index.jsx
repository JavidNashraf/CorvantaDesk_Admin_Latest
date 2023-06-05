import { Note } from "../GeneralSettings/sub-sections";
import { Status, Thumbnail } from "./sub-sections";

export const Sidebar = ({ defaulValue }) => {
  return (
    <div>
      <Thumbnail />
      <Status defaulValue={defaulValue} />
      <Note />
      {/* <ProductDetails /> */}
    </div>
  );
};
