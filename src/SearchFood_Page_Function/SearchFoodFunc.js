import {
  createChart,
  updateChartData,
  updateChartLabels,
  updateChartTitle,
} from "../Charts/SearchPageCharts";
const foodInfoChart = createChart("food-info-chart");
export const upadateSearchPage = async (db) => {
  // Create a function that will handle the state of the button based on the input state
  updateButtonState();

  // Create function for the search button is clicked
  searchFoodItems(db);
};

export const displaySearchPage = (db) => {};

const updateButtonState = () => {
  $("#search-bar").on("input", () => {
    if ($("#search-bar").val() === "") {
      $("#search-button").addClass("disabled");
    } else {
      $("#search-button").removeClass("disabled");
    }
  });
};

const searchFoodItems = (db) => {
  $("#search-button").on("click", async () => {
    $("#food-list").empty();
    const foodName = $("#search-bar").val();
    const foodData = await db.getAll("FoodData");
    const filteredData = foodData.filter((singleData) => {
      const { name } = singleData;
      if (name.includes(foodName.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    });

    // Create a function that will display the data in the list
    displayList(filteredData, db);
  });
};

const displayList = (data, db) => {
  if (data.length) {
    data.map((singleData) => {
      const { name, id } = singleData;
      $("#food-list").append(`
      <li id="${id}-list-item" class="list-group-item custom-list-item">
      <p class="small-para" style="text-transform:capitalize">${name}</p>
      </li>
      `);
    });

    // Add an event to all the list items
    $(".list-group-item").on("click", async function () {
      // Add a class to the list item
      $(this).addClass("selected-item");

      const key = parseInt($(this).attr("id").match(/\d+/));

      // Get the data from the food data
      const data = await db.get("FoodData", key);

      // Empty all the options in select
      $(".form-select").empty();
      console.log($("#quantity-value").val());
      // This method will show the info of the food selected
      showFoodInfo(data);
    });
  } else {
    $("#food-list").append(`
      <p>Not Found</p>
    `);
  }
};

const showFoodInfo = (foodData) => {
  const { name, serving } = foodData;
  $("#food-name").text(name);
  $("#quantity-value").val("1");
  // Enable all the controls in the food info tab
  $(".food-input-row button").removeClass("disabled");
  // $("#increase-btn").removeClass("disabled");
  $(".food-input-row select").removeAttr("disabled");
  $(".food-input-row input").removeAttr("disabled").removeClass("disabled");

  // Add all the options for the food serving
  serving.map((singleServing, index) => {
    const { size } = singleServing;
    $(".form-select").append(`
      <option value=${index}>${size}</option>
    `);
  });

  $(".form-select option:nth-child(1)").attr("selected", "selected");

  // Show the chart.
  const { data } = serving[0];
  const foodMacroData = [data[1].Protein, data[2].Carbohyrate, data[3].Fat];
  $("#food-info-chart").css("display", "block");
  updateChartData("food-info-chart", foodMacroData);
  const newLabels = [
    `Protein (${foodMacroData[0]}g)`,
    `Carb (${foodMacroData[1]}g)`,
    `Fat (${foodMacroData[2]}g)`,
  ];
  updateChartLabels("food-info-chart", newLabels);
  updateChartTitle(
    "food-info-chart",
    `Total Calories: ${data[0].Calories} cal`
  );

  // Add event listeners to the buttons and the dropdown in the form
  updateFoodInfoData(foodData, "food-info-chart");
};

const updateFoodInfoData = (foodData, chartID) => {
  const { serving } = foodData;

  // When the user updates data from the select options
  $(".form-select").on("change", function () {
    const optionSelected = parseInt($(".form-select > option:selected").val());
    const { data } = serving[optionSelected];
    const foodMacroData = [data[1].Protein, data[2].Carbohyrate, data[3].Fat];
    updateChartData(chartID, foodMacroData);
    const newLabels = [
      `Protein (${foodMacroData[0]}g)`,
      `Carbs (${foodMacroData[1]}g)`,
      `Fat (${foodMacroData[2]}g)`,
    ];
    updateChartLabels(chartID, newLabels);
    updateChartTitle(chartID, `Total Calories: ${data[0].Calories} cal`);
  });

  // Keep the decrease button disabled if the value is less than 0.5
  $("#quantity-value").on("change", function () {
    // console.log($(this).val());
    if (parseFloat($(this).val()) <= 0.5) {
      // console.log("hello");
      $("#decrease-btn").addClass("disabled");
    } else {
      $("#decrease-btn").removeClass("disabled");
    }
  });

  // Add event click listener to decrease button
  $("#decrease-btn").on("click", function () {
    // Decrease the value of the input by 0.5
    const prevValue = parseFloat($("#quantity-value").val());
    console.log(prevValue);
    $("#quantity-value").val(`${prevValue - 0.5}`);

    // Disable the button if the value is less than or equal to 0.5
    // console.log($("#quantity-value").val());
    if (parseFloat($("#quantity-value").val()) <= 0.5) {
      $(this).addClass("disabled");
    }

    showUpdatedChart(chartID, foodData);
  });

  // Add event click listener to increase button
  $("#increase-btn").on("click", function () {
    const prevValue = parseFloat($("#quantity-value").val());
    console.log(prevValue);
    $("#quantity-value").val(`${prevValue + 0.5}`);

    if (parseFloat($("#quantity-value").val()) >= 1) {
      $("#decrease-btn").removeClass("disabled");
    }
    showUpdatedChart(chartID, foodData);
  });

  // Create a focusout event listener for the number input
  $("#quantity-value").on("focusout", function () {
    if (parseFloat($(this).val()) < 0.5) {
      $(this).val(`0.5`);
    }
    if ($(this).val() === "") {
      $(this).val(`1`);
    }

    showUpdatedChart(chartID, foodData);
  });
};

const showUpdatedChart = (chartID, foodData) => {
  const { serving } = foodData;
  const quantity = parseFloat($("#quantity-value").val());
  const optionSelected = parseInt($(".form-select > option:selected").val());
  const { data } = serving[optionSelected];
  const foodMacroData = [
    data[1].Protein * quantity,
    data[2].Carbohyrate * quantity,
    data[3].Fat * quantity,
  ];
  updateChartData(chartID, foodMacroData);
  const newLabels = [
    `Protein (${foodMacroData[0]}g)`,
    `Carb (${foodMacroData[1]}g)`,
    `Fat (${foodMacroData[2]}g)`,
  ];
  updateChartLabels(chartID, newLabels);
  updateChartTitle(
    chartID,
    `Total Calories: ${data[0].Calories * quantity} cal`
  );
};
