$(document).ready(function(){

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

      var tName = "";
      var tDestination = "";
      var tFirstTime = "";
      var tFrequency = "";

    $("#submitTrain").on("click", function(event){
        event.preventDefault();
  
    tName = $("#inputTrain").val().trim();
    tDestination = $("#inputDestination").val().trim();
    tFirstTime = $("#inputFirstTime").val().trim();
    tFrequency = $("#inputFrequency").val().trim();
    

    database.ref().push({
        tName: tName,
        tDestination: tDestination,
        tFirstTime: tFirstTime,
        tFrequency: tFrequency,
        //tMinutesTillTrain: tMinutesTillTrain,
        dataAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });

    database.ref().on("child_added", function(childSnapshot) {

        $("#trains-here").append("<tr><td class='train-name'> " + childSnapshot.val().tName + 
            " </td><td class='train-destination'> " + childSnapshot.val().tDestination +  
            " </td><td class='train-frequency'> " + childSnapshot.val().tFrequency + 
            " </td><td class='train-arrival'> " + nextTrain +
            " </td><td class='train-away'> " + tMinutesTillTrain + 
            " </td></tr>");
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
          // First Time (pushed back 1 year to make sure it comes before current time)
          var firstTimeConverted = moment(tFirstTime, "HH:mm").subtract(1, "years");
          console.log(firstTimeConverted.format("llll"));
      
          // Current Time
          var currentTime = moment();
          console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
      
          // Difference between the times
          var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
          console.log("DIFFERENCE IN TIME: " + diffTime);
      
          // Time apart (remainder)
          var tRemainder = diffTime % tFrequency;
          console.log(tRemainder);
      
          // Minute Until Train
          var tMinutesTillTrain = tFrequency - tRemainder;
          console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
      
          // Next Train
          var nextTrain = moment().add(tMinutesTillTrain, "minutes");
          console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
});