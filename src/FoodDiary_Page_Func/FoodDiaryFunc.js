// This function will display the food diary page
import { Tooltip } from "bootstrap";
export const displayFoodDiary = async (db) => {
  // Get all the data from the indexedDB
  const breakfastData = await db.getAll("BreakFast");
  const lunchData = await db.getAll("Lunch");
  const dinnerData = await db.getAll("Dinner");
  const snackData = await db.getAll("Snack");

  // Initialize all the tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl);
  });

  if (breakfastData.length > 0) {
    // Display the table
    $("#breakfast-table-status").css("display", "none");
    await displayTables(db, breakfastData, "breakfast-table");
  } else {
    // just add no data
    $("#breakfast-table").css("display", "none");
    $("#breakfast-table-status")
      .css("display", "block")
      .append(`<p class="bold">NO DATA</p>`);
  }

  if (lunchData.length > 0) {
    // Display the table
    $("#lunch-table-status").css("display", "none");
    await displayTables(db, lunchData, "lunch-table");
  } else {
    // just add no data
    $("#lunch-table").css("display", "none");
    $("#lunch-table-status")
      .css("display", "block")
      .append(`<p class="bold">NO DATA</p>`);
  }

  if (dinnerData.length > 0) {
    // Display the table
    $("#dinner-table-status").css("display", "none");
    await displayTables(db, dinnerData, "dinner-table");
  } else {
    // just add no data
    $("#dinner-table").css("display", "none");
    $("#dinner-table-status")
      .css("display", "block")
      .append(`<p class="bold">NO DATA</p>`);
  }

  if (snackData.length > 0) {
    // Display the table
    $("#snack-table-status").css("display", "none");
    await displayTables(db, snackData, "snack-table");
  } else {
    // just add no data
    $("#snack-table").css("display", "none");
    $("#snack-table-status")
      .css("display", "block")
      .append(`<p class="bold">NO DATA</p>`);
  }

  likeButtonEvent(db);
  deleteButtonEvent(db);
  editButtonEvent(db);
  saveChangesButtonEvent(db);
  closeButtonEvent();
  searchPageRouting();
};

// This function will display tables of associted category
const displayTables = async (db, data, tableName) => {
  // Get the keys of liked foods
  const likedFoodKeys = await db.getAllKeys("Favourite");
  const likedColorCode = "#fb3958";
  const greyColorCode = "#A9A9A9";
  let tableChar = "a";
  if (tableName === "breakfast-table") {
    tableChar = "b";
  } else if (tableName === "lunch-table") {
    tableChar = "l";
  } else if (tableName === "dinner-table") {
    tableChar = "d";
  } else if (tableName === "snack-table") {
    tableChar = "s";
  }
  data.map((singleData) => {
    const { id, name, servingSelected, quantity } = singleData;
    const { data, size } = servingSelected;
    // Enable the displaying of the table

    $(`#${tableName} > tbody`).append(`
      <tr id="${id}-row-${tableChar}">
        <td>
          <article class="food-description">
            <section class="btn-section" id="btn-section">
              <svg fill="${
                likedFoodKeys.includes(id) ? likedColorCode : greyColorCode
              }" viewBox="0 0 30 30" width="25px" height="25px" id="${id}-like-button-${tableChar}" class="like-button">    <path d="M 9.5449219 4 C 5.9299219 4 3 6.9299219 3 10.544922 C 3 16.837321 10.298975 22.849799 13.708984 25.527344 A 2 2 0 0 0 13.71875 25.535156 C 13.742115 25.5535 13.773881 25.579629 13.796875 25.597656 L 13.798828 25.595703 A 2 2 0 0 0 15 26 A 2 2 0 0 0 16.203125 25.595703 L 16.203125 25.597656 C 16.209855 25.59238 16.219801 25.585381 16.226562 25.580078 C 16.231704 25.576045 16.23898 25.570455 16.244141 25.566406 A 2 2 0 0 0 16.263672 25.548828 C 19.663109 22.880904 27 16.852336 27 10.544922 C 27 6.9299219 24.070078 4 20.455078 4 C 17.000078 4 15 7 15 7 C 15 7 12.999922 4 9.5449219 4 z"/></svg>
              <div id="${id}-edit-button-${tableChar}" class="edit-button">
                <svg fill="#000000" viewBox="0 0 32 32" width="20px" height="20px"><path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"/></svg>
              </div>
              <div id="${id}-close-button-${tableChar}" class="close-button" style="display:none;">
                <svg fill="#000000" viewBox="0 0 50 50" width="25px" height="25px"><path d="M 14.40625 13 L 13 14.40625 L 23.625 25 L 13 35.59375 L 14.40625 37 L 25.0625 26.40625 L 35.6875 37 L 37.09375 35.59375 L 26.46875 25 L 37.09375 14.40625 L 35.6875 13 L 25.0625 23.59375 Z"/></svg>
              </div>
              <svg fill="#000000" viewBox="0 0 24 24" width="20px" height="20px" id="${id}-delete-button-${tableChar}" class="delete-button"><path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"/></svg>
            </section>
            <section class="food-info">
              <h4 class="bold" style="text-transform: capitalize;">${name}</h4>
              <p id="${id}-quantity-${tableChar}">Quantity: <span id="${id}-quantity-value-${tableChar}">${quantity}</span></p>
              <div class="quantity-input-section" id="${id}-quantity-section-${tableChar}" style="display:none">
                <p>Quantity: </p>
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
                      min="0.5"
                      id=${id}-quantity-input-${tableChar}
                    />
                    <button
                      type="button"
                      class="btn btn-primary light-theme-btn"
                      id="increase-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              <p id="${id}-selected-serving-${tableChar}">Serving: <span id="${id}-serving-value-${tableChar}">${size}</span></p>

              <div class="serving-input-section" id="${id}-serving-section-${tableChar}" style="display:none">
                <p>Serving:</p>
                <select
                  class="form-select"
                  aria-label="Default select example"
                  id=${id}-select-${tableChar}
                > 
                </select>
              </div>
              <button type="button" class="btn btn-primary light-theme-btn btn-sm" style="display:none" id="${id}-save-changes-${tableChar}" class="save-changes-button">
                Save Changes
              </button>
            </section>
          </article>
        </td>
        <td><p>${data[0].Calories * quantity}</p></td>
        <td><p>${data[1].Protein * quantity}</p></td>
        <td><p>${data[2].Carbohyrate * quantity}</p></td>
        <td><p>${data[3].Fat * quantity}</p></td>
      </tr>
    `);
  });
};

