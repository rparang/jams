function Field(val){
  var value = val;
  this.getValue = function(){
      return value;
  };
  this.setValue = function(val){
      value = val;
  };
}

jQuery.extend({
  getValues: function(url) {
    var result = null;
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
            result = data;
        }
    }).done( function(data) {
      $.each(data, function (i, item) {
        buildPlaylist(i, item);
        $("#t-"+i).click(function() {
          $t = $(this).data('track');
          $r = i;
          field.setValue(i);
          loadNewVideo($t, $r, item.id);
        })
      });
    });
    return result;
  }
});

function buildPlaylist(i, item) {
  $('<li>').attr({
    id: 't-'+i,
    class: 'track',
    'data-track': item.youtube_id
  })
  .appendTo("#track-listing");
  $('<span>').html(item.title).appendTo("#t-"+i);
}

//Styles

function updatePlaylistStyle(track_index) {
  $s = $("#t-"+track_index);
  $('.track').removeClass('selected'); //Clear all songs with 'selected' class
  $s.addClass('selected');
}

function addPlayCoverStyle(feed_item_id) {
  $("#cover-"+feed_item_id).children("#play").addClass('pause');
}

function removePlayCoverStyle() {
  $(".cover").children('#play').removeClass('pause');
}

function showPlayer() {
  if (playState.getValue() !== "stopped") {
    $('#player-container').show();
  }
}

function updateTrackName() {
  $('#track-name').html(track_name[field.getValue()]);
}

function updateButtonPlay() {
  if ($('#playpause').hasClass('paused')) {
    $('#playpause').removeClass('paused')
  }
}

function updateButtonPause() {
  if (!$('#playpause').hasClass('paused')) {
    $('#playpause').addClass('paused');
  }
}

function updateButtonBack() {
  if (field.getValue() < 1) {
    $('#back').addClass('inactive');
  }
  else if (field.getValue() > 28) {
    $('#next').addClass('inactive');
  }
  else {
    $('.controls').children().removeClass('inactive');
  }
}


function playFeedTrack(youtube_id, feed_item_id) {
  $("#cover-"+feed_item_id).click(function() {
    var track_index = jQuery.inArray(youtube_id, tracks);
    if (youtube_id == youtubeStateId.getValue()) { //If item I'm clicking is also same item in current state
      if (playState.getValue() == "stopped") {
        field.setValue(track_index); //Set playlist index
        loadNewVideo(youtube_id, track_index, feed_item_id);
      }
      else if (playState.getValue() == "playing") {
        pause();
        playState.setValue("paused");
        removePlayCoverStyle();
        updateButtonPause();
      }
      else {
        play();
        playState.setValue("playing");
        addPlayCoverStyle(feed_item_id);
        updateButtonPlay();
      }
    }
    else {
      field.setValue(track_index); //Set playlist index
      loadNewVideo(youtube_id, track_index, feed_item_id);
    }
  });
};

function loadPlayer(track_id) {
  var params = { allowScriptAccess: "always" };
  var atts = { id: "ytapiplayer" };
  swfobject.embedSWF("http://www.youtube.com/v/" + track_id + 
                     "?version=3&enablejsapi=1&playerapiid=player1&autoplay=0", 
                     "yt-player", "250", "220", "9", null, null, params, atts);
}

function loadNewVideo(track_id, track_index, feed_item_id) {
  updatePlaylistStyle(track_index); //Playlist selected item
  updateTrackName(); //Track name on player
  updateButtonPlay(); //Make track player show pause button while playing
  updateButtonBack(); //Update back button depending on playlist index
  removePlayCoverStyle();
  addPlayCoverStyle(feed_item_id);

  ytapiplayer.loadVideoById(track_id);
  youtubeStateId.setValue(track_id);

  playState.setValue("playing");
  showPlayer();

}

function initialize(start_index, track_id) {
  loadPlayer(track_id);
  updatePlaylistStyle(start_index);
  playState.setValue("stopped");
  youtubeStateId.setValue(tracks[field.getValue()]);
}

function updatePlayerInfo() {
  if(ytplayer && ytplayer.getDuration) {
    $('#videoDuration').html(secondsToHms(ytplayer.getDuration()));
    $('#videoCurrentTime').html(secondsToHms(ytplayer.getCurrentTime()));
    $('#bytesTotal').html(ytplayer.getVideoBytesTotal());
    $("#startBytes").html(ytplayer.getVideoStartBytes());
    $("#bytesLoaded").html(ytplayer.getVideoBytesLoaded());
  }
}
  
function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById("ytapiplayer");
  ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
  setInterval(updatePlayerInfo, 500);
  updatePlayerInfo();
}

function play() {
  ytapiplayer.playVideo();
}

function pause() {
  ytapiplayer.pauseVideo();
}

function stop() {
  ytapiplayer.stopVideo();
}

function halfMute(value) {
  ytapiplayer.setVolume(value);
}

function nextVideo() {
  ytapiplayer.nextVideo();
}

