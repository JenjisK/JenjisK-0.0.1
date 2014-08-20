/* SEGMENT */ // TO TEST
/* NOTATIONS :
	Sauf si précisé, les noms de variables suivants seront utilisés à des fins précises :
		i,j,l = entiers indices de tableaux / boucles for
		u,v,w = Vectors
		x,y = abcisses et ordonnées des Vectors
		s,t = Segments
*/

/* ARC */
function Arc(center, start, alpha)
{
	this.center = center || new Vector(0,0);
	this.start = start || new Vector(1,0);
	this.radius = this.start.norm();
	this.alpha = alpha || 0;
	this.beta = (new Vector(1,0)).angle(this.start);
}
Arc.prototype.setStart = function(newStart){
	this.start = newStart || new Vector(1,0);
	this.radius = this.start.norm();
	this.beta = (new Vector(1,0)).angle(this.start);
}
Arc.prototype.intersectSegment = function(s){ // Détermine le point d'intersection entre l'arc THIS et le segment s. Retour : [k, v]
	var contact = null;
	
	// Enregistrement des points de contacts
	var w = Vector.minus(s.v, s.u);
	
	/* On passe en représentation paramétrique,
		On a donc notre segment:	x = u.x + t*dx avec dx = v.x - u.x
									y = u.y + t*dy avec dy = v.y - u.y
		Equation d'un cercle: 		(x-xc)^2 + (y-yc)^2 = r^2
		
		Substitution:				(u.x + t*dx - xc)^2 + (u.y + t*dy - yc)^2 = r^2
								<=>	(dx^2 + dy^2)*t^2 + 2*((cx*dx) + (cy*dy))*t + (cx^2 + cy^2 - r^2) = 0 avec cx = u.x - xc et cy = u.y - xy
								
		On résout, et on trouve 0, 1 ou 2 valeur(s) de t. Comme on est sur un segment, t doit être compris entre 0 et 1. Sinon, on sort du segment.
	*/
	
	var dx = w.x;
	var dy = w.y;
	var cx = s.u.x - this.center.x;
	var cy = s.u.y - this.center.y;
	
	var A = dx*dx + dy*dy;
	var B = dx*cx + dy*cy;
	var C = cx*cx + cy*cy - this.radius*this.radius;
	
	var delta = B*B - A*C;
	
	if (delta > 0){
		var sqrt_delta = Math.sqrt(delta);
		var t1 = (-B + sqrt_delta)/A;
		var t2 = (-B - sqrt_delta)/A;
		
		/* Diffère ici de Segment.intersectCircle car les angles sont à prendre en compte */
		var u = Vector.plus(s.u, Vector.multiply(w, t1))
		var angleU = this.start.angle(Vector.minus(u, this.center));
		angleU = (this.alpha > 0 && angleU < 0)?angleU+2*Math.Pi:(this.alpha < 0 && angleU > 0)?angleU-2*Math.Pi:angleU;
		var ratioU = (this.alpha == 0)?0:angleU/this.alpha;
		var v = Vector.plus(s.u, Vector.multiply(w, t2))
		var angleV = this.start.angle(Vector.minus(v, this.center));
		angleV = (this.alpha > 0 && angleV < 0)?angleV+2*Math.Pi:(this.alpha < 0 && angleV > 0)?angleV-2*Math.Pi:angleV;
		var ratioV = (this.alpha == 0)?0:angleV/this.alpha;
		
		if (ratioU < ratioV){
			if (t1 >= 0 && t1 <= 1 && ((this.alpha >= 0 && angleU <= this.alpha) || (this.alpha <= 0 && angleU >= this.alpha))){
				contact = [ratioU, u];
			}else if (t2 >= 0 && t2 <= 1 && ((this.alpha >= 0 && angleV <= this.alpha) || (this.alpha <= 0 && angleV >= this.alpha))){
				contact = [ratioV, v];
			}
		}else{
			if (t2 >= 0 && t2 <= 1 && ((this.alpha >= 0 && angleV <= this.alpha) || (this.alpha <= 0 && angleV >= this.alpha))){		
				contact = [ratioV, v];
			}else if (t1 >= 0 && t1 <= 1 && ((this.alpha >= 0 && angleU <= this.alpha) || (this.alpha <= 0 && angleU >= this.alpha))){
				contact = [ratioU, u];
			}
		}
	}
	else if (delta == 0){
		var t1 = -B/(2*A);
		
		/* Diffère ici de Segment.intersectCircle car les angles sont à prendre en compte */
		var u = Vector.plus(s.u, Vector.multiply(w, t1))
		var angleU = this.start.angle(Vector.minus(u, this.center));
		angleU = (this.alpha > 0 && angleU < 0)?angleU+2*Math.Pi:(this.alpha < 0 && angleU > 0)?angleU-2*Math.Pi:angleU;
		
		var ratioU = (this.alpha == 0)?0:angleU/this.alpha;
		if (t1 >= 0 && t1 <= 1 && ((this.alpha >= 0 && angleU <= this.alpha) || (this.alpha <= 0 && angleU >= this.alpha))){
			contact = [ratioU, u];
		}
	}
	
	return contact;
}
Arc.prototype.intersectPolygon = function(polygon){	// TO TEST - Détermine le point d'intersection entre l'arc THIS et le polygone polygon. Retour [k, v]
	var firstContact = false, l = polygon.points.length, j;
	for(var i = 0; i < l; i++)
	{
		j = (i+1)%l;
		var contact = this.intersectSegment(new Segment(polygon.points[i], polygon.points[j]));
		if(contact)
		if(!firstContact || firstContact[0] > contact[0])
		{
			firstContact = [contact[0], contact[1], new Segment(polygon.points[i], polygon.points[j])];
		}
	}
	return firstContact;
}
Arc.prototype.intersectPath = function(path){		// TO TEST - Détermine le point d'intersection entre l'arc THIS et le chemin path. Retour [k, v]
	var firstContact = false, j;
	for(var i = 0; i < path.points.length-1; i++)
	{
		j = i+1;
		var contact = this.intersectSegment(new Segment(path.points[i], path.points[j]));
		if(contact)
		if(!firstContact || firstContact[0] > contact[0])
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
