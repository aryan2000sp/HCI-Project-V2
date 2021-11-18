import { Modal } from "bootstrap";
import { Toast } from "bootstrap";
export const displayData = async (db) => {
  try {
    const store = db.transaction("User", "readonly").objectStore("User");
    const { firstName, weight, weightUnit } = await store.get(1);
    // Add the text to the page
    $("#user-name").text(firstName);
    // Add the weight to page
    $("#weight-info-display").text(`${weight} ${weightUnit}`);

    // Create a transaction for the displaying the favourite food data
    const favouriteFoodStore = db
      .transaction("Favourite", "readonly")
      .objectStore("Favourite");

    const favouriteFoodData = await favouriteFoodStore.getAll();
    addFoodModal(favouriteFoodData);

    // Create a method that will display the total calories for the category
    displayFoodCal(db);
  } catch (error) {
    console.error(error);
  }
};

export const updateUserData = (db) => {
  // Clearing the weight change form
  $("#edit-weight").on("click", () => {
    console.log("true");
    // Clear the weight-number input field
    $("#weight-number").val("");

    // Clear the error message if there is any
    $(".error-text").css("display", "none");
  });

  // Adding a form submission for the weight change
  $("#save-changes").on("click", async () => {
    const weightNumber = $("#weight-number").val();
    const weightUnit = $("#weight-unit").val();

    // If the weightNumber is empty
    if (weightNumber === "") {
      // Display the error message
      $(".error-text").css("display", "block");
    } else {
      // First Get the data
      const userData = await db.get("User", 1);

      // Now insert the updated data into the IDB
      await db.put("User", {
        ...userData,
        weight: weightNumber,
        weightUnit: weightUnit,
      });
      $("#weight-info-display").text(weightNumber + " " + weightUnit);

      const modal = Modal.getInstance($("#weight-change-modal"));
      modal.hide();
    }
  });
};

const addFoodModal = (data) => {
  data.map((singleData) => {
    const { id, name, servingSelected, quantity } = singleData;
    const { size, data } = servingSelected;
    // $("#food-content").append(`<tr id=table-row-${singleData.id}></tr>`);
    // const tableRow = $(`#table-row-${singleData.id}`);
    $("#food-content").append(`
      <tr id="table-row-${id}">
        <td>
        <article class="quick-food-modal">
            <div>
              <input class="form-check-input" type="checkbox" value="" id="${id}">
            </div>
            <div>
              <h4 class="bold" style="text-transform: capitalize;">${name}</h4>
            <p>Serving:${size}</p>
            <p >Quantity:${quantity}</p>
          </div>
          </article>
        </td>
        <td>
          <p>${data[0].Calories * quantity}</p>
        </td>
        <td>
          <p>${data[1].Protein * quantity}</p>
        </td>
        <td>
          <p>${data[2].Carbohyrate * quantity}</p>
        </td>
        <td>
          <p>${data[3].Fat * quantity}</p>
        </td>
      </tr>
    `);

    // const { serving } = tableRow.append(`<p>${singleData}`);
    // Select the table row
  });
};

