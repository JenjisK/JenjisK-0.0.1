/* 
	Shape ce sera les formes utilisées par les Colliders pour effectuer les tests de collision.
*/
function Shape()
{
	// Type - Path (ouvert) / Polygon (fermé) / Circle
	this.type = "Polygon";
	// Points
}
/* Path est directement hérité de Shape */
function Path()
{
	this.type = "Path";
	this.vertices = new Array();
}
/* Héritage déclaré */
Path.prototype = new Shape();
/* Polygon est directement hérité de Shape */
function Polygon()
{
	this.type = "Polygon";
	this.points = new Array();
}
/* Héritage déclaré */
Polygon.prototype = new Shape();
/* Circle est directement hérité de Shape */
function Circle()
{
	this.type = "Circle";
	this.center = new Vector(0,0);
	this.radius = 0;
}
/* Héritage déclaré */
Polygon.prototype = new Shape();