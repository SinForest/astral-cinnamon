	//Alle Vektoren innerhalb von dem Rechteck (x0,y0),(x1,y1) aus dem Lokalspeicher laden bzw. von Server holen und lokal speichern. 
	function getVectorRectangle(x0, y0, x1, y1) {
		//da verdammte scheiß Rundungsfehler in JS entstehen, weil es nicht mit FLoat Zahlen umgehen kann... runden!!!
		x0 = Math.round(x0*1000)/1000;
		y0 = Math.round(y0*1000)/1000;
		x1 = Math.round(x1*1000)/1000;
		y1 = Math.round(y1*1000)/1000;
		console.log('('+x0+','+y0+'),('+x1+','+y1+')   Ergebniss: '+localStorage['('+x0+','+y0+'),('+x1+','+y1+')']);
		if (localStorage['('+x0+','+y0+'),('+x1+','+y1+')'] != undefined) {
			//Rechteck-Ausschnitt der Vektoren vorhanden.
			//console.log("Ausgabe: "+localStorage['('+x0+','+y0+'),('+x1+','+y1+')']);
			return JSON.parse(localStorage['('+x0+','+y0+'),('+x1+','+y1+')']);
			//return (localStorage['('+x0+','+y0+'),('+x1+','+y1+')']);
		} else {
			//Abfrage beim Server mittels Hilfsfunktion, die alle Vektoren in einem Array zurückgibt
			var tmpVectorArray = getFromText("crawl.php?x0="+x0+"&y0="+y0+"&x1="+x1+"&y1="+y1);
			//Speichern in localStorage 
			localStorage['('+x0+','+y0+'),('+x1+','+y1+')'] = JSON.stringify(tmpVectorArray); 
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
	    camera.position.x=1;
	    camera.position.y=window.innerWidth;
	    camera.position.z=-100;	    
	    
	    scene = new THREE.Scene();
	    
	    	    
	    
	    var geometry = new THREE.Geometry();	        
	    var Xmax = (leftUpperLongitude - rightBottomLongitude)/2;					
		var Ymax = (leftUpperLatitude  - rightBottomLatitude) /2;
		for (var buildingNR=0; buildingNR < vect.length; buildingNR++)
		{
			for (var polygonNR=0; polygonNR < 1/*vect[buildingNR].length*/; polygonNR++)
			{
				vect[buildingNR][polygonNR][0][0] -= initializationLongitude;
				vect[buildingNR][polygonNR][0][1] -= initializationLatitude;
				vect[buildingNR][polygonNR][0][0] *= window.innerWidth/2  /Xmax;
				vect[buildingNR][polygonNR][0][1] *= window.innerHeight/2 /Ymax;
				for (var vectorNR=0; vectorNR < vect[buildingNR][polygonNR].length-1; vectorNR++)
				{					
					vect[buildingNR][polygonNR][vectorNR+1][0] -= initializationLongitude;
					vect[buildingNR][polygonNR][vectorNR+1][1] -= initializationLatitude;
					vect[buildingNR][polygonNR][vectorNR+1][0] *= window.innerWidth/2  /Xmax;
					vect[buildingNR][polygonNR][vectorNR+1][1] *= window.innerHeight/2 /Ymax;
					
					geometry.vertices.push( new THREE.Vector3(vect[buildingNR][polygonNR][vectorNR][0],   0, vect[buildingNR][polygonNR][vectorNR][1] ) ); //Startwert
					geometry.vertices.push( new THREE.Vector3(vect[buildingNR][polygonNR][vectorNR+1][0], 0, vect[buildingNR][polygonNR][vectorNR+1][1] ) ); //Endwert
				}
			}
		}
		var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1, linewidth: 2 } );
	    //var buildings = new THREE.Line(geometry, material);
		buildings = new THREE.Line(geometry, material);
	    buildings.type = THREE.LinePieces;
	    scene.add(buildings);
	    	    
	    
	    renderer = new THREE.CanvasRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );	
		container.appendChild( renderer.domElement );
		
		
	    
		
		window.addEventListener( 'resize', onWindowResize, false );
	
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	}
	
	
	
	function onWindowResize() {
	
		camera.left = window.innerWidth / - zoom;
		camera.right = window.innerWidth / zoom;
		camera.top = window.innerHeight / zoom;
		camera.bottom = window.innerHeight / - zoom;	
		camera.updateProjectionMatrix();	
		renderer.setSize( window.innerWidth, window.innerHeight );
		render();
	}
		
	var targetRotation = 0;
	var targetRotationOnMouseDown = 0;

	var mouseX = 0;
	var mouseXOnMouseDown = 0;
	var mouseYOnMouseDown = 0;
	
	function onDocumentMouseDown( event ) {

        event.preventDefault();

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        document.addEventListener( 'mouseout', onDocumentMouseUp, false );

        mouseXOnMouseDown = event.clientX - window.innerWidth / 2;
        mouseYOnMouseDown = event.clientX - window.innerHeight / 2;
        targetRotationOnMouseDown = targetRotation;
    }

    function onDocumentMouseMove( event ) {

        mouseX = event.clientX - window.innerWidth / 2;
        mouseY = event.clientY - window.innerHeight / 2;
    	/*console.log("X-Wert: "+event.clientX);
    	console.log("Z-Wert: "+event.clientY);
    	console.log("");*/
        targetRotation = targetRotationOnMouseDown + ( mouseX  - mouseXOnMouseDown  ) * 0.02;
    }
    
    function onDocumentMouseUp( event ) {

		document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		document.removeEventListener( 'mouseout', onDocumentMouseUp, false );

	}


    function onDocumentTouchStart( event ) {

        if ( event.touches.length == 1 ) {

            event.preventDefault();

            mouseXOnMouseDown = event.touches[ 0 ].pageX - window.innerWidth / 2;
            targetRotationOnMouseDown = targetRotation;

        }
    }

    function onDocumentTouchMove( event ) {

        if ( event.touches.length == 1 ) {

            event.preventDefault();

            mouseX = event.touches[ 0 ].pageX - window.innerWidth / 2;
            targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

        }
    }
	
	
	function animate() {
	
		requestAnimationFrame( animate );
		render();
	
	}
	
	function render() {
	
		var timer = Date.now() * 0.0001;
		
		camera.position.z = -Math.cos( targetRotation ) * 200;// * zoom;
		camera.position.x = Math.sin( targetRotation ) * 200;// * zoom;
		//camera.position.x = 00;
		//camera.position.z = 00;
		camera.lookAt( scene.position );
	
		renderer.render( scene, camera );
	
	}