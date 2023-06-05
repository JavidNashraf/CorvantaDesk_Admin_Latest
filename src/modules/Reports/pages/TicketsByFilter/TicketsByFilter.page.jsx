// import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import moment from "moment";
import { FilterCheck, FilterIndicator } from "../../components";
import { Button, DateRangePicker } from "components";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import {
  getReportsByCustomer,
  getReportsByAgent,
  getReportsByDepartment,
  getReportsByPriority,
  getReportsByStatus,
} from "store";

let dataHolder = [];
for (let i = 1; i <= 12; i++) {
  dataHolder.push({
    createdOn: moment(`${i}`, "M").format("MMM"),
    byCustomer: 400,
    byAgent: 300,
    byStatus: 200,
    byDepartment: 500,
    byPriority: 100,
  });
}

const getLabel = ({ filterName }) => {
  switch (filterName) {
    case "byCustomer":
      return { label: "Tickets by Customer", color: "bg-[#FFA800]" };
    case "byAgent":
      return { label: "Tickets by Agent", color: "bg-[#8950FC]" };
    case "byStatus":
      return { label: "Tickets by Status", color: "bg-[#53a739]" };
    case "byDepartment":
      return { label: "Tickets by Department", color: "bg-[#fc8c50]" };
    case "byPriority":
      return { label: "Tickets by Priority", color: "bg-[#5095fc]" };
    default:
      return "";
  }
};

export const TicketsByFilter = () => {
  const [filters, setFilters] = useState({
    byCustomer: true,
    byAgent: true,
    byStatus: false,
    byDepartment: false,
    byPriority: false,
  });

  const dispatch = useDispatch();
  const {
    reportsByCustomer,
    reportsByAgent,
    reportsByStatus,
    reportsByDepartment,
    reportsByPriority,
    loading,
  } = useSelector((state) => state?.reports);

  const [data, setData] = useState(null);

  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;


  useEffect(() => {
    let data = [];
    reportsByCustomer.forEach((report) => {
      data.push({
        createdOn: report?.createdOn,
        byCustomer: report?.count,
      });
    });
    reportsByAgent.forEach((report) => {
      data.push({
        createdOn: report?.createdOn,
        byAgent: report?.count,
      });
    });
    reportsByStatus.forEach((report) => {
      data.push({
        createdOn: report?.createdOn,
        byStatus: report?.count,
      });
    });
    reportsByPriority.forEach((report) => {
      data.push({
        createdOn: report?.createdOn,
        byPriority: report?.count,
      });
    });
    reportsByDepartment.forEach((report) => {
      data.push({
        createdOn: report?.createdOn,
        byDepartment: report?.count,
      });
    });
    setData(data);
  }, [
    reportsByCustomer,
    reportsByAgent,
    reportsByStatus,
    reportsByDepartment,
    reportsByPriority,
  ]);

  return (
    <div className="m-[40px] max-w-[1367px]">
      {/* Filters */}
      <div className="w-full p-[18px] bg-[#000000] rounded-[8px]">
        {Object.keys(filters).map((filter) => {
          return (
            <FilterCheck
              checked={filters?.[filter]}
              name={filter}
              label={getLabel({ filterName: filter })?.label}
              setFilters={setFilters}
            />
          );
        })}
      </div>
      {/* Chart */}
      <Spin spinning={loading}>
        <div className="bg-[#000000] p-[32px] mt-[40px] rounded-[8px]">
          {/* Filter Indicator */}
          <div className="h-[52px] flex items-center justify-between gap-[12px]">
            <div>
              <Formik
                onSubmit={async (values) => {
                  const startDate = moment(values?.dates[0]).toISOString();
                  const endDate = moment(values?.dates[1])?.toISOString();
                  await dispatch(
                    getReportsByCustomer({
                      startDate,
                      endDate,
                    })
                  );
                  await dispatch(
                    getReportsByAgent({
                      startDate,
                      endDate,
                    })
                  );
                  await dispatch(
                    getReportsByDepartment({
                      startDate,
                      endDate,
                    })
                  );
                  await dispatch(
                    getReportsByPriority({
                      startDate,
                      endDate,
                    })
                  );
                  await dispatch(
                    getReportsByStatus({
                      startDate,
                      endDate,
                    })
                  );
                }}
                initialValues={{ dates: "" }}
              >
                <Form className="flex items-center gap-[20px]">
                  <div className="min-w-[200px]">
                    <DateRangePicker name="dates" />
                  </div>
                  <div>
                    <Button type="ghost" htmlType="submit">
                      Filter Data
                    </Button>
                  </div>
                </Form>
              </Formik>
            </div>
            <div className="flex items-center gap-[20px] max-w-[800px]">
              {Object.keys(filters).map((filter, idx) => {
                return (
                  <>
                    {filters?.[filter] ? (
                      <FilterIndicator
                        title={getLabel({ filterName: filter })?.label}
                        bg={getLabel({ filterName: filter })?.color}
                      />
                    ) : null}
                  </>
                );
              })}
            </div>
          </div>
          {/* Chart Component */}
          <div className="mt-[32px]">
            {/* Heading */}
            <h5 className="text-[24px] text-white mb-[32px]">
              Support Response Time
            </h5>
            {/* Chart */}
            <div className="w-full">
              {true ? (
                <ResponsiveContainer width="100%" height={437}>
                  <BarChart
                    barSize={8}
                    barGap={1}
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <XAxis
                      dataKey="createdOn"
                      strokeDasharray="3 3"
                      stroke="#323248"
                      tick={{ fill: "#474761" }}
                      tickFormatter={(text) => moment(text)?.format(localStorage.getItem('dateFormat'))}
                    />
                    <YAxis
                      width={35}
                      strokeDasharray="3 3"
                      stroke="#323248"
                      tick={{ fill: "#474761" }}
                    />
                    {Object.keys(filters).map((filter, idx) => {
                      const color = getLabel({ filterName: filter })?.color;
                      const fillColor = color?.substring(4, 11);
                      return (
                        <Bar
                          dataKey={filter}
                          fill={fillColor}
                          hide={!filters?.[filter]}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center bg-[#08090A] rounded-[8px] text-white text-[16px]">
                  No Data Available
                </div>
              )}
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};
