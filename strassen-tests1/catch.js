var inputFile = "inputs.txt";
var leftUpperLongitude = 8.697115; //Laengengrad X
var leftUpperLatitude = 49.412041; //Breitengrad Y
var rightDownLatitude = 49.410628; //Breitengrad Y
var rightDownLongitude = 8.7013; //Laengengrad X
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