/* 
	Shape ce sera les formes utilisées par les Colliders pour effectuer les tests de collision.
*/
function Shape()
{
	// Type - Path (ouvert) / Polygon (fermé) / Circle
	this.type = "Shape";
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
/* Polygon est directement hérité de Path */
function Polygon()
{
	this.type = "Polygon";
	this.vertices = new Array();
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
Circle.prototype = new Shape();

Shape.prototype.intersectShape = function(shape){
	switch(shape.type)
	{
		case 'polygon' :
			return this.intersectPolygon(shape); break;
		case 'path' :
			return this.intersectPath(shape); break;
		case 'circle' :
			return this.intersectCircle(shape); break;
		default : console.group('Shape.intersectShape');console.error('Type Of Shape Undefined');console.log(shape);console.groupEnd('Shape.intersectShape');break;
	}
}
Polygon.prototype.intersectPolygon = function(polygon){
	var l = this.vertices.length, m = polygon.vertices.length;
	for(var i = 0; i < l; i++){
		var segment1 = new Segment(this.vertices[i], this.vertices[(i+1)%l]);
		
		for(var j = 0; j < m; j++){
			var segment2 = new Segment(polygon.vertices[j], polygon.vertices[(j+1)%m]);
			
			if(segment1.intersectSegment(segment2) != null){
				return true;
			}
		}			
	}
	return false;
}
Polygon.prototype.intersectPath = function(path){
	var l = this.vertices.length;
	for(var i = 0; i < l; i++){
		var segment1 = new Segment(this.vertices[i], this.vertices[(i+1)%l]);
		
		for(var j = 0; j < path.vertices.length-1; j++){
			var segment2 = new Segment(path.vertices[j], path.vertices[(j+1)%m]);
			
			if(segment1.intersectSegment(segment2) != null){
				return true;
			}
		}			
	}
	return false;
}
Polygon.prototype.intersectCircle = function(circle){
	var l = this.vertices.length;
	for(var i = 0; i < l; i++){
		var segment = new Segment(this.vertices[i], this.vertices[(i+1)%l]);
		
		if (segment.intersectCircle(circle) != null){
			return true;
		}
	}
}
Polygon.prototype.addVertice = function(u)
{
	this.vertices.push(u);
}
Path.prototype.intersectPolygon = function(polygon){
	return polygon.intersectPath(this);
}
Path.prototype.intersectPath = function(path){
	for(var i = 0; i < this.vertices.length-1; i++){
		var segment1 = new Segment(this.vertices[i], this.vertices[i+1]);
		
		for(var j = 0; j < path.vertices.length-1; j++){
			var segment2 = new Segment(path.vertices[j], path.vertices[j+1]);
			
			if(segment1.intersectSegment(segment2) != null){
				return true;
			}
		}			
	}
	return false;
}
Path.prototype.intersectCircle = function(circle){
	for(var i = 0; i < this.vertices.length-1; i++){
		var segment = new Segment(this.vertices[i], this.vertices[i+1]);
		
		if (segment.intersectCircle(circle) != null){
			return true;
		}
	}
}
Path.prototype.addVertice = function(u)
{
	this.vertices.push(u);
}
Circle.prototype.intersectPolygon = function(polygon){
	return polygon.intersectCircle(this);
}
Circle.prototype.intersectPath = function(path){
	return path.intersectCircle(this);
}
Circle.prototype.intersectCircle = function(circle){
	if(Vector.minus(this.center,circle.center).norm() < this.radius + circle.radius){
		return true;
	}else{
		return false;
	}
}



