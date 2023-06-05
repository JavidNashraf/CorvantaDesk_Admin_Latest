import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { element, bool } from "prop-types";
import { useMediaQuery } from "react-responsive";
import { SideBar, TopBar, Notifications } from "./components";
import { GetMFAUri } from "store/Actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";
import { useSidebarData } from "./components/SideBar/data";
import { getDepartments } from "store";
import { getAllTickets } from "store";
import { AutoRefreshApp } from "store";

export function DashboardLayout({ children, hide }) {
  const { settings } = useSelector((state) => state?.appSettings);
  const [active, setActive] = useState("");
  const [activeSub, setActiveSub] = useState("");
  const [activeInnerSub, setActiveInnerSub] = useState("");
  const [activeDeepInnerSub, setActiveDeepInnerSub] = useState("");
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state?.departments);
  const { allTickets } = useSelector((state) => state?.tickets);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const lessThanDesktop = useMediaQuery({
    query: "(max-width: 900px)",
  });

  const sidebarData = useSidebarData();

  const sidebarLinksLength = sidebarData?.length;

  const [hideSide, setHideSide] = useState(!!lessThanDesktop);
  const [hideNoti, setHideNoti] = useState(false);

  useEffect(() => {
    const activeLink = sidebarData.filter((sideItem) => {
      const { name, path } = sideItem;
      if (name === "Dashboard") {
        return path === pathname;
      } else {
        return pathname.includes(path);
      }
    });

    setActive(activeLink[0]);

    // Set Sublink
    if (activeLink?.length && activeLink[0]?.subLinks?.length) {
      const activeSubLink = activeLink[0].subLinks.filter((subItem) => {
        const { path } = subItem;
        return pathname.includes(path);
      });
      setActiveSub(activeSubLink[0]);

      if (activeSubLink?.length && activeSubLink[0]?.subLinks?.length) {
        const activeInnerSubLink = activeSubLink[0]?.subLinks?.filter(
          ({ path }) => {
            const trimmedPathname = path.substring(0, path.lastIndexOf("/"));
            return pathname.includes(trimmedPathname);
          }
        );
        setActiveInnerSub(activeInnerSubLink[0]);
        // Set Deep Inner Sub Link
        if (
          activeInnerSubLink?.length &&
          activeInnerSubLink[0]?.subLinks?.length
        ) {
          const activeDeepInnerSubLink =
            activeInnerSubLink[0]?.subLinks?.filter(({ path }) => {
              const trimmedPathname = path.substring(0, path.lastIndexOf("/"));
              return pathname.includes(trimmedPathname);
            });
          setActiveDeepInnerSub(activeDeepInnerSubLink[0]);
        } else {
          setActiveDeepInnerSub("");
        }
      } else {
        setActiveInnerSub("");
      }
    }
  }, [pathname, user, sidebarLinksLength]);

  useEffect(() => {
    if (user) {
      dispatch(GetMFAUri(user.id));
    }
  }, [user, dispatch]);

  const toggleSide = () => {
    setHideSide((state) => !state);
  };

  const toggleNotification = (f, page) => {
    setHideNoti(f);
  };

  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getAllTickets());
  }, []);

  setInterval(() => {
    if (settings?.autoRefreshInterval && isLoggedIn) {
      dispatch(AutoRefreshApp());
    }
  }, settings?.autoRefreshInterval * 10000);

  // Setting Departments
  const ticketsWithDepartmentName = allTickets?.map((ticket) => ({
    ...ticket,
    departmentName: departments?.filter(
      (dept) => dept?.id === ticket?.departmentId
    )[0]?.name,
  }));

  // console.log(ticketsWithDepartmentName);

  const finalTickets = ticketsWithDepartmentName?.filter(
    (ticket) => ticket?.departmentName !== undefined
  );

  function getUniqueListBy(arr, key) {
    return [...new Map(arr?.map((item) => [item?.[key], item]))?.values()];
  }
  const uniqueDeptTickets = getUniqueListBy(finalTickets, "departmentId");

  const deptLinks = uniqueDeptTickets?.map((el) => ({
    name: el?.departmentName,
    deptId: el?.departmentId,
    path: `/admin/dashboard/support/tickets/by-departments/${el?.departmentId}`,
  }));
  return (
    <div
      className={`w-full md:min-h-screen ${hideNoti ? "notificationShow" : ""}`}
    >
      <TopBar
        hide={hide}
        hideSide={hideSide}
        toggleSide={toggleSide}
        toggleNotification={(v) => toggleNotification(v)}
        innerSubLinks={
          activeSub && activeSub.showDropdown ? activeSub.subLinks : []
        }
      />
      <div className="flex w-full">
        {!hide && (
          <div className="col-auto">
            <SideBar hideSide={hideSide} />
          </div>
        )}
        <div className="col">
          <div className="bg-[#0C0D0F] px-[20px] py-[20px] md:px-[40px] flex items-center gap-5">
            {pathname?.split("/")[3] === "support" ? (
              <>
                <h2 className="text-xl font-normal text-white">Support</h2>
                <div className="h-5 w-[1px] bg-[#323248]" />
                <h6 className="text-white text-[12px]">
                  <Link
                    to="/admin/dashboard/support/tickets/list"
                    className={`${
                      !pathname.includes("show-all") &&
                      pathname.includes("details")
                        ? "bg-[#1b1b2b] text-[#3699FF]"
                        : "text-[#92928F]"
                    } hover:bg-[#1b1b2b] hover:text-[#3699FF]`}
                  >
                    My Tickets
                  </Link>
                  {" - "}
                  <Link
                    to="/admin/dashboard/support/tickets/show-all/list"
                    className={`${
                      pathname.includes("show-all")
                        ? "bg-[#1b1b2b] text-[#3699FF]"
                        : "text-[#92928F]"
                    } hover:bg-[#1b1b2b] hover:text-[#3699FF]`}
                  >
                    All Tickets
                  </Link>
                  {" - "}
                  <Link
                    to="/admin/dashboard/support/tickets/queue"
                    className={`${
                      pathname.includes("queue")
                        ? "bg-[#1b1b2b] text-[#3699FF]"
                        : "text-[#92928F]"
                    } hover:bg-[#1b1b2b] hover:text-[#3699FF]`}
                  >
                    Queue
                  </Link>
                </h6>
                <div className="h-5 w-[1px] bg-[#323248]" />
                {deptLinks?.map((link) => (
                  <Link
                    to={link?.path}
                    className={`${
                      pathname.includes("by-departments") &&
                      pathname.includes(link?.deptId)
                        ? "bg-[#1b1b2b] text-[#3699FF]"
                        : "text-[#92928F]"
                    } hover:bg-[#1b1b2b] hover:text-[#3699FF]`}
                  >
                    {link?.name}
                  </Link>
                ))}
              </>
            ) : (
              <></>
            )}
            {pathname?.split("/")[3] !== "support" && (
              <h2 className="text-xl font-normal text-white">{active?.name}</h2>
            )}

            {pathname?.split("/")[3] !== "support" &&
            activeSub?.name &&
            !active?.hideBread ? (
              <>
                <div className="h-5 w-[1px] bg-[#323248]" />
                <h6 className="text-white text-[12px]">
                  <Link
                    to={activeSub?.path}
                    className={activeSub?.name ? "text-[#FFFFFF]" : ""}
                  >{`${activeSub?.name} ${
                    activeInnerSub?.name ? "-" : ""
                  } `}</Link>
                  {activeInnerSub?.name && !activeDeepInnerSub ? (
                    <span>{`${activeInnerSub?.name} ${
                      activeDeepInnerSub ? "-" : ""
                    } `}</span>
                  ) : activeInnerSub?.name && activeDeepInnerSub ? (
                    <Link
                      to={activeInnerSub?.path}
                      className={activeInnerSub?.name ? "text-[#FFFFFF]" : ""}
                    >{`${activeInnerSub?.name} ${
                      activeInnerSub?.name ? "-" : ""
                    } `}</Link>
                  ) : (
                    ""
                  )}

                  {activeDeepInnerSub?.name ? (
                    <span>{`${activeDeepInnerSub?.name}`}</span>
                  ) : (
                    ""
                  )}
                </h6>
              </>
            ) : (
              <></>
            )}
          </div>

          {children}
        </div>
      </div>
      <Notifications
        hideNoti={hideNoti}
        toggleNotification={(f, page) => toggleNotification(f, page)}
      />
    </div>
  );
}

DashboardLayout.propTypes = {
  children: element.isRequired,
  hide: bool,
};

DashboardLayout.defaultProps = {
  hide: false,
};
