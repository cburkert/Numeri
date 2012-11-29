var IRREG = new Array(
    "cero", "uno", "dos", "tres", "cuatro", "cinco",
    "seis", "siete", "ocho", "nueve",
    "diez", "once", "doce", "trece", "catorce", "quince",
    "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte",
    "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco",
    "veintiséis", "veintisiete", "veintiocho", "veintinueve"
);

var TENNER = new Array("", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa");

var HUNDREDS = new Array("", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos");

var POWERS = new Array("mil", "millones", "mil millones");
var ONE_POWER = new Array("mil", "un millón", "mil millones");

//var ORDINAL = new Array("", "primo", "secondo", "terzo", "quarto", "quinto", "sesto", "settimo", "ottavo", "nono", "decisimo" );



function getCardinalSolution( num ) {
	var power = 0;
	var solution = "";

	var overthousand = Math.floor( num / 1000 );
	if ( overthousand == 0 || num % 1000 != 0 ) {
		solution = getUnderThousandRange( num, true );
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
	} else if ( tens < 3 ) {
		ustring = IRREG[num % 100];
	} else {
		tstring = TENNER[tens];
		if ( units > 0 ) {
			ustring = IRREG[units];
			if ( withAnd ) {
				ustring = " y " + ustring;
			}
		}
	}

	if ( hundreds > 0 ) {
		hstring += " ";
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
