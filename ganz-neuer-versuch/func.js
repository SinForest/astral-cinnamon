			// function getFromText(input)
			// {
				// var vectors = new Array();
				// $.get(input, function(data){
					// var tmp_1 = data.split("/n");
					// for(var i=0; i < tmp_1.length(); i++)
					// {
						// vectors[i] = new Array();
						// var tmp_2 = tmp_1[i].split(",");
						// for(var j=0; j < tmp_2.length(); j++)
						// {
							// vectors[i][j] = tmp_2[j].split(" ");
							// alert(vectors[i][j][1]);
						// }
					// }
				// });
				// return vectors;
			// }
			
			function getFromText(input)
			{
				var vectors = new Array();
				$.ajax({
					url: input,
					dataType: "text",
					async: false,
					success: function(data){
						var tmp_1 = data.split("\n");
						for(var i=0; i < tmp_1.length; i++) {
							vectors[i] = new Array();							
							//LINESTRING( ) entfernen
							tmp_1[i] = tmp_1[i].substring(11, tmp_1[i].indexOf(")"));
							
							var tmp_2 = tmp_1[i].split(",");							
							for(var j=0; j < tmp_2.length; j++)
							{
								vectors[i][j] = tmp_2[j].split(" ");
							}
						}						
					}
				});	
				return vectors;
			}
			
			function resetCanvas(i_canvas)
			{
				var ctx = i_canvas.getContext("2d");
				ctx.fillStyle = "#1F1F1F"; //Dunkelgrau füllen;
				ctx.fillRect(0,0,canW,canH); //Füllen vom Canvas;
			}
			
			function drawStreets(i_canvas, i_vectors)
			{
				var ctx = i_canvas.getContext("2d");
				ctx.strokeStyle = "#0040FF"; //Straßen sind blau;
				var Xmax = rightBottomLongitude - leftUpperLongitude;					
				var Ymax = rightBottomLatitude - leftUpperLatitude;
				for (var stra=0; stra < i_vectors.length; stra++)
				{
					for (var vec=0; vec < i_vectors[stra].length; vec++)
					{					
						var XKord = (i_vectors[stra][vec][0] - leftUpperLongitude) / (Xmax/canW);
						var YKord = (i_vectors[stra][vec][1] - leftUpperLatitude) / (Ymax/canH);
						if(vec == 0)
						{
							ctx.moveTo( XKord , YKord );
						}
						else
						{
							ctx.lineTo( XKord , YKord );
						}
					}
				}
				ctx.stroke();
			}