// ############################## Helper functions ##############################

// Shows slides. We're using jQuery here - the **$** is the jQuery selector function, which takes as input either a DOM element or a CSS selector string.
function showSlide(id) {
  // Hide all slides
  $(".slide").hide();
  // Show just the slide we want to show
  $("#"+id).show();
}

// Get random integers.
// When called with no arguments, it returns either 0 or 1. When called with one argument, *a*, it returns a number in {*0, 1, ..., a-1*}. When called with two arguments, *a* and *b*, returns a random value in {*a*, *a + 1*, ... , *b*}.
function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}

// Add a random selection function to all arrays (e.g., <code>[4,8,7].random()</code> could return 4, 8, or 7). This is useful for condition randomization.
Array.prototype.random = function() {
  return this[random(this.length)];
}

// shuffle function - from stackoverflow?
// shuffle ordering of argument array -- are we missing a parenthesis?
function shuffle (a)
{
    var o = [];

    for (var i=0; i < a.length; i++) {
      o[i] = a[i];
    }

    for (var j, x, i = o.length;
         i;
         j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// from: http://www.sitepoint.com/url-parameters-jquery/
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
    return null;
  } else{
    return results[1] || 0;
  }
}

// ############################## Configuration settings ##############################
var stim_set = [];
//var nouns = ['baby', 'balloon', 'cake', 'chick', 'elephant', 'gnome', 'hippo', 'house', 'monkey', 'mouse', 'plane', 'umbrella'];

var nouns = ['baby', 'balloon'];
var dirs = ['asc', 'desc'];
var adjs = ['big', 'small'];
var verb = ['seem', 'find', 'are'];

var trial_verb = shuffle(verb).shift();
for (var i = 0; i < nouns.length; i++){
	for (var j = 0; j < dirs.length; j++){
		for (var k = 0; k < adjs.length; k++){
			var stim_element = {noun: nouns[i], dir: dirs[j], adj: adjs[k], vb: trial_verb};
			stim_set.push(stim_element);
		}
	} 
}

var NUM_PICS = 7;
var TEST_WORD = "test";
function getImageFiles(elem) {
	var pic_set = [];
  if (elem.dir  == 'asc') {
			for (var j = 1; j <= NUM_PICS; j++) {
				pic_set.push('images-sara/' + elem.noun + '_' + j + '.png');
			}
			
		} else {
			for (var j = NUM_PICS; j > 0; j--){
				pic_set.push('images-sara/' + elem.noun + '_' + j + '.png');
			}
		}

  return pic_set;
}
stim_set = shuffle(stim_set);
function AreAdjacentNouns(stims) {
	var are_adj = false;
	var i = 0;
	while (are_adj == false && i < (stims.length-1) ) {
		if (stims[i].noun == stims[i+1].noun){
			are_adj = true;			
		} 
		i++;
	}
	return are_adj;
}
while (AreAdjacentNouns(stim_set) == true) {
	stim_set = shuffle(stim_set);
}

stim_set.unshift({noun:"pretty", dir: "asc", adj: "pretty", vb: trial_verb}, {noun:"car", dir: "desc", adj:"ugly", vb: trial_verb});
var totalTrials = stim_set.length;
function getAudioFile(elem) {
	var audio_name = 'audio/mp3s/' + elem.noun + '_' + elem.adj + '_' + elem.vb + '.mp3';
	return audio_name;
}

