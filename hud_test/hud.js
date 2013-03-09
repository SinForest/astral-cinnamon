var canT;
var conT;
var canH;
var conH;
var colorHUD = "#5A2828";
var colorMap = "#f0f0f0";
var colorMen = "#332121";
var leftMenu;
var rightMenu;
var leftMenuContent;
var rightMenuContent;
var leftMenuSlider;
var rightMenuSlider;


//Funktion zum initialisieren vom HUD <-  Erst nach init() ausführen!
function initHUD() {
	
	canH = document.createElement( 'canvas' );
	conH = canH.getContext('2d');
	container.appendChild(canH);
	
	canT.setAttribute("style" , "z-index:2;position:absolute;left:0px;top:0px;");
	canH.setAttribute("style" , "z-index:1;position:absolute;left:0px;top:0px;");
	
	canH.setAttribute("height" , scHeight);
	canH.setAttribute("width" , scWidth);
	
	conH.fillStyle = colorHUD;
	conH.fillRect(0,0,scWidth,scHeight);
	conH.fillStyle = colorMap;
	conH.beginPath();
	conH.moveTo(scWidth/2,scHeight/2);
	conH.arc(scWidth/2,scHeight/2,scHeight/2.1,0,Math.PI*2, false);
	conH.fill();
	
	leftMenu = document.createElement( 'div' );
	leftMenu.setAttribute("style" , "z-index:3;position:absolute;left:0px;top:0px;");
	
	leftMenuContent = document.createElement( 'div' );
	leftMenuContent.setAttribute("style" ,"float:left;");
	leftMenuContent.setAttribute("height" , scHeight);
	leftMenuContent.setAttribute("width" , "0");
	leftMenuSlider = document.createElement( 'canvas' );
	leftMenuSlider.setAttribute("height" , scHeight);
	leftMenuSlider.setAttribute("width" , scWidth*0.03);
	leftMenuSlider.getContext('2d').fillStyle = colorMen;
	leftMenuSlider.getContext('2d').fillRect(0,0,scWidth*0.03,scHeight);
	leftMenuSlider.onclick = function() {leftMenuClick()};
	
	leftMenu.appendChild(leftMenuContent);
	leftMenu.appendChild(leftMenuSlider);
	
	container.appendChild(leftMenu);
}

function leftMenuClick() {
	alert("Das Menü sollte ausklappen!");
	if(leftMenuContent.width == 0)
	{
		leftMenuContent.setAttribute("width" , scWidth/2.2);
	}
	else
	{
		
	}
	
}