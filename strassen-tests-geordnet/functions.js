function catchFromTxt(input)
{
	$("#container").load(input, function(msg)
	{
        // den inhalt/rückgabewert nach zeilenumbrüchen aufteilen
        // und in ein array ablegen
        var tmpArray = msg.split("\n");
        var vectors = new Array();
        // array durchlaufen
        for(var i=0;i<tmpArray.length;i++)
        {
        	vectors[i] = Array();
        	var tmpCoords = tmpArray[i].split(",");
        	for (var j=0;j<tmpCoords.length;j++)
					{
        		vectors[i][j] = tmpCoords[j].split(" ");
        	}            
        }
				return vectors;
  });
}

function draw(map, vectors)
{
			var canW = 1280
			var canH = 1024
			var c = document.getElementById(map);
			var ctx = c.getContext("2d");
			ctx.fillStyle = "#1F1F1F"; //Dunkelgrau füllen;
			ctx.strokeStyle = "#0040FF"; //Straßen sind blau;
			ctx.fillRect(0,0,canW,canH); //Füllen vom Canvas;
			var Xmax = rightDownLongitude - leftUpperLongitude;					
			var Ymax = rightDownLatitude - leftUpperLatitude;
				// Die Breite/Höhe der Map wird berechnet;
			for (var stra=0; stra < vectors.length; stra++)
			{
				vectors[stra][0][0] -= leftUpperLongitude;
				vectors[stra][0][1] -= leftUpperLatitude;
					// Jeder Vektor wird relativ zur oberen, linken Ecke angegeben;
				vectors[stra][0][0] /= (Xmax/canW);
				vectors[stra][0][1] /= (Ymax/canH);
					//Die relative Position des Vektors im Canvas wird berechnet;
				ctx.moveTo( Math.round(vectors[stra][0][0]) , Math.round(vectors[stra][0][1]) );
				//Der "drawer" setzt am ersten Punkt der Straße Nr. 'stra' an;
				for (var vec=1; vec < vectors[stra].length; vec++)
				{
					vectors[stra][vec][0] -= leftUpperLongitude;
					vectors[stra][vec][1] -= leftUpperLatitude;
						// Jeder Vektor wird relativ zur oberen, linken Ecke angegeben;
					vectors[stra][vec][0] /= (Xmax/canW);
					vectors[stra][vec][1] /= (Ymax/canH);
						//Die relative Position des Vektors im Canvas wird berechnet;
					ctx.lineTo( Math.round(vectors[stra][vec][0]) , Math.round(vectors[stra][vec][1]) );
						//Der "drawer" bewegt sich zum nächsten Punkt der Straße;
				}
			}
			ctx.stroke();
}