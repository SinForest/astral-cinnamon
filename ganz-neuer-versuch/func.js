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
                ctx.fillRect(0,0,i_canvas.width,i_canvas.height); //Füllen vom Canvas;
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
                                var XKord = (i_vectors[stra][vec][0] - leftUpperLongitude) / (Xmax/i_canvas.width);
                                var YKord = (i_vectors[stra][vec][1] - leftUpperLatitude) / (Ymax/i_canvas.height);
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
       
        function drawCircle(i_canvas, xPos, yPos, rad)
        {
                var ctx = i_canvas.getContext("2d");
                ctx.strokeStyle = "#FF1020"; //Kreis wird rot;
                var Xmax = rightBottomLongitude - leftUpperLongitude;                                  
                var Ymax = rightBottomLatitude - leftUpperLatitude;
                xPos = (xPos - leftUpperLongitude) / (Xmax/i_canvas.width);
                yPos = (yPos - leftUpperLatitude) / (Ymax/i_canvas.height);
                //alert(xPos);
                //alert(yPos);
                ctx.beginPath();
                ctx.arc(xPos,yPos,rad,0,2*Math.PI);
                ctx.stroke();
        }
        
        
        
        function getLatitude(position) {
        	return position.coords.latitude;  
    	}

    	function getLongitude(position) {
    		return position.coords.longitude;
    	}

    	function x(position) {
    		//console.log(getLatitude(position));
    		console.los(watchID);
    	}

    	function errorHandler(err) {
    	  if(err.code == 1) {
    	    alert("Error: Access is denied!");
    	  }else if( err.code == 2) {
    	    alert("Error: Position is unavailable!");
    	  }
    	}
    	function main(){

    	   if(navigator.geolocation){
    	      // timeout at 60000 milliseconds (60 seconds)
    	      var options = {timeout:7500,maximumAge:refreshInterval*900};
    	      geoLoc = navigator.geolocation;
    	      watchID = geoLoc.watchPosition(x, 
    	                                     errorHandler,
    	                                     options);
    	   }else{
    	      alert("Sorry, browser does not support geolocation!");
    	   }
    	}