const displayFoodCal = async (db) => {
  try {
    const breakfastTx = db.transaction("BreakFast", "readonly");
    const breakfastStore = breakfastTx.objectStore("BreakFast");
    const breakfastNumber = await breakfastStore.count();
    if (breakfastNumber > 0) {
      const data = await breakfastStore.getAll();
      let totalCal = 0;

      data.map((singleData) => {
        const { servingSelected, quantity } = singleData;
        const { data } = servingSelected;
        totalCal += data[0].Calories * quantity;
      });

      $("span[name=breakfast]").text(`${totalCal}`);
    } else {
      $("span[name=breakfast]").text(`0`);
    }
    breakfastTx.done;

    const lunchTx = db.transaction("Lunch", "readonly");
    const lunchStore = lunchTx.objectStore("Lunch");
    const lunchNumber = await lunchStore.count();
    if (lunchNumber > 0) {
      const data = await lunchStore.getAll();
      let totalCal = 0;

      data.map((singleData) => {
        const { servingSelected, quantity } = singleData;
        const { data } = servingSelected;
        totalCal += data[0].Calories * quantity;
      });
      $("span[name=lunch]").text(`${totalCal}`);
    } else {
      $("span[name=lunch]").text(`0`);
    }
    lunchTx.done;

    const dinnerTx = db.transaction("Dinner", "readonly");
    const dinnerStore = dinnerTx.objectStore("Dinner");
    const dinnerNumber = await dinnerStore.count();
    if (dinnerNumber > 0) {
      const data = await dinnerStore.getAll();
      let totalCal = 0;

      data.map((singleData) => {
        const { servingSelected, quantity } = singleData;
        const { data } = servingSelected;
        totalCal += data[0].Calories * quantity;
      });
      $("span[name=dinner]").text(`${totalCal}`);
    } else {
      $("span[name=dinner]").text(`0`);
    }
    dinnerTx.done;

    const snackTx = db.transaction("Snack", "readonly");
    const snackStore = snackTx.objectStore("Snack");
    const snackNumber = await snackStore.count();
    if (snackNumber > 0) {
      const data = await snackStore.getAll();
      let totalCal = 0;
      data.map((singleData) => {
        const { servingSelected, quantity } = singleData;
        const { data } = servingSelected;
        totalCal += data[0].Calories * quantity;
      });
      $("span[name=snack]").text(`${totalCal}`);
    } else {
      $("span[name=snack]").text(`0`);
    }

    // Display the data for the calorie count
    const d = new Date();
    const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const { Calories } = await db.get("DayCount", date);
    $("#calorie-count").text(`${Calories} cal`);
    if (Calories < 2000) {
      const progressPercent = (Calories / 2000) * 100;
      $("#progress-bar").css("width", `${progressPercent}%`);
      $("#progress-bar").removeClass("bg-danger").addClass("bg-success");
    } else {
      const progressPercent = ((Calories - 2000) / 2000) * 100;
      $("#progress-bar").removeClass("bg-success").addClass("bg-danger");
      $("#progress-bar").css("width", `${progressPercent}%`);
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateModalFood = (db, mainChart) => {
  // Create an instance of toast
  const toast = new Toast($("#liveToast"));
  // console.log();
  let category = null;
  $(".quick-add-food").on("click", (event) => {
    category = $(event.target).attr("name");

    $("input:checkbox:checked").each(function () {
      $(this).prop("checked", false);
    });
  });

  $("#save-food-data").on("click", async () => {
    try {
      const d = new Date();
      const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      let totalCal = 0;
      let totalProtein = 0;
      let totalCarb = 0;
      let totalFat = 0;

      for (let i = 0; i < $("input:checkbox:checked").length; i++) {
        const key = $($("input:checkbox:checked")[i]).attr("id");
        const tx = db.transaction("Favourite", "readonly");
        const favouriteStore = tx.objectStore("Favourite");
        const foodData = await favouriteStore.get(parseInt(key));
        const { id, servingSelected, quantity } = foodData;
        const { data } = servingSelected;
        tx.done;

        // Add up all the calories and macronutrients
        totalCal += data[0].Calories * quantity;
        totalProtein += data[1].Protein * quantity;
        totalCarb += data[2].Carbohyrate * quantity;
        totalFat += data[3].Fat * quantity;

        if (category === "breakfast") {
          const tx = db.transaction("BreakFast", "readwrite");
          const breakfast = tx.objectStore("BreakFast");
          const keys = await breakfast.getAllKeys();
          if (!keys.includes(id)) {
            await breakfast.add(foodData);
          } else {
            // Update the quantity of the food
            const { quantity } = await breakfast.get(id);
            const newQuantity = foodData.quantity + quantity;
            await breakfast.put({ ...foodData, quantity: newQuantity });
          }
          const breakfastData = await breakfast.getAll();
          let totalCal = 0;
          breakfastData.map((singleData) => {
            const { quantity, servingSelected } = singleData;
            const { data } = servingSelected;
            totalCal += data[0].Calories * quantity;
          });
          $("span[name=breakfast]").text(`${totalCal}`);
          $("#food-feedback-message").text("Items Added to Breakfast");
          tx.done;
        }
        if (category === "lunch") {
          const tx = db.transaction("Lunch", "readwrite");
          const lunch = tx.objectStore("Lunch");
          const keys = await lunch.getAllKeys();
          if (!keys.includes(id)) {
            await lunch.add(foodData);
          } else {
            const { quantity } = await lunch.get(id);
            const newQuantity = foodData.quantity + quantity;
            await lunch.put({ ...foodData, quantity: newQuantity });
          }
          const lunchData = await lunch.getAll();
          let totalCal = 0;
          lunchData.map((singleData) => {
            const { quantity, servingSelected } = singleData;
            const { data } = servingSelected;
            totalCal += data[0].Calories * quantity;
          });
          $("span[name=lunch]").text(`${totalCal}`);
          $("#food-feedback-message").text("Items Added to Lunch");
          tx.done;
        }
        if (category === "dinner") {
          const tx = db.transaction("Dinner", "readwrite");
          const dinner = tx.objectStore("Dinner");
          const keys = await dinner.getAllKeys();
          if (!keys.includes(id)) {
            await dinner.add(foodData);
          } else {
            const { quantity } = await dinner.get(id);
            const newQuantity = foodData.quantity + quantity;
            await dinner.put({ ...foodData, quantity: newQuantity });
          }
          const dinnerData = await dinner.getAll();
          let totalCal = 0;
          dinnerData.map((singleData) => {
            const { quantity, servingSelected } = singleData;
            const { data } = servingSelected;
            totalCal += data[0].Calories * quantity;
          });
          $("span[name=dinner]").text(`${totalCal}`);
          $("#food-feedback-message").text("Items Added to Dinner");
          tx.done;
        }
        if (category === "snack") {
          const tx = db.transaction("Snack", "readwrite");
          const snack = tx.objectStore("Snack");
          const keys = await snack.getAllKeys();
          if (!keys.includes(id)) {
            await snack.add(foodData);
          } else {
            const { quantity } = await snack.get(id);
            const newQuantity = foodData.quantity + quantity;
            await snack.put({ ...foodData, quantity: newQuantity });
          }
          const snackData = await snack.getAll();
          let totalCal = 0;
          snackData.map((singleData) => {
            const { quantity, servingSelected } = singleData;
            const { data } = servingSelected;
            totalCal += data[0].Calories * quantity;
          });
          $("span[name=snack]").text(`${totalCal}`);
          $("#food-feedback-message").text("Items Added to Snack");
          tx.done;
        }
      }

      // Close the modal
      const modal = Modal.getInstance($("#quick-food-modal"));
      modal.hide();

      // show the toast.
      toast.show();

      // Add data to the DayCount store if the day is different else update the data
      const dayCountTx = db.transaction("DayCount", "readwrite");
      const dayCountStore = dayCountTx.objectStore("DayCount");
      const keys = await dayCountStore.getAllKeys();
      const previousData = await dayCountStore.get(date);
      if (keys.includes(date)) {
        await dayCountStore.put({
          date: date,
          Calories: totalCal + previousData.Calories,
          Protein: totalProtein + previousData.Protein,
          Carbohyrate: totalCarb + previousData.Carbohyrate,
          Fat: totalFat + previousData.Fat,
        });
      } else {
        await dayCountStore.add({
          date: date,
          Calories: totalCal,
          Protein: totalProtein,
          Carbohyrate: totalCarb,
          Fat: totalFat,
        });
      }

      // Update the calorie count
      const calorieCount = totalCal + previousData.Calories;
      $("#calorie-count").text(`${calorieCount} cal`);
      if (calorieCount < 2000) {
        const progressPercent = (calorieCount / 2000) * 100;
        $("#progress-bar").css("width", `${progressPercent}%`);
        $("#progress-bar").removeClass("bg-danger").addClass("bg-success");
      } else {
        const progressPercent = ((calorieCount - 2000) / 2000) * 100;
        $("#progress-bar").css("width", `${progressPercent}%`);
        $("#progress-bar").removeClass("bg-success").addClass("bg-danger");
      }
      mainChart.data.datasets[0].data = [
        totalProtein + previousData.Protein,
        totalCarb + previousData.Carbohyrate,
        totalFat + previousData.Fat,
      ];
      mainChart.update();

      dayCountTx.done;
      // Update the calorie count
    } catch (error) {
      console.error(error);
    }
  });
};
