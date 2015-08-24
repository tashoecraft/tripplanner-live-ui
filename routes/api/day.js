var express = require('express');
var router = express.Router();
var models = require('../../models');

var keys = {
  Hotel: models.Hotel,
  Restaurant: models.Restaurant,
  Activity: models.Activity
};

var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

// get whole days
router.get('/', function(req, res, next) {
  Day.find().then(function(data) {
    //console.log(data);
    res.send(data);
  });
});

//get specific day
router.get('/:dayNumber', function(req, res, next) {
  Day.findOne({
    number: req.params.dayNumber
  }).then(function(data) {
    res.send(data);
  });
});

var createDay = function(req, res, next) {
  console.log(req.body);
  var newDay = new Day(req.body);
  newDay.save().then(function(data) {
    res.send(data);
  });
};

// create a new day
router.post('/', createDay);



router.post('/:id/:instance/:name', function(req, res, next) {
  var id = req.params.id;
  var instance = req.params.instance;
  var splitInstance = instance.split("");
  var upperInstance = splitInstance.splice(0, 1)[0].toUpperCase() +
    splitInstance.join(
      "").toLowerCase();

  var name = req.params.name;
  keys[upperInstance].findOne({
      name: name
    })
    .then(function(result) {
      Day.findOne({
        _id: id
      }).then(function(day) {
        if (instance === "hotel") {
          day.instance = result;
        } else {
          day.instance.push(result);
        }
      });
    });
});

//delete a day
router.delete('/:dayNumber', function(req, res, next) {
  var dayNumber = req.params.dayNumber;
  Day.findOneAndRemove({
    number: dayNumber
  }, function() {
    res.send("delete successful");
  });
});

// delete specific activity/restaurant/hotel
router.delete('/:id/:instance/:name', function(req, res, next) {
  var id = req.params.id;
  var instance = req.params.instance;
  var name = req.params.name;
  Day.findOne({
    _id: id
  }).then(function(day) {
    if (instance === "hotel") {
      day.remove("hotel");
    } else if (instance == "restaurant") {
      day.restaurants.forEach(function(rest, index) {
        if (rest.name === name) {
          day.restaurants[index].remove();
        }
      });
    } else if (instance == "activity") {
      day.activities.forEach(function(act, index) {
        if (act.name === name) {
          day.activities[index].remove();
        }

      });
    }
  });
});



module.exports = router;
