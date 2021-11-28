export const displayProfilePage = () => {
  changeFormEvent();
};

// Create a function that will change the setting form
const changeFormEvent = () => {
  console.log("Profile");
  $(".custom-list-group-item").on("click", function () {
    // Remove the class selected item class from the previously selected item
    const prevForm = $(".selected-item").attr("id");
    $(`.${prevForm}`).css("display", "none");
    $(".selected-item").removeClass("selected-item");

    // Add a class selected to this item
    $(this).addClass("selected-item");
    const formName = $(this).attr("id");

    // Display the form
    $(`.${formName}`).css("display", "block");
  });
};
