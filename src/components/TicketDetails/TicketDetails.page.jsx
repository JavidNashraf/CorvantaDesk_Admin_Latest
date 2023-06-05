import { Details, RelatedList } from "./sections";

export const TicketDetailsComponent = () => {
  return (
    <div className="p-[40px] flex flex-col gap-[30px] overflow-hidden">
      <RelatedList />
      <Details />
    </div>
  );
};
