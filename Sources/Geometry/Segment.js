/* SEGMENT - TEST */
/* NOTATIONS :
	Sauf si précisé, les noms de variables suivants seront utilisés à des fins précises :
		i,j,l = entiers indices de tableaux / boucles for
		u,v,w = Vectors
		x,y = abcisses et ordonnées des Vectors
		s,t = Segments
*/
/* WARNING : Segment.intersectSegment(/Fast/Internal)
*/

/* SEGMENT */
function Segment(u,v)
{
	this.u = u;	// Vecteur définissant le début du segment
	this.v = v; // Vecteur définissant la fin du segment
}
/* GETTERS */
Segment.prototype.containVector = function(w){				// Détermine si w appartient à THIS
	return (Vector.minus(w, u).norm() + Vector.minus(w, v).norm() == Vector.minus(v, u).norm());
}
Segment.prototype.intersectSegmentFast = function(s){		// Détermine si THIS et s s'intersectent
	// a et b représentent ici les vecteurs directionnels des segments s et THIS respectivement
	var a = s.v.minus(s.u);
	var b = this.v.minus(this.u);
	// Si les segments se croisent, il y a nécessairement une alternance de signe ... Faire un DESSIN !
	return (a.vectorProduct(this.u.minus(s.u))*a.vectorProduct(this.v.minus(s.u))<=0 && b.vectorProduct(s.u.minus(this.u))*b.vectorProduct(s.v.minus(this.u))<=0);
}
Segment.prototype.intersectSegment = function(s){			// Détermine le point d'intersection de THIS et s. Retour : [k, u]
	// Utilisation de intersectSegmentFast pour allègement des calculs
	if(this.intersectSegmentFast(s))
	{
		// Les vecteurs w1 et w2 sont les vecteurs directeurs des segments THIS et s
		var w1 = this.v.minus(this.u);
		var w2 = s.v.minus(s.u);
		// Produit scalaire des vecteurs segment - Si null, alors les vecteurs sont collinéaires
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
Segment.prototype.intersectSegmentInternal = function(s){	// Détermine le point d'intersection l'intérieur de THIS et de s. Retour : [k, u]
	if(s.containVector(this.u) || s.containVector(this.v))
	{
		return false;
	}
	else
	{
		return this.intersectSegment(s);
	}
}
Segment.prototype.intersectShape = function(shape){			// Détermine le point d'intersection de THIS avec la forme shape
	switch(shape)
	{
		case "polygon" : return this.intersectPolygon(shape); break;
		case "path" : return this.intersectPath(shape); break;
		case "circle" : return this.intersectCircle(shape); break;
		default : console.warn("segment.intersectShape used on undefined-type shape."); return false; break;
	}
}
Segment.prototype.intersectPolygon = function(polygon){		// Détermine le point d'intersection de THIS avec le polygone polygon
	/* firstContact enregistrera le contact le plus immédiat parmi ceux trouvés, nombreOfPoints conserve
		le nombre de points ou "vertices" formant le polygone polygon */
	var firstContact = false, nombreOfPoints = polygon.points.length;
	/* La boucle for (sur i) parcours les points de proche en proche 
		La différence avec segment.intersecPath est qu'ici la dernière valeur de i est nombreOfPoints-1
	*/
	for(var i = 0, j; i < nombreOfPoints; i++)
	{
		/* i est l'indice du premier point à considérer, et j celui du suivant dans la liste des
			points du polynome polynom (%l afin de récupérer le numéro 0 quand i est maximal) */
		j = (i+1)%nombreOfPoints;
		// On récupére un éventuel contact entre le segment THIS et celui constitué des deux points étudiés
		var contact = this.intersectSegment(new Segment(polygon.points[i], polygon.points[j]));
		// Si il y a bien contact, on le compare avec l'actuel "meilleur contact"
		if(contact)
		if(!firstContact || firstContact[0] > contact[0])
		{
			// Si il est meilleur, il devient le nouveau "meilleur contact" et on ajoute le segment incriminé de polynom
			firstContact = [contact[0], contact[1], new Segment(polygon.points[i], polygon.points[j])];
		}
	}
	// On retourne firstContact qui contient alors le meilleur contact
	return firstContact;
}
Segment.prototype.intersectPath = function(path){			// Détermine le point d'intersection de THIS avec le chemin path
	// Pas de variable nombreOfPoints car il n'est utilisé qu'une fois
	var firstContact = false;
	// Pas de variable j ici car pas besoin de faire un %modulo% puisque i s'arrête à path.points.length-2
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
Segment.prototype.intersectCircle = function(circle){		// Détermine le point d'intersection de THIS avec le cercle circle
	var contact = null;
	
	// Enregistrement des points de contacts
	var w = Vector.minus(this.v, this.u);
	
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
	var cx = this.u.x - circle.center.x;
	var cy = this.u.y - circle.center.y;
	
	var A = dx*dx + dy*dy;
	var B = dx*cx + dy*cy;
	var C = cx*cx + cy*cy - circle.radius*circle.radius;
	
	var delta = B*B - A*C;
	
	if (delta > 0){
		var sqrt_delta = Math.sqrt(delta);
		var t1 = (-B + sqrt_delta)/A;
		var t2 = (-B - sqrt_delta)/A;
		
		if (t1 < t2){
			if (t1 >= 0 && t1 <= 1){		
				contact = [t1, Vector.plus(this.u, Vector.multiply(w, t1))];
			}else if (t2 >= 0 && t2 <= 1){
				contact = [t2, Vector.plus(this.u, Vector.multiply(w, t2))];
			}
		}else{
			if (t2 >= 0 && t2 <= 1){		
				contact = [t2, Vector.plus(this.u, Vector.multiply(w, t2))];
			}else if (t1 >= 0 && t1 <= 1){
				contact = [t1, Vector.plus(this.u, Vector.multiply(w, t1))];
			}
		}
	}
	else if (delta == 0){
		var t1 = -B/(2*A);
		if (t1 >= 0 && t1 <= 1){
			contact = [t1, new Vector(this.u.x + t1*dx, this.u.y + t1.dy)];
		}
	}
	
	return contact;
}
Segment.prototype.apsidesCircle = function(circle){			// Détermine les points de circle en lesquels THIS est tangeant
	var n = this.v.minus(this.u).normal().setNorm(circle.radius);
	return [circle.center.plus(n), circle.center.plus(n.reverse())];
}




