import React from 'react';
import { DashboardLayout } from 'layout';
import { useMediaQuery } from 'react-responsive';
import { Tickets, Orders, IncomeOverview, IncomeForecast } from 'modules';
import './Home.styles.scss';

function Home() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1400px)',
  });

  return (
    <DashboardLayout>
      <div className="p-4 md:px-6 dashboard">
        <Tickets />
        <Orders />
        {isDesktopOrLaptop && <div />}
        <IncomeOverview />
        <IncomeForecast />
        {isDesktopOrLaptop && <div />}
      </div>
    </DashboardLayout>
  );
}
export default Home;
