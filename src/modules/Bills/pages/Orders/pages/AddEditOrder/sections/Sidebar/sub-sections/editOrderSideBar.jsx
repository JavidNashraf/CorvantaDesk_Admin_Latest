import { Input, MultiSelect } from "components";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getCurrentOnlineUsers } from "store";
import { getUsers } from "store";

export const EditOrderSideBar = () => {
  const [adminList, setAdminList] = useState([]);
  const dispatch = useDispatch();
  const { users, onlineUsers } = useSelector((state) => state?.users);
  const { orderAdminID, order } = useSelector((state) => state?.orders);
  const isSuperAdmin = useSelector(
    (state) => state?.auth?.user?.userRolesResponse?.userRoles
  )[1]?.enabled;

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getCurrentOnlineUsers());
  }, []);

  useEffect(() => {
    let usersData = [];
    users?.forEach((user) => {
      const isOnline = onlineUsers?.find((admin) => admin?.userId === user?.id)
        ? true
        : false;
      usersData.push({
        value: user?.id,
        label: user?.fullName
          ? `${user?.fullName}${isOnline ? "   (Online)" : ""}`
          : "N/A",
        isActive: isOnline ? true : false,
      });
    });

    setAdminList(usersData);
  }, [users, onlineUsers]);

  var options=[]

  switch (order?.status) {
    case 2:
      options=[
        { label: "Paid", value: 2 },
        { label: "Processing", value: 3 },
        { label: "Accepted", value: 4 },
        { label: "Completed", value: 5 },
        { label: "Cancelled", value: 6 },
      ]
      break;
      case 3:
        options=[
          { label: "Processing", value: 3 },
          { label: "Accepted", value: 4 },
          { label: "Completed", value: 5 },
          { label: "Cancelled", value: 6 },
        ]
      break;
      case 4:
        options=[
          { label: "Accepted", value: 4 },
          { label: "Completed", value: 5 },
          { label: "Cancelled", value: 6 },
        ]
        break;
      case 5:
        options=[
          { label: "Completed", value: 5 },
          { label: "Cancelled", value: 6 },
        ]
        break;
      case 6:
        options=[
          { label: "Cancelled", value: 6 },
        ]
        break;
    default:
      options=[
        { label: "Draft", value: 0 },
        { label: "Pending", value: 1 },
        { label: "Paid", value: 2 },
        { label: "Processing", value: 3 },
        { label: "Accepted", value: 4 },
        { label: "Completed", value: 5 },
        { label: "Cancelled", value: 6 },
      ]
    break;
  }

  const adminsList = users?.filter((admin) => admin?.canTakeOrders === true);
  return (
    <div className="p-[32px] bg-[#000000] rounded-[8px]">
      <div className="flex justify-between items-center">
        <h6 className="text-white font-medium text-[16px]">Order Details</h6>
      </div>
      <p className="text-[#474761] text-[14x] mt-[8px] mb-[32px]">
        View corresponding product details
      </p>

      <MultiSelect
        name="adminAssigned"
        label="Assigned To"
        placeholder="Search Admin"
        options={adminsList?.map((admin) => ({
          label: admin?.fullName,
          value: admin?.id,
        }))}
        defult={order?.adminUserInfos }
      />
      <Input
        name="orderNo"
        placeholder="#43"
        type="text"
        label="Order Number"
        className="mb-[20px] mt-1"
        disabled={true}
      />
      <Input
        name="orderPrice"
        type="text"
        label="Total Price"
        className="mb-[20px]"
        disabled
      />
      <Input
        name="createdOn"
        type="text"
        label="Created On"
        className="mb-[20px]"
        disabled
      />
      <Input
        name="modifiedOn"
        type="text"
        label="Last Modified On"
        className="mb-[20px]"
        disabled
      />

      <Input
        name="assignedToClient"
        placeholder={order?.clientFullName ? order?.clientFullName : ""}
        type="text"
        label="Client"
        className="mb-[20px]"
        disabled
      />

      <Input
        name="CustomerIp"
        placeholder="154.227.25.101"
        type="text"
        label="Customer IP"
        className="mb-[20px]"
        disabled
      />
      {isSuperAdmin && (
        <Input
          name="adminAssigned"
          placeholder="Select admin"
          type="select"
          label="Assign To"
          className="mb-[20px]"
          options={adminList}
        />
      )}
      <Input
        name="status"
        placeholder="Status"
        type="select"
        label="Status"
        className="mb-[20px]"
        options={options}
      />
    </div>
  );
};
