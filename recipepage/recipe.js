

// Retrieve user selected recipe ID from local storage ----------------------------
var userSelectedID = localStorage.getItem("recipeId");
console.log(userSelectedID);

//=====================================================================================================================================

// API URL ------------------------------------------------------------------------------------------------

//variable for query URL that pulls all recipe information from Spoonacular API
var queryURL = "https://api.spoonacular.com/recipes/informationBulk?ids=" + userSelectedID + "&apiKey=e2fdf8caf9fc4fd185d2672794a3994c"

//=====================================================================================================================================

// RECIPE DATA ------------------------------------------------------------------------------------------------
$.ajax({
  url: queryURL,
  method: "GET"

//run function response to retrieve data from the queryURL
  }).then(function(response) {

    // access the first index of the reponse 
    var actual_data = response[0];

    // RECIPE TITLE - add to div ----------------------------------------
    $("#recipeTitle").text(actual_data.title);

    // IMAGE -------------------------------------------------------------
    $("#recipeImg").attr("src", actual_data.image);

    // INGREDIENTS -------------------------------------------------------
    for (i = 0; i < actual_data.extendedIngredients.length; i++) {

      var current_ingredient_name = actual_data.extendedIngredients[i].name;
      var current_ingredient_amount = Math.round(actual_data.extendedIngredients[i].amount * 100) / 100;
      var current_ingredient_unit = actual_data.extendedIngredients[i].unit;

      $("#ingredients-section").append(`<div class="recipes" data=${current_ingredient_name}> ${current_ingredient_amount} ${current_ingredient_unit}  ${current_ingredient_name} </div>`);
        
        // console.log(actual_data.extendedIngredients[i].name);
        // console.log(actual_data.extendedIngredients[i].amount);
        // console.log(actual_data.extendedIngredients[i].unit);
      }
      
    // INSTRUCTIONS -----------------------------------------------------
    var src_instructions = actual_data.instructions
    var split_instructions = src_instructions.split(".");
    var display_split_strings = '<br>';

    for (num=0; num < split_instructions.length-1; num++){
      display_split_strings += `<li> ${split_instructions[num]} <br></li>`;
      };
 
    document.getElementById("recipeInstructions").innerHTML = display_split_strings;

  }); // END OF FUNCTION RESPONSE 

// ======================================================================================================================================

//FIREBASE -----------------------------------------------------------------------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyCcqYafYLVS5QvocHANk0illfsIYUqH3I4",
  authDomain: "cart-to-kitchen-4c135.firebaseapp.com",
  databaseURL: "https://cart-to-kitchen-4c135.firebaseio.com",
  projectId: "cart-to-kitchen-4c135",
  storageBucket: "cart-to-kitchen-4c135.appspot.com",
  messagingSenderId: "421625026826",
  appId: "1:421625026826:web:988bc65eda645a60"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Variable to reference the database
var database = firebase.database();



// ON-INGREDIENTS-CLICK EVENT ---------------------------------------------------------------------------
// --------- this will allow the user to click on specific ingredients to add them to a grocery list
$(document).on("click", ".recipes", function (){

  // grab the value from the click 
  var ingredName = $(this).text().trim();
  //console.log(ingredName);

  // push to Firebase
  database.ref("/list").push({
    ingredient_name: ingredName,
  })

});

// FAVORITES BUTTON FUNCTIONALITY -----------------------------------------------------------------------
var favoritesArray;

function snapshotToArray(snapshot) {
  favoritesArray = [];

  snapshot.forEach(function(childSnapshot) {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;

    favoritesArray.push(item);
  });

  return favoritesArray;
};
  
//-------------------
firebase.database().ref('/favorites/favoritesArray').on('value', function(snapshot) {
  snapshotToArray(snapshot);
  console.log(favoritesArray);
});

// FAVORITES BUTTON ON CLICK FUNCTION
$(document).on("click", "#fav-btn", function() {
    
  favoritesArray.push(userSelectedID);
  //console.log("favoritesArray to be pushed to firebase: " + favoritesArray);

  database.ref("/favorites").set({
    favoritesArray: favoritesArray,
  });
    
})