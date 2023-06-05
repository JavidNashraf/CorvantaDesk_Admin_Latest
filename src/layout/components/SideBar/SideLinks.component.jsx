import React from "react";
import { string } from "prop-types";
import { Link, NavLink, useLocation } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useDispatch } from "react-redux";
import { setSupport } from "store/Slices/ticketsSlice";

function SideLinks({
  name,
  path,
  icon,
  hideSide,
  hideInSide,
  count,
  subLinks,
}) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isActive =
    name === "Dashboard" ? pathname === path : pathname.includes(path);
  return (
    <>
      {!hideInSide ? (
        <li>
          <Link
            to={path}
            onClick={() =>
            (name = "Support"
              ? dispatch(setSupport(true))
              : dispatch(setSupport(false)))
            }
            className={`${isActive ? "border-s-[3px] border-[#0096C7] bg-gradient-to-r from-[#023E8A3D]/[0.24] from-10% to-[#0C0D0F] text-[#0096C7]" : "text-white"
              }
              hover:border-s-[3px] hover:border-[#0096C7] pt-4 pb-4 flex  no-underline hover:bg-gradient-to-r hover:from-[#023E8A3D]/[0.24] hover:from-10% hover:to-[#0C0D0F]  px-4`
            }


          >
            {icon(isActive ? "#3699ff" : "#494b74")}
            <div className="flex items-center gap-[12px]">
              <span
                className={`${hideSide ? "hidden" : "inline"} transition-all`}
              >
                &nbsp; {name}
              </span>
              <Badge pill bg="primary">
                {count}
              </Badge>
            </div>
          </Link>
          {!hideSide && subLinks?.length && (
            <ul
              className={`sublinks text-[#FFFFFF] ${isActive ? "bg-[#0C0D0F]" : ""
                }`}
            >
              {subLinks?.map(
                (link) =>
                  link?.show &&
                  link?.showSide && (
                    <li>
                      <NavLink
                        onClick={() =>
                        (name = "My Tickets"
                          ? dispatch(setSupport(true))
                          : dispatch(setSupport(false)))
                        }
                        to={link?.path}
                        className={({ isActive }) =>
                          (isActive ? `text-[#0096C7] ` : "text-[#FFFFFF] ") +
                          ` flex items-center w-full pl-1 pt-3 pb-3 no-underline hover:bg-gradient-to-r hover:from-[#023E8A3D]/[0.50] hover:from-10% hover:to-[#0C0D0F] py-2`
                        }
                      >
                        <span>{">"}</span>
                        <div className="flex items-center gap-[12px]">
                          <span
                            className={`${hideSide ? "hidden" : "inline"
                              } transition-all`}
                          >
                            &nbsp; {link?.name}
                          </span>
                          <Badge pill bg="primary">
                            {link?.count}
                          </Badge>
                        </div>
                      </NavLink>
                      {!hideSide && link?.subLinks?.length > 0 && (
                        <ul
                          className={`sublinks text-[#FFFFFF] ${isActive ? "bg-[#0C0DF]" : ""
                            }`}
                        >
                          {link?.subLinks?.map(
                            (link) =>
                              link?.show &&
                              link?.showSide && (
                                <li className="flex items-center">
                                  <span>{">>"}</span>
                                  <NavLink
                                    to={link?.path}
                                    className={({ isActive }) =>
                                      (isActive
                                        ? `text-[#0096C7] `
                                        : "text-[#FFFFFF]") +
                                      ` no-underline hover:bg-gradient-to-r hover:from-[#023E8A3D]/[0.60] hover:from-10% hover:to-[#0C0D0F] py-2`
                                    }
                                  >
                                    <div className="flex items-center gap-[12px]">
                                      <span
                                        className={`${hideSide ? "hidden" : "inline"
                                          } transition-all`}
                                      >
                                        &nbsp; {link?.name}
                                      </span>
                                      <Badge pill bg="primary">
                                        {link?.count}
                                      </Badge>
                                    </div>
                                  </NavLink>
                                </li>
                              )
                          )}
                        </ul>
                      )}
                    </li>
                  )
              )}
            </ul>
          )}
        </li>
      ) : (
        <></>
      )}
    </>
  );
}

SideLinks.propTypes = {
  name: string.isRequired,
  path: string.isRequired,
};

// SideLinks.defaultProps = {
//   name: 'Link',
//   path: '/',
// };

export default SideLinks;