function getAudioTailLength(elem){
	switch (elem.vb) {
    case "find":
		switch (elem.adj){
			case "small":
				var audio_tail = 0.947;
				break;
			case "big":
				var audio_tail = 0.732;
				break;
			case "pretty":
				var audio_tail = 0.890;
				break;
			case "ugly":
				var audio_tail = 0.879;
				break;
		}
	case "seem":
		switch (elem.adj){
			case "small":
				var audio_tail = 1.259;
				break;
			case "big":
				var audio_tail = 1.108;
				break;
			case "pretty":
				var audio_tail = 1.150;
				break;
			case "ugly":
				var audio_tail = 1.286;
				break;
		}
	case "are":
		switch (elem.adj){
			case "small":
				var audio_tail = 0.956;
				break;
			case "big":
				var audio_tail = 0.715;
				break;
			case "pretty":
				var audio_tail = 0.882;
				break;
			case "ugly":
				var audio_tail = 0.875;
				break;
		}
	}
       
    
	return audio_tail;
}
function getProtStatus(elem){
	switch(elem.noun){
		case "pretty":
			var stat = "na";
			break;
		case "car":
			var stat = "na";
			break;
		case 'baby':
			var stat = "small";
			break;
		case 'balloon':
			var stat = "neither";
			break;
		case 'cake':
			var stat = "neither";
			break;
		case 'chick':
			var stat = "small";
			break;
		case 'elephant':
			var stat = "big";
			break;
		case 'gnome':
			var stat = "small";
			break;
		case 'hippo':
			var stat = "big";
			break;
		case 'house':
			var stat = "big";
			break;
		case 'monkey':
			var stat = "neither";
			break;
		case 'mouse':
			var stat = "small"
			break;
		case 'plane':
			var stat = "big";
			break;
		case 'umbrella':
			var stat = "neither";
			break;
	}
	return stat;
}
var playBtn = document.getElementById('play');
var stopBtn = document.getElementById('stop');

var playSound = function() {
	audio.play();
};

playBtn.addEventListener('click', playSound, false);
stopBtn.addEventListener('click', function(){audio.pause()}, false);
 
/*  $("#startButton").prop("disabled", true);
 
 $(function() {
  $('form#audio_test_form').validate({
	 rules: {	
      "autest": "required",
    },
    messages: {
      "autest": "Please enter the word you heard in lower case letters",
    },
    submitHandler: submit_audio()
  });
function submit_audio() {
	  experiment.data.audio_test.push(document.getElementById("audtest").value);
	  $("#startButton").removeAttr('disabled');
      
    }  
   */
// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

   /*  // submitaudio function
function submit_audio() {
	  experiment.data.audio_test.push(document.getElementById("audtest").value);
      experiment.next();
    }
	
$(function() {
  $('form#audio_test_form').validate({
	 rules: {
      "audtest": "required",
	  "audtest": value = "table",
    },
    messages: {
      "audtest": "Please enter the correct word",
    },
    submitHandler: submit_audio()
  }); */

