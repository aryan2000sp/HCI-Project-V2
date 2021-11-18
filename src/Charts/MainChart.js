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

export const createMainChart = async (db) => {
  // Get todays date
  const d = new Date();
  const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  // Get the data from the indexedDB
  const dayCountTx = db.transaction("DayCount", "readonly");
  const dayCountStore = dayCountTx.objectStore("DayCount");

  const dayData = await dayCountStore.get(date);
  const chartData = [dayData.Protein, dayData.Carbohyrate, dayData.Fat];

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
        data: chartData,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      subtitle: {
        display: true,
        text: "Custom Chart Subtitle",
        position: "bottom",
        padding: 20,
        font: {
          size: 24,
        },
      },
    },
  };

  const config = {
    type: "pie",
    data: data,
    options: options,
  };
  const chart = new Chart($("#macro-nutrients-chart"), config);
  return chart;
};
