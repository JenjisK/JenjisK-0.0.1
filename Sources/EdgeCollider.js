/*	EdgeCollider
*/

EdgeCollider.prototype = new Collider();
function EdgeCollider(position, rotation, vertices)
{
	/* TRANSFORM OF COLLIDER */
		this.layer = null;
		this.position = position || new Vector(0,0)
		this.rotation = rotation || 0;
		this.radius = 0;
	/* VERTICES */
	this.vertices = vertices || new Array();
}

EdgeCollider.prototype.addVertice = function(u){
	this.vertices.push(u);
	var d = Vector.minus(u, this.position).norm();
	if(d > this.radius)
		this.radius = d;
}
EdgeCollider.prototype.calculateRadius = function(){
	this.radius = 0;
	for(var k = 0; k < this.vertices.length; k++)
	{
		var radius = Vector.minus(this.vertices[k], this.position).norm()
		if(radius > this.radius)
		{
			this.radius = radius;
		}
	}
}

EdgeCollider.prototype.intersectPolygonCollider = function(polygon){
	return polygon.intersectEdgeCollider(this);
}
EdgeCollider.prototype.intersectEdgeCollider = function(edge){
	for(var i = 0; i < this.vertices.length-1; i++){
		var segment1 = new Segment(this.vertices[i], this.vertices[i+1]);
		
		for(var j = 0; j < edge.vertices.length-1; j++){
			var segment2 = new Segment(edge.vertices[j], edge.vertices[j+1]);
			
			if(segment1.intersectSegment(segment2) != null){
				return true;
			}
		}			
	}
	return false;
}
EdgeCollider.prototype.intersectCircleCollider = function(circle){
	for(var i = 0; i < this.vertices.length-1; i++){
		var segment = new Segment(this.vertices[i], this.vertices[i+1]);
		
		if (segment.intersectCircle(circle) != null){
			return true;
		}
	}
}

EdgeCollider.prototype.intersectPolygonCollider = function(polygon, move){
	return polygon.moveIntersectEdgeCollider(this, Vector.reverse(move));
}
EdgeCollider.prototype.moveIntersectEdgeCollider = function(edge, move){
	var l = this.vertices.length, m = edge.vertices.length;
	var moveLength2 = move.norm2()
	var contact = false;
	var contactLength2 = moveLength2;
	
	for(var i = 0; i < l; i++)
	{
		// HERE IT IS PLUS !
		var segmentMove = new Segment(this.vertices[i], Vector.plus(this.vertices[i], move));
		
		for(var j = 0; j < m-1; j++)
		{
			var segmentSolid = new Segment(edge.vertices[j], edge.vertices[j+1]);
			
			var tmpContact = segmentDeplacement.intersectSegment(segmentMove, segmentSolid);
			if(tmpContact)
			{
				var tmpContactLength2 = Vector.minus(tmpContact, this.vertices[i]).norm2();
				if(tmpContactLength2 < contactLength2)
				{
					contact = tmpContact;
					contactLength2 = tmpContactLength2;
				}
			}
		}
	}
	for(var j = 0; j < m; j++)
	{
		// HERE IT IS MINUS !
		var segmentMove = new Segment(edge.vertices[j], Vector.minus(edge.vertices[j], move));
		
		for(var i = 0; i < l-1; i++)
		{
			var segmentSolid = new Segment(this.vertices[i], this.vertices[i+1]);
			
			var tmpContact = segmentDeplacement.intersectSegment(segmentMove, segmentSolid);
			if(tmpContact)
			{
				var tmpContactLength2 = Vector.minus(tmpContact, edge.vertices[j]).norm2();
				if(tmpContactLength2 < contactLength2)
				{
					contact = tmpContact;
					contactLength2 = tmpContactLength2;
				}
			}
		}
	}
	
	if(contact)
	{
		return contactLength2/moveLength2;
	}
	else
	{
		return false;
	}
}
EdgeCollider.prototype.moveIntersectCircleCollider = function(circle, move){
	var l = this.vertices.length;
	var moveLength2 = move.norm2();
	var contact = false;
	var contactLength2 = moveLength2;
	for(var k = 0; k < l-1; k++)
	{
		var segmentSolid = new Segment(this.vertices[k], this.vertices[k+1]);
		var vectorsMove = segmentSolid.apsidesCircle(circle);
		var segmentMove1 = new Segment(vectorsMove[0], Vector.plus(vectorsMove[0],move));
		var segmentMove2 = new Segment(vectorsMove[1], Vector.plus(vectorsMove[1],move));
		var tmpContact1 = segmentMove1.intersectSegment(segmentSolid);
		var tmpContact2 = segmentMove2.intersectSegment(segmentSolid);
		
		if(tmpContact1)
		{
			var tmpContactLength2 = Vector.minus(tmpContact1, vectorsMove[0]).norm2();
			if(tmpContactLength2 < contactLength2)
			{
				contact = tmpContact1;
				contactLength2 = tmpContactLength2;
			}
		}
		if(tmpContact2)
		{
			var tmpContactLength2 = Vector.minus(tmpContact2, vectorsMove[1]).norm2();
			if(tmpContactLength2 < contactLength2)
			{
				contact = tmpContact2;
				contactLength2 = tmpContactLength2;
			}
		}
	}
	
	if(contact)
	{
		return contactLength2/moveLength2;
	}
	else
	{
		return false;
	}
}









