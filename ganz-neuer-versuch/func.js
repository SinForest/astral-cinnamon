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
							var tmp_2 = tmp_1[i].split(",");							
							for(var j=0; j < tmp_2.length; j++)
							{
								vectors[i][j] = tmp_2[j].split(" ");
								//alert("("+i+","+j+"): "+vectors[i][j][0] + ":" + vectors[i][j][1]);
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
				var Xmax = rightDownLongitude - leftUpperLongitude;					
				var Ymax = rightDownLatitude - leftUpperLatitude;
				for (var stra=0; stra < i_vectors.length; stra++)
				{
					for (var vec=0; vec < i_vectors[stra].length; vec++)
					{
						i_vectors[stra][vec][0] = (i_vectors[stra][vec][0] - leftUpperLongitude) / (Xmax/canW);
						i_vectors[stra][vec][1] = (i_vectors[stra][vec][1] - leftUpperLatitude) / (Ymax/canH);
						if(vec = 0)
						{
							ctx.moveTo( Math.round(i_vectors[stra][0][0]) , Math.round(i_vectors[stra][0][1]) );
						}
						else
						{
							ctx.lineTo( Math.round(i_vectors[stra][vec][0]) , Math.round(i_vectors[stra][vec][1]) );
						}
					}
				}
				ctx.stroke();
			}