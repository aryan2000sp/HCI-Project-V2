import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from "chart.js";

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);

// const labels = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

const data = {
  labels: [],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      //   borderColor: ["rgb(150, 25, 25)", "rgb(25, 150, 25)", "rgb(25, 25, 150)"],
      data: [1, 3, 7],
    },
  ],
};

const options = {
  animation: false,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "",
      position: "top",
      font: {
        weight: "bold",
        size: 20,
      },
    },
    legend: {
      display: false,
    },
  },
};

const config = {
  type: "bar",
  data: data,
  options: options,
};

export const createSummaryChart = (
  chartID,
  newTitleData,
  newChartData,
  newLabelData,
  colorCode
) => {
  const newDatasets = [
    {
      label: chartID,
      backgroundColor: [colorCode],

      data: newChartData,
    },
  ];

  const newTitle = {
    display: true,
    text: newTitleData,
    position: "top",
    align: "start",
    font: {
      weight: "bold",
      size: 18,
    },

    padding: {
      bottom: 30,
    },
  };

  const newOptions = {
    ...options,
    plugins: { ...options.plugins, title: newTitle },
  };

  const newData = { ...data, datasets: [...newDatasets], labels: newLabelData };
  const newConfig = { ...config, data: newData, options: newOptions };
  const canvas = $(`#${chartID}`);
  const chart = new Chart(canvas, newConfig);
  return chart;
};
