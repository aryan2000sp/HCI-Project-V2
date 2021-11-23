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

const labels = ["Protein", "Carbohydrate", "Fat"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      //   borderColor: ["rgb(150, 25, 25)", "rgb(25, 150, 25)", "rgb(25, 25, 150)"],
      data: [],
    },
  ],
};

const options = {
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "",
      position: "bottom",
      font: {
        weight: "bold",
        size: 20,
      },
    },
    legend: {
      position: "right",
      align: "left",

      labels: {
        boxWidth: 15,
        font: {
          size: 15,
        },
      },
    },
  },
};

const config = {
  type: "pie",
  data: data,
  options: options,
};

// Create method that will create new pie chart
export const createChart = (chartID) => {
  const canvas = $(`#${chartID}`);
  const chart = new Chart(canvas, config);
  canvas.data("chart", chart);
  return chart;
};

// Create a method that will update the chart
export const updateChartData = (chartID, newData) => {
  const chart = $(`#${chartID}`).data("chart");
  chart.data.datasets[0].data = newData;
  chart.update();
};

export const updateChartLabels = (chartID, newData) => {
  const chart = $(`#${chartID}`).data("chart");
  chart.data.labels = newData;
  chart.update();
};

export const updateChartTitle = (chartID, newData) => {
  const chart = $(`#${chartID}`).data("chart");
  chart.options.plugins.title.text = newData;
  chart.update();
};
