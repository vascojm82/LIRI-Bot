let env = require('dotenv').config({path: 'keys/.env'}),
    Spotify = require('node-spotify-api'),
    request = require('request'),
    moment = require('moment'),
    keys = require('./keys'),
    fs = require('fs'),
    prettyjson = require('prettyjson'),
    imdb = require('imdb-api'),
    args = [
        process.argv[2],    //Command
        process.argv.slice(3,process.argv.length).join(" ")   //Argument
    ],
    spotify = new Spotify(keys.credentials.spotify),
    bandsInTownQueryURL = 'https://rest.bandsintown.com/artists/' + args[1] + '/events?app_id=codingbootcamp';

let searchSpotify = (song) => {
  spotify.search({ type: 'track', query: song, limit: 1 })
    .then((response) => {
      console.log(prettyjson.render(response, {noColor: false}));
    })
    .catch((err) => {
      console.log(err);
    });
}

let searchBandsInTown = (queryURL) => {
  request(queryURL, (error, response, body) => {
    if(error)
      console.log(error);
    else{
      console.log(prettyjson.render(body, {noColor: false}));
    }
  })
}

let searchIMDB = (movie_name) => {
  imdb.get(
    { name: movie_name },
    { apiKey: keys.credentials.imdb.key, timeout: 30000 })
    .then(response => {
      console.log(`Title: ${response.title}`);
      console.log(`Year: ${response.year}`);
      console.log(`Rating: ${response.rating}`);
      console.log(`Country: ${response.country}`);
      console.log(`Plot: ${response.plot}`);
    }).catch(err => console.log(err));
}

let readfile = (filename) => {
  fs.readFile(filename, "utf8", (error, data) => {
    if(data){
      var dataArr = data.split(" ");
      dataArr = [
          dataArr[0],    //Command
          dataArr.slice(1,dataArr[1].length).join(" ")   //Argument
      ]
      evaluate(dataArr);
    }else if(error){
      return console.log(error);
    }
  });
}

let evaluate = (value) => {
  switch(value[0]) {
      case 'concert-this':
          searchBandsInTown(bandsInTownQueryURL);
          break;
      case 'spotify-this-song':
          searchSpotify(value[1]);
          break;
      case 'movie-this':
          searchIMDB(value[1]);
          break;
      case 'do-what-it-says':
          readfile("random.txt");
          break;
  }
}

if(args[1] === "" || args[1] == undefined)
  args[1] = 'The Sign';

evaluate(args);
