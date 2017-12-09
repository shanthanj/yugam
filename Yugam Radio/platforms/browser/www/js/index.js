
var progressTimer;

var playButton;
var stopButton;
var activityIndicator;
var textPosition;

document.addEventListener("deviceready", onDeviceReady, false);

document.addEventListener('init', function(event) {

	//initialize variables
	playButton = document.getElementById('playbutton');
	stopButton = document.getElementById('stopbutton');
	activityIndicator = document.getElementById('activityindicator');
	textPosition = document.getElementById('textposition');



  var page = event.target;

  if (page.id === 'home') {
    page.querySelector('#push-button').onclick = function() {
      document.querySelector('#myNavigator').pushPage('shows.html', {data: {title: 'Shows'}});
    };
  } else if (page.id === 'shows') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }
});

function onDeviceReady() {
	html5audio.play();
	getStreamStats();
	return false;
}

function getStreamStats() {
	$.ajax({
        url: "http://50.22.219.37:36626/statistics?json=1",
        type: "GET",
        success: function(data) {
            //console.log("polling");
						var songAndArtist = data.streams[0].songtitle;
						var song = songAndArtist.split(" - ")[1];
						var artist = songAndArtist.split(" - ")[0];
						$('#songTitle').text(song);
						$('#singerInfo').text(artist);
        },
        dataType: "json",
        complete: setTimeout(function() {getStreamStats()}, 10000),
        timeout: 2000
    });
}



function onError(error)
{
	console.log(error.message);
}

function onConfirmRetry(button) {
	if (button == 1) {
		html5audio.play();
	}
}

function pad2(number) {
	return (number < 10 ? '0' : '') + number
}

var myaudioURL = 'http://50.22.219.37:36626/;';
var myaudio = new Audio(myaudioURL);
var isPlaying = false;
var readyStateInterval = null;

var html5audio = {
	play: function()
	{
		isPlaying = true;
		myaudio.play();

		readyStateInterval = setInterval(function(){
			 if (myaudio.readyState <= 2) {
				 playButton.style.display = 'none';
				 activityIndicator.style.display = 'block';
				 textPosition.innerHTML = 'loading...';
			 }
		},1000);
		myaudio.addEventListener("timeupdate", function() {
			 var s = parseInt(myaudio.currentTime % 60);
			 var m = parseInt((myaudio.currentTime / 60) % 60);
			 var h = parseInt(((myaudio.currentTime / 60) / 60) % 60);
			 if (isPlaying && myaudio.currentTime > 0) {
				 textPosition.innerHTML = pad2(h) + ':' + pad2(m) + ':' + pad2(s);
			 }
		}, false);
		myaudio.addEventListener("error", function() {
			 console.log('myaudio ERROR');
		}, false);
		myaudio.addEventListener("canplay", function() {
			 console.log('myaudio CAN PLAY');
		}, false);
		myaudio.addEventListener("waiting", function() {
			 //console.log('myaudio WAITING');
			 isPlaying = false;
			 playButton.style.display = 'none';
			 stopButton.style.display = 'none';
			 activityIndicator.style.display = 'block';
		}, false);
		myaudio.addEventListener("playing", function() {
			 isPlaying = true;
			 playButton.style.display = 'none';
			 activityIndicator.style.display = 'none';
			 stopButton.style.display = 'block';
		}, false);
		myaudio.addEventListener("ended", function() {
			 //console.log('myaudio ENDED');
			 html5audio.stop();
			 // navigator.notification.alert('Streaming failed. Possibly due to a network error.', null, 'Stream error', 'OK');
			 // navigator.notification.confirm(
			 //	'Streaming failed. Possibly due to a network error.', // message
			 //	onConfirmRetry,	// callback to invoke with index of button pressed
			 //	'Stream error',	// title
			 //	'Retry,OK'		// buttonLabels
			 // );
			 if (window.confirm('Streaming failed. Possibly due to a network error. Retry?')) {
			 	onConfirmRetry();
			 }
		}, false);
	},
	pause: function() {
		isPlaying = false;
		clearInterval(readyStateInterval);
		myaudio.pause();
		stopButton.style.display = 'none';
		activityIndicator.style.display = 'none';
		playButton.style.display = 'block';
	},
	stop: function() {
		isPlaying = false;
		clearInterval(readyStateInterval);
		myaudio.pause();
		stopButton.style.display = 'none';
		activityIndicator.style.display = 'none';
		playButton.style.display = 'block';
		myaudio = null;
		myaudio = new Audio(myaudioURL);
		textPosition.innerHTML = '';
	}
};