// ############################## The main event ##############################
var experiment = {

    // The object to be submitted.
    data: {

      noun: [],
      ratings: [],
      elapsed_ms: [],
	  elapsed_first_click_ms: [],
	  dir: [],
	  adj: [],
	  verb: [],
	  num_checked: [],
      num_errors: [],
	  lang: [],
      expt_aim: [],
      expt_gen: [],
      user_agent: [],
      window_width: [],
      window_height: [],
	  prototype_status: [],
    },

    start_ms: 0,  // time current trial started ms
    num_errors: 0,    // number of errors so far in current trial
	first_click: true,

    // end the experiment
	precheck: function(){
		var aut = $("#audtest").val();
		if (aut.toLowerCase() != TEST_WORD) {
			$("#audMessage").html("please enter the text you heard");
		} else {
			experiment.next();
		}
	},
    end: function() {
      showSlide("finished");
      setTimeout(function() {
        turk.submit(experiment.data)
      }, 1500);
    },
	log_checkbox: function() {
		if (!experiment.first_click)
			return;
		experiment.first_click = false;
		var response_time = Date.now() - experiment.start_ms;
		experiment.data.elapsed_first_click_ms.push(response_time);
	},
    // LOG RESPONSE
    log_response: function() {
      var response_logged = false;
      var elapsed = Date.now() - experiment.start_ms;

      //Array of check boxes
      var responses = [];
	  $(".judgment_box").each(function(){
		if($(this).is(':checked')){
			responses.push($(this).attr("value"));
		}
	  });
	  
	  if (responses.length > 0) {
		response_logged = true;
		experiment.data.elapsed_ms.push(elapsed);
		experiment.data.ratings.push(responses);		
		experiment.data.num_checked.push(responses.length)
	  }

      if (response_logged) {
        nextButton.blur();

        // uncheck check boxes
        $(".judgment_box").attr("checked", false);

        $('#stage-content').hide();
        experiment.next();
      } else {
          experiment.num_errors += 1;
          $("#testMessage").html('<font color="red">' +
               'Please make a response!' +
               '</font>');
      }
    },

    // The work horse of the sequence - what to do on every trial.
    next: function() {
      // Allow experiment to start if it's a turk worker OR if it's a test run
      if (window.self == window.top | turk.workerId.length > 0) {
          $("#testMessage").html('');   // clear the test message
          $("#prog").attr("style","width:" +
              String(100 * (1 - stim_set.length/totalTrials)) + "%")
          // style="width:progressTotal%"
          window.setTimeout(function() {
            $('#stage-content').show();            
            experiment.num_errors = 0;
			experiment.first_click = true;
          }, 150);

          // Get the current trial - <code>shift()</code> removes the first element
          // select from our scales array and stop exp after we've exhausted all the domains
          var elem = stim_set.shift();

          //If the current trial is undefined, call the end function.
          if (typeof elem == "undefined") {
            return experiment.debriefing();
          }

          // Display the sentence stimuli
          var image_filenames = getImageFiles(elem);
		  for (i = 1; i<= NUM_PICS; i++){
			  var file_name = image_filenames.shift();
			  $("#noun_" + i).attr('src', file_name);
		  }
		
		$("#nextButton").prop("disabled", true);
		var audio = new Audio();
		audio.loop = false;
		audio.addEventListener("canplaythrough", function() {audio.play();});

		//to load a file; soundFileSource is the filename of the sound file you want to play
		audio.setAttribute("src", getAudioFile(elem));
		audio.load();
		doSomethingAfterAudio(elem);

		//do something when audio ended - this checks in every 50ms once triggered and performs an action when the audio has finished playing
		function doSomethingAfterAudio(elem){
			if (audio.currentTime > audio.duration - getAudioTailLength(elem)) {
				experiment.start_ms = Date.now();
				$("#nextButton").removeAttr('disabled');
			} else {
				setTimeout(function() {doSomethingAfterAudio(elem);}, 50);
			};			
			 
		};
		//var inner_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		//var inner_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        // push all relevant variables into data object
        experiment.data.noun.push(elem.noun);
		experiment.data.dir.push(elem.dir);
		experiment.data.adj.push(elem.adj);
		experiment.data.verb.push(elem.vb);
		experiment.data.prototype_status.push(getProtStatus(elem));  
        experiment.data.window_width.push($(window).width());
        experiment.data.window_height.push($(window).height());
		//experiment.data.inner_win_width.push(inner_w);
        //experiment.data.inner_win_height.push(inner_h);
		

        showSlide("stage");
      }
    },

    //  go to debriefing slide
    debriefing: function() {
      showSlide("debriefing");
    },

    // submitcomments function
    submit_comments: function() {
	  experiment.data.lang.push(document.getElementById("homelang").value);
      experiment.data.expt_aim.push(document.getElementById("expthoughts").value);
      experiment.data.expt_gen.push(document.getElementById("expcomments").value);
      experiment.data.user_agent.push(window.navigator.userAgent);
      experiment.end();
    }
}

$(function() {
  $('form#demographics').validate({
	 rules: {
      "lg": "required",
    },
    messages: {
      "lg": "Please provide your native language",
    },
    submitHandler: experiment.submit_comments
  });
  /* experiment.next();
  experiment.next(); */
  
  $(".judgment_box").change(function(){experiment.log_checkbox();});
});

