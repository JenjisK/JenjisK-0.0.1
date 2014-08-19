/* SEGMENT - TOTEST */ // La notation TOTEST précise que dans sa version actuelle les fonctionnalités de la classe n'ont pas toutes été testées
/* CONVENTIONS :
	Sauf si précisé, les noms de variables suivants seront utilisés à des fins précises :
		i,j,l = entiers indices de tableaux / boucles for
		u,v,w = Vectors
		x,y = abcisses et ordonnées des Vectors
		s,t = Segments
*/
/* IMPORTANT : CONSOLE
	Les fonctions de "debug" censées retourner une représentation sous forme de chaine de caractère
	des objets sont délaissées au profit de l'utilisation de la console.
	
	Les fonctions suivantes sont à utiliser :
		console.log : affiche un message simple en console
		console.dir : permet l'affichage d'une représentation d'un objet en console (à préférer à
			console.log si utilisation de Firefox)
		console.info : message de type (?)
		console.warn : message de type (!)
		console.error : message de type (x)
		console.time : démarre un compteur
		console.timeEnd : arrête un compteur et affiche sa valeur
		
*/
/* WARNING : Segment.intersectSegment
	La fonction Segment.intersectSegment est importante. Il est nécessaires de lire sa description
	avant de l'utiliser pour savoir comment analiser ses retours.
*/

