	//Alle Vektoren innerhalb von dem Rechteck (x0,y0),(x1,y1) aus dem Lokalspeicher laden bzw. von Server holen und lokal speichern. 
	function getBuildingVectorRectangle(x0, y0, x1, y1) {
		//da verdammte scheiß Rundungsfehler in JS entstehen, weil es nicht mit FLoat Zahlen umgehen kann... runden!!!
		x0 = parseFloat(x0).toFixed(decimalPlace);
		y0 = parseFloat(y0).toFixed(decimalPlace);
		x1 = parseFloat(x1).toFixed(decimalPlace);
		y1 = parseFloat(y1).toFixed(decimalPlace);
		/*x0 = Math.round(x0*1000)/1000;
		y0 = Math.round(y0*1000)/1000;
		x1 = Math.round(x1*1000)/1000;
		y1 = Math.round(y1*1000)/1000;*/
		//console.log('('+x0+','+y0+'),('+x1+','+y1+')   Ergebniss: '+localStorage['[['+x0+','+y0+'],['+x1+','+y1+']]']);
		if (localStorage['[['+x0+','+y0+'],['+x1+','+y1+']]'] != undefined) {
			//Rechteck-Ausschnitt der Vektoren vorhanden.
			return JSON.parse(localStorage['[['+x0+','+y0+'],['+x1+','+y1+']]']);			
		} else {
			//Abfrage beim Server mittels Hilfsfunktion (getFromText), die alle GebäudeVektoren in einem Array zurückgibt
			var tmpVectorArray = getFromText("crawl.php?x0="+x0+"&y0="+y0+"&x1="+x1+"&y1="+y1);
			//Speichern in localStorage 
			localStorage['[['+x0+','+y0+'],['+x1+','+y1+']]'] = JSON.stringify(tmpVectorArray); 			
			//Zurückgeben 
			console.log("ACHTUNG SERVERABFRAGE");
			return tmpVectorArray;
		}
		
	}

	//Hilfsfunktion um Vektoren in einem bestimmten Rechteck aus der input Datei auslesen.
	function getFromText(input) {
        var vectors = new Array();
        $.ajax({
            url: input,
            dataType: "text",
            async: false,
            success: function(data){
               var tmp_1 = data.split("\n");               
               for(var i=0; i < tmp_1.length; i++) {            	   
                   vectors[i] = new Array();                                                      
                   //POLYGON(( )) entfernen
                   tmp_1[i] = tmp_1[i].substring(9, tmp_1[i].indexOf("))"));                   
                   var tmp_2 = tmp_1[i].split("),(");
                   for(var j=0; j < tmp_2.length; j++)
	               {
                	   vectors[i][j] = new Array();
                	   var tmp_3 = tmp_2[j].split(",");
                	   for(var k=0; k < tmp_3.length; k++)
                       {
                		   vectors[i][j][k] = tmp_3[k].split(" ");                		   
                		   for(var l=0;l<vectors[i][j][k].length;l++) {
                			   vectors[i][j][k][l] = parseFloat(vectors[i][j][k][l]);									
                		   }
                       }
	               }                   
               }                                              
            }
        });    
        return vectors;
    }
		
	
	
	function init() {
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		
		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight , 1, 5000 );
	    camera.position.x=0;
	    camera.position.y=-1500;
	    camera.position.z=100;	    
	    
	    scene = new THREE.Scene();
	    
	    var tmp_x0 = Math.floor(1/stepLongitude * userPositionLongitude)/ (1/stepLongitude);//X Wert links unten 
		var tmp_y0 = Math.floor(1/stepLatitude  * userPositionLatitude) / (1/stepLatitude);	//Y Wert links unten 
		//var tmp_x1 = Math.round((tmp_x0 + stepLongitude)*10000)/10000;						//X Wert rechts oben 
		//var tmp_y1 = Math.round((tmp_y0 + stepLatitude)*10000)/10000;						//Y Wert rechts oben
		var tmp_x1 = tmp_x0 + stepLongitude;						//X Wert rechts oben 
		var tmp_y1 = tmp_y0 + stepLatitude;							//Y Wert rechts oben
		tmp_x0 = parseFloat(tmp_x0).toFixed(decimalPlace);
		tmp_y0 = parseFloat(tmp_y0).toFixed(decimalPlace);
		tmp_x1 = parseFloat(tmp_x1).toFixed(decimalPlace);
		tmp_y1 = parseFloat(tmp_y1).toFixed(decimalPlace);

		//Anzahl an Vektor-Rechtecken laden
		for (var i= -loadRectanglesHorizontal; i<= loadRectanglesHorizontal; i++) {
			for (var j = loadRectanglesVertical; j>= -loadRectanglesVertical; j--) {
				var x0 = parseFloat(tmp_x0) + i*parseFloat(stepLongitude);
				var y0 = parseFloat(tmp_y0) - j*parseFloat(stepLatitude);
				var x1 = parseFloat(tmp_x1) + i*parseFloat(stepLongitude);
				var y1 = parseFloat(tmp_y1) - j*parseFloat(stepLatitude);
				x0 = parseFloat(x0).toFixed(decimalPlace);
				y0 = parseFloat(y0).toFixed(decimalPlace);
				x1 = parseFloat(x1).toFixed(decimalPlace);
				y1 = parseFloat(y1).toFixed(decimalPlace);
				var tmp = getBuildingVectorRectangle(x0, y0 , x1, y1);
				addBuildingVectorRectangle("[["+x0+","+y0+"],["+x1+","+y1+"]]", tmp);
			}
		}
		
	    renderer = new THREE.CanvasRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );	
		
		//Clipping-Code + Initialisierung von conT/canT:
		canT = document.getElementsByTagName('canvas')[0];
		conT = canT.getContext('2d');
		conT.beginPath;
		conT.moveTo(scWidth/2,scHeight/2);
		conT.arc(scWidth/2,scHeight/2,scHeight/2.1,0, Math.PI*2, false);
		conT.stroke();
		conT.clip();
	    
		
		window.addEventListener( 'resize', onWindowResize, false );
	}
	
