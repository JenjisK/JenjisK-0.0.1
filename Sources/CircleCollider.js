/*	CircleCollider
*/

CircleCollider.prototype = new Collider();
function CircleCollider(position, rotation, radius)
{
	/* TRANSFORM OF COLLIDER */
		this.layer = null;
		this.position = position || new Vector(0,0)
		this.rotation = rotation || 0;
		this.radius = radius || 0;
}

CircleCollider.prototype.intersectPolygonCollider = function(polygon){
	return polygon.intersectCircleCollider(this);
}
CircleCollider.prototype.intersectEdgeCollider = function(edge){
	return edge.intersectCircleCollider(this);
}
CircleCollider.prototype.intersectCircleCollider = function(circle){
	if(Vector.minus(this.position,circle.position).norm() < this.radius + circle.radius){
		return true;
	}else{
		return false;
	}
}

CircleCollider.prototype.moveIntersectPolygonCollider = function(polygon, move){
	return polygon.moveIntersectCircleCollider(this, Vector.reverse(move));
}
CircleCollider.prototype.moveIntersectEdgeCollider = function(edge, move){
	return edge.moveIntersectCircleCollider(this, Vector.reverse(move));
}
CircleCollider.prototype.moveIntersectCircleCollider = function(circle, move){
	var tmpCircle = new Circle(circle.position, circle.rotation, circle.radius + this.radius);
	var tmpSegment = new Segment(Vector.duplicate(this.position), Vector.plus(this.position, move));
	var contact = tmpSegment.intersectCircle(tmpCircle);
	if(contact)
	{
		return Vector.minus(contact, this.position).norm2()/move.norm2();
	}
	else
	{
		return false;
	}
}










