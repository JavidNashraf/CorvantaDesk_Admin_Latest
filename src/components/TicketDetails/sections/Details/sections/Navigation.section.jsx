import { Button } from "components";
import { useNavigate } from "react-router-dom";

export const Navigation = ({ links, active, isAdmin }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-[#0D0E0F]  rounded-lg flex justify-between items-center ${
        !isAdmin ? "mt-4" : ""
      }`}
    >
      <div className="bg-[#0D0E0F] rounded-lg px-[40px] py-[20px] flex items-center gap-[40px]">
        {links.map((link) => (
          <div
            onClick={link?.onClick}
            key={link?.label}
            className={`text-[14px] ${
              active === link?.label ? "text-[#3699FF]" : "text-[#6D6D80]"
            } uppercase cursor-pointer transition-all hover:text-[#3699FF]`}
          >
            <span className="inline-block align-middle"> {link?.label}</span>
            {link?.showCount && (
              <span
                className={`inline-block align-middle text-[10px] ml-[5px] rounded-[5px] text-[#FFFFFF] pl-[8px] pr-[8px] pt-[2px] pb-[2px]
            ${active === link?.label ? "bg-[#3699FF]" : "bg-[#6D6D80]"}`}
              >
                {link?.count}
              </span>
            )}
          </div>
        ))}
      </div>
      {isAdmin && (
        <div className="pr-2">
          <Button
            onClick={() =>
              navigate(
                "/admin/dashboard/support/tickets/show-all/list/generate-ticket"
              )
            }
          >
            Generate Ticket
          </Button>
        </div>
      )}
    </div>
  );
};
