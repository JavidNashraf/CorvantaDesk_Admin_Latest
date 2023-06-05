import { useNavigate } from 'react-router-dom';
import { Button } from 'components';

export const Navigation = ({ current, setCurrent, navData }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#000000] p-[12px] rounded-[8px]">
      <div className="bg-[#08090A] p-[8px] rounded-[8px] flex items-center justify-between">
        <div className="pl-[32px] pt-[12px] pb-[12px] flex items-center gap-[40px]">
          {navData.map((nav) => (
            <button
              key={nav?.path}
              onClick={() => setCurrent(nav?.path)}
              className={`${
                current === nav?.path ? 'text-[#3699FF]' : 'text-[#6D6D80]'
              } text-[14px] transition-all hover:text-[#3699FF]`}
            >
              {nav?.label}
            </button>
          ))}
        </div>
        <Button
          onClick={() =>
            navigate('/admin/dashboard/knowledge-base/articles/add/new')
          }
        >
          Create New
        </Button>
      </div>
    </div>
  );
};