const likeButtonEvent = (db) => {
  $(".like-button").on("click", async function () {
    localStorage.setItem("state", "updated");
    const foodKey = parseInt($(this).attr("id").match(/\d+/));
    const favouriteFoodKeys = await db.getAllKeys("Favourite");

    if (favouriteFoodKeys.includes(foodKey)) {
      // Food is liked and can give a unlike
      $(this).css("fill", "#A9A9A9");

      await db.delete("Favourite", foodKey);
    } else {
      // Food is not liked and can give like
      $(this).css("fill", "#fb3958");
      const stringLen = $(this).attr("id").length;
      const tableChar = $(this).attr("id")[stringLen - 1];
      let foodData = null;
      if (tableChar === "b") {
        foodData = await db.get("BreakFast", foodKey);
      } else if (tableChar === "l") {
        foodData = await db.get("Lunch", foodKey);
      } else if (tableChar === "d") {
        foodData = await db.get("Dinner", foodKey);
      } else if (tableChar === "s") {
        foodData = await db.get("Snack", foodKey);
      }

      await db.add("Favourite", foodData);
    }
  });
};

const deleteButtonEvent = (db) => {
  // Update the state of the app

  $(".delete-button").on("click", async function () {
    localStorage.setItem("state", "updated");
    const stringLen = $(this).attr("id").length;
    const foodKey = parseInt($(this).attr("id").match(/\d+/));

    const tableChar = $(this).attr("id")[stringLen - 1];
    let totalCal = 0;
    let totalProtein = 0;
    let totalCarb = 0;
    let totalFat = 0;
    if (tableChar === "b") {
      const foodData = await db.get("BreakFast", foodKey);
      const { servingSelected, quantity } = foodData;
      const { data } = servingSelected;
      totalCal += data[0].Calories * quantity;
      totalProtein += data[1].Protein * quantity;
      totalCarb += data[2].Carbohyrate * quantity;
      totalFat += data[3].Fat * quantity;

      // Remove from the breakfast table
      await db.delete("BreakFast", foodKey);
      stripeTable("breakfast-table");
      $(`#${foodKey}-row-b`).remove();
    } else if (tableChar === "l") {
      const foodData = await db.get("Lunch", foodKey);
      const { servingSelected, quantity } = foodData;
      const { data } = servingSelected;
      totalCal += data[0].Calories * quantity;
      totalProtein += data[1].Protein * quantity;
      totalCarb += data[2].Carbohyrate * quantity;
      totalFat += data[3].Fat * quantity;

      await db.delete("Lunch", foodKey);
      stripeTable("lunch-table");
      $(`#${foodKey}-row-l`).remove();
    } else if (tableChar === "d") {
      const foodData = await db.get("Dinner", foodKey);
      const { servingSelected, quantity } = foodData;
      const { data } = servingSelected;
      totalCal += data[0].Calories * quantity;
      totalProtein += data[1].Protein * quantity;
      totalCarb += data[2].Carbohyrate * quantity;
      totalFat += data[3].Fat * quantity;

      await db.delete("Dinner", foodKey);
      stripeTable("dinner-table");
      $(`#${foodKey}-row-d`).remove();
    } else if (tableChar === "s") {
      const foodData = await db.get("Snack", foodKey);
      const { servingSelected, quantity } = foodData;
      const { data } = servingSelected;
      totalCal += data[0].Calories * quantity;
      totalProtein += data[1].Protein * quantity;
      totalCarb += data[2].Carbohyrate * quantity;
      totalFat += data[3].Fat * quantity;

      await db.delete("Snack", foodKey);
      stripeTable("snack-table");
      $(`#${foodKey}-row-s`).remove();
    }

    const prevDayData = await db.get("DayCount", "1");
    const { Calories, Carbohyrate, Protein, Fat } = prevDayData;
    await db.put("DayCount", {
      date: "1",
      Calories: Calories - totalCal,
      Protein: Protein - totalProtein,
      Carbohyrate: Carbohyrate - totalCarb,
      Fat: Fat - totalFat,
    });
  });
};

