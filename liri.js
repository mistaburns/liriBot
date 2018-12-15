require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var moment = require("moment");
var request = require("request");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);


function pick () {
  if ("concert-this"){
    bands();
  }else if ("spotify-this-song"){
    runSpotify();
  }else if ("movie-this"){
    movies();
  }else if ("do-what-it-says"){
    runGeneric();
  }else {
    console.log("LiriBot doesn't have the answers you seek!");
  }
};


function start (argOne, argTwo) {
  pick(argOne, argTwo);
};

start(process.argv[2], process.argv.slice(3).join(" "));

function movies (movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var bandsURL =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  get(bandsURL).then(
    function(response) {
      var results = response.data;

      console.log("Title: " + results.Title);
      console.log("Year: " + results.Year);
      console.log("Rated: " + results.Rated);
      console.log("Rating: " + results.imdbRating);
      console.log("Plot: " + results.Plot);
      console.log("Cast: " + results.Actors);
    }
  );
};

function runGeneric() {
  fs.readFile("random.txt", "utf8", function(error, res) {
    console.log(res);
  });
};


function bands(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=6be2f02247251af1952eb1814941de88";

  get(queryURL).then(
    function(res) {
      var resData = res.data;
      if (!resData.length) {
        console.log("No results found for " + artist);
        return;
      }
      console.log("Upcoming concerts for " + artist + ":");
      for (var i = 0; i < resData.length; i++) {
        var show = resData[i];
        console.log(
          show.venue.city + "," + show.venue.country +" at " + show.venue.name + " " +
          moment(show.datetime).format("MM/DD/YYYY")
        );
      }
    }
  );
};
