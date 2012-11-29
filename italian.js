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
			part = getUnderThousandRange(lowerRange);
			if ( power == 0 ) {
				// no blank before "mila"
				// you don't drop doubled vowels here
				// http://en.allexperts.com/q/Italian-Language-1584/2012/4/numbers.htm
				// http://www.orbilat.com/Languages/Italian/Grammar/Italian-Numerals.html
				part = part + POWERS[power];
			} else {
				part = part + " " + POWERS[power];
			}
		} else {
			// in case of lowerRange == 0 do nothing
			part = "";
		}

		if ( solution == "" ) {
			solution = part;
		} else if ( part != "" && power == 0 ) {
			// no blank after "mille" and "mila"
			solution = part + solution;
		} else if ( part != "" ) {
			solution = part + " " + solution;
		}
		num = Math.floor( num / 1000 );
		power += 1;
	}

	return solution
}

function getUnderThousandRange( num ) {
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