//Aktionen, die beim Verändern der aktuellen GPS Koordinate ausgeführt werden soll. Übergeben werden die neuen Koordinaten des Users 
function onUserMove(x,y) {
	//Überprüfen, ob wirklich Position geändert wurde 
	if ( (userPositionLongitude != x) || (userPositionLatitude != y) ) {
		//Karte aktualsieren, neue Werte übergeben 
		actualizeMap(x,y);
		//GPS Koordinaten global aktualisieren 
		userPositionLongitude = x;
		userPositionLatitude = y;					
	}
}

	
	
//Funktion bekommt neue Daten
function actualizeMap(newPositionX, newPositionY) {
	//Prüfen ob noch innerhalb eines vorgegeben Rechtecks 					
	var tmp_x0 = Math.floor(1/stepLongitude * userPositionLongitude)/ (1/stepLongitude);//alter X Wert links unten (Position noch nicht global in userPosition geschrieben) 
	var tmp_y0 = Math.floor(1/stepLatitude  * userPositionLatitude) / (1/stepLatitude);	//alter Y Wert links unten 
	var tmp_x1 = tmp_x0 + stepLongitude;						//alter X Wert rechts oben 
	var tmp_y1 = tmp_y0 + stepLatitude;							//alter Y Wert rechts oben 
	tmp_x0 = parseFloat(x0).toFixed(decimalPlace);
	tmp_y0 = parseFloat(y0).toFixed(decimalPlace);
	tmp_x1 = parseFloat(x1).toFixed(decimalPlace);
	tmp_y1 = parseFloat(y1).toFixed(decimalPlace);
	console.log("LOG");
	console.log(tmp_x0);
	console.log(tmp_y0);
	console.log(tmp_x1);
	console.log(tmp_y1);
	
	//wenn nicht mehr im selben Rechteck müssen weitere Rechtecke geladen werden:
	if((newPositionX > tmp_x1) && (newPositionY > tmp_y1)) {
		//nach rechts-oben
		for (var i= -loadRectanglesHorizontal; i <= loadRectanglesHorizontal; i++) {
			for(var j= loadRectanglesVertical; j >= -loadRectanglesVertical; j--) {	
				if ((i == loadRectanglesHorizontal) || (j == loadRectanglesVertical)) {
					var x0 = tmp_x0 + (i+1)*parseFloat(stepLongitude);;
						x0 = parseFloat(x0).toFixed(decimalPlace);
					var y0 = tmp_y0 + (j+1)*parseFloat(stepLatitude);
						y0 = parseFloat(y0).toFixed(decimalPlace);
					var x1 = tmp_x1 + (i+1)*parseFloat(stepLongitude);;
						x1 = parseFloat(x1).toFixed(decimalPlace);
					var y1 = tmp_y1 + (j+1)*parseFloat(stepLatitude);
						y1 = parseFloat(y1).toFixed(decimalPlace);
					var tmp = getBuildingVectorRectangle(x0, y0 , x1, y1);
					addBuildingVectorRectangle("[["+x0+","+y0+"],["+x1+","+y1+"]]", tmp);
				}
			}
		}					

	}
	else if((newPositionX < tmp_x0) && (newPositionY < tmp_y0)) {
		//nach links-unten 
		for (var i= loadRectanglesHorizontal; i >= -loadRectanglesHorizontal; i--) {
			for(var j= -loadRectanglesVertical; j <= loadRectanglesVertical; j++) {	
				if ((i == -loadRectanglesHorizontal) || (j == -loadRectanglesVertical)) {
					var x0 = tmp_x0 + (i-1)*parseFloat(stepLongitude);;
						x0 = parseFloat(x0).toFixed(decimalPlace);
					var y0 = tmp_y0 + (j-1)*parseFloat(stepLatitude);
						y0 = parseFloat(y0).toFixed(decimalPlace);
					var x1 = tmp_x1 + (i-1)*parseFloat(stepLongitude);;
						x1 = parseFloat(x1).toFixed(decimalPlace);
					var y1 = tmp_y1 + (j-1)*parseFloat(stepLatitude);
						y1 = parseFloat(y1).toFixed(decimalPlace);
					var tmp = getBuildingVectorRectangle(x0, y0 , x1, y1);
					addBuildingVectorRectangle("[["+x0+","+y0+"],["+x1+","+y1+"]]", tmp);
				}
			}
		}
	}
	else if((newPositionX < tmp_x0) && (newPositionY > tmp_y1)) {
		//nach links-oben 
		for (var i= loadRectanglesHorizontal; i >= -loadRectanglesHorizontal; i--) {
			for(var j= loadRectanglesVertical; j >= -loadRectanglesVertical; j--) {	
				if ((i == -loadRectanglesHorizontal) || (j == loadRectanglesVertical)) {
					var x0 = tmp_x0 + (i-1)*parseFloat(stepLongitude);;
						x0 = parseFloat(x0).toFixed(decimalPlace);
					var y0 = tmp_y0 + (j+1)*parseFloat(stepLatitude);
						y0 = parseFloat(y0).toFixed(decimalPlace);
					var x1 = tmp_x1 + (i-1)*parseFloat(stepLongitude);;
						x1 = parseFloat(x1).toFixed(decimalPlace);
					var y1 = tmp_y1 + (j+1)*parseFloat(stepLatitude);
						y1 = parseFloat(y1).toFixed(decimalPlace);
					var tmp = getBuildingVectorRectangle(x0, y0 , x1, y1);
					addBuildingVectorRectangle("[["+x0+","+y0+"],["+x1+","+y1+"]]", tmp);
				}
			}
		}
	}
	else if((newPositionX > tmp_x1) && (newPositionY < tmp_y0)) {
		//nach rechts-unten
		for (var i= -loadRectanglesHorizontal; i <= loadRectanglesHorizontal; i++) {
			for(var j= -loadRectanglesVertical; j <= loadRectanglesVertical; j++) {	
				if ((i == loadRectanglesHorizontal) || (j == -loadRectanglesVertical)) {
					var x0 = tmp_x0 + (i+1)*parseFloat(stepLongitude);;
						x0 = parseFloat(x0).toFixed(decimalPlace);
					var y0 = tmp_y0 + (j-1)*parseFloat(stepLatitude);
						y0 = parseFloat(y0).toFixed(decimalPlace);
					var x1 = tmp_x1 + (i+1)*parseFloat(stepLongitude);;
						x1 = parseFloat(x1).toFixed(decimalPlace);
					var y1 = tmp_y1 + (j-1)*parseFloat(stepLatitude);
						y1 = parseFloat(y1).toFixed(decimalPlace);
					var tmp = getBuildingVectorRectangle(x0, y0 , x1, y1);
					addBuildingVectorRectangle("[["+x0+","+y0+"],["+x1+","+y1+"]]", tmp);
				}
			}
		}
	} else if (tmp_x1 < newPositionX) {					
		//nach rechts
		for (var i= -loadRectanglesHorizontal; i <= loadRectanglesHorizontal; i++) {
			for(var j= loadRectanglesVertical; j >= -loadRectanglesVertical; j--) {	
				if (i == loadRectanglesHorizontal) {
					var x0 = tmp_x0 + (1+loadRectanglesHorizontal)*parseFloat(stepLongitude);;
						x0 = parseFloat(x0).toFixed(decimalPlace);
					var y0 = tmp_y0 + j*parseFloat(stepLatitude);
						y0 = parseFloat(y0).toFixed(decimalPlace);
					var x1 = tmp_x1 + (1+loadRectanglesHorizontal)*parseFloat(stepLongitude);;
						x1 = parseFloat(x1).toFixed(decimalPlace);
					var y1 = tmp_y1 + j*parseFloat(stepLatitude);
						y1 = parseFloat(y1).toFixed(decimalPlace);
					var tmp = getBuildingVectorRectangle(x0, y0 , x1, y1);
					addBuildingVectorRectangle("[["+x0+","+y0+"],["+x1+","+y1+"]]", tmp);
				}
			}
		}
	} else if (tmp_x0 > newPositionX) {
		//nach links 
		for (var i= loadRectanglesHorizontal; i >= -loadRectanglesHorizontal; i--) {
			for(var j= loadRectanglesVertical; j >= -loadRectanglesVertical; j--) {	
				if (i == -loadRectanglesHorizontal) {
					var x0 = tmp_x0 - (1+loadRectanglesHorizontal)*parseFloat(stepLongitude);;
						x0 = parseFloat(x0).toFixed(decimalPlace);
					var y0 = tmp_y0 + j*parseFloat(stepLatitude);
						y0 = parseFloat(y0).toFixed(decimalPlace);
					var x1 = tmp_x1 - (1+loadRectanglesHorizontal)*parseFloat(stepLongitude);;
						x1 = parseFloat(x1).toFixed(decimalPlace);
					var y1 = tmp_y1 + j*parseFloat(stepLatitude);
						y1 = parseFloat(y1).toFixed(decimalPlace);
					var tmp = getBuildingVectorRectangle(x0, y0 , x1, y1);
					addBuildingVectorRectangle("[["+x0+","+y0+"],["+x1+","+y1+"]]", tmp);
				}
			}
		}
	} else if (tmp_y0 < newPositionY) {
		//nach oben 
		for (var i= -loadRectanglesHorizontal; i <= loadRectanglesHorizontal; i++) {
			for(var j= -loadRectanglesVertical; j <= loadRectanglesVertical; j++) {	
				if (j == loadRectanglesVertical) {
					var x0 = tmp_x0 + i*parseFloat(stepLongitude);
						x0 = parseFloat(x0).toFixed(decimalPlace);
					var y0 = tmp_y0 + (1+loadRectanglesVertical)*parseFloat(stepLatitude);
						y0 = parseFloat(y0).toFixed(decimalPlace);
					var x1 = tmp_x1 + i*parseFloat(stepLongitude);
						x1 = parseFloat(x1).toFixed(decimalPlace);
					var y1 = tmp_y1 + (1+loadRectanglesVertical)*parseFloat(stepLatitude);
						y0 = parseFloat(y0).toFixed(decimalPlace);
					var tmp = getBuildingVectorRectangle(x0, y0 , x1, y1);
					addBuildingVectorRectangle("[["+x0+","+y0+"],["+x1+","+y1+"]]", tmp);
				}
			}
		}
	} else if (tmp_y0 > newPositionY) {
		//nach unten 
		for (var i= -loadRectanglesHorizontal; i <= loadRectanglesHorizontal; i++) {
			for(var j= loadRectanglesVertical; j >= -loadRectanglesVertical; j--) {	
				if (j == -loadRectanglesVertical) {
					var x0 = tmp_x0 + i*parseFloat(stepLongitude);
						x0 = parseFloat(x0).toFixed(decimalPlace);
					var y0 = tmp_y0 - (1+loadRectanglesVertical)*parseFloat(stepLatitude);
						y0 = parseFloat(y0).toFixed(decimalPlace);
					var x1 = tmp_x1 + i*parseFloat(stepLongitude);
						x1 = parseFloat(x1).toFixed(decimalPlace);
					var y1 = tmp_y1 - (1+loadRectanglesVertical)*parseFloat(stepLatitude);
						y1 = parseFloat(y1).toFixed(decimalPlace);
					var tmp = getBuildingVectorRectangle(x0, y0 , x1, y1);							
					addBuildingVectorRectangle("[["+x0+","+y0+"],["+x1+","+y1+"]]", tmp);
				}
			}
		}
	}
	
	//Kamera aktualisieren 
	
						
}


