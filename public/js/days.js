/* global $ mapModule */

var daysModule = (function() {

  var exports = {},
    days = [{
      hotels: [],
      restaurants: [],
      activities: []
    }],
    currentDay = days[0];

  function addDay() {
    var curDay = $('.current-day').text();
    curDay = Number(curDay);
    curDay++;
    $.ajax({
      method: 'POST',
      url: 'api/days',
      data: {number: curDay}
    });
    days.push({
      hotels: [],
      restaurants: [],
      activities: []
    });
    renderDayButtons();
    switchDay(days.length - 1);
  }

  function switchDay(index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay() {
    if (days.length === 1) return;
    var index = days.indexOf(currentDay);
    var curDay = $('.current-day').text();
    $.ajax({
      method: 'delete',
      url: 'api/days/' + curDay,

    })
    days.splice(index, 1);
    switchDay(index);
  }

  function renderDayButtons() {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i) {
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append(
      '<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML(day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ?
      ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    currentDay[attraction.type].push(attraction);
    renderDay(currentDay);
  };

  exports.removeAttraction = function(attraction) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    Object.keys(day).forEach(function(type) {
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      day[type].forEach(function(attraction) {
        $list.append(itineraryHTML(attraction));
        mapModule.drawAttraction(attraction);
      });
    });
  }

  function itineraryHTML(attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name +
      '</span><button data-id="' + attraction._id + '" data-type="' +
      attraction.type +
      '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  function checkIfDay() {
    var check = false;
    $.ajax({
      method: 'GET',
      url: 'api/days'
    }).done(function(data) {
      data.forEach(function(indiv) {
        if (indiv.number === 1) check = true;
      });
      if (!check) {
        $.ajax({
          method: 'POST',
          url: 'api/days',
          data: {
            number: 1
          }
        });
      }
    });
  }



  $(document).ready(function() {
    checkIfDay();
    switchDay(0);
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
