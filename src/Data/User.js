// class User {
//   #firstName;
//   #lastName;
//   #weight;
//   #weightUnit;
//   #foodDiary;

//   constructor(firstName, lastName) {
//     this.#firstName = firstName;
//     this.#lastName = lastName;
//     this.#weight = 70;
//     this.#weightUnit = "kg";
//     this.#foodDiary = [];
//   }

//   // Getters and setters
//   getFirstName() {
//     return this.#firstName;
//   }

//   setFirstName(newFirstName) {
//     this.#firstName = newFirstName;
//   }

//   getLastName() {
//     return this.#lastName;
//   }

//   setLastName(newLastName) {
//     this.#lastName = newLastName;
//   }

//   getWeight() {
//     return this.#weight;
//   }

//   setWeight(newWeight) {
//     this.#weight = newWeight;
//   }

//   getWeightUnit() {
//     return this.#weightUnit;
//   }

//   setWeightUnit(newWeightUnit) {
//     this.#weightUnit = newWeightUnit;
//   }

//   getFoodDiary() {
//     return this.#foodDiary;
//   }

//   addFoodItem(foodItem) {
//     this.#foodDiary.push(foodItem);
//   }
// }

if (JSON.parse(localStorage.getItem("user")) === null) {
  localStorage.setItem("user", JSON.stringify(User));
}

const user = JSON.parse(localStorage.getItem("user"));
$("#weight-info-display").text(user.weight + " " + user.weightUnit);
