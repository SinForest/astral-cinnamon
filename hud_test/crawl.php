<?php
$homepage = file_get_contents('http://129.206.228.72:8080/OSMGeometrieService/osmgeomservice/buildings/'.$_GET['x0'].'/'.$_GET['y0'].'/'.$_GET['x1'].'/'.$_GET['y1'].'');
//$homepage = file_get_contents('http://google.com/');
header("Content-Type: text/plain");
echo($homepage);
//phpinfo();
?>