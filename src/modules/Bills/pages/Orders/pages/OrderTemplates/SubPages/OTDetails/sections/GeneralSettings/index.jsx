import { Button } from "components";
import { Delete } from "modules/UserProfile/sections/APIKeys/sections";
import { useState } from "react";
import { GS, LineItems } from "./sub-sections";

export const GeneralSettings = () => {
  const [cancel, setCancel] = useState(false);

  return (
    <div>
      <Delete show={cancel} setShow={setCancel} type="Cancel" />
      <GS />
      <LineItems />
      <div className="flex justify-between text-right ">
        <Button
          type="secondary"
          className="h-[52px] mt-[32px]"
          htmlType="button"
          onClick={() => setCancel(true)}
        >
          Cancel Changes
        </Button>
        <Button type="ghost" className="h-[52px] mt-[32px]" htmlType="submit">
          Save Changes
        </Button>
      </div>
    </div>
  );
};
