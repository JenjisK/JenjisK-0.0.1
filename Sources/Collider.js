/*	Collider
*/

function Collider(position, rotation)
{
	/* TRANSFORM OF COLLIDER */
		this.layer = null;
		this.position = position || new Vector(0,0)
		this.rotation = rotation || 0;
		this.radius = 0;
		
	/* PROPERTIES OF COLLIDER */
		this.isTrigger = false;
}

Collider.prototype.intersectCollider = function(collider){
	if(Vector.minus(this.position, collider.position).norm() < this.radius + collider.radius)
	{
		if(collider instanceof Polygon)
		{
			return this.intersectPolygon(collider);
		}
		else if(collider instanceof Edge)
		{
			return this.intersectEdge(collider);
		}
		else if(collider instanceof Circle)
		{
			return this.intersectCircle(collider);
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

Collider.prototype.moveIntersectCollider = function(collider, move){
	if(Vector.minus(this.position, collider.position).norm() < this.radius + collider.radius)
	{
		if(collider instanceof Polygon)
		{
			return this.moveIntersectPolygon(collider, move);
		}
		else if(collider instanceof Edge)
		{
			return this.moveIntersectEdge(collider, move);
		}
		else if(collider instanceof Circle)
		{
			return this.moveIntersectCircle(collider, move);
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}






