import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import { getTicketsByAdminID } from 'store';
import { Spin } from 'antd';
import { getDepartments } from 'store';
import { useNavigate } from 'react-router-dom';

export function Tickets() {
  const dispatch = useDispatch();
  const { t } = useTranslation('/Tickets/ns');

  const navigate = useNavigate();

  const { user } = useSelector((state) => state?.auth);
  const { tickets, loading } = useSelector((state) => state?.tickets);
  const { departments } = useSelector((state) => state?.departments);
  const departmentLoading = useSelector((state) => state?.departments?.loading);
  useEffect(() => {
    dispatch(getTicketsByAdminID({ id: user?.id }));
    dispatch(getDepartments());
  }, []);

  const ticketsWithDepartmentName = tickets?.map((ticket) => ({
    ...ticket,
    departmentName: departments?.filter(
      (dept) => dept?.id === ticket?.departmentId
    )[0]?.name,
  }));

  const finalTickets = ticketsWithDepartmentName?.filter(
    (ticket) => ticket?.departmentName !== undefined
  );

  const totalTickets = finalTickets?.length;
  const counts = {};
  finalTickets?.forEach(function (x) {
    counts[x?.departmentName] = (counts[x?.departmentName] || 0) + 1;
  });

  const listToDisplay = Object?.keys(counts)?.map((name) => {
    return {
      name,
      percentage: `${((counts[name] / totalTickets) * 100).toFixed(2)}%`,
      percent: (counts[name] / totalTickets) * 100,
    };
  });

  const chartData = listToDisplay?.map((el, idx) => {
    return [
      {
        name: 'Un-Assigned',
        value: 100 - el?.percent,
      },
      {
        name: 'Assigned',
        value: el?.percent,
      },
    ];
  });

  let minusValue = 0;

  return (
    <div className="ticket-card">
      <Spin spinning={loading || departmentLoading}>
        <div className="ticket-card__header">
          <h3 className="ticket-card__header-heading">{t('heading')}</h3>
          <p className="ticket-card__header-text">{t('desc')}</p>
        </div>
        <div className="ticket-card__inner">
          <div className="ticket-card__inner-left">
            {listToDisplay?.length ? (
              listToDisplay?.map(({ name, percentage }, idx) => {
                return (
                  <div className="ticket-card__inner-left-text">
                    <h3
                      className="ticket-card__inner-left-text-heading cursor-pointer"
                      style={{ color: idx % 2 === 0 ? '#0BB783' : '#3699FF' }}
                      onClick={() => {
                        navigate(
                          `/admin/dashboard/support/tickets/by-departments/${
                            departments?.find((dept) => dept?.name === name)?.id
                          }`,
                          {
                            state: {
                              activeDepartment: name,
                            },
                          }
                        );
                      }}
                    >
                      {name}
                    </h3>
                    <p className="ticket-card__inner-left-text-txt">
                      {percentage}
                    </p>
                  </div>
                );
              })
            ) : (
              <h6 className="text-white">No Data To Display...</h6>
            )}
          </div>
          <div
            className="ticket-card__inner-right"
            style={{ color: '#FFFFFF' }}
          >
            {chartData?.length ? (
              <PieChart width={250} height={250}>
                {chartData?.map((el, idx) => {
                  const outerRadius = 120 + minusValue;
                  const innerRadius = 104 + minusValue;
                  minusValue = minusValue - 25;
                  return (
                    <Pie
                      key={`chart-ticket-${idx}-assigned-${idx}`}
                      data={el}
                      dataKey="value"
                      stroke="none"
                      outerRadius={outerRadius}
                      innerRadius={innerRadius}
                      endAngle={450}
                      startAngle={80}
                      paddingAngle={-10}
                    >
                      <Cell fill="#151521" />
                      <Cell
                        fill={idx % 2 === 0 ? '#0BB783' : '#3699FF'}
                        cornerRadius={10}
                      />
                    </Pie>
                  );
                })}
                {/* <Pie
                  data={d1}
                  dataKey="value"
                  stroke="none"
                  outerRadius={120}
                  innerRadius={104}
                  endAngle={450}
                  startAngle={80}
                  paddingAngle={-10}
                >
                  <Cell fill="#151521" />
                  <Cell fill="#0BB783" cornerRadius={10} />
                </Pie>
                <Pie
                  data={d2}
                  dataKey="value"
                  stroke="none"
                  outerRadius={94}
                  innerRadius={78}
                  endAngle={450}
                  startAngle={80}
                  paddingAngle={-10}
                >
                  <Cell fill="#151521" />
                  <Cell fill="#3699FF" cornerRadius={10} />
                </Pie>
                <Pie
                  data={d3}
                  dataKey="value"
                  stroke="none"
                  outerRadius={68}
                  innerRadius={52}
                  endAngle={450}
                  startAngle={80}
                  paddingAngle={-10}
                >
                  <Cell fill="#151521" />
                  <Cell fill="#F64E60" cornerRadius={10} />
                </Pie>
                <Pie
                  data={d4}
                  dataKey="value"
                  stroke="none"
                  outerRadius={42}
                  innerRadius={26}
                  endAngle={450}
                  startAngle={80}
                  paddingAngle={-10}
                >
                  <Cell fill="#151521" />
                  <Cell fill="#8950FC" cornerRadius={10} />
                </Pie> */}
              </PieChart>
            ) : null}
          </div>
        </div>
      </Spin>
    </div>
  );
}
