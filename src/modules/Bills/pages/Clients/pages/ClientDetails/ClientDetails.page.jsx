import "./ClientDetails.styles.scss";
import { useEffect, useState } from "react";
import {
  UserProfileCard,
  SubUsers,
  Navigation,
  // Overview
  AssignedTickets,
  // PastEmails,
  ProductsServices,
  // Events & Logs
  // EventsLogs,
  AccountStatement,
  Settings,
  // UserPermissions,
  APIKeys,
  Logs,
  LoginSessions,
  Invoices,
  OtherActions,
} from "./sections";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import {
  getUserById,
  getUserModulesById,
  getUserSettingsById,
  getCreditBalanceByClient,
} from "store";
import { Brands } from "./sections/Brand.section";

export const ClientDetails = () => {
  const [active, setActive] = useState("OVERVIEW");

  const links = [
    { label: "OVERVIEW", onClick: () => setActive("OVERVIEW") },
    // { label: "PERMISSIONS", onClick: () => setActive("PERMISSIONS") },
    { label: "API KEYS", onClick: () => setActive("API KEYS") },
    { label: "SETTINGS", onClick: () => setActive("SETTINGS") },
    { label: "EVENTS & LOGS", onClick: () => setActive("EVENTS & LOGS") },
    {
      label: "ACCOUNT STATEMENT",
      onClick: () => setActive("ACCOUNT STATEMENT"),
    },
  ];

  const { loading, user } = useSelector((state) => state?.users);

  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserById(id, true));
    dispatch(getUserModulesById(id));
    dispatch(getCreditBalanceByClient(id));
    dispatch(getUserSettingsById(id));
  }, [id]);

  // console.log("client", user);

  return (
    <div className="users">
      <div className="admin-details min-w-[60vh]">
        {loading || user === null ? (
          <Spin
            size="large"
            style={{ gridColumn: "1/3", alignSelf: "center" }}
          />
        ) : (
          <>
            <div className="admin-details__left">
              {/* USER PROFILE CARD */}
              <UserProfileCard />
              <div className="mt-4">
                <OtherActions />
              </div>
              <div className="mt-4">
                <Brands />
              </div>
              <div className="mt-4">
                <SubUsers />
              </div>
            </div>
            <div className="admin-details__right">
              <Navigation active={active} links={links} />
              {active === "OVERVIEW" ? (
                <>
                  <ProductsServices />
                  <AssignedTickets />
                  <Invoices clientTab={setActive} />
                  {/* TODO: Show it when mass email integration is done */}
                  {/* <PastEmails /> */}
                </>
              ) : (
                <></>
              )}
              {active === "SETTINGS" ? <Settings /> : <></>}
              {active === "API KEYS" ? <APIKeys /> : <></>}
              {/* {active === "PERMISSIONS" ? <UserPermissions /> : <></>} */}
              {active === "EVENTS & LOGS" ? (
                <>
                  <LoginSessions />
                  <Logs />
                </>
              ) : (
                <></>
              )}
              {active === "ACCOUNT STATEMENT" ? <AccountStatement /> : <></>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
