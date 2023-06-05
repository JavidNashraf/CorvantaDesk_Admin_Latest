import { Button } from "components";
import { GS, LineItems } from "./sub-sections";

export const GeneralSettings = () => {
  return (
    <div>
      <GS />
      <LineItems />
      {/* <Note /> */}

      <div className="text-right ">
        <Button type="ghost" className="h-[52px] mt-[32px]" htmlType="submit">
          Save Changes
        </Button>
      </div>
    </div>
  );
};
