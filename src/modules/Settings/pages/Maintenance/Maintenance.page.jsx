import { AdminMaintenance, ClientMaintenance } from './sections';

export default function Maintenance() {
  return (
    <div className="p-[40px]">
      <AdminMaintenance />
      <div className="mt-[20px]">
        <ClientMaintenance />
      </div>
    </div>
  );
}
