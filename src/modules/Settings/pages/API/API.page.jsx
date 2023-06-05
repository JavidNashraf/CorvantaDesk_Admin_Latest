import { APISettings, APIKeysList } from './section';

export default function API() {
  return (
    <div className="p-[40px]">
      <APISettings />
      <APIKeysList />
    </div>
  );
}
