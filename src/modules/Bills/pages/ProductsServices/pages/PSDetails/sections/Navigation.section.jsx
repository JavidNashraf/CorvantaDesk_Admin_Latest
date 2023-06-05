import { Link } from "react-router-dom";

export const Navigation = ({ links, active, hideModule = true, moduleSettings, ...props }) => {
  return (
    <div className="navigation p-3 bg-[#000000] rounded-lg">
      <div className="bg-[#323248] rounded-lg px-[40px] py-[20px] flex items-center justify-between">
        <div className="flex items-center gap-[40px]">
          {links.map((link) => {
            return(
              <div
              onClick={link?.onClick}
              key={link?.label}
              className={`text-[14px] ${
                active === link?.label ? "text-[#3699FF]" : "text-[#6D6D80]"
              } uppercase cursor-pointer transition-all hover:text-[#3699FF]`}
            >
              {link?.label}
            </div>
            )
          })}
          {hideModule ? null : (
            <div
            onClick={moduleSettings?.onClick}
            key={moduleSettings?.label}
            className={`text-[14px] ${
              active === moduleSettings?.label ? "text-[#3699FF]" : "text-[#6D6D80]"
            } uppercase cursor-pointer transition-all hover:text-[#3699FF]`}
          >
            {moduleSettings?.label}
          </div>
          )}
        </div>
        {props?.actionLink ? (
          <div className="flex gap-3">
            {props?.actionLink.map((action) => (
              <Link
                to={action?.link}
                className="text-[#3699FF] text-[16px] hover:text-[#0BB783]"
              >
                {action?.text}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
