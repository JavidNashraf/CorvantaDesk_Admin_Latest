import { Switch } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unAssignDepartmentByUserId } from 'store';
import { assignDepartmentByUserId } from 'store';

const DepartmentSelector = ({ name, value, checked }) => {
  const [loading, setLoading] = useState(false);
  const [checkValue, setCheckValue] = useState(checked);
  const { id } = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  return (
    <div className="flex justify-between items-center">
      <div className="text-[rgb(146,_146,_143)] text-[12px]">{name}</div>
      <Switch
        loading={loading}
        onChange={async () => {
          setLoading(true);
          if (!checkValue) {
            await dispatch(
              assignDepartmentByUserId({
                data: { userId: id, departmentId: value },
              })
            );
            setCheckValue(true);
          } else {
            await dispatch(
              unAssignDepartmentByUserId({
                data: { userId: id, departmentId: value },
              })
            );
            setCheckValue(false);
          }
          setLoading(false);
        }}
        checked={checkValue}
      />
    </div>
  );
};

export const Departments = ({ showDepartments }) => {
  // const { id } = useSelector((state) => state?.auth?.user);
  const { userDepartments } = useSelector((state) => state?.departments);

  return (
    <div
      className={`w-[278px] bg-[#000000] shadow-lg ${
        showDepartments ? '' : 'hidden'
      } rounded-lg text-gray-300`}
      style={{
        position: 'absolute',
        top: '214px',
        left: '-200px',
        zIndex: 4,
      }}
    >
      {/* Heading */}
      <div className="p-[20px] border-b-[1px] border-b-[#323248] cursor-auto text-white text-[14px]">
        Departments
      </div>
      <div className="p-[20px] flex flex-col gap-[20px]">
        {userDepartments?.map((department, idx) => {
          return (
            <DepartmentSelector
              key={`department-${idx}-${idx}1`}
              name={department?.departmentName}
              value={department?.departmentId}
              checked={department?.isAssign}
            />
          );
        })}
        {/* <DepartmentSelector name="Department 1" value="2876ajsy1=21ejd" />
        <DepartmentSelector name="Department 2" value="2876ajsy1=21ejd" />
        <DepartmentSelector name="Department 3" value="2876ajsy1=21ejd" />
        <DepartmentSelector name="Department 4" value="2876ajsy1=21ejd" />
        <DepartmentSelector name="Department 5" value="2876ajsy1=21ejd" />
        <DepartmentSelector name="Department 6" value="2876ajsy1=21ejd" /> */}
      </div>
    </div>
  );
};
