var inputFile = "inputs.txt";
var leftUpperLongitude = 8.659085; //Laengengrad X
var leftUpperLatitude = 49.434311; //Breitengrad Y
var rightDownLatitude = 49.390474; //Breitengrad Y
var rightDownLongitude = 8.712819; //Laengengrad X
vectors = Array();

$(document).ready(function() {
	// inhalt von "data.txt" einlesen/laden
    // inhalt der datei steht dann in "msg"
    $("#container").load(inputFile, function(msg) {
        // den inhalt/rückgabewert nach zeilenumbrüchen aufteilen
        // und in ein array ablegen
        var tmpArray = msg.split("\n");
        
        // array durchlaufen
        for(var i=0;i<tmpArray.length;i++)
        {
        	vectors[i] = Array();
        	var tmpCoords = tmpArray[i].split(",");
        	for (var j=0;j<tmpCoords.length;j++) {
        		vectors[i][j] = tmpCoords[j].split(" ");
        	}            
        }
        draw();
    });
});