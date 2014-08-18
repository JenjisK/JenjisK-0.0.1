/* SEGMENT - WORKS */

function Segment(u,v)
{
	this.u = u;
	this.v = v;
	
	/* DEBUG */
	if(typeof debug != "undefined")
	{
		debug.add('create Segment ['+this.u.debug()+', '+this.v.debug()+']');
	}
}
/* NON UTILISE ICI */
Segment.prototype.containVector = function(w){
	return (w.minus(this.u).norm()+w.minus(this.v).norm()==this.v.minus(this.u).norm() && !w.equal(this.u) && !w.equal(this.v));
}
/*  */
Segment.prototype.containVectorSoft = function(w){
	return (approx(w.minus(this.u).norm()+w.minus(this.v).norm())==approx(this.v.minus(this.u).norm()) && !w.equal(this.u) && !w.equal(this.v));
}
/* WORKS
 *
 *	Par deux produits scalaires détermine si OUI ou NON les deux segments sont en contact
 *
 *	a est le vecteur CD (segment s)
 *	b est le vecteur AB (segment this)
 */
Segment.prototype.intersectSegmentFast = function(s){
	var a = s.v.minus(s.u);
	var b = this.v.minus(this.u);
	return (a.vectorProduct(this.u.minus(s.u))*a.vectorProduct(this.v.minus(s.u))<=0 && b.vectorProduct(s.u.minus(this.u))*b.vectorProduct(s.v.minus(this.u))<=0);
}
/* WORKS 
 *
 *	Détermine si il y a contact entre les deux segments et retourne les coordonnées du contact si existant
 *	Fonctionnement : A+k*I = C+l*J que l'on décompose dans la base carthésienne
 *	CF : http://fr.openclassrooms.com/forum/sujet/calcul-du-point-d-intersection-de-deux-segments-21661
 *
 *	w1 est le vecteur AB
 *	w2 est le vecteur CD
 *	sp est w1^w2
 *	k est la proportion de w1 avant le contact
 *	w est le vecteur de contact
 *
 */
Segment.prototype.intersectSegment = function(s){
	// Si détection de l'intersection
	if(this.intersectSegmentFast(s))
	{
		// Vecteurs segment
		var w1 = this.v.minus(this.u);
		var w2 = s.v.minus(s.u);
		// Produit scalaire des vecteurs segment
		var sp = w1.vectorProduct(w2);
		
		if(sp == 0)
		{
			return false;
		}
		else
		{
			var k = ((s.u.x-this.u.x)*w2.y+(this.u.y-s.u.y)*w2.x)/sp;
			var w = this.u.plus(w1.multiply(k));
			return [k, w];
		}
	}
	else
	{
		return false;
	}
}
/* WORKS
 *
 *	Détermine si le segment rencontre le polynôme et retourne firstContact si oui, false si non.
 *		On retourne firstContact en tant que contact survenu le plus "tôt"
 *
 *	firstContact contient le boolean false si pas encore de contact détecté, et le triplet du meilleur contact (pourcentage du segment avt contact, vecteur tronqué avant contact,
 *		segment du poly rencontré)
 *	l est le nombre de segments composants le polynome
 *	contact contient l'équivalent de firstContact pour le segment du poly en cours de traitement
 */
Segment.prototype.intersectSegmentInner = function(s){
	// Si détection de l'intersection
	if(this.intersectSegmentFast(s))
	{
		// Vecteurs segment
		var w1 = this.v.minus(this.u);
		var w2 = s.v.minus(s.u);
		// Produit scalaire des vecteurs segment
		var sp = w1.vectorProduct(w2);
		
		if(sp == 0 || this.containVectorSoft(s.u) || this.containVectorSoft(s.v) || s.containVectorSoft(this.u) || s.containVectorSoft(this.v))
		{
			return false;
		}
		else
		{
			var k = ((s.u.x-this.u.x)*w2.y+(this.u.y-s.u.y)*w2.x)/sp;
			var w = this.u.plus(w1.multiply(k));
			return [k, w];
		}
	}
	else
	{
		return false;
	}
}
 Segment.prototype.intersectPolygon = function(polygon){
	var firstContact = false, l = polygon.points.length, s, j;
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
Segment.prototype.intersectPath = function(path){
	var firstContact = false, s, j;
		var t = '';
	for(var i = 0; i < path.points.length-1; i++)
	{
		var contact = this.intersectSegment(new Segment(path.points[i], path.points[i+1]));
		if(contact)
		if(!firstContact || firstContact[0] > contact[0])
		{
			firstContact = [contact[0], contact[1], new Segment(path.points[i], path.points[i+1])];
		}
	}
	return firstContact;
}
Segment.prototype.intersectCircle = function(circle){
	var contacts = new Array();
	
	// Enregistrement des points de contacts
	var w = this.v.minus(this.u);
	if(approx(w.x) == 0)
	{
		var bprime = circle.center.y;
		var delta = bprime*bprime-(circle.center.y*circle.center.y+(this.u.x-circle.center.x)*(this.u.x-circle.center.x)-circle.radius*circle.radius);
		
		if(delta > 0)
		{
			var sqrt_delta = Math.sqrt(delta);
			
			var w1 = new Vector(this.u.x, (bprime+sqrt_delta));
			var w2 = new Vector(this.u.x, bprime-sqrt_delta);
			
			if(this.containVectorSoft(w1))
			{
				contacts.push([Math.sqrt(this.u.minus(w1).norm2()/this.u.minus(this.v).norm2()), w1]);
			}
			if(this.containVectorSoft(w2))
			{
				contacts.push([Math.sqrt(this.u.minus(w2).norm2()/this.u.minus(this.v).norm2()), w2]);
			}
		}
	}
	else
	{
		var a1 = w.y/w.x;
		var b1 = this.u.y-a1*this.u.x;
		
		var a = 1+a1*a1;
		var b = 2*(a1*(b1-circle.center.y)-circle.center.x);
		var delta = b*b-4*a*(circle.center.x*circle.center.x+(b1-circle.center.y)*(b1-circle.center.y)-circle.radius*circle.radius);
		
		if(delta > 0)
		{
			var sqrt_delta = Math.sqrt(delta);
			var x1 = -(b+sqrt_delta)/(2*a);
			var x2 = (-b+sqrt_delta)/(2*a);
			
			var w1 = new Vector(x1, a1*x1+b1);
			var w2 = new Vector(x2, a1*x2+b1);
			
			if(this.containVectorSoft(w1))
			{
				contacts.push([Math.sqrt(this.u.minus(w1).norm2()/this.u.minus(this.v).norm2()), w1]);
			}
			if(this.containVectorSoft(w2))
			{
				contacts.push([Math.sqrt(this.u.minus(w2).norm2()/this.u.minus(this.v).norm2()), w2]);
			}
		}
	}
	
	var contact = false;
	var ratio = 1;
	for(var k = 0; k < contacts.length; k++)
	{
		if(ratio > contacts[k][0])
		{
			ratio = contacts[k][0];
			contact = contacts[k];
		}
	}
	return contact;
}
Segment.prototype.apsidesCircle = function(circle){
	var n = this.v.minus(this.u).normal().normalize().multiply(circle.radius);
	return [circle.center.plus(n), circle.center.plus(n.reverse())];
}
Segment.prototype.debug = function(){
	return 'Segment ['+this.u.debug()+', '+this.v.debug()+']';
}