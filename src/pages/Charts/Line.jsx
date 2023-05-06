import React from 'react';

import { ChartsHeader, LineChart } from '../../components';

const Line = () => (
  <div className='mt-24'>
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="Line" title="Inflation Rate" />
      <div className="w-full" dir="ltr">
        <LineChart/>
      </div>
    </div>
  </div>
);

export default Line;
