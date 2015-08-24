/* global $ daysModule all_hotels all_restaurants all_activities */

$(document).ready(function() {

  var attractionsByType = {
    hotels: all_hotels,
    restaurants: all_restaurants,
    activities: all_activities
  };

  function findByTypeAndId(type, id) {
    var attractions = attractionsByType[type],
      selected;
    attractions.some(function(attraction) {
      if (attraction._id === id) {
        selected = attraction;
        selected.type = type;
        return true;
      }
    });
    return selected;
  }


  $('#attraction-select').on('click', 'button', function() {
    var $button = $(this),
      type = $button.data('type'),
      attractions = attractionsByType[type],
      id = $button.siblings('select').val();
    var findBy = findByTypeAndId(type, id);
    if (type === "hotels"){
    type = type.split("").slice(0, type.length - 1).join(
      "");
    }
    var currentDay = $('.current-day').text();
    console.log("this is the current day" + currentDay);

    $.ajax({
      method: 'POST',
      url: 'api/days/' + currentDay + '/' + type + '/' +
        id
    });
    daysModule.addAttraction(findBy);
  });

  $('#itinerary').on('click', 'button', function() {
    var $button = $(this),
      type = $button.data('type'),
      id = $button.data('id');
    daysModule.removeAttraction(findByTypeAndId(type, id));
  });



});
