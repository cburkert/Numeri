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

	var overthousand = Math.floor( num / 1000 );
	if ( overthousand == 0 || num % 1000 != 0 ) {
		solution = getUnderThousandRange( num );
	} else {
		solution = "";
	}
	num = overthousand;

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
		num = Math.floor( num / 1000 );
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

	if ( hundreds > 0 && tens == 0 && units == 0 ) {
		return hstring;
	} else if ( tens < 2 ) {
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
	document.getElementById("challenge").solution.value = "continuare";
	document.getElementById("challenge").solution.setAttribute("onclick", "next()");
}

function next() {
	document.getElementById("challenge").proposal.removeAttribute("readonly");
	document.getElementById("challenge").proposal.setAttribute("onkeyup", "checkInput(document.getElementById(\"challenge\").proposal.value)");
	document.getElementById("challenge").solution.value = "Soluzione";
	document.getElementById("challenge").solution.setAttribute("onclick", "showSolution()");
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
		alert("Invalid settings " + min + " " + max);
	} else if ( min > max ) {
		alert("Min is greater than max!");
	} else if ( getMagnitudeOrder(max) > POWERS.length ) {
		alert("Numbers greater than '" + POWERS[POWERS.length-1] + "' are not supported.");
	} else {
		next();
	}
}
