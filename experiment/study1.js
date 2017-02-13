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
var nouns = ['baby', 'balloon', 'cake', 'chick', 'elephant', 'gnome', 'hippo', 'house', 'monkey', 'mouse', 'plane', 'umbrella'];

//var nouns = ['baby', 'balloon'];
var dirs = ['asc', 'desc'];
var adjs = ['big', 'small'];
var num_trials = 48;
for (var i = 0; i < nouns.length; i++){
	for (var j = 0; j < dirs.length; j++){
		for (var k = 0; k < adjs.length; k++){
			var stim_element = {noun: nouns[i], dir: dirs[j], adj: adjs[k]};
			stim_set.push(stim_element);
		}
	} 
}

var NUM_PICS = 7;

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
stim_set.unshift({noun:"pretty", dir: "asc", adj: "pretty"}, {noun:"car", dir: "desc", adj:"ugly"});
var totalTrials = stim_set.length;


// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

// ############################## The main event ##############################
var experiment = {

    // The object to be submitted.
    data: {

      noun: [],
      ratings: [],
      elapsed_ms: [],
	  dir: [],
	  adj: [],
	  num_checked: [],
      num_errors: [],
	  lang: [],
      expt_aim: [],
      expt_gen: [],
      user_agent: [],
      window_width: [],
      window_height: [],
    },

    start_ms: 0,  // time current trial started ms
    num_errors: 0,    // number of errors so far in current trial

    // end the experiment
    end: function() {
      showSlide("finished");
      setTimeout(function() {
        turk.submit(experiment.data)
      }, 1500);
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
            experiment.start_ms = Date.now();
            experiment.num_errors = 0;
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
          var beg = "<h3><b> Which ";
		  switch (elem.noun){
			  case "baby":
			  var current_noun = "babies";
			  break;
			  case "balloon":
			  var current_noun = "balloons";
			  break;
			  case "cake":
			  var current_noun = "cakes";
			  break;
			  case "chick":
			  var current_noun = "chicks";
			  break;
			  case "elephant":
			  var current_noun = "elephants";
			  break;
			  case "gnome":
			  var current_noun = "gnomes";
			  break;
			  case "hippo":
			  var current_noun = "hippos";
			  break;
			  case "house":
			  var current_noun = "houses";
			  break;
			  case "monkey":
			  var current_noun = "monkies";
			  break;
			  case "mouse":
			  var current_noun = "mice";
			  break;
			  case "plane":
			  var current_noun = "planes";
			  break;
			  case "umbrella":
			  var current_noun = "umbrellas";
			  break;
			  case "pretty":
			  var current_noun = "balloons";
			  break;
			  case "car":
			  var current_noun = "cars";
			  
		  }
		  var middle = " do you find ";
		  var conc = "?</b></h3>"
		  var current_stimulus = beg + current_noun + middle + elem.adj + conc;
		  $('#currentStim').html(current_stimulus);

          // push all relevant variables into data object
          experiment.data.noun.push(elem.noun);
		  experiment.data.dir.push(elem.dir);
		  experiment.data.adj.push(elem.adj);
          experiment.data.window_width.push($(window).width());
          experiment.data.window_height.push($(window).height());

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
    submitHandler: experiment.submit_comments
  });
  /* experiment.next();
  experiment.next(); */
});

