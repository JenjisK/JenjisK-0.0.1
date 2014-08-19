/* VECTOR - WORKS */ // La notation WORKS précise que dans sa version actuelle les fonctionnalités de la classe fonctionnent toutes
/* CONVENTIONS :
	Sauf si précisé, les noms de variables suivants seront utilisés à des fins précises :
		i,j,l = entiers indices de tableaux / boucles for
		u,v,w = Vectors
		x,y = abcisses et ordonnées des Vectors
		s,t = Segments
*/
/* WARNING : Modifications
	De légères modifications pourront être opérer sur de fonctions du type "normalize".
	Il faut par exemple voir si pour cette fonction il faut retourner un vecteur normalisé ou
	si il faut normaliser le vecteur (deuxième option choisie actuellement, possiblement non
	en accord avec les codes antèrieur au 19/08/2014).
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

/* VECTOR */
function Vector(x,y)
{
	/* Coordonnées spatiales x et y du vecteur */
	this.x = x;
	this.y = y;
}
/* GETTERS */
/* Retourne une copie (mêmes coordonnées) de THIS
*/
Vector.prototype.duplicate = function(){
	return new Vector(this.x, this.y);
}
/* Retourne la norme du vecteur THIS
*/
Vector.prototype.norm = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y);
}
/* Retourne la norme au carré du vecteur THIS
   A utiliser autant que possible sachant que la recherche d'une racine prend nettement plus de
   temps que d'élever un nombre au carré. Pour comparer des distances par exemple.
*/
Vector.prototype.norm2 = function(){
	return this.x*this.x + this.y*this.y;
}
/* Détermine si Oui ou Non les vecteurs u et THIS ont les mêmes coordonées
*/
Vector.prototype.equal = function(u){
	return (this.x == u.x && this.y == u.y);
}
/* Retourne le produit scalaire de THIS avec u
   NB : c'est bien THIS en premier (This.u)
*/
Vector.prototype.scalarProduct = function(u){
	return this.x*u.x + this.y*u.y;
}
/* Retourne le produit vectoriel 2D de This avec u
   NB : c'est bien THIS en premier (This^u)
*/
Vector.prototype.vectorProduct = function(u){
	return this.x*u.y - this.y*u.x;
}
/* Retourne l'angle direct entre les vecteurs THIS et u
   NB : l'angle est dans [0, 2Pi[ et c'est bien THIS en premier
*/
Vector.prototype.angleWith = function(w){
	var v = this.duplicate().normalize();
	var u = w.duplicate().normalize();
	return (u.vectorProduct(v) > 0)?Math.acos(v.scalarProduct(u)):-Math.acos(v.scalarProduct(u));
}
/* Retourne le vecteur directement normal à THIS
*/
Vector.prototype.normal = function(){
	return new Vector(this.y, -this.x);
}
/* SETTERS */
/* Défini la norme du vecteur THIS à newNorm
*/
Vector.prototype.setNorm = function(newNorm){
	var norm = this.norm();
	if(norm != 0)
	{
		this.x = this.x * newNorm / norm;
		this.y = this.y * newNorm / norm;
	}
}
/* INTERNAL OPERATORS */
/* Ajoute u au vecteur THIS
*/
Vector.prototype.plus = function(u){
	this.x += u.x;
	this.y += u.y;
}
/* Multiplie THIS par a
*/
Vector.prototype.multiply = function(a){
	this.x *= a
	this.y *= a;
}
/* Soustrait u au vecteur THIS
*/
Vector.prototype.minus = function(u){
	this.x -= u.x;
	this.y -= u.y;
}
/* Inverse le vecteur THIS
*/
Vector.prototype.reverse = function(){
	this.multiply(-1);
}
/* Normalise le vecteur THIS
*/
Vector.prototype.normalize = function(){
	var norm = this.norm();
	if(norm != 0)
	{
		this.multiply(1/norm);
	}
}
/* Tourne le vecteur THIS de a OU de arcos(a),arcsin(a)
   NB : Si seul a est renseigné, le vecteur THIS est tourné d'un angle a dans le sens trigo
		Si a et b sont renseignés, le vecteur THIS est tourné de l'angle de cosinus a et de sinus b
    NB : Renseigner les deux arguments permet d'éviter de multiples calculs trigonométriques,
		notamment lorsque plusieurs vecteur doivent être tournés
*/
Vector.prototype.rotate = function(a, b){
	var x = this.x, y = this.y;
	if(typeof b !== "undefined")
	{
		/* Il s'agit ici de calculs trigonométriques évidents */
		x = a*this.x-b*this.y;
		y = b*this.x+a*this.y;
	}
	else
	{
		/* Ici il faut au préalable calculer le cosinus et le sinus à partir de l'angle a */
		var c = Math.cos(a), s = Math.sin(a);
		x = c*this.x-s*this.y;
		y = s*this.x+c*this.y;
	}
	this.x = x;
	this.y =  y;
}
