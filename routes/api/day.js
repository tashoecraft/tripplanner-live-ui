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
  var newDay = new Day();
  newDay.save().then(function(data) {
    res.send(data);
  });

});

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
router.delete('/:id/:instance', function(req, res, next) {

});


module.exports = router;
