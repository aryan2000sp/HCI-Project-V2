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
  // const d = new Date();
  const date = `1`;

  // Get the data from the indexedDB
  const dayCountTx = db.transaction("DayCount", "readonly");
  const dayCountStore = dayCountTx.objectStore("DayCount");
  const dayData = await dayCountStore.get(date);
  const chartData = [dayData.Protein, dayData.Carbohyrate, dayData.Fat];
  dayCountTx.done;
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
      title: {
        display: true,
        text: "Today Macronutrient Count",
        position: "top",
        padding: {
          bottom: 20,
        },
        font: {
          size: 24,
        },
      },

      legend: {
        position: "right",
        align: "center",

        labels: {
          boxWidth: 22,
          font: {
            size: 22,
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
  const chart = new Chart($("#macro-nutrients-chart"), config);
  return chart;
};
