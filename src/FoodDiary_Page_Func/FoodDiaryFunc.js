// This function will display the food diary page
export const displayFoodDiary = async (db) => {
  // Get all the data from the indexedDB
  const breakfastData = await db.getAll("BreakFast");
  const lunchData = await db.getAll("Lunch");
  const dinnerData = await db.getAll("Dinner");
  const snackData = await db.getAll("Snack");

  if (breakfastData.length > 0) {
    // Display the table
    $("#breakfast-table-status").css("display", "none");
    displayTables(breakfastData, "breakfast-table");
  } else {
    // just add no data
    $("#breakfast-table").css("display", "none");
    $("#breakfast-table-status").css("display", "block").append(`NO DATA`);
  }

  if (lunchData.length > 0) {
    // Display the table
    $("#lunch-table-status").css("display", "none");
    displayTables(lunchData, "lunch-table");
  } else {
    // just add no data
    $("#lunch-table").css("display", "none");
    $("#lunch-table-status").css("display", "block").append(`NO DATA`);
  }

  if (dinnerData.length > 0) {
    // Display the table
    $("#dinner-table-status").css("display", "none");
    displayTables(dinnerData, "dinner-table");
  } else {
    // just add no data
    $("#dinner-table").css("display", "none");
    $("#dinner-table-status").css("display", "block").append(`NO DATA`);
  }

  if (snackData.length > 0) {
    // Display the table
    $("#snack-table-status").css("display", "none");
    displayTables(snackData, "snack-table");
  } else {
    // just add no data
    $("#snack-table").css("display", "none");
    $("#snack-table-status").css("display", "block").append(`NO DATA`);
  }
};

// This function will display tables of associted category
const displayTables = (data, tableName) => {
  // $(`#${tableName}`).css("display", "block");
  data.map((singleData) => {
    const { name, servingSelected, quantity } = singleData;
    const { data, size } = servingSelected;
    // Enable the displaying of the table

    $(`#${tableName} > tbody`).append(`
      <tr>
        <td>
          <article class="food-description">
            <section class="btn-section" id="btn-section">
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
