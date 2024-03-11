import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, LinearScale, PointElement, CategoryScale, LineElement, Filler, ArcElement, Legend, Tooltip } from 'chart.js';
import { lightOrange, lightPurple, orange, purple } from '../../../constants/color';
import { getLastSevenDays } from '../../../lib/features';

ChartJS.register(Tooltip, PointElement, CategoryScale, LinearScale, LineElement, Filler, ArcElement, Legend);

const lineChart = {
  responsive:true,
  plugins:{
    legend:{
      display:false
    },
    title:{
      display:false
    }
  },
  scales:{
    x:{
      display:true
    },
    y:{
     beginAtZero:true,
     grid:{
      display:false
     }
    }
  }
};

const labels = getLastSevenDays();

const LineChart = ({vlaue=[]}) => {

  const data = {
    labels,
    datasets: [{
      data: vlaue,
      label: 'Revenue',
      fill:true,
      backgroundColor:lightPurple,
      borderColor:purple,
    }]
  };

  return (
    <Line data={data} options={lineChart}/>
  )
};

const doughnutOptions = {
  responsive:true,
  plugins:{
    legend:{
      display:false
    },
  },
  cutout:120
}

const DoughnutChart = ({vlaue=[], labels=[]}) => {

  const data = {
    labels,
    datasets: [{
      data: vlaue,
      backgroundColor:[lightPurple, lightOrange],
      hoverBackgroundColor:[purple, orange],
      borderColor:[purple, orange],
      offset:30
    }]
  };


  return (
    <Doughnut style={{zIndex:"1"}} data={data} options={doughnutOptions}/>
  )
}

export {
  LineChart,
  DoughnutChart
}