const stripeTable = (tableName) => {
  // $(`tr:even`).css("background-color", "#dcdcdc");
  $(`#${tableName} tr:odd`).css("background-color", "#dcdcdc");
};

// Create a function that will add the event listener for the edit button
const editButtonEvent = (db) => {
  $(".edit-button").on("click", async function () {
    const foodKey = parseInt($(this).attr("id").match(/\d+/));
    const stringLen = $(this).attr("id").length;

    const tableChar = $(this).attr("id")[stringLen - 1];

    // Show current quatity in the text box
    const currentQuantity = $(`#${foodKey}-quantity-value-${tableChar}`).text();
    const currentOption = $(`#${foodKey}-serving-value-${tableChar}`).text();

    // First hide all the paras
    $(`#${foodKey}-quantity-${tableChar}`).css("display", "none");
    $(`#${foodKey}-selected-serving-${tableChar}`).css("display", "none");

    // Hide this edit button
    $(this).css("display", "none");

    // Show the close button
    $(`#${foodKey}-close-button-${tableChar}`).css("display", "block");

    // Show all the divs and button
    $(`#${foodKey}-serving-section-${tableChar}`).css("display", "flex");
    $(`#${foodKey}-quantity-section-${tableChar}`).css("display", "flex");
    $(`#${foodKey}-save-changes-${tableChar}`).css("display", "block");
    $(`#${foodKey}-select-${tableChar}`).empty();

    // Add all the options for the select for this food
    if (tableChar === "b") {
      const foodData = await db.get("BreakFast", foodKey);
      const { serving } = foodData;
      addOptions(serving, `${foodKey}-select-${tableChar}`);
    } else if (tableChar === "l") {
      const foodData = await db.get("Lunch", foodKey);
      const { serving } = foodData;
      addOptions(serving, `${foodKey}-select-${tableChar}`);
    } else if (tableChar === "d") {
      const foodData = await db.get("Dinner", foodKey);
      const { serving } = foodData;
      addOptions(serving, `${foodKey}-select-${tableChar}`);
    } else if (tableChar === "s") {
      const foodData = await db.get("Snack", foodKey);
      const { serving } = foodData;
      addOptions(serving, `${foodKey}-select-${tableChar}`);
    }
  });
};

const addOptions = (data, selectName) => {
  data.map((singleData, index) => {
    const { size } = singleData;
    console.log(selectName);
    $(`#${selectName}`).append(`
      <option value="${index}">
        ${size}
      </option>
    `);
  });
};

// Add functions to all the close button
const closeButtonEvent = () => {
  $(".close-button").on("click", function () {
    const foodKey = parseInt($(this).attr("id").match(/\d+/));
    const stringLen = $(this).attr("id").length;

    const tableChar = $(this).attr("id")[stringLen - 1];

    // First hide this button
    $(this).css("display", "none");

    // Hide all the controls
    $(`#${foodKey}-quantity-section-${tableChar}`).css("display", "none");
    $(`#${foodKey}-serving-section-${tableChar}`).css("display", "none");
    $(`#${foodKey}-save-changes-${tableChar}`).css("display", "none");

    // Show the edit button
    $(`#${foodKey}-edit-button-${tableChar}`).css("display", "block");

    // Show all the paras
    $(`#${foodKey}-quantity-${tableChar}`).css("display", "block");
    $(`#${foodKey}-selected-serving-${tableChar}`).css("display", "block");
  });
};

// Create function that will add event listener to the save changes button
const saveChangesButtonEvent = (db) => {
  $(".save-changes-button").on("click", async function () {
    const foodKey = parseInt($(this).attr("id").match(/\d+/));
    const stringLen = $(this).attr("id").length;

    const tableChar = $(this).attr("id")[stringLen - 1];

    // Get the input values from controls
    const quantityValue = $(`#${foodKey}-quantity-input-${tableChar}`).val();
    const selectedIndex = $(
      `#${foodKey}-select-${tableChar} > option:selected`
    ).val();
    // Will come back to this later
  });
};

const searchPageRouting = () => {
  $(".search-food-item").on("click", function () {
    const id = $(this).attr("id");

    if (id === "search-food-breakfast") {
      localStorage.setItem("page", "breakfast");
    } else if (id === "search-food-lunch") {
      localStorage.setItem("page", "lunch");
    } else if (id === "search-food-dinner") {
      localStorage.setItem("page", "dinner");
    } else if (id === "search-food-snack") {
      localStorage.setItem("page", "snack");
    }
  });
};
