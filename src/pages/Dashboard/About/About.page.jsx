import { DashboardLayout } from 'layout';
import React from 'react';

function About() {
  return (
    <DashboardLayout hide>
      <div className="bg-black/[.2] p-4 md:px-6">
        <h2 className="text-xl font-normal text-white">About</h2>
      </div>
    </DashboardLayout>
  );
}

export default About;
