import { List } from 'components';
import { Basket, User } from 'icons';

let data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    icon: i % 2 === 0 ? <Basket /> : <User />,
    title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    created: 'Created 3 Hours Ago - February 5th, 2022 at 5:30 PM',
  });
}

export const EventsLogs = () => {
  return (
    <div className="mt-[20px] p-[32px] bg-[#000000] rounded-[8px]">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-[32px]">
        <h6 className="text-white text-[16px]">Events & Logs</h6>
        <button
          type="button"
          className="bg-[#212E48] rounded-[8px] px-[16px] py-[8px] text-[#3699FF]"
        >
          Download Report
        </button>
      </div>
      {/* List Section */}
      {data.length && (
        <div className="custom-list">
          <List
            data={data}
            renderFn={(item) => {
              return (
                <>
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#171723] rounded-[8px] p-[8px]">
                      {item?.icon}
                    </div>
                    <h6 className="text-white text-[14px]">{item?.title}</h6>
                  </div>
                  <div>
                    <p className="text-[#474761] text-[14px]">
                      {item?.created}
                    </p>
                  </div>
                </>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
