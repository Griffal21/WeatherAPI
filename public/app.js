/* Note Taker (18.2.6)
 * front-end
 * ==================== */


var card = null;

 //FROM THE DEMO EXAMPLE
$(document).ready(function () {

  $("#search").click(function () {
    var city = $("#textInput").val().trim();
    var key = apiKey.MY_KEY
    var url = "https://api.openweathermap.org/data/2.5/forecast";

    $.ajax({
      url: url, //API Call
      dataType: "json",
      type: "GET",
      data: {
        q: city,
        appid: key,
        units: "metric",
        cnt: "5"
      },
      success: function (result) {
        console.log(result);
        var name = result.city.name + ", " + result.city.country;

        console.log(name);
      }
    })//ajax




  })//#search






  $("#reset").click(function (e) {
  location.reload();
  });
  $("#submitButton").click(function (e) {
  $.ajax({
  type: "POST",
  url: "http://api.openweathermap.org/data/2.5/group?id=2643741,2644688,2633352,2654675,2988507,2990969,2911298,2925535,2950159,3120501,3128760,5128581,4140963,4930956,5106834,5391959,5368361,5809844,4099974,4440906&appid="+apiKey.MY_KEY+"&units=metric",
  dataType: "json",
  success: function (result, status, xhr) {
 // res = CreateWeatherJson(result);
 // console.log("result ", result);
 // console.log("result list", result.list);
 // console.log("result List.length ", result.list.length);

  for (var i=0; i<result.list.length; i++) {
    //console.log(result.list[i]);
    // console.log("=============================================");
    // console.log("City: "+result.list[i].name+", "+result.list[i].sys.country);
    var name = "City: "+result.list[i].name+", "+result.list[i].sys.country;
    // console.log("Current Condition: "+result.list[i].weather[0].description);
    var curr = "Current Condition: "+result.list[i].weather[0].description;
    // console.log("Tempeature (c): "+result.list[i].main.temp);
    var tempcond = "Tempeature (c): "+result.list[i].main.temp;
    // console.log("Pressure (mbar) "+result.list[i].main.pressure);
    var press = "Pressure (mbar) "+result.list[i].main.pressure;
    // console.log("Humidity "+result.list[i].main.humidity+"%");
    var humid = "Humidity "+result.list[i].main.humidity+"%";
    // console.log("Wind speed: "+result.list[i].wind.speed+" At "+result.list[i].wind.deg+" Gusting "+result.list[i].wind.gust);
    var windcond = "Wind speed: "+result.list[i].wind.speed+" At "+result.list[i].wind.deg+" Gusting "+result.list[i].wind.gust

    if(result.list[i].wind.gust === undefined) {
      var windcond = "Wind speed: "+result.list[i].wind.speed+" At "+result.list[i].wind.deg
    }
    

    card = `<div class="card" style="width: 22rem;"><div class="card-body"><h5 class="card-title">${name}</h5><h6 class="card-subtitle mb-2 text-muted">${curr}</h6><p class="card-text">${tempcond}</p><p class="card-text">${press}</p><p class="card-text">${humid}</p><p class="card-text">${windcond}</p></div></div>`

    $("#target").prepend(card);
  }// for loop
}//success
  });//ajax
})//submit button

  }); //document.ready function










//FROM THE NOTETAKER APP
// Loads results onto the page
function getResults() {
  // Empty any results currently on the page
  $("#results").empty();
  // Grab all of the current notes
  $.getJSON("/all", function(data) {
    // For each note...
    for (var i = 0; i < data.length; i++) {
      // ...populate #results with a p-tag that includes the note's title and object id
      $("#results").prepend("<p class='data-entry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
        data[i]._id + ">" + data[i].title + "</span><span class=delete>X</span></p>");
    }
  });
}

// Runs the getResults function as soon as the script is executed
getResults();

// When the #make-new button is clicked
$(document).on("click", "#make-new", function() {
  // AJAX POST call to the submit route on the server
  // This will take the data from the form and send it to the server
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      title: $("#title").val(),
      note: $("#note").val(),
      created: Date.now()
    }
  })
  // If that API call succeeds, add the title and a delete button for the note to the page
    .then(function(data) {
    // Add the title and delete button to the #results section
      $("#results").prepend("<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
      data._id + ">" + data.title + "</span><span class=delete>X</span></p>");
      // Clear the note and title inputs on the page
      $("#note").val("");
      $("#title").val("");
    });
});

// When the #clear-all button is pressed
$("#clear-all").on("click", function() {
  // Make an AJAX GET request to delete the notes from the db
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/clearall",
    // On a successful call, clear the #results section
    success: function(response) {
      $("#results").empty();
    }
  });
});


// When user clicks the delete button for a note
$(document).on("click", ".delete", function() {
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
      selected.remove();
      // Clear the note and title inputs
      $("#note").val("");
      $("#title").val("");
      // Make sure the #action-button is submit (in case it's update)
      $("#action-button").html("<button id='make-new'>Submit</button>");
    }
  });
});

// When user click's on note title, show the note, and allow for updates
$(document).on("click", ".dataTitle", function() {
  // Grab the element
  var selected = $(this);
  // Make an ajax call to find the note
  // This uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function(data) {
      // Fill the inputs with the data that the ajax call collected
      $("#note").val(data.note);
      $("#title").val(data.title);
      // Make the #action-button an update button, so user can
      // Update the note s/he chooses
      $("#action-button").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
    }
  });
});

// When user click's update button, update the specific note
$(document).on("click", "#updater", function() {
  // Save the selected element
  var selected = $(this);
  // Make an AJAX POST request
  // This uses the data-id of the update button,
  // which is linked to the specific note title
  // that the user clicked before
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#title").val(),
      note: $("#note").val()
    },
    // On successful call
    success: function(data) {
      // Clear the inputs
      $("#note").val("");
      $("#title").val("");
      // Revert action button to submit
      $("#action-button").html("<button id='make-new'>Submit</button>");
      // Grab the results from the db again, to populate the DOM
      getResults();
    }
  });
});
