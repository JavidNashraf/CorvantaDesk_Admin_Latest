import React, { Fragment, useEffect } from "react";
import SideLinks from "./SideLinks.component";
import "./SideBar.styles.scss";
// import { useSelector } from 'react-redux';
import { useSidebarData } from "./data";
// import { checkModule } from 'lib/checkModule';
import { Spin } from "antd";
import { useLocation } from "react-router-dom";

export function SideBar({ hideSide }) {
  const { pathname } = useLocation();

  let sidebarData = useSidebarData();
  useEffect(() => {}, [pathname]);

  return (
    <Spin spinning={sidebarData?.length === 0}>
      <div
        className={`sidebar bg-[#0C0D0F] transition-all pt-[20px] ${
          hideSide ? "w-[95px]" : "w-[300px]"
        }`}
      >
        <ul className="p-0">
          {sidebarData.map(
            ({
              name,
              module,
              path,
              hideInSide,
              icon,
              count,
              show,
              subLinks,
            }) => {
              return (
                <Fragment key={path}>
                  {/* TODO: Remove or operator and module variable once all modules are included */}
                  {show ? (
                    <SideLinks
                      name={name}
                      path={path}
                      icon={icon}
                      count={count}
                      hideSide={hideSide}
                      hideInSide={hideInSide}
                      subLinks={subLinks}
                    />
                  ) : (
                    <></>
                  )}
                </Fragment>
              );
            }
          )}
        </ul>
      </div>
    </Spin>
  );
}
