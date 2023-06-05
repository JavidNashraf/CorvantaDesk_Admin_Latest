import { Details } from "components/TicketDetails/sections";
import React from "react";
import { DepartmentList } from "./DepartmentTickets";
import { DepartmentListWaiting } from "./DepartmentTicketsWaiting";
import { QueueList } from "./TicketDetails.page";
import { WaitingList } from "./WaitingList";

const Queue = ({ type }) => {
  return (
    <div className="p-[40px] flex flex-col gap-[30px]">
      {type === "waiting" ? (
        <WaitingList />
      ) : type === "department" ? (
        <DepartmentList />
      ) : type === "departmentwaiting" ? (
        <DepartmentListWaiting />
      ) : (
        <QueueList />
      )}
      <Details />
    </div>
  );
};

export default Queue;
