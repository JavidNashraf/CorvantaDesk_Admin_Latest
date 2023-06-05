import { List } from 'components';
import { useSelector } from 'react-redux';
import './Users.styles.scss';

const Info = ({ fullName }) => {
  return (
    <div className="flex items-center gap-[12px] pb-[20px] border-b-[#323248] border-dashed border-b-[1px]">
      <div className="bg-[#171723] h-[45px] w-[45px] flex items-center justify-center rounded-[8px] text-[20px] text-[#0BB783] font-medium">
        {fullName.substring(0, 1)}
      </div>
      <div className="flex flex-col gap-[4px]">
        <div className="text-[16px] text-white">{fullName}</div>
        {/* <div className="text-[14px] text-[#474761]">${amount}</div> */}
      </div>
    </div>
  );
};

let data = [];
for (let i = 0; i <= 10; i++) {
  data.push({
    name: `Paul ${i}`,
    amount: i + 30,
  });
}

export const Users = () => {
  const { specificUsers, loading } = useSelector((state) => state?.users);
  return (
    <>
      <h6 className="text-white my-[32px] text-[16px]">
        Targeted Clients/Admins
      </h6>
      <div className="flex flex-col gap-[20px] mb-[20px] custom-users-list">
        <List
          grid={{ gutter: 0, column: 1 }}
          data={specificUsers}
          renderFn={(item) => <Info {...item} />}
          pageSize={5}
          loading={loading}
        />
        {/* <Info label="SMTP Configuration" value="Choose Configuration" />
        <Info label="Name" value="Paul Elliot" />
        <Info label="Email Address" value="paul@fakemail.com" /> */}
      </div>
    </>
  );
};
