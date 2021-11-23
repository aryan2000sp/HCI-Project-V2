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
};

// This function will display tables of associted category
const displayTables = async (db, data, tableName) => {
  // Get the keys of liked foods
  const likedFoodKeys = await db.getAllKeys("Favourite");
  const likedColorCode = "#fb3958";
  const greyColorCode = "#A9A9A9";
  data.map((singleData) => {
    const { id, name, servingSelected, quantity } = singleData;
    const { data, size } = servingSelected;
    // Enable the displaying of the table

    $(`#${tableName} > tbody`).append(`
      <tr>
        <td>
          <article class="food-description">
            <section class="btn-section" id="btn-section">
              <svg fill="${
                likedFoodKeys.includes(id) ? likedColorCode : greyColorCode
              }" viewBox="0 0 30 30" width="25px" height="25px" id="${id}-like-button" class="like-button">    <path d="M 9.5449219 4 C 5.9299219 4 3 6.9299219 3 10.544922 C 3 16.837321 10.298975 22.849799 13.708984 25.527344 A 2 2 0 0 0 13.71875 25.535156 C 13.742115 25.5535 13.773881 25.579629 13.796875 25.597656 L 13.798828 25.595703 A 2 2 0 0 0 15 26 A 2 2 0 0 0 16.203125 25.595703 L 16.203125 25.597656 C 16.209855 25.59238 16.219801 25.585381 16.226562 25.580078 C 16.231704 25.576045 16.23898 25.570455 16.244141 25.566406 A 2 2 0 0 0 16.263672 25.548828 C 19.663109 22.880904 27 16.852336 27 10.544922 C 27 6.9299219 24.070078 4 20.455078 4 C 17.000078 4 15 7 15 7 C 15 7 12.999922 4 9.5449219 4 z"/></svg>
              <svg fill="#000000" viewBox="0 0 32 32" width="20px" height="20px" id="${id}-edit-button" class="edit-button"><path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="20px" height="20px" id="${id}-delete-button" class="delete-button"><path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"/></svg>
            </section>
            <section class="food-info">
              <h4 class="bold" style="text-transform: capitalize;">${name}</h4>
              <p>Quantity: ${quantity}</p>
              <p>Serving: ${size}</p>
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
  console.log("Called");
  $(".like-button").on("click", async function () {
    const foodKey = parseInt($(this).attr("id").match(/\d+/));
    const favouriteFoodKeys = await db.getAllKeys("Favourite");

    if (favouriteFoodKeys.includes(foodKey)) {
      // Food is liked and can give a unlike
      $(this).css("fill", "#A9A9A9");
    } else {
      // Food is not liked and can give like
      $(this).css("fill", "#fb3958");
    }
  });
};
