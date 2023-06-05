import React, { useEffect, useState } from 'react';

import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';
import './style.scss';
import { getIncomeOverview, getInvoiceOverview } from 'store/Actions/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const income = false;
export function IncomeOverview() {
  const { t } = useTranslation('/IncomeOverview/ns');
  const { incomeOverview } = useSelector((state) => state?.incomeOverview);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()


  useEffect(() => {
    dispatch(getIncomeOverview());
  }, []);

  useEffect(() => {
    if (incomeOverview) {
      let dataArr = [];
      const incomes = incomeOverview?.income
      const refunds = incomeOverview?.refund
      if (incomes) {
        let count = 0
        for (let income of incomes) {
          let obj = {}
          for (const [key, value] of Object.entries(income)) {
            obj = {
              name: key,
              income: value,
              refunds: refunds?.[count]?.[key] ? refunds[count][key] : 0,
              xAxis:"Income/Refunds",
            }
          }
          dataArr.push(obj)
          count++
        }
      }
      setData(dataArr);
    }
  }, [incomeOverview]);

  
  return (
    <div className="income-overview">
      <div className="income-overview__header">
        <button className="income-overview__header-heading"
          onClick={() => {
            navigate(
              `/admin/dashboard/billing/orders/incomeOverview/details`)
          }}>{t('title')}

        </button>
        <p className="income-overview__header-text">{t('desc')}</p>
      </div>
      {!income ? (
        <>
          <div className="income-overview__chart">
            <ResponsiveContainer width="100%" height={150}>
              <LineChart
                width={500}
                height={150}
                data={data}
                margin={{ top: 0, right: -5, bottom: 0, left: -5 }}
              >
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#FFA800"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="refunds"
                  stroke="#F64E60"
                  strokeWidth={3}
                  dot={false}
                />
                <XAxis
                      height={20}
                       dataKey="xAxis"
                      // tickFormatter={(text) => moment(text)?.format("MMM-YYYY")}
                      strokeDasharray="3 3"
                      stroke="#323248"
                      tick={{ fill: "#474761" }}
                    />
                    <YAxis
                      width={50}
                      strokeDasharray="3 3"
                      stroke="#323248"
                      tick={{ fill: "#474761" }}
                    />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="income-overview__card">
            <div
              className="income-overview__card-inner"
              style={{ background: '#392F28 0% 0% no-repeat padding-box' }}
            >
              <div className="income-overview__card-inner-icon">
                <img src="/icon/coin-yellow.svg" alt="" />
                <img src="/icon/vuesax-bulk-coin-blue.svg" />
              </div>
              <div
                className="income-overview__card-inner-text"
                style={{ color: '#FFA800' }}
              >
                {t('yi')}
              </div>
            </div>
            <div
              className="income-overview__card-inner"
              style={{ background: '#3A2434 0% 0% no-repeat padding-box' }}
            >
              <div className="income-overview__card-inner-icon">
                <img src="/icon/coin-red.svg" alt="" />
                <img src="/icon/vuesax-bulk-coin-red.svg" />
              </div>
              <div
                className="income-overview__card-inner-text"
                style={{ color: '#F64E60' }}
              >
                {t('yr')}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-white p-[20px] text-center">
          No Data Available Yet!
        </div>
      )}
    </div>
  );
}
