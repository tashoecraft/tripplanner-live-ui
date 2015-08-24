var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

// get whole days
router.get('/', function(req, res, next) {
  Day.find().then(function(data) {
    res.send(data);
  });
  next();
});

//get specific activity/restaurant/hotel
router.get('/', function() {

});

// create a new day
router.post('/', function(req, res, next) {
  var newDay = new Day(req.body);
  newDay.save().then(function(data) {
    res.send(data);
  });

});

router.post('/:id/:instance/:name', function(req, res, next){
  var id = req.params.id;
  var instance = req.params.instance;
  var name = req.params.name;
  Day.findOne({name: name})
  .then(function(result){
    Day.findOne({ id: id
  }).then(function(day){
    if (instance === "hotel"){
      day.instance = result;
    }
    else {
      day.instance.push(result);
    }
  })
  })
  })

//delete a day
router.delete('/:id', function(req, res, next) {
  var id = req.params.id;
  Day.findByIdAndRemove({
    _id: id
  }, function() {
    console.log("delete successful");
  });
});

// delete specific activity/restaurant/hotel
router.delete('/:id/:instance/:name', function(req, res, next) {
  var id = req.params.id;
  var instance = req.params.instance;
  var name = req.params.name;
  Day.findOne({ _id: id
  }).then(function(day){
    if(instance === "hotel"){
      day.remove("hotel");
    }
    else if(instance == "restaurant"){
      day.restaurants.forEach(function(rest, index){
        if (rest.name === name){
          day.restaurants[index].remove();
        }

      })
    }
  else if(instance == "activity"){
      day.activities.forEach(function(act, index){
        if (act.name === name){
          day.activities[index].remove();
        }

      })
    }
  })
});




module.exports = router;
