import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import moment from "moment";
import { FilterCheck, FilterIndicator } from '../../components';
import { Button, DateRangePicker, Input } from "components";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { supportResponceTime } from 'store';

export const SupportResponseTime = () => {
  const [dataHolder, setDataHolder] = useState([])
  const [filter, setFilter] = useState("hourly");
  const [filters, setFilters] = useState({
    normal: true,
    byCustomer: true,
    byAgent: true,
    byEmail: true,
    linkedIP: true,
    byStatus: true,
    byDepartment: true,
  });
  const reportTypes = {
    normal: 0,
    byCustomer: 1,
    byAgent: 2,
    byEmail: 3,
    linkedIP: 4,
    byStatus: 5,
    byDepartment: 6
  }
  const initialValues = {
    duration: "hourly",
    dates: [moment(new Date()), moment(new Date())]
  };
  const validationSchema = Yup.object().shape({
    duration: Yup.string().required("Field is required!"),
  });

  let xAxis = []
  let filterObj = {}
  const dispatch = useDispatch();
  const { responceTime, loading } = useSelector((state) => state?.reports);
  useEffect(() => {
    if (responceTime && Object.keys(responceTime)?.length > 0) {
      for (let data in responceTime) {
        let obj = responceTime[data]?.find((items) => {
          const { filterBy } = items
          return filter?.toLowerCase() === filterBy?.toLowerCase()
        })
        const details = obj?.details || []
        let resultObj = {}
        for (let detail of details) {
          if (detail?.[filter] && !(xAxis.some((value) => value == detail[filter]))) {
            xAxis.push(detail[filter])
          }
          resultObj[`${detail[filter]}`] = detail?.["longTime"]
        }
        filterObj[data] = {
          ...resultObj,
        }
      }
    }
    let val = []
    for (let data of xAxis) {
      const result = {
        label: isNaN(data) ? data?.slice(0, 3) : `${data}`,
        normal: filterObj?.['normal']?.[`${data}`] || null,
        byCustomer: filterObj?.['byCustomer']?.[`${data}`] || null,
        byAgent: filterObj?.['byAgent']?.[`${data}`] || null,
        byEmail: filterObj?.['byEmail']?.[`${data}`] || null,
        linkedIP: filterObj?.['linkedIP']?.[`${data}`] || null,
        byStatus: filterObj?.['byStatus']?.[`${data}`] || null,
        byDepartment: filterObj?.['byDepartment']?.[`${data}`] || null,
      };
      val.push(result)
    }
    setDataHolder(val)
  }, [responceTime, filter])
  // Updated state
  const { appSettings } = useSelector((state) => state);
  const dateFormat = appSettings?.dateFormat;


  useEffect(() => {
    const startDate = moment(new Date()).format(localStorage.getItem('dateFormat'));
    const endDate = moment(new Date()).format(localStorage.getItem('dateFormat'));;
    for (let reportType in reportTypes) {
      dispatch(
        supportResponceTime({
          reportType: reportTypes[reportType],
          startDate,
          endDate,
        })
      );
    }
  }, [])

  const dropdownHandler = (data) => {
    setFilter(data)
  }

  const getLabel = ({ filterName }) => {
    switch (filterName) {
      case 'normal':
        return { label: "Tickets by Normal", color: "bg-[#5095fc]" };
      case 'byCustomer':
        return { label: "Tickets by Customer", color: "bg-[#FFA800]" };
      case 'byAgent':
        return { label: "Tickets by Agent", color: "bg-[#8950FC]" };
      case 'byEmail':
        return { label: "Tickets by Email", color: "bg-[#40956b]" };
      case 'linkedIP':
          return { label: "Tickets by LinkedIP", color: "bg-[#35de50]" };
      case 'byStatus':
        return { label: "Tickets by Status", color: "bg-[#bd589d]" };
      case 'byDepartment':
        return { label: "Tickets by Department", color: "bg-[#f10c37]" };
      default:
        return '';
    }
  };
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
          <div className="h-[52px] flex items-center justify-between">
            <div>
              <Formik
                onSubmit={async (values) => {
                  const startDate = moment(values?.dates[0]).format(localStorage.getItem('dateFormat'));
                  const endDate = moment(values?.dates[1]).format(localStorage.getItem('dateFormat'));
                  for (let reportType in reportTypes) {
                    await dispatch(
                      supportResponceTime({
                        reportType: reportTypes[reportType],
                        startDate,
                        endDate,
                      })
                    );
                  }
                }}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {() => {
                  return (
                    <Form className="flex items-center gap-[20px] ">
                      <div className="min-w-[350px]">
                        <DateRangePicker name="dates" />
                      </div>
                      <div className="flex gap-[12px] items-center">
                        <Input
                          className="min-w-[200px]"
                          type="select"
                          options={[
                            { label: "Hourly", value: "hourly" },
                            { label: "Day", value: "day" },
                            { label: "Monthly", value: "month" },
                            { label: "Year", value: "year" },
                          ]}
                          name="duration"
                          customOnChange={(e)=>{dropdownHandler(e.target.value)}}
                        />
                      </div>
                      <div>
                        <Button type="ghost" htmlType="submit">
                          Filter Data
                        </Button>
                      </div>
                    </Form>
                  )
                }}
              </Formik>
            </div>
            <div className="flex items-center gap-[20px]">
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
              {dataHolder?.length > 0 ? (
                <ResponsiveContainer width="100%" height={437}>
                  <BarChart
                    barSize={30}
                    barGap={3}
                    width={500}
                    height={300}
                    data={
                      dataHolder
                    }
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <XAxis
                      dataKey="label"
                      strokeDasharray="3 3"
                      stroke="#323248"
                      tick={{ fill: "#474761" }}
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
