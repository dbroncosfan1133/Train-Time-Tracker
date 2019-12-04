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
      var trainName = "";
      var trainDestination = "";
      var trainFirstTime = "";
      var trainFrequency = "";

//Grab user inputs from form, push inputs to firebase, clear form for new inputs
    $("#submitTrain").on("click", function(event){
        event.preventDefault();

    trainName = $("#inputTrain").val().trim();
    trainDestination = $("#inputDestination").val().trim();
    trainFirstTime = $("#inputFirstTime").val().trim();
    trainFrequency = $("#inputFrequency").val().trim();

    $("#inputTrain").val("");
	$("#inputDestination").val("");
	$("#inputFirstTime").val("");
	$("#inputFrequency").val("");

    database.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        trainFirstTime: trainFirstTime,
        trainFrequency: trainFrequency,
        dataAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });

//Run user input through moment.js to calculate train times
    database.ref().on("child_added", function(childSnapshot) {

console.log(childSnapshot.val());

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(childSnapshot.val().trainFirstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted.format("llll"));

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = currentTime.diff(firstTimeConverted, "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var trainRemainder = diffTime % childSnapshot.val().trainFrequency;
    console.log(trainRemainder);

    // Minutes Until Train
    var minutesTilTrain = childSnapshot.val().trainFrequency - trainRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesTilTrain);

    // Next Train minutes away
    var nextTrain = currentTime.add(minutesTilTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
    //Next trains arrival time
    var arrivalTime = nextTrain.format("hh:mm a");

    //Append moment.js results to page
    $("#trains-here").append("<tr><td>" + childSnapshot.val().trainName + 
        "</td><td>" + childSnapshot.val().trainDestination +  
        "</td><td>" + childSnapshot.val().trainFrequency + 
        "</td><td>" + arrivalTime +
        "</td><td>" + minutesTilTrain + 
        "</td></tr>");
    
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $(document).ready(function() {
        
    });
});