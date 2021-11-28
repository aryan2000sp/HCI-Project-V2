import {
  createChart,
  updateChartData,
  updateChartLabels,
  updateChartTitle,
} from "../Charts/SearchPageCharts";

import { Toast } from "bootstrap";
const foodInfoChart = createChart("food-info-chart");
export const upadateSearchPage = async (db) => {
  // Create a new toast object
  const toast = new Toast($("#liveToast"));

  // Create a function that will handle the state of the button based on the input state
  updateButtonState();

  // Create function for the search button is clicked
  searchFoodItems(db);

  addFoodEvent(db, toast);

  favouriteFoodEvent(db, toast);
};

export const displaySearchPage = (db) => {
  // Add a function that will display for which timing the food is being searched for
  displaySearchTitle();

  displayFavouriteCarousel(db);
};

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
  $("#add-food-info").removeClass("disabled");
  $("#add-food-favourite").removeClass("disabled");
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

// Create a function that will add event listener to add food button
const addFoodEvent = (db, toast) => {
  const foodCategory = localStorage.getItem("page");

  console.log(foodCategory);
  $("#add-food-info").on("click", async function () {
    // First all the values from the options and text input
    const quantity = $("#quantity-value").val();
    const selectedServingIndex = $("#serving-select > option:selected").val();

    // Get the selected items key
    const key = parseInt($(".selected-item").attr("id").match(/\d+/));
    const foodData = await db.get("FoodData", key);
    const { serving } = foodData;
    const servingSelected = serving[selectedServingIndex];

    const newFoodData = {
      ...foodData,
      quantity: quantity,
      servingSelected: servingSelected,
    };

    // Get the previous DayCount data
    const dayCount = await db.get("DayCount", "1");
    const { Calories, Protein, Carbohyrate, Fat } = dayCount;
    const { data } = serving[selectedServingIndex];
    const totalCal = data[0].Calories * quantity + Calories;
    const totalProtein = data[1].Protein * quantity + Protein;
    const totalCarb = data[2].Carbohyrate * quantity + Carbohyrate;
    const totalFat = data[3].Fat * quantity + Fat;

    // Add new data to the dayCount db
    await db.put("DayCount", {
      ...dayCount,
      Calories: totalCal,
      Protein: totalProtein,
      Carbohyrate: totalCarb,
      Fat: totalFat,
    });

    if (foodCategory === "breakfast") {
      await db.put("BreakFast", newFoodData);
      $("#food-feedback-message").text("Item Added to Breakfast");
    } else if (foodCategory === "lunch") {
      await db.put("Lunch", newFoodData);
      $("#food-feedback-message").text("Item Added to Lunch");
    } else if (foodCategory === "dinner") {
      await db.put("Dinner", newFoodData);
      $("#food-feedback-message").text("Item Added to Dinner");
    } else if (foodCategory === "snack") {
      await db.put("Snack", newFoodData);
      $("#food-feedback-message").text("Item Added to Snack");
    }

    // Show the toast
    toast.show();
  });
};

const displaySearchTitle = () => {
  $(".food-timing-category").text(localStorage.getItem("page"));
};

// Create a function that will add event to Favourite button
const favouriteFoodEvent = (db, toast) => {
  const foodCategory = localStorage.getItem("page");

  $("#add-food-favourite").on("click", async function () {
    // First all the values from the options and text input
    const quantity = $("#quantity-value").val();
    const selectedServingIndex = $("#serving-select > option:selected").val();

    // Get the selected items key and food item
    const key = parseInt($(".selected-item").attr("id").match(/\d+/));
    const foodData = await db.get("FoodData", key);
    const { serving } = foodData;
    const servingSelected = serving[selectedServingIndex];

    const newFoodData = {
      ...foodData,
      quantity: quantity,
      servingSelected: servingSelected,
    };

    await db.put("Favourite", newFoodData);
    $("#food-feedback-message").text("Item Added to Favourites");
    toast.show();
  });
};

// Create a function that will display all the carousel items
const displayFavouriteCarousel = async (db) => {
  const favouriteFoodCount = await db.count("Favourite");
  if (favouriteFoodCount === 0) {
    // Hide the carousel
    $("#favourite-food-carousel").css("display", "none");
    $(".favourite-section-main").append(
      `<p class="bold">NO FAVOURITE FOOD ADDED<p>`
    );
  } else {
    // Show the carousel
    $("#favourite-food-carousel").css("display", "block");

    // Get the favourite food data
    const foodData = await db.getAll("Favourite");

    // Display all the carousels
    displayCarouselItem("favourite-carousel-inner", foodData);
  }
};

const displayCarouselItem = (carouselName, foodData) => {
  // Map through the data
  foodData.map((singleData, index) => {
    const { id, name, serving } = singleData;

    $(`#${carouselName}`).append(`
      <div class="carousel-item ${
        index === 0 ? "active" : ""
      } custom-carousel-item">
        <article class="favourite-food-col favourite-food-col-1">
          <h3 style="text-transform: capitalize;" class="bold">${name}</h3>

          <section class="favourite-food-input">
          <p>Quantity:</p>
          <div>

              <button
              type="button"
              class="btn btn-primary light-theme-btn"
              id="decrease-btn"
              >
                -
              </button>
              <input 
                class="form-control"
                type="number"
                placeholder="0"
                aria-label="default input example"
                value="1"
                id="${id}-quantity-value-fav"
                min="0.5"          
              />
              <button
                type="button"
                class="btn btn-primary light-theme-btn"
                id="increase-btn"
              >
                +
              </button>
            </div>
          </section>

          <section class="favourite-food-input">
          <p>Serving:</p>
          <select
            class="form-select"
            aria-label="Default select example"
            id="${id}-serving-select-fav"
          ></select>  
        </section>
        </article>
        <article class="favourite-food-col favourite-food-col-2">
          <canvas id="${id}-chart-fav"></canvas>
        </article>
      </div>
    `);

    addOptions(`${id}-serving-select-fav`, serving);
    // Create a new chart in here with some data in it
  });
};

// Create a function that will add options to select
const addOptions = (selectName, data) => {
  data.map((singleData, index) => {
    const { size } = singleData;
    $(`#${selectName}`).append(`
      <option value=${index}>
        ${size}
      </option>
    `);
  });

  $(`#${selectName} option:nth-child(1)`).attr("selected", "selected");
};
