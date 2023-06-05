import { Input } from "components";
import { useQuery } from "components/TicketDetails/sections/Details/Details.section";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClients, getUserById } from "store";
import { SearchableField } from ".";

export const Status = () => {
  const { clients, user } = useSelector((state) => state?.users);
  const query = useQuery();
  const clientId = query.get("client");
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch();

  const filtered = useMemo(() => {
    const clientList = clients?.filter((client) => client?.isDeleted === false);
    return clientList?.filter((client) => !client.parentID && client.fullName != null)
  }, [clients])

  useEffect(() => {
    (async () => {
      await dispatch(getClients());
    })();

    if (clientId) {
      dispatch(getUserById(clientId, true))
    }
  }, []);

  return (
    <div className="p-[32px] bg-[#000000] rounded-[8px]">
      <SearchableField
        name="assignedToClientId"
        label="Client"
        placeholder="Search Client"
        data={filtered}
        defaultValue={clientId ? user?.fullName : ""}
      />
      <Input
        name="paymentType"
        placeholder="Payment Type"
        type="select"
        label="Payment Type"
        optionFilterProp="children"
        className="mb-[20px]"
        options={[
          { label: "One Time", value: 0 },
          { label: "Recurring", value: 1 },
        ]}
      />
      <Input
        name="billingCycle"
        placeholder="Billing Cycle"
        type="select"
        label="Billing Cycle"
        options={[
          { label: "Hourly", value: 0 },
          { label: "Monthly", value: 1 },
          { label: "Quarterly", value: 2 },
          { label: "SemiAnnually", value: 3 },
          { label: "Annually", value: 4 },
          { label: "Biennially", value: 5 },
          { label: "Triennially", value: 6 },
        ]}
      />
    </div>
  );
};
