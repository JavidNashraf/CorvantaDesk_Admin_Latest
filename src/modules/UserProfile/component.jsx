// import { useTranslation } from 'react-i18next';
import { useState } from "react";
import {
  Navigation,
  ProfileDetails,
  SigninMethods,
  APIKeys,
  // Logs,
  // LoginSessions,
} from "./sections";
import "./style.scss";

export const UserProfile = () => {
  const [tab, setTab] = useState("Settings");
  // const { t } = useTranslation('/UserProfile/ns');

  const items = [
    { name: "Settings", onClick: () => setTab("Settings") },
    { name: "API Keys", onClick: () => setTab("API Keys") },
    // { name: "Logs", onClick: () => setTab("Logs") },
  ];

  let Component = () => <></>;
  switch (tab) {
    case "Settings":
      Component = () => (
        <>
          <ProfileDetails />
          <SigninMethods />
        </>
      );
      break;
    case "API Keys":
      Component = () => <APIKeys />;
      break;
    case "Logs":
      Component = () => (
        <>
          {/* <LoginSessions /> */}
          {/* <Logs /> */}
        </>
      );
      break;
    default:
      Component = () => (
        <>
          <ProfileDetails />
          <SigninMethods />
        </>
      );
  }

  return (
    <div className="userprofile">
      <Navigation items={items} active={tab} />
      <Component />
    </div>
  );
};