/* SEGMENT */
function Segment(u,v)
{
	/* u et v désignent bien ici les vecteur formant les extrêmitées du segment */
	this.u = u;
	this.v = v;
}
/* GETTERS */
/* TOIMPROVE - Détermine si Oui ou Non le vecteur w est situé sur le segment
	Je pense sincèrement que cette méthode peut être améliorée
*/
Segment.prototype.containVector = function(w){
	return (w.minus(this.u).norm()+w.minus(this.v).norm()==this.v.minus(this.u).norm() && !w.equal(this.u) && !w.equal(this.v));
}
/* TOIMPROVE - Détermine approximativement si Oui ou Non le vecteur w est situé sur le segment
	L'approximation arrondi les valeurs à 10^-5 près dans sa version originale
	L'utilité de cette fonction peut être remise en cause dans beaucoup de case
	A UTILISER AVEC PARCIMONIE
*/
Segment.prototype.containVectorSoft = function(w){
	return (approx(w.minus(this.u).norm()+w.minus(this.v).norm())==approx(this.v.minus(this.u).norm()) && !w.equal(this.u) && !w.equal(this.v));
}
/* Détermine si oui ou non les segments THIS et s s'intersectent
	/!\ Cette version est principalement utile à intersectSegment pour alléger la masse de calculs
*/
Segment.prototype.intersectSegmentFast = function(s){
	// a et b représentent ici les vecteurs directionnels des segments s et THIS respectivement
	var a = s.v.minus(s.u);
	var b = this.v.minus(this.u);
	// Si les segments se croisent, il y a nécessairement une alternance de signe ... Faire un DESSIN !
	return (a.vectorProduct(this.u.minus(s.u))*a.vectorProduct(this.v.minus(s.u))<=0 && b.vectorProduct(s.u.minus(this.u))*b.vectorProduct(s.v.minus(this.u))<=0);
}
/* TOTEST - Détermine si Oui ou Non les segments THIS et s s'intersectent et, le cas échéant,
	retourne la proportion du vecteur THIS avant intersection
	
	EXPLICATION :
		Si les segments AB et CD s'intersectent en I, la fonction retourne alors le rapport AI/AB (k) et le vecteur AI (w).
	
	REMARQUES :
		* deux vecteurs colinéaires ne sont pas déclarés intersectés
		* deux vecteurs sécants non colinéaires son déclarés sécants
			* en particulier, les segments sont ici considérés FERMéS donc les extrêmités comptent !
	
	VERSION ANTERIEURE :
		La version antérieure est ici ommise. Il faut cependant la garder (Physic/Segments.js)
		jusqu'à tests complets de celle-ci
*/
Segment.prototype.intersectSegment = function(s){
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
/* TOWRITE - intersectInternalSegment
	Il manque ici la fonction permettant de vérifier si les INTERIEURS de deux segments s'intersectent.
*/
/* Notes sur "segment.intersect..." :
	Ces fonctions ont été séparées alors qu'elle pourraient se trouver dans un switch d'une fonction
	"segment.intersectShape". Ceci est fait pour plus de clareté mais afin de "respecter la POO" il
	pourra être utile de les remplacer par/de créer la fonction segment.intersectShape.
*/
/* Détermine si Oui ou Non le segment THIS intersecte le polygone polygon et, le cas échéant,
	retourne le segment incriminé, la proportion, etc.
	
	EXPLICATION :
		Parmi les segment formant polygon, la fonction va chercher celui qui intersect le plus
		rapidement le segment THIS, i.e. celui qui minimise AI où AB est le segment THIS et I un
		point d'intersection.
		La valeur retournée est un triplet (k, u, v) où :
			* k est la proportion AI/AB avec AB le segment THIS et I le point de première intersection
			* u est le segment AI
			* v est le segment de polynom premièrement touché par AB (intersection en I donc)
	
	LIMITES :
		Une limite certaine à cet algorithme, et considérant le fonctionnement de
		segment.intersectSegment, est qu'il ne retourne qu'un contact dans le cas où deux contacts
		"équivalents" sont trouvés.
*/
Segment.prototype.intersectPolygon = function(polygon){
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
/* TOTEST - Détermine si Oui ou Non le segment THIS intersecte le chemin path et, le cas échéant,
	retourne le segment incriminé, la proportion, etc.

	REMARQUES :
		Se repporter à segment.intersectPolygon pour plus d'informations sur le fonctionnement
		Seul les différences seront ici détaillées en commentaire.
*/
Segment.prototype.intersectPath = function(path){
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
/* TOTEST - Détermine si Oui ou Non le segment THIS intersecte le cercle circle et, le cas échéant,
	retourne les coordonnées/tangentes/etc. relatives à la collisions.
	
	EXPLICATION :
		Retourne le premier point de collision du segment THIS sur le cercle circle si il existe.
		La valeur retournée est un triplet (k, u, v) où :
			* k est la proportion AI/AB avec AB le segment THIS et I le point de première intersection
			* u est le segment AI
			* v est le vecteur tangeante au cercle au point I
	
	WARNING :
		La nouvelle méthode pour détecter les collisions alors qu'il y a un contact pourra nécessiter
		ou bien une modification de la méthode, ou bien l'ajout d'une nouvelle méthode, pour
		gérer le cas (delta = 0)
*/
Segment.prototype.intersectCircle = function(circle){
	/* Ici les divers points de contacts sont enregistrés dans un tableau. 
		Ils sont traités à la fin du script
	*/
	var contacts = new Array();
	
	// w est le vecteur associé au segment THIS
	var w = this.v.minus(this.u);
	/* On test si le vecteur est vertical ou non pour éviter les problèmes de division par zéro
		Si ce n'est pas le cas, on pourra aisément utiliser une équation de la droite de la forme y = a*x + b
	*/
	if(approx(w.x) == 0)
	{
		/* Résolution du système :
			* y=a*x+b (Droite, pas segment : la vérification est faite ultérieurement)
			* x^2+y^2=r^2
		*/
		var bprime = circle.center.y;
		var delta = bprime*bprime-(circle.center.y*circle.center.y+(this.u.x-circle.center.x)*(this.u.x-circle.center.x)-circle.radius*circle.radius);
		
		// delta > 0 signifie l'existence de deux solitions réelles
		if(delta > 0)
		{
			var sqrt_delta = Math.sqrt(delta);
			
			// Création des deux vecteurs possibles pour le contact
			var w1 = new Vector(this.u.x, (bprime+sqrt_delta));
			var w2 = new Vector(this.u.x, bprime-sqrt_delta);
			
			// Ajout à contacts des vecteurs qui appartiennent bien au segment (pas uniquement sur la droite)
			if(this.containVectorSoft(w1))
			{
				contacts.push([Math.sqrt(this.u.minus(w1).norm2()/this.u.minus(this.v).norm2()), w1]);
			}
			if(this.containVectorSoft(w2))
			{
				contacts.push([Math.sqrt(this.u.minus(w2).norm2()/this.u.minus(this.v).norm2()), w2]);
			}
		}
		/* On ne test pas le cas avec deux solutions réelles car il signifie que le segment est tangeant
			au cercle OR les segments avec lesquels on va tester les collisions seront
		*/
	}
	// Si le vecteur directeur du segment est vertical
	else
	{
		/* WARNING
			Je ne sais plus exactement ce que j'ai fait ici. C'est sans doute encore une résolution
			de système en prenant comme première équation x = constante.
		*/
		/* */var a1 = w.y/w.x;
		/* */var b1 = this.u.y-a1*this.u.x;
		/* */var a = 1+a1*a1;
		/* */var b = 2*(a1*(b1-circle.center.y)-circle.center.x);
		/* */var delta = b*b-4*a*(circle.center.x*circle.center.x+(b1-circle.center.y)*(b1-circle.center.y)-circle.radius*circle.radius);
		
		/* */if(delta > 0)
		/* */{
			/* */var sqrt_delta = Math.sqrt(delta);
			/* */var x1 = -(b+sqrt_delta)/(2*a);
			/* */var x2 = (-b+sqrt_delta)/(2*a);
			
			/* */var w1 = new Vector(x1, a1*x1+b1);
			/* */var w2 = new Vector(x2, a1*x2+b1);
			
			/* */if(this.containVectorSoft(w1))
			/* */{
				/* */contacts.push([Math.sqrt(this.u.minus(w1).norm2()/this.u.minus(this.v).norm2()), w1]);
			/* */}
			/* */if(this.containVectorSoft(w2))
			/* */{
				/* */contacts.push([Math.sqrt(this.u.minus(w2).norm2()/this.u.minus(this.v).norm2()), w2]);
			/* */}
		/* */}
	}
	
	// On initialise la valeur de retour à false (elle vaudra false si aucun contact)
	var contact = false;
	// Ratio est le rapport AI/AB courant. Il vaut 1 au début puisque pas encore de contact
	var ratio = 1;
	for(var k = 0; k < contacts.length; k++)
	{
		// Si le ratio du contact étudié est inférieur à celui du plus petit pour le moment rencontré...
		if(ratio > contacts[k][0])
		{
			// ...alors ce contact est antérieur donc il remplace l'autre
			ratio = contacts[k][0];
			contact = contacts[k];
		}
	}
	return contact;
}
/* TOTEST - Retourne pour un segment donnée les deux points du cercle en lesquels il serait tangeant
	
	INFORMATIONS :
		Une gymnastique permet de comprendre : on se déplace depuis le centre du cercle d'une
			distance égale à son rayon et dans une direction orthogonale au segment.
		Il faut naturellement retourner les DEUX points à considérer.
*/
Segment.prototype.apsidesCircle = function(circle){
	var n = this.v.minus(this.u).normal().setNorm(circle.radius);
	return [circle.center.plus(n), circle.center.plus(n.reverse())];
}
