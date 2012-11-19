var IRREG = new Array(
    "zero", "uno", "due", "tre", "quattro", "cinque",
    "sei", "sette", "otto", "nove",
    "dieci", "undici", "dodici", "tredici", "quattordici", "quindici",
    "sedici", "diciassette", "diciotto", "diciannove"
);

var TENNER = new Array("", "dieci", "venti", "trenta", "quaranta", "cinquanta", "sessanta", "settanta", "ottanta", "novanta");

var HUNDREDS = new Array("", "cento", "duecento", "trecento", "quattrocento", "cinquecento", "seicento", "settecento", "ottocento", "novecento");

var POWERS = new Array("mila", "milioni", "miliardi");
var ONE_POWER = new Array("mille", "un milione", "miliardo");

var ORDINAL = new Array("", "primo", "secondo", "terzo", "quarto", "quinto", "sesto", "settimo", "ottavo", "nono", "decisimo" );

var VOWELS = "aeiou";

// static vars
// min and max are inclusive
var min = 0;
var max = 100;
var number = 0;
var solution = "";
var ordinalProb = 1;
var ordinal_enabled = false;

function isVowelAt( str, pos ) {
	if ( str == "" ) {
		return 0;
	}

	if ( pos < 0 ) {
		pos += str.length;
	}
	var c = str.charAt(pos);

	if ( VOWELS.search(c) >= 0 ) {
		var found = 1;
	} else {
		var found = 0;
	}

	return found;
}

function getCardinalSolution( num ) {
	var power = 0;
	var solution = "";

	solution = getUnderThousandRange( num );
	num = Math.floor( num / 1000 );

	while ( num > 0 ) {
		var lowerRange = num % 1000;
		var part = "";

		if ( lowerRange == 1 ) {
			// special case
			part = ONE_POWER[power];
		} else if ( lowerRange > 1 ) {
			part = getUnderThousandRange(lowerRange, new Boolean(true));
			part = part + " " + POWERS[power];
		} else {
			// in case of lowerRange == 0 do nothing
			part = "";
		}

		if ( solution == "" ) {
			solution = part;
		} else if ( part != "" ) {
			solution = part + " " + solution;
		}
		num /= 1000;
		power += 1;
	}

	return solution
}

function getUnderThousandRange( num, withAnd ) {
	var hundreds = Math.floor(num / 100) % 10;
	var tens = Math.floor((num / 10) % 10);
	var units = num % 10;

	var hstring = HUNDREDS[hundreds];
	var tstring = "";
	var ustring = "";

	if ( tens < 2 ) {
		var ustring = IRREG[num % 100];
	} else {
		tstring = TENNER[tens];
		if ( units > 0 ) {
			ustring = IRREG[units];
		}
	}

	// elide double vowels
	if ( isVowelAt(hstring, -1) && isVowelAt(tstring, 0) ) {
		hstring = hstring.substr(0, hstring.length-1);
	}
	if ( isVowelAt(tstring, -1) && isVowelAt(ustring, 0) ) {
		tstring = tstring.substr(0, tstring.length-1);
	}

	return hstring + tstring + ustring;
}


function getOrdinalSolution( num ) {
	var sol = "";

	if ( num <= ORDINAL.length - 1 ) {
		sol = ORDINAL[num];
	} else {
		var cardinal = getCardinalSolution(num);
		sol = cardinal.substr(0, cardinal.length-1);
		if ( sol.charAt(sol.length-1) == "e" ) {
			sol += "simo";
		} else {
			sol += "esimo";
		}
	}

	return sol;
}


function createChallenge() {
	number = min + (max - min)*Math.random();
	number = Math.round(number);
	// randomly question cardinal or ordinal
	if ( !ordinal_enabled || Math.random() < 1 - ordinalProb ) {
		// cardinal
		solution = getCardinalSolution( number );
		document.challenge.number.value = number;
	} else {
		solution = getOrdinalSolution( number );
		document.challenge.number.value = number + unescape("%B0");
	}
	resetProposal();
	document.challenge.proposal.focus();
}


function checkInput( proposal ) {
	if ( proposal == solution ) {
		document.challenge.proposal.setAttribute("class", "correct");
		window.setTimeout("createChallenge()", 1000);
		return;
	}

	var sol_prefix = solution.substr(0, proposal.length);
	if ( sol_prefix != proposal ) {
		document.challenge.proposal.setAttribute("class", "wrong");
	} else {
		document.challenge.proposal.setAttribute("class", "empty");
	}
}

function resetProposal() {
	document.challenge.proposal.value = "";
	document.challenge.proposal.setAttribute("class", "empty");
}

function sleep( seconds ) {
	var now = (new Date).getTime();
	var then = now + ( seconds * 1000 );
	while ( now < then ) {
		now = (new Date).getTime();
	}
}

function showSolution() {
	document.challenge.proposal.value = solution;
	document.challenge.proposal.setAttribute("readonly", "readonly");
	document.challenge.proposal.removeAttribute("onkeyup");
	document.challenge.solution.value = "continuare";
	document.challenge.solution.setAttribute("onclick", "next()");
}

function next() {
	document.challenge.proposal.removeAttribute("readonly");
	document.challenge.proposal.setAttribute("onkeyup", "checkInput(document.challenge.proposal.value)");
	document.challenge.solution.value = "Soluzione";
	document.challenge.solution.setAttribute("onclick", "showSolution()");
	createChallenge();
}

function applySettings() {
	min = parseInt(document.settings.min.value);
	max = parseInt(document.settings.max.value);
	ordinal_enabled = document.settings.ordinal.checked;
	if ( isNaN(min) || isNaN(max) ) {
		alert("Invalid settings " + min + " " + max);
	} else if ( min > max ) {
		alert("Min is greater than max!");
	} else {
		createChallenge();
	}
}
