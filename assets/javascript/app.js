$(document).ready(function(){

//Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyALRol1Nu0QKybM-5GwxLp8Ca3FqdsYqho",
        authDomain: "train-tracker-d9767.firebaseapp.com",
        databaseURL: "https://train-tracker-d9767.firebaseio.com",
        projectId: "train-tracker-d9767",
        storageBucket: "train-tracker-d9767.appspot.com",
        messagingSenderId: "907508474357",
        appId: "1:907508474357:web:61a6db59f28acb348880bc"
      };

// Initialize Firebase
      firebase.initializeApp(firebaseConfig);

      var database = firebase.database();

//Global variables
      var tName = "";
      var tDestination = "";
      var tFirstTime = "";
      var tFrequency = "";

//Grab user inputs from form, push inputs to firebase, clear form for new inputs
    $("#submitTrain").on("click", function(event){
        event.preventDefault();

    tName = $("#inputTrain").val().trim();
    tDestination = $("#inputDestination").val().trim();
    tFirstTime = $("#inputFirstTime").val().trim();
    tFrequency = $("#inputFrequency").val().trim();

    $("#inputTrain").val("");
	$("#inputDestination").val("");
	$("#inputFirstTime").val("");
	$("#inputFrequency").val("");

    database.ref().push({
        tName: tName,
        tDestination: tDestination,
        tFirstTime: tFirstTime,
        tFrequency: tFrequency,
        dataAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });

//Run user input through moment.js to calculate train times
    database.ref().on("child_added", function(childSnapshot) {

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(tFirstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted.format("llll"));

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = currentTime.diff(firstTimeConverted, "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minutes Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train minutes away
    var nextTrain = currentTime.add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
    //Next trains arrival time
    var arrivalTime = nextTrain.format("hh:mm a");

    //Append moment.js results to page
    $("#trains-here").append("<tr><td>" + childSnapshot.val().tName + 
        "</td><td>" + childSnapshot.val().tDestination +  
        "</td><td>" + childSnapshot.val().tFrequency + 
        "</td><td>" + arrivalTime +
        "</td><td>" + tMinutesTillTrain + 
        "</td></tr>");
    
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $(document).ready(function() {
        
    })
});