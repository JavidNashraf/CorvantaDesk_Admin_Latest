import React from 'react';
import { DashboardLayout } from 'layout';
import { useMediaQuery } from 'react-responsive';
import { InvoiceOverviewList } from 'modules/IncomeOverview/IncomeOverviewDetails';
// import './Home.styles.scss';

const IncomeOverview = () => {

  return (
    <DashboardLayout>
       <div className=" bg-[#1A1A27]  px-[40px] py-[5px] md:px-[40px] flex items-center gap-5">
        <h2 className="text-xl  font-normal text-white">Income Overview</h2>
        <div className='h-5 w-[1px] bg-[#323248]'> </div>
        < h6 className="text-white text-[12px]">
        <a className='text-[#FFFFFF]'> Dashboard -</a> 
        <span>IncomeOverview</span>
        </h6> 
       </div>
      <div className="">
    <InvoiceOverviewList/>
      </div>
    </DashboardLayout>
  );
};
export default IncomeOverview;