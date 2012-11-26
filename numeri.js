// static vars
// min and max are inclusive
var min = 0;
var max = 100;
var number = 0;
var solution = "";
var ordinalProb = 1;
var ordinal_enabled = false;


/* required language specific functions:
 * - getCardinalSolution( number )
 * - getOrdinalSolution( number )
 */


function separateThousands( num ) {
	var ns = num.toString();
	var len = ns.length;
	var chunklen = len > 3 ? 3 : len;
	var separated = ns.substr( len - chunklen, chunklen );

	for ( var i = len - 3; i > 0; i -= 3 ) {
		chunklen = i > 3 ? 3 : i;
		separated = ns.substr( i - chunklen, chunklen ) + "." + separated;
	}

	return separated;
}

function createChallenge() {
	number = min + (max - min)*Math.random();
	number = Math.round(number);
	// randomly question cardinal or ordinal
	if ( !ordinal_enabled || Math.random() < 1 - ordinalProb ) {
		// cardinal
		solution = getCardinalSolution( number );
		document.getElementById("challenge").number.value = separateThousands(number);
	} else {
		solution = getOrdinalSolution( number );
		document.getElementById("challenge").number.value = separateThousands(number) + unescape("%B0");
	}
	resetProposal();
	var size = solution.length > 20 ? solution.length : 20;
	document.getElementById("challenge").proposal.setAttribute("size", size);
	document.getElementById("challenge").proposal.focus();
}


function checkInput( proposal ) {
	if ( proposal == solution ) {
		document.getElementById("challenge").proposal.setAttribute("class", "correct");
		window.setTimeout("createChallenge()", 1000);
		return;
	}

	var sol_prefix = solution.substr(0, proposal.length);
	if ( sol_prefix != proposal ) {
		document.getElementById("challenge").proposal.setAttribute("class", "wrong");
	} else {
		document.getElementById("challenge").proposal.setAttribute("class", "empty");
	}
}

function resetProposal() {
	document.getElementById("challenge").proposal.value = "";
	document.getElementById("challenge").proposal.setAttribute("class", "empty");
}

function showSolution() {
	document.getElementById("challenge").proposal.value = solution;
	document.getElementById("challenge").proposal.setAttribute("class", "empty");
	document.getElementById("challenge").proposal.setAttribute("readonly", "readonly");
	document.getElementById("challenge").proposal.removeAttribute("onkeyup");
	document.getElementById("solution").setAttribute("class", "hidden");
}

function next() {
	document.getElementById("solution").removeAttribute("class");
	document.getElementById("challenge").proposal.removeAttribute("readonly");
	document.getElementById("challenge").proposal.setAttribute("onkeyup", "checkInput(document.getElementById(\"challenge\").proposal.value)");
	createChallenge();
}

function getMagnitudeOrder( max ) {
	var magnitude = 0;
	max = Math.floor( max / 1000 );
	while ( max > 0 ) {
		magnitude++;
		max = Math.floor( max / 1000 );
	}
	return magnitude;
}

function applySettings() {
	min = parseInt(document.getElementById("settings").min.value);
	max = parseInt(document.getElementById("settings").max.value);
	ordinal_enabled = document.getElementById("settings").ordinal.checked;
	if ( isNaN(min) || isNaN(max) ) {
		alert("Invalid settings:\nEnter numbers!");
	} else if ( min < 0 || max < 0 ) {
		alert("Invalid settings:\nEnter positive numbers!");
	} else if ( min > max ) {
		alert("Invalid setting:\nMax has to be greater than Min!");
	} else if ( getMagnitudeOrder(max) > POWERS.length ) {
		alert("Numbers greater than '" + POWERS[POWERS.length-1] + "' are not supported.");
	} else {
		next();
	}
}
