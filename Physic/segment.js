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
	
	/* On passe en représentation paramétrique,
		On a donc notre segment:	x = u.x + t*dx avec dx = v.x - u.x
									y = u.y + t*dy avec dy = v.y - u.y
		Equation d'un cercle: 		(x-xc)^2 + (y-yc)^2 = r^2
		
		Substitution:				(u.x + t*dx - xc)^2 + (u.y + t*dy - yc)^2 = r^2
								<=>	(dx^2 + dy^2)*t^2 + 2*((cx*dx) + (cy*dy))*t + (cx^2 + cy^2 - r^2) = 0 avec cx = u.x - xc et cy = u.y - xy
								
		On résout, et on trouve 0, 1 ou 2 valeur(s) de t. Comme on est sur un segment, t doit être compris entre 0 et 1. Sinon, on sort du segment.
	*/
	
	var dx = this.v.x - this.u.x;
	var dy = this.v.y - this.u.y;
	var cx = this.u.x - circle.center.x;
	var cy = this.u.y - circle.center.y;
	
	var A = dx*dx + dy*dy;
	var B = 2*(dx*cx + dy*cy);
	var C = cx*cx + cy*cy - circle.radius*circle.radius;
	
	var delta = B*B - 4*A*C;
	
	if (delta > 0) {
		var t1 = (-B + sqrt(delta))/(2*A);
		var t2 = (-B - sqrt(delta))/(2*A);
		
		if (t1 < t2) {
			if (t1 >= 0 && t1 <= 1) {		
				contact.push(t1, new Vector(this.u.x + t1*dx, this.u.y + t1.dy));
			} else if (t2 >= 0 && t2 <= 1) {
				contact.push(t2, new Vector(this.u.x + t2*dx, this.u.y + t2.dy));
			}
		} else {
			if (t2 >= 0 && t2 <= 1) {		
				contact.push(t2, new Vector(this.u.x + t2*dx, this.u.y + t2.dy));
			} else if (t1 >= 0 && t1 <= 1) {
				contact.push(t1, new Vector(this.u.x + t1*dx, this.u.y + t1.dy));
			}
		}
	} else if (delta == 0) {
		var t1 = -B/(2*A);
		if (t1 >= 0 && t1 <= 1) {
			contact.push(t1, new Vector(this.u.x + t1*dx, this.u.y + t1.dy));
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