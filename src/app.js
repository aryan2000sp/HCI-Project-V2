// Create a open IDB
import { openDB } from "idb";
import { UserData } from "./Data/UserData";
import { foodData } from "./Data/FoodData";
import { favouriteFoodData } from "./Data/FavouriteFood";
import { updateUserData, displayData } from "./Home_Page_Func/HomeFunctions";
import { updateModalFood } from "./Home_Page_Func/HomeFunctions";
import { createMainChart } from "./Charts/MainChart";
import { displayFoodDiary } from "./FoodDiary_Page_Func/FoodDiaryFunc";
import {
  displaySearchPage,
  upadateSearchPage,
} from "./SearchFood_Page_Function/SearchFoodFunc";
import { displaySummaryPage } from "./Summary Page/Summary";
import { displayProfilePage } from "./Profile_Page_Function/ProfilePageFunc";
import { displaySimulatePage } from "./Simulate_Page_Function/SimulatePageFunc";

export const createDatabase = async () => {
  try {
    const db = await openDB("HCI_Database", 1, {
      upgrade(db) {
        localStorage.setItem("state", "notUpdated");
        // Create schema for the user
        if (!db.objectStoreNames.contains("User")) {
          const store = db.createObjectStore("User", {
            keyPath: "u_id",
          });
        }

        // Create a schema for food data
        if (!db.objectStoreNames.contains("FoodData")) {
          const store = db.createObjectStore("FoodData", {
            keyPath: "id",
            autoIncrement: true,
          });

          // Create an index for the foodData
          store.createIndex("foodName", "name", { unique: false });
        }

        // Create a schema for the favourite food
        if (!db.objectStoreNames.contains("Favourite")) {
          const store = db.createObjectStore("Favourite", {
            keyPath: "id",
          });

          store.createIndex("foodName", "name", { unique: false });
        }

        // Create a schema for the breakfast
        if (!db.objectStoreNames.contains("BreakFast")) {
          const store = db.createObjectStore("BreakFast", {
            keyPath: "id",
          });
        }

        // Create a schema for the lunch
        if (!db.objectStoreNames.contains("Lunch")) {
          const store = db.createObjectStore("Lunch", {
            keyPath: "id",
          });
        }

        // Create a schema for the dinner
        if (!db.objectStoreNames.contains("Dinner")) {
          const store = db.createObjectStore("Dinner", {
            keyPath: "id",
          });
        }

        // Create a schema for the snacks
        if (!db.objectStoreNames.contains("Snack")) {
          const store = db.createObjectStore("Snack", {
            keyPath: "id",
          });
        }

        // Create a schema for Days count of macronutrients
        if (!db.objectStoreNames.contains("DayCount")) {
          const store = db.createObjectStore("DayCount", {
            keyPath: "date",
          });
        }
      },
    });

    // Add the user data to indexedDB
    const userStore = db.transaction("User", "readonly").objectStore("User");
    const numberOfUsers = await userStore.count();
    if (numberOfUsers === 0) {
      await db.add("User", UserData);
    }

    // Add foodData to indexedDB
    const foodStore = db
      .transaction("FoodData", "readonly")
      .objectStore("FoodData");
    const numberOfFood = await foodStore.count();
    if (numberOfFood === 0) {
      foodData.map(async (singleData) => {
        const tx = db.transaction("FoodData", "readwrite");
        const foodData = tx.objectStore("FoodData");
        await foodData.add(singleData);
        tx.done;
      });
    }

    // Add some favourite food
    const favourite = db
      .transaction("Favourite", "readonly")
      .objectStore("Favourite");

    const favouriteNumber = await favourite.count();
    if (
      favouriteNumber === 0 &&
      localStorage.getItem("state") === "notUpdated"
    ) {
      favouriteFoodData.map(async (singleData) => {
        const tx = db.transaction("Favourite", "readwrite");
        const favouriteStore = tx.objectStore("Favourite");
        await favouriteStore.add(singleData);
        console.log(singleData);
        tx.done;
      });
    }

    // Add data to breakfast
    const breakfastStore = db
      .transaction("BreakFast", "readonly")
      .objectStore("BreakFast");
    const breakfastNumber = await breakfastStore.count();
    // const d = new Date();
    const date = `1`;
    let totalCal = 0;
    let totalProtein = 0;
    let totalCarb = 0;
    let totalFat = 0;
    if (
      breakfastNumber === 0 &&
      localStorage.getItem("state") === "notUpdated"
    ) {
      // Get the first two enteries in the food data
      const data = foodData.filter((singleData) => singleData.id <= 2);
      // let totalCal = 0;
      // let totalProtein = 0;
      // let totalCarb = 0;
      // let totalFat = 0;
      for (let i = 0; i <= 1; i++) {
        const tx = db.transaction("BreakFast", "readwrite");
        const breakfastStore = tx.objectStore("BreakFast");
        const getQuantity = Math.floor(Math.random() * 3) + 1;
        await breakfastStore.add({
          ...foodData[i],
          servingSelected: foodData[i].serving[0],
          quantity: getQuantity,
        });

        const { serving } = foodData[i];
        const { data } = serving[0];
        totalCal += data[0].Calories * getQuantity;
        totalProtein += data[1].Protein * getQuantity;
        totalCarb += data[2].Carbohyrate * getQuantity;
        totalFat += data[3].Fat * getQuantity;
        tx.done;
      }
      await db.put("DayCount", {
        date: date,
        Calories: totalCal,
        Protein: totalProtein,
        Carbohyrate: totalCarb,
        Fat: totalFat,
      });
    }
    // data.map(async (singleData) => {

    // });
    // After the database is created display the user data
    // and add event handlers for updating the user data

    const searchPageRouting = () => {
      $(".search-page-link").on("click", function () {
        if ($(this).attr("id") === "breakfast-search") {
          localStorage.setItem("page", "breakfast");
        } else if ($(this).attr("id") === "lunch-search") {
          localStorage.setItem("page", "lunch");
        } else if ($(this).attr("id") === "dinner-search") {
          localStorage.setItem("page", "dinner");
        } else if ($(this).attr("id") === "snack-search") {
          localStorage.setItem("page", "snack");
        }
      });
    };

    searchPageRouting();

    if ($("body").is("#Home-Page")) {
      console.log("Inside home page");
      const mainChart = await createMainChart(db);
      displayData(db);
      updateUserData(db);
      updateModalFood(db, mainChart);
    }

    if ($("body").is("#FoodDiary-Page")) {
      displayFoodDiary(db);
    }

    if ($("body").is("#SearchFood-Page")) {
      displaySearchPage(db);
      upadateSearchPage(db);
    }

    if ($("body").is("#Summary-Page")) {
      displaySummaryPage();
    }

    if ($("body").is("#Profile-Page")) {
      displayProfilePage();
    }

    if ($("body").is("#Simulate-Page")) {
      displaySimulatePage();
    }
  } catch (error) {
    console.error(error);
  }
};
