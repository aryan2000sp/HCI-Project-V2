import { createSummaryChart } from "../Charts/SummaryChart";

export const displaySummaryPage = () => {
  // Create a chart for the monthly summary data
  createSummaryChart(
    "summary-chart-monthly",
    "Your Monthly Average Calories Intake",
    [1500, 1800, 1200, 1550, 1490, 2100, 2000, 1560, 1340, 1650, 1290, 1100],
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    "#FF6384"
  );

  // Create a chart for weekly data
  createSummaryChart(
    "summary-chart-weekly",
    "Your Calories Intake over the week",
    [1500, 2100, 1340, 1700, 1100, 1350, 2200],
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "#6384FF"
  );

  displayChartEvent();
};

// Create a function that will add events to list items
const displayChartEvent = () => {
  $("#weekly-chart-display").on("click", function () {
    // First hide the monthly chart
    $("#summary-chart-monthly").css("display", "none");

    // Show weekly chart
    $("#summary-chart-weekly").css("display", "block");

    // Activate this list item
    $(this).css("text-decoration", "underline");

    // Remove this class from other list item
    $("#monthly-chart-display").css("text-decoration", "none");
  });

  $("#monthly-chart-display").on("click", function () {
    // First hide the monthly chart
    $("#summary-chart-weekly").css("display", "none");

    // Show weekly chart
    $("#summary-chart-monthly").css("display", "block");

    // Activate this list item
    $(this).css("text-decoration", "underline");

    // Remove this class from other list item
    $("#weekly-chart-display").css("text-decoration", "none");
  });
};
