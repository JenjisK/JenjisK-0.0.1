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
}
/* Héritage déclaré */
Polygon.prototype = new Path();
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
	switch(this.type)
	{
		case 'polygon' :
			switch(shape.type)
			{
				case 'polygon' : return Polygon.intersectPolygon(this, shape); break;
				case 'path' : return Polygon.intersectPath(this, shape); break;
				case 'circle' : return Polygon.intersectCircle(this, shape); break;
				default : console.group('Shape.intersectShape');console.error('Type Of Shape Undefined');console.log(shape);console.groupEnd('Shape.intersectShape');break;
			}
			break;
		case 'path' :
			switch(shape.type)
			{
				case 'polygon' : return Polygon.intersectPath(shape, this); break;
				case 'path' : return Path.intersectPath(this, shape); break;
				case 'circle' : return Path.intersectCircle(this, shape); break;
				default : console.group('Shape.intersectShape');console.error('Type Of Shape Undefined');console.log(shape);console.groupEnd('Shape.intersectShape');break;
			}
			break;
		case 'circle' :
			switch(shape.type)
			{
				case 'polygon' : return Polygon.intersectCircle(shape, this); break;
				case 'path' : return Path.intersectCircle(shape, this); break;
				case 'circle' : return Circle.intersectCircle(this, shape); break;
				default : console.group('Shape.intersectShape');console.error('Type Of Shape Undefined');console.log(shape);console.groupEnd('Shape.intersectShape');break;
			}
			break;
		default : console.group('Shape.intersectShape');console.error('Type Of Shape Undefined');console.log(this);console.groupEnd('Shape.intersectShape');break;
	}
}
Circle.prototype.intersectShape = function(shape){
	if (shape.type == "Path" || shape.type == "Polygon") {	
		for (var i = 0; i < shape.vertices.length-1; i++) {
			var v1 = shape.vertices[i];
			var v2 = shape.vertices[i+1];
			
			var tmpSegment = new Segment(v1, v2);
			
			if (tmpSegment.intersectCircle(this) != null) {
				return true;
			}
		}
		return false;
	} else if (shape.type == "Circle") {
		if ((this.center - shape.center).norm() < this.radius + shape.radius) {
			return true;
		} else {
			return false;
		}
	}
}

Path.prototype.intersectShape = function(shape) {
	if (shape.type == "Path" || shape.type == "Polygon") {	
		for (var i = 0; i < shape.vertices.length-1; i++) {
			var v1 = shape.vertices[i];
			var v2 = shape.vertices[i+1];
			var tmpSegment = new Segment(v1, v2);
			
			for (var j = 0; j < this.vertices.length-1; j++) {
				var v3 = this.vertices[j];
				var v4 = this.vertices[j+1];
				var tmpSegment2 = new Segment(v3, v4);
				
				if (tmpSegment.intersectSegment(tmpSegment2) != null) {
					return true;
				}
			}			
		}
		return false;
	} else if (shape.type == "Circle") {
		return shape.intersectShape(this);
	}
}
