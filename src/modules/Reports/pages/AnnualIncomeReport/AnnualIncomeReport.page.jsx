import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import moment from "moment";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getAnnualReports } from "store";
import { Formik, Form } from "formik";
import { Spin } from "antd";
import { Button, Input } from "components";
import { FilterCheck, FilterIndicator } from '../../components';

export const AnnualIncomeReport = () => {
  const dispatch = useDispatch();
  const { annualReports, loading } = useSelector((state) => state?.reports);
  const [filters, setFilters] = useState({
    byCustomer: true,
    byAgent: true,
    byEmail: true
  });
  const [data, setData] = useState([]);
  let yearValue = [];
  const initialValues = {
    year: "2022",
  };
  const [selectedYear, setSelectedYear] = useState(initialValues);
  const validationSchema = Yup.object().shape({
    year: Yup.string().required("Year is required!"),
  });

  useEffect(() => {
    dispatch(getAnnualReports());
  }, []);

  useEffect(() => {
    if (Array.isArray(annualReports) && annualReports?.length > 0) {
      const selectedYearObj = annualReports?.find((data) => {
        return data?.year == selectedYear?.year
      })
      let val = []
      const montlyIncomes = selectedYearObj?.montlyIncomes || []
      for (let montlyIncome of montlyIncomes) {
        let resultObj = {}
        resultObj[`label`] = isNaN(montlyIncome?.['month']) ? montlyIncome['month']?.slice(0, 3) : `${montlyIncome['month']}` || null
        resultObj[`income`] = montlyIncome?.["income"] || null
        val.push(resultObj)
      }
      setData(val)
    }
  }, [annualReports, selectedYear])
  if (annualReports?.length) {
    annualReports?.forEach((years) => {
      yearValue.push({
        label: `${years?.year}`,
        values: `${years?.year}`,
      });
    });
  }
  const dropdownHandler = (data) => {
    setSelectedYear(data)
  }
  return (
    <div className="m-[40px] max-w-[1367px]">
      {/* Filters */}
      <div className="w-full p-[18px] bg-[#000000] rounded-[8px]">
        <FilterCheck
          checked={filters?.byCustomer}
          name="byCustomer"
          label=" By Products"
          setFilters={setFilters}
        />
        <FilterCheck
          checked={filters?.byAgent}
          name="byAgent"
          label=" By Department"
          setFilters={setFilters}
        />
      </div>

      {/* Chart */}
      <Spin spinning={loading}>
        <div className="bg-[#000000] p-[32px] mt-[40px] rounded-[8px]">
          {/* Filter Indicator */}
          <div className="h-[52px] flex items-center justify-between">
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(value) => dropdownHandler(value)}
              >
                {() => {
                  return (
                    <Form className="flex gap-[12px] items-center">
                      <Input
                        className="min-w-[200px]"
                        type="select"
                        options={yearValue}
                        name="year"
                      />
                      <Button type="ghost" htmlType="submit">
                        Filter
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            <div className="flex items-center gap-[20px]">
              {filters?.byCustomer && (
                <FilterIndicator title=" By Products" bg="bg-[#8950FC]" />
              )}
              {filters?.byAgent && (
                <FilterIndicator title="By Department" bg="bg-[#ffa800]" />
              )}
            </div>
          </div>
          {/* Chart Component */}
          <div className="mt-[32px]">
            {/* Heading */}
            <h5 className="text-[24px] text-white mb-[32px]">
              Annual Income Report
            </h5>
            {/* Chart */}
            <div className="w-full">
              {data?.length ? (
                <ResponsiveContainer width="100%" height={437}>
                  <BarChart
                    barSize={30}
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
                      dataKey="label"
                      // tickFormatter={(text) => moment(text)?.format("MMM-YYYY")}
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
                    <Bar dataKey="income" fill="#8950FC" />
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