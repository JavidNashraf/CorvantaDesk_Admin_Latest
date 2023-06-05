import { lazy } from "react";

const pages = [
  {
    path: "/unauthorized-access",
    Component: lazy(() =>
      import("./unauthorized-access/UnauthorizedAccess.page")
    ),
  },
  {
    path: "/lock-screen",
    Component: lazy(() => import("./lock-screen/LockScreen.page")),
  },
];
export const Error404 = lazy(() => import("./error-404/Error404.page"));

export const dashboardPages = [
  {
    path: "/",
    Component: lazy(() => import("./Dashboard/Home/Home.page")),
  },
  {
    path: "/income-overview",
    Component: lazy(() => import("./Dashboard/IncomeOverview/IncomeOverview.page")),
  },
  {
    path: "/about",
    Component: lazy(() => import("./Dashboard/About/About.page")),
  },
  {
    path: "/editor",
    Component: lazy(() => import("./Dashboard/Editor/Editor.page")),
  },
  {
    path: "/settings/users/*",
    Component: lazy(() => import("./Dashboard/Users/Users.page")),
  },
  {
    path: "/billing/*",
    Component: lazy(() => import("./Dashboard/Billing/Billing.page")),
  },
  {
    path: "/account-settings/*",
    Component: lazy(() =>
      import("./Dashboard/AccountSettings/AccountSettings.page")
    ),
  },
  {
    path: "/settings/*",
    Component: lazy(() => import("./Dashboard/Settings/Settings.page")),
  },
  {
    path: "/knowledge-base/*",
    Component: lazy(() =>
      import("./Dashboard/KnowledgeBase/KnowledgeBase.page")
    ),
  },
  {
    path: "/reports/*",
    Component: lazy(() => import("./Dashboard/Reports/Reports.page")),
  },
  {
    path: "/support/*",
    Component: lazy(() => import("./Dashboard/Support/Support.page")),
  },
];

export default pages;
