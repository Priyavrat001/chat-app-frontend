import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS } from "chart.js";

ChartJS.register(

)

const LineChart = () => {

    const data = {
        labels:["january", "febuary"],
        datasets:[]
    }

  return (
    <Line data={data}}/>
  )
}
const DonaldChart = () => {
  return (
    <div>Charts</div>
  )
}

export {
    LineChart,
    DonaldChart
}