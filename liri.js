var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var fs = require('fs');
var arg = process.argv;
var arg2 = arg[2];
var song1 = arg[3];
var song2 = '';
var counter = 1;
var interval;

var client = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

function returnTweets() {
	var twitterParams = {
		id: 924750740664569900,
		screen_name: 'test_acc1979',
		count: 20,
		trim_user: true		
	}
	var twitterText = '\nCommand: ' + arg2 + '\n';
	client.get('statuses/user_timeline', twitterParams, function (error, tweets, response) {
		if (error) {return console.log(error);}
		console.log(`Here is a list of the most recent tweets from user name @${twitterParams.screen_name}`);
		for (var i = tweets.length-1; i>=0; i--) {
			console.log(`Tweet number ${i+1}: "${tweets[i].text}"`);
			twitterText+='\nTweet number '+(i+1)+': "'+tweets[i].text+'"\n';
		}
		twitterText+='\n\n\n';
		fs.appendFile('log.txt', twitterText, function(err) {
			if (err) {console.log(err);}
		});

	});

}


//hyperbolic praise function
function postTweets () {
	interval = setInterval(function () {
		var postParams = {
			status: '{setInterval Gushing praise tweet '+ counter +'}'
		}
		client.post('statuses/update', postParams, function (error, tweet, response) {
			if (error) {return console.log(error);}
			console.log('New tweet posted');
		});
		counter++
		if (counter = 9) {
			clearInterval(interval)
		}
	}, 1000*5);
}

function concatArguments() {
	var string = '';
	if ( arg.length > 4 ) {
		for ( var i = 3; i < arg.length; i++ ) {
			string += arg[i] + ' ';
		}
		return string;
	}
}

function returnSpotify() {
	var spotify = new Spotify({
		id: 'c9c223814f0b4098b18dfdb92caff31f',
		secret: 'b8f57e670581440380bba8780a402e3f'
	});
 	song1 = concatArguments() || arg[3];
		if (song1===undefined) {
	 		song1 = 'I want it that way';
	 	}
 	var songTitle = song2 || song1;
 	var queryObj = {
		type: 'track', 
		query: songTitle,
		limit: 1
 	}
 	console.log(songTitle);
	spotify.search(queryObj, function(error, data) {

		if (error) {return console.log(error);}
		var track = data.tracks.items[0];
		console.log(`The artist's name is: "${track.artists[0].name}"`)
		console.log('===================');
		console.log(`The song's name is: "${track.name}"`);
		console.log('===================');
		console.log(`A link to the preview: "${track.preview_url}"`);
		console.log('===================');
		console.log(`This song comes from the album: "${track.album.name}"`);
		var spotifyText = `\nCommand: ${arg2}\n\nThe artist's name is: "${track.artists[0].name}"\n
The song's name is: "${track.name}"\n
A link to the preview: "${track.preview_url}"\n
This song comes from the album: "${track.album.name}"\n\n\n\n`;
		fs.appendFile('log.txt', spotifyText, function(err) {
			if (err) {console.log(err);}
		});

	});
}

function returnOMDB() {
	
	var title = concatArguments() || arg[3];
	var tomatoes = false;
	var rating = '';
	var queryURL = "https://www.omdbapi.com/?t=" + title + "&tomatoes=true&y=&plot=short&apikey=40e9cece"
	request(queryURL, function (error, response, body) {
		var movie = JSON.parse(body);
		for ( var i = 0; i <movie.Ratings.length; i++ ) {
			if (movie.Ratings[i].Source==='Rotten Tomatoes') {
				tomatoes = true;
				rating = movie.Ratings[i].Value;
			}
		}
		if (error) throw error;


		console.log(`The title is: "${movie.Title}"`);
		console.log('===================');
		console.log(`Year released: "${movie.Year}"`);
		console.log('===================');
		if (movie.imdbRating!=='undefined') {
			console.log(`The IMDB rating is: "${movie.imdbRating}"`);
			console.log('===================');
		}
		if (tomatoes) {
			console.log(`The Rotten Tomatoes rating is: "${rating}"`);
			console.log('===================');
		}
		console.log(`The movie was produced in the country: "${movie.Country}"`);
		console.log('===================');
		console.log(`The language the movie is in: "${movie.Language}"`);
		console.log('===================');
		console.log(`Plot summary: "${movie.Plot}"`);
		console.log('===================');
		console.log(`List of actors: "${movie.Actors}"`);
		var omdbText = `\nCommand: ${arg2}\n\nThe title is: "${movie.Title}"\n
Year released: "${movie.Year}"\n
The IMDB rating is: "${movie.imdbRating}"\n
The Rotten Tomatoes rating is: "${rating}"\n
The movie was produced in the country: "${movie.Country}"\n
The movie was produced in the country: "${movie.Country}"\n
The language the movie is in: "${movie.Language}"\n
Plot summary: "${movie.Plot}"\n
List of actors: "${movie.Actors}"\n\n\n\n`;

		fs.appendFile('log.txt', omdbText, function(err) {
			if (err) {console.log(err);}
		});
	});
	}


function doWhatItSays() {
	
	fs.readFile('random.txt', 'utf8', function (err, data) {
		if (err) {return console.log(err);}
		var songArr = data.split(','); 
		// arg2 = songArr[0].trim();
		song2 = songArr[1].trim();
		returnSpotify();
	});
}


var command = {
	'my-tweets': returnTweets,
	'spotify-this-song': returnSpotify,
	'movie-this': returnOMDB,
	'do-what-it-says': doWhatItSays
}

// postTweets();
command[arg2]();