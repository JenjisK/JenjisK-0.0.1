/* ARC - WORKS */

function Arc(c, u, a)
{
	this.center = c;
	this.start = u;
	this.radius = u.norm();
	this.alpha = a;
	
	if(typeof debug != "undefined")
	{
		debug.add('create Arc ['+this.center.debug()+', '+this.start.debug()+', '+this.alpha+']');
	}
}
Arc.prototype.intersectSegment = function(s){
	var contacts = new Array();
	
	// Enregistrement des points de contact
	var w = s.v.minus(s.u);
	if(approx(w.x) == 0)
	{
		var bprime = this.center.y;
		var delta = bprime*bprime-(this.center.y*this.center.y + (s.u.x-this.center.x)*(s.u.x-this.center.x)-this.radius*this.radius);
		
		if(delta > 0)
		{
			var sqrt_delta = Math.sqrt(delta);
			
			var w1 = new Vector(s.u.x, (bprime+sqrt_delta));
			var w2 = new Vector(s.u.x, bprime-sqrt_delta);
			var beta1 = w1.minus(this.center).angleWith(this.start);
			var beta2 = w2.minus(this.center).angleWith(this.start);
			
			if(s.containVectorSoft(w1) && Math.abs(this.alpha) > Math.abs(beta1) && this.alpha*beta1 > 0)
			{
				contacts.push([beta1, w1]);
			}
			if(s.containVectorSoft(w2) && Math.abs(this.alpha) > Math.abs(beta2) && this.alpha*beta2 > 0)
			{
				contacts.push([beta2, w2]);
			}
		}
	}
	else
	{
		var a1 = w.y/w.x;
		var b1 = s.u.y-a1*s.u.x;
		
		var a = 1+a1*a1;
		var b = 2*(a1*(b1-this.center.y)-this.center.x);
		var delta = b*b-4*a*(this.center.x*this.center.x+(b1-this.center.y)*(b1-this.center.y)-this.radius*this.radius);
		
		if(delta > 0)
		{
			var sqrt_delta = Math.sqrt(delta);
			var x1 = -(b+sqrt_delta)/(2*a);
			var x2 = (-b+sqrt_delta)/(2*a);
			
			var w1 = new Vector(x1, a1*x1+b1);
			var w2 = new Vector(x2, a1*x2+b1);
			var beta1 = w1.minus(this.center).angleWith(this.start);
			var beta2 = w2.minus(this.center).angleWith(this.start);
			
			if(s.containVectorSoft(w1) && Math.abs(this.alpha) > Math.abs(beta1) && this.alpha*beta1 > 0)
			{
				contacts.push([beta1, w1]);
			}
			if(s.containVectorSoft(w2) && Math.abs(this.alpha) > Math.abs(beta2) && this.alpha*beta2 > 0)
			{
				contacts.push([beta2, w2]);
			}
		}
	}
	
	var contact = false;
	var gamma = this.alpha;
	for(var k = 0; k < contacts.length; k++)
	{
		if(Math.abs(gamma) > Math.abs(contacts[k][0]))
		{
			gamma = contacts[k][0];
			contact = contacts[k];
		}
	}
	return contact;
}
Arc.prototype.intersectPolygon = function(polygon){
	var firstContact = false, l = polygon.points.length, s, j;
		var t = '';
	for(var i = 0; i < l; i++)
	{
		j = (i+1)%l;
		var contact = this.intersectSegment(new Segment(polygon.points[i], polygon.points[j]));
		if(contact)
		if(!firstContact || Math.abs(firstContact[0]) > Math.abs(contact[0]))
		{
			firstContact = [contact[0], contact[1], new Segment(polygon.points[i], polygon.points[j])];
		}
	}
	return firstContact;
}
Arc.prototype.intersectPath = function(path){
	var firstContact = false, l = path.points.length, s, j;
		var t = '';
	for(var i = 0; i < l-1; i++)
	{
		j = i+1;
		var contact = this.intersectSegment(new Segment(path.points[i], path.points[j]));
		if(contact)
		if(!firstContact || Math.abs(firstContact[0]) > Math.abs(contact[0]))
		{
			firstContact = [contact[0], contact[1], new Segment(path.points[i], path.points[j])];
		}
	}
	return firstContact;
}
Arc.prototype.intersectCircle = function(circle){
	var contacts = new Array();
	
	if(this.center.y == circle.center.y)
	{
	
	}
	else
	{
		var N = (this.radius*this.radius-circle.radius*circle.radius-this.center.x*this.center.x+circle.center.x*circle.center.x-this.center.y*this.center.y+circle.center.y*circle.center.y)/(2*(circle.center.y-this.center.y));
		var P = (circle.center.x-this.center.x)/(circle.center.y-this.center.y);
		
		var a = P*P+1;
		var b = 2*(circle.center.y*P-N*P-circle.center.x);
		var c = circle.center.x*circle.center.x+circle.center.y*circle.center.y+N*N-circle.radius*circle.radius-2*circle.center.y*N;
		var delta = b*b-4*a*c;
		
		if(delta > 0)
		{
			var sqrt_delta = Math.sqrt(delta);
			var x1 = -(b+sqrt_delta)/(2*a);
			var x2 = (-b+sqrt_delta)/(2*a);
			
			var w1 = new Vector(x1, N-x1*P);
			var w2 = new Vector(x2, N-x2*P);
			var beta1 = w1.minus(this.center).angleWith(this.start);
			var beta2 = w2.minus(this.center).angleWith(this.start);
			
			if(Math.abs(this.alpha) > Math.abs(beta1) && this.alpha*beta1 > 0)
			{
				contacts.push([beta1, w1]);
			}
			if(Math.abs(this.alpha) > Math.abs(beta2) && this.alpha*beta2 > 0)
			{
				contacts.push([beta2, w2]);
			}
		}
	}
	
	var contact = false;
	var gamma = this.alpha;
	for(var k = 0; k < contacts.length; k++)
	{
		if(Math.abs(gamma) > Math.abs(contacts[k][0]))
		{
			gamma = contacts[k][0];
			contact = contacts[k];
		}
	}
	return contact;
}
Arc.prototype.debug = function(){
	return 'Arc ['+this.c.debug()+', '+this.u.debug()+', '+this.a+']';
}