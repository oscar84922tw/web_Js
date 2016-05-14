var forecast = new Array();
var day = ["day1", "day2", "day3"];
var skycons = new Skycons();
var city = "Taipei";
var cities = ["Taipei ", "New Taipei ", "Taichung ", "Tainan ", "Kaohsiung ", "Keelung", "Taoyuan City ", "Hsinchu City ", "Hsinchu County ", "Miaoli County ", "Changhua County ", "Nantou County ", "Yunlin County ", "Chiayi City ", "Chiayi County ", "Pingtung County ", "Yilan County ", "Hualien County ", "Taitung ", "Penghu ", "Kinmen County", "Matsu"];




$(document).ready(function() {
for (var i = 0; i < cities.length; i++) {
    $(".dropdown-menu").append(
      "<li role=\"presentation\"><a role=\"menuitem\" tabindex=\"-1\" href=\"#\">" + cities[i] + "</a></li>"
    )
}
  $('#dropdown li').on('click', function() {
    city = $(this).text() ;
  });

  var src = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + city + "%20City%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
  $.getJSON(src, function(data) {
    console.log(data)
    skycons.set("today", data.query.results.channel.item.condition.text);
    $(".temperature").append(data.query.results.channel.item.condition.temp)
    $(".date").append(data.query.results.channel.item.condition.date)
    for (var i = 0; i < 3; i++) {
      forecast[i] = new Array()
      forecast[i][0] = data.query.results.channel.item.forecast[i + 1].text;
      forecast[i][1] = data.query.results.channel.item.forecast[i + 1].high;
      forecast[i][2] = data.query.results.channel.item.forecast[i + 1].low;
      forecast[i][3] = data.query.results.channel.item.forecast[i + 1].date;
    }


    for (var i = 0; i < 3; i++) {
      if (forecast[i][0].toString() === "Sunny") {
        skycons.add(day[i], Skycons.CLEAR_DAY);
        console.log(skycons);
      } else if (forecast[i][0] === "Partly Cloudy" || forecast[i][0] === "Mostly Cloudy") {
        skycons.add(day[i], Skycons.PARTLY_CLOUDY_DAY);
        console.log(skycons);
      } else if (forecast[i][0] === "Rain") {
        skycons.add(day[i], Skycons.RAIN);
        console.log(skycons);
      } else if (forecast[i][0] === "Cloudy") {
        skycons.add(day[i], Skycons.CLOUDY);
        console.log(skycons);
      }
      console.log(skycons)
      console.log(day[i])
    }
    skycons.play();
  })

  /*
  Get value from Bootstrap dropdown menu
  */





});
