import PropTypes from "prop-types";
import { Doughnut, Line } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { getLastSevenDays } from "../../../lib/features";

ChartJS.register(
  Tooltip,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Filler,
  ArcElement,
  Legend,
);

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#171a2b",
      padding: 12,
      displayColors: false,
      titleFont: { family: "Inter, sans-serif", weight: "600" },
      bodyFont: { family: "Inter, sans-serif" },
    },
  },
  interaction: { intersect: false, mode: "index" },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      border: { display: false },
      ticks: {
        color: "#9699aa",
        font: { family: "Inter, sans-serif", size: 11 },
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#f0f1f5", drawBorder: false },
      border: { display: false },
      ticks: {
        precision: 0,
        color: "#9699aa",
        font: { family: "Inter, sans-serif", size: 11 },
        padding: 10,
      },
    },
  },
};

const LineChart = ({ value = [], labels, label = "Messages", color = "#6258e8" }) => {
  const data = {
    labels: labels?.length ? labels : getLastSevenDays(),
    datasets: [
      {
        data: value,
        label,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(99,102,241,.12)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(99,102,241,.24)");
          gradient.addColorStop(1, "rgba(99,102,241,0)");
          return gradient;
        },
        borderColor: color,
        borderWidth: 3,
        tension: 0.38,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#fff",
        pointBorderColor: color,
        pointBorderWidth: 2,
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "76%",
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#171a2b",
      padding: 12,
      displayColors: true,
    },
  },
  borderWidth: 0,
  spacing: 4,
};

const DoughnutChart = ({ vlaue = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: vlaue,
        backgroundColor: ["#6258e8", "#f2a65a"],
        hoverBackgroundColor: ["#4f46d5", "#e8933d"],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  return <Doughnut data={data} options={doughnutOptions} />;
};

export { LineChart, DoughnutChart };

LineChart.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  color: PropTypes.string,
};

DoughnutChart.propTypes = {
  vlaue: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
};
