import { Modal } from "components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentOnlineUsers } from "store";
import { addTicketComments } from "store";
import { editTicket } from "store";

export const AssignTicket = ({ show, setShow, id }) => {
  const { users, onlineUsers } = useSelector((state) => state?.users);
  const { departments } = useSelector((state) => state?.departments);
  const { ticket } = useSelector((state) => state?.tickets);
  const [departmentId, setDepartmentId] = useState("");
  const [usersData, setUsersData] = useState([])

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentOnlineUsers());

    if (ticket?.departmentId) {
      const usersWithDeptIds = users?.filter((user) => user?.departmentIds)
      const currUsersData = []
      usersWithDeptIds?.forEach(user => {
        const isOnline = onlineUsers?.some((admin) => admin?.userId === user?.id)
       
        // console.log("TICKETTTT");
        if (user?.departmentIds?.some((userDeptId) => userDeptId === ticket?.departmentId)) {
          currUsersData.push({
            value: user?.id,
            label: isOnline ? `${user?.fullName} (Online)` : user?.fullName,
            isActive: isOnline ? true : false,
          })
        }
      })?.sort((a, b) => b.isActive - a.isActive)
      
      setUsersData([{ label: "Auto Assign", value: "auto" }, ...currUsersData])
    }

    return () => {
      setUsersData([])
    }
  }, [ticket]);

  useEffect(() => {
    dispatch(getCurrentOnlineUsers());

    if (departmentId) {
      const usersWithDeptIds = users?.filter((user) => user?.departmentIds)
      const currUsersData = []
      usersWithDeptIds?.forEach(user => {
        const isOnline = onlineUsers?.some((admin) => admin?.userId === user?.id)
        
        // console.log("DEPP");
        if (user?.departmentIds?.some((userDeptId) => userDeptId === departmentId)) {
          currUsersData.push({
            value: user?.id,
            label: isOnline ? `${user?.fullName} (Online)` : user?.fullName,
            isActive: isOnline ? true : false,
          })
        }
      })?.sort((a, b) => b.isActive - a.isActive)
      
      setUsersData([{ label: "Auto Assign", value: "auto" }, ...currUsersData])
    }

    return () => {
      setUsersData([])
    }
  }, [departmentId]);

  let departmentsData = [{ value: "", label: "Select Department" }];
  departments?.forEach((departments) => {
    departmentsData.push({
      value: departments?.id,
      label: departments?.name,
    });
  });
  const ticketStatus = [
    "Active",
    "Waiting",
    "Closed",
    "Closed and Locked",
  ]?.map((el, idx) => ({
    label: el,
    value: idx,
  }));

  const fields = [
    {
      type: "select",
      name: "department",
      // placeholder: "Select Department",
      options: departmentsData,
      action: setDepartmentId,
      title: "Department",
    },
    {
      type: "select",
      name: "assignedTo",
      // placeholder: "Please select department first",
      options: usersData,
      title: "Admin",
    },
    {
      type: "select",
      name: "ticketPriority",
      placeholder: "Select Priority",
      options: ["Low", "Normal", "High"].map((el, idx) => ({
        label: el,
        value: idx,
      })),
      title: "Priority",
    },
    {
      name: "ticketStatus",
      title: "Status",
      type: "select",
      options: ticketStatus,
    },
    {
      type: "textarea",
      name: "comment",
      title: "Comment",
      placeholder: "Enter Comment Here...",
    },
  ];

  const initialValues = {
    department: ticket?.departmentId,
    assignedTo: ticket?.assignedTo ? ticket?.assignedTo : "auto",
    ticketStatus: ticket?.ticketStatus,
    ticketPriority: ticket?.ticketPriority,
    comment: "",
  };

  return (
    <Modal
      heading="Assign/Transfer Ticket"
      submitText="Transfer Ticket"
      show={show}
      setShow={setShow}
      fields={fields}
      initialValues={initialValues}
      // loading={detailsLoading || loading || usersLoading}
      handleSubmit={async (values) => {
        if (values.assignedTo === "auto" && usersData.length > 1) {
          values.assignedTo = usersData[1].value
          values.assignedToFullName = usersData[1].label
        }

        const finalTicketValues = {
          ...ticket,
          ticketStatus: Number(values?.ticketStatus),
          ticketPriority: Number(values?.ticketPriority),
          assignedTo: values?.assignedTo,
        };
        
        await dispatch(editTicket({ data: finalTicketValues }));

        if (values?.comment) {
          await dispatch(
            addTicketComments({
              ticketId: ticket?.id,
              commentText: values?.comment,
              isSticky: false,
              isDraft: false,
              ticketCommentAction: 1,
              ticketCommentType: 1,
            })
          );
        }
        setShow(false);
      }}
    />
  );
};
