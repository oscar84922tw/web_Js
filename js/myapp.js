var forecast = new Array();
var day = ["day1", "day2", "day3"];
var skycons = new Skycons();
var city = "Taipei";
var cities = ["Taipei ", "New Taipei ", "Taichung ", "Tainan ", "Kaohsiung ", "Keelung", "Taoyuan City ", "Hsinchu City ", "Hsinchu County ", "Miaoli County ", "Changhua County ", "Nantou County ", "Yunlin County ", "Chiayi City ", "Chiayi County ", "Pingtung County ", "Yilan County ", "Hualien County ", "Taitung ", "Penghu ", "Kinmen County", "Matsu"];
var clickC = true;
var F2C = function(temp) {
    return Math.round((temp - 32) / (9 / 5));
}
var chooserIcon = function(code) {
    if ((code > 0 && code < 5) || (code == 35) || (code >= 37 && code < 41) || (code == 45 || code == 47)) {
        return Skycons.RAIN;
    } else if ((code > 4 && code <= 11) || (code == 18) || code == 12) {
        return Skycons.SLEET
    } else if ((code > 30 && code < 33) || (code == 36)) {
        return Skycons.CLEAR_DAY
    } else if (code == 34) {
        return Skycons.CLEAR_NIGHT
    } else if (code == 30 || code == 28 || code == 26 || code == 44) {
        return Skycons.PARTLY_CLOUDY_DAY
    } else if (code == 27 || code == 29) {
        return Skycons.PARTLY_CLOUDY_NIGHT
    } else if ((code > 12 && code < 18) || (code >= 41 && code < 44) || (code == 46)) {
        return Skycons.SNOW
    } else if (code > 19 && code < 23) {
        return Skycons.FOG
    } else if (code == 24) {
        return Skycons.WIND
    }
    // else if ((code == 47)) {
    //     return Skycons.RAIN;
    // }
}

var getData = function(city) {
    src = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + city + "%20City%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
    var temp;
    $.getJSON(src, function(data) {
        today_we = data.query.results.channel.item.condition.code;
        skycons.set("today", chooserIcon(parseInt(today_we)));
        temp = data.query.results.channel.item.condition.temp;
        $(".temperature").text(F2C(temp));
        if (clickC) {
            $(".dropdown-toggle").append(F2C(temp));
        }
        var date = data.query.results.channel.item.condition.date
        $(".date").text(date.slice(4, date.length - 13))
        for (var i = 0; i < 3; i++) {
            forecast[i] = new Array()
            forecast[i][0] = data.query.results.channel.item.forecast[i + 1].code;
            forecast[i][1] = F2C(data.query.results.channel.item.forecast[i + 1].high);
            forecast[i][2] = F2C(data.query.results.channel.item.forecast[i + 1].low);
            forecast[i][3] = data.query.results.channel.item.forecast[i + 1].date;
            $(".d" + day[i]).text(forecast[i][3]);
            $("." + day[i]).text(forecast[i][2] + "~" + forecast[i][1]);
        }

        for (var i = 0; i < 3; i++) {
            // console.log(chooserIcon(forecast[i][0]));
            skycons.add(day[i], chooserIcon(forecast[i][0]));
        }
        skycons.play();
    })
}


$(document).ready(function() {
    getData(city);

    function dd(src) {
        var temp = null;
        $.getJSON(src, function(data) {
            temp = F2C(data.query.results.channel.item.condition.temp);

            return temp;
        })
    }
    $.each(cities, function(i, val) {
        src = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + val + "%20City%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
        $(".dropdown-menu").append("<li role=\"presentation\"><a role=\"menuitem\" tabindex=\"-1\" href=\"#\"><p id = 'temp" + i + "'>" + val + " " + "</p></a></li>")

        $.getJSON(src, function(data) {
            $("#temp" + i).append(F2C(data.query.results.channel.item.condition.temp))
        })
    });
    $('#dropdown li').on('click', function() {
        clickC = false;
        console.log("")
        city = $(this).text();
        $(".dropdown-toggle").html(city);
        getData(city)
    });

});
