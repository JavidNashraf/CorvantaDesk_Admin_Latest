import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getIncomeForecast } from 'store/Actions/dashboard';

import './style.scss';

const income = true;

export function IncomeForecast() {

  const { t } = useTranslation('/IncomeForecast/ns');
  const dispatch = useDispatch();
  const { incomeForecast } = useSelector((state) => state?.incomeOverview);
  const [data, setData] = useState([]);
  useEffect(() => {
    dispatch(getIncomeForecast());
  }, []);

  useEffect(() => {
    if (incomeForecast) {
      let dataArr = [];
      let count = 0
      for (const [key, value] of Object.entries(incomeForecast)) {
       let obj = {
          id: count,
          text: key,
          price: value
        }
        dataArr.push(obj)
        count++
      }
      setData(dataArr);
    }
  }, [incomeForecast]
  );


  return (
    <div className="income-forecast">
      <div className="income-forecast__header">
        <div>
          <h3 className="income-forecast__header-heading">{t('title')}</h3>
          <p className="income-forecast__header-text">{t('desc')}</p>
        </div>
        {income ? (
          <div className="income-forecast__header-price"></div>
        ) : null}
      </div>
      <div className="income-forecast__box">
        {income ? (
          <ul className="income-forecast__box-list">
            {data.map(({ id, text, price }) => (
              <li key={id} className="income-forecast__box-list-item">
                <p className="income-forecast__box-list-item-txt">{text}</p>
                <p className="income-forecast__box-list-item-price">{price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-white p-[20px] text-center">
            No Data Available Yet!
          </div>
        )}
      </div>
    </div>
  );
}
