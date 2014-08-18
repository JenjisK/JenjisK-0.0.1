/* SHAPE - WORKS - TO EDIT 
	Le nom va changer
*/
function Shape(type)
{
	this.type = type;
	this.points = new Array();
	this.center = new Vector(0,0,0);
	this.radius = 0;
	
}
Shape.prototype.addPoint = function(z){
	this.points.push(z);
}
Shape.prototype.addPoints = function(points){
	for(var k = 0; k < points.length; k++)
		this.points.push(points[k]);
}
/* A EDITER */
Shape.prototype.containPoint = function(z){
	var c = true;
	switch(this.type)
	{
		case 'polygon' :
			var previous = 0, i, current, vectorProduct;
			var l = this.points.length;
			for(var i = 0; i < l; i++)
			{
				j = (i+1)%l;
				vectorProduct = this.points[j].minus(this.points[i]).vectorProduct(z.minus(this.points[i]));
				current = (vectorProduct == 0)?2:(vectorProduct > 0)?1:-1;
				if(current == 0)
				{
					break;
				}
				else if(previous == 0)
				{
					previous = current;
				}
				else if(previous != current)
				{
					c = false;
					break;
				}
			}
			break;
		case 'circle' :
			c = (this.points[1].minus(this.points[0]).norm() >= z.minus(this.points[0]).norm());
			break;
		case 'path' :
			c = false;
			break;
		default :
			break;
	}
	return c;
}
/* A EDITER */
Shape.prototype.intersectSegment = function(a,b){
	var c = false;
	if(this.containPoint(a) || this.containPoint(b))
	{
		c = true;
	}
	else
	{
		var i, l = this.points.length;
		if(l > 1)
		{
			for(var k = 0; k < l; k++)
			{
				i = (k+1)%l;
				if(segmentIntersectingSegment(a,b,this.points[k], this.points[i]))
				{
					c = true;
					break;
				}
				
			}
		}
	}
	return c;
}
/* A EDITER */
Shape.prototype.intersectShape = function(shape){
	var c = false;
	switch(this.type)
	{
		case 'circle' :
			c = (shape.containPoint(this.points[0]));
			break;
		case 'polygon' :
			switch(shape.type)
			{
				case 'circle' :
					c = (this.containPoint(shape.points[0]));
					break;
				case 'polygon' :
					var i, l = shape.points.length;
					if(l == 1)
					{
						c = this.containPoint(shape.points[0]);
					}
					else if(l > 1)
					{
						for(var i = 0; i < l; i++)
						{
							j = (i+1)%l;
							if(this.intersectSegment(shape.points[i], shape.points[j]))
							{
								c = true;
								break;
							}
						}
					}
			}
			break;
		default :
			break;
	}
	return c;
}
/* % restant, vecteur tangeant */
Shape.prototype.intersectShapeTranslation = function(shape, translation){
	var contact = false;
	switch(this.type)
	{
		case 'circle' :
			switch(shape.type)
			{
				case 'circle' :
					var s = new Segment(this.center, this.center.plus(translation));
					shape.radius += this.radius;
					var i = s.intersectCircle(shape);
					shape.radius -= this.radius;
					if(i)
					{
						var t = i[1].minus(shape.center).normal().normalize();
						contact = [i[0], t];
					}
					break;
				case 'polygon' :
					var l = shape.points.length, s, j;
					for(var i = 0; i < l; i++)
					{
						j = (i+1)%l;
						s = new Segment(shape.points[i], shape.points[j]);
						var pts = s.apsidesCircle(this);
						var s1 = new Segment(pts[0], pts[0].plus(translation));
						var s2 = new Segment(pts[1], pts[1].plus(translation));
						var s3 = new Segment(shape.points[i], shape.points[i].minus(translation));
						var c1 = s1.intersectPolygon(shape);
						var c2 = s2.intersectPolygon(shape);
						var c3 = s3.intersectCircle(this);
						if(c1)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c1[0]))
							{
								var t =  s.v.minus(s.u).normalize()
								contact = [c1[0], t];
							}
						}
						if(c2)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c2[0]))
							{
								var t =  s.v.minus(s.u).normalize();
								contact = [c2[0], t];
							}
						}
						if(c3)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c3[0]))
							{
								var t = c3[1].minus(this.center).normal().normalize();
								contact = [c3[0], t];
							}
						}
					}
					break;
				
				case 'path' :
					var l = shape.points.length, s, j;
					for(var i = 0; i < l-1; i++)
					{
						s = new Segment(shape.points[i], shape.points[i+1]);
						var pts = s.apsidesCircle(this);
						var s1 = new Segment(pts[0], pts[0].plus(translation));
						var s2 = new Segment(pts[1], pts[1].plus(translation));
						var s3 = new Segment(shape.points[i], shape.points[i].minus(translation));
						var c1 = s1.intersectPath(shape);
						var c2 = s2.intersectPath(shape);
						var c3 = s3.intersectCircle(this);
						if(c1)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c1[0]))
							{
								var t =  s.v.minus(s.u).normalize()
								contact = [c1[0], t];
							}
						}
						if(c2)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c2[0]))
							{
								var t =  s.v.minus(s.u).normalize();
								contact = [c2[0], t];
							}
						}
						if(c3)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c3[0]))
							{
								var t = c3[1].minus(this.center).normal().normalize();
								contact = [c3[0], t];
							}
						}
					}
						var s3 = new Segment(shape.points[l-1], shape.points[l-1].minus(translation));
						var c3 = s3.intersectCircle(this);
						if(c3)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c3[0]))
							{
								var t = c3[1].minus(this.center).normal().normalize();
								contact = [c3[0], t];
							}
						}
					break;
			}
			break;
		case 'polygon' :
			switch(shape.type)
			{
				case 'circle' :
					var l = this.points.length, s, j;
					for(var i = 0; i < l; i++)
					{
						j = (i+1)%l;
						s = new Segment(this.points[i], this.points[j]);
						var pts = s.apsidesCircle(shape);
						var s1 = new Segment(pts[0], pts[0].minus(translation));
						var s2 = new Segment(pts[1], pts[1].minus(translation));
						var s3 = new Segment(this.points[i], this.points[i].plus(translation));
						var c1 = s1.intersectPolygon(this);
						var c2 = s2.intersectPolygon(this);
						var c3 = s3.intersectCircle(shape);
						if(c1)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c1[0]))
							{
								var t =  s.v.minus(s.u).normalize()
								contact = [c1[0], t];
							}
						}
						if(c2)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c2[0]))
							{
								var t =  s.v.minus(s.u).normalize();
								contact = [c2[0], t];
							}
						}
						if(c3)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c3[0]))
							{
								var t = c3[1].minus(this.center).normal().normalize();
								contact = [c3[0], t];
							}
						}
					}
					break;
				case 'polygon' :
					var l = this.points.length, s, j;
					for(var i = 0; i < l; i++)
					{
						s = new Segment(this.points[i], this.points[i].plus(translation));
						var c = s.intersectPolygon(shape);
						if(c)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c[0]))
							{
								var t =  c[2].v.minus(c[2].u).normalize();
								contact = [c[0], t];
							}
						}
					}
					l = shape.points.length;
					for(var i = 0; i < l; i++)
					{
						s = new Segment(shape.points[i], shape.points[i].minus(translation));
						var c = s.intersectPolygon(this);
						if(c)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c[0]))
							{
								var t =  c[2].v.minus(c[2].u).normalize();
								contact = [c[0], t];
							}
						}
					}
					break;
				case 'path' :
					var l = this.points.length, s, j;
					for(var i = 0; i < l; i++)
					{
						s = new Segment(this.points[i], this.points[i].plus(translation));
						var c = s.intersectPath(shape);
						if(c)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c[0]))
							{
								var t =  c[2].v.minus(c[2].u).normalize();
								contact = [c[0], t];
							}
						}
					}
					l = shape.points.length;
					for(var i = 0; i < l; i++)
					{
						s = new Segment(shape.points[i], shape.points[i].minus(translation));
						var c = s.intersectPolygon(this);
						if(c)
						{
							if(!contact || Math.abs(contact[0]) > Math.abs(c[0]))
							{
								var t =  c[2].v.minus(c[2].u).normalize();
								contact = [c[0], t];
							}
						}
					}
					break;
			}
	}
							if(contact)	debug.innerHTML = contact[1].multiply(20).debug();
	return contact;
}
Shape.prototype.translate = function(u){
	var shape = new Shape(this.type);
	switch(this.type)
	{
		case 'polygon' :
		case 'path' :
			for(var k = 0; k < this.points.length; k++)
			{
				shape.addPoint(this.points[k].plus(u));
			}
			break;
		case 'circle' :
			shape.center = this.center.plus(u);
			shape.radius = this.radius;
			break;
		default :
			break;
	}
	return shape;
}
Shape.prototype.rotate = function(a, b){
	var shape = new Shape(this.type);
	if(typeof b !== "undefined")
	{
		switch(this.type)
		{
			case 'path' :
			case 'polygon' :
				for(var k = 0; k < this.points.length; k++)
				{
					shape.addPoint(this.points[k].rotate(a,b));
				}
				break;
			case 'circle' :
				shape.center = this.center.rotate(a,b);
				shape.radius = this.radius;
				break;
		}
	}
	else
	{
		var c = Math.cos(a), s = Math.sin(a);
		switch(this.type)
		{
			case 'path' :
			case 'polygon' :
				for(var k = 0; k < this.points.length; k++)
				{
					shape.addPoint(this.points[k].rotate(a,b));
				}
				break;
			case 'circle' :
				shape.center = this.center.rotate(a,b);
				shape.radius = this.radius;
				break;
		}
	}
	return shape;
}
Shape.prototype.debug = function(){
	return '[SHAPE]';
}0