//Funktion zum hinzufügen eines Rechtsecks 
function addBuildingVectorRectangle(key, tmpVectorArray) {				
								
				var geometry = new THREE.Geometry();
			for (var buildingNR=0; buildingNR < tmpVectorArray.length; buildingNR++)
			{
				for (var polygonNR=0; polygonNR < 1/*tmpVectorArray[buildingNR].length*/; polygonNR++)
				{
					tmpVectorArray[buildingNR][polygonNR][0][0] -= initializationLongitude;
					tmpVectorArray[buildingNR][polygonNR][0][1] -= initializationLatitude;
					tmpVectorArray[buildingNR][polygonNR][0][0] *= scaleLongitude;
					tmpVectorArray[buildingNR][polygonNR][0][1] *= scaleLatitude;
					for (var vectorNR=0; vectorNR < tmpVectorArray[buildingNR][polygonNR].length-1; vectorNR++)
					{					
						tmpVectorArray[buildingNR][polygonNR][vectorNR+1][0] -= initializationLongitude;
						tmpVectorArray[buildingNR][polygonNR][vectorNR+1][1] -= initializationLatitude;
						tmpVectorArray[buildingNR][polygonNR][vectorNR+1][0] *= scaleLongitude;
						tmpVectorArray[buildingNR][polygonNR][vectorNR+1][1] *= scaleLatitude;
						
						geometry.vertices.push( new THREE.Vector3(tmpVectorArray[buildingNR][polygonNR][vectorNR][0],   0, tmpVectorArray[buildingNR][polygonNR][vectorNR][1] ) ); //Startwert 
						geometry.vertices.push( new THREE.Vector3(tmpVectorArray[buildingNR][polygonNR][vectorNR+1][0], 0, tmpVectorArray[buildingNR][polygonNR][vectorNR+1][1] ) ); //Endwert
					}
				}
			}
			var material = new THREE.LineBasicMaterial( { color: 0x06123A, opacity: 1, linewidth: 2 } );
			buildingsOnMap[key] = new THREE.Line(geometry, material);
			buildingsOnMap[key].type = THREE.LinePieces;
				scene.add(buildingsOnMap[key]);		
				
				
				var geo = new THREE.Geometry();
				console.log(key);
				var tmp = JSON.parse(key);
				var tmp_x0 = parseFloat((tmp[0][0].toFixed(decimalPlace) - initializationLongitude)*scaleLongitude);
			var tmp_y0 = parseFloat((tmp[0][1].toFixed(decimalPlace) - initializationLatitude)*scaleLatitude);
			var tmp_x1 = parseFloat((tmp[1][0].toFixed(decimalPlace) - initializationLongitude)*scaleLongitude);
			var tmp_y1 = parseFloat((tmp[1][1].toFixed(decimalPlace) - initializationLatitude)*scaleLatitude);
			console.log(tmp_x0);
			console.log(tmp_y0);
			console.log(tmp_x1);
			console.log(tmp_y1);
				geo.vertices.push( new THREE.Vector3(tmp_x0, 0,  tmp_y0));  
				geo.vertices.push( new THREE.Vector3(tmp_x1, 0,  tmp_y0));
				geo.vertices.push( new THREE.Vector3(tmp_x1, 0,  tmp_y0));
				geo.vertices.push( new THREE.Vector3(tmp_x1, 0,  tmp_y1));
				geo.vertices.push( new THREE.Vector3(tmp_x1, 0,  tmp_y1));
				geo.vertices.push( new THREE.Vector3(tmp_x0, 0,  tmp_y1));
				geo.vertices.push( new THREE.Vector3(tmp_x0, 0,  tmp_y1));
				geo.vertices.push( new THREE.Vector3(tmp_x0, 0,  tmp_y0));
				var material = new THREE.LineBasicMaterial( { color: 0xFF000, opacity: 0.5, linewidth: 1 } );
				var x = new THREE.Line(geo, material);
				x.type = THREE.LinePieces;
				scene.add(x);
		}
		
			
	function onWindowResize() {
	
		/*camera.left = window.innerWidth / - zoom;
		camera.right = window.innerWidth / zoom;
		camera.top = window.innerHeight / zoom;
		camera.bottom = window.innerHeight / - zoom;	
		camera.updateProjectionMatrix();	
		renderer.setSize( window.innerWidth, window.innerHeight );
		render();*/
	}
		
	
	
	function animate() {
	
		//requestAnimationFrame( animate );
		render();
	
	}
	
	function render() {
	
		var timer = Date.now() * 0.0001;
		
		//camera.position.z = -Math.cos( targetRotation ) * 200;// * zoom;
		//camera.position.x = Math.sin( targetRotation ) * 200;// * zoom;
		//camera.position.x = 00;
		//camera.position.z = 00;
		camera.lookAt( scene.position );
	
		renderer.render( scene, camera );
		
	
	}