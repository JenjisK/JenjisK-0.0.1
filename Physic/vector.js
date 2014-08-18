/* VECTOR - WORKS */

function Vector(x,y)
{
	this.x = x;
	this.y = y;
	
	if(typeof debug != "undefined")
	{
		debug.add('create Vector ['+this.x+', '+this.y+']');
	}
}

/* ENSEMBLE DE FONCTIONS MATHEMATIQUES */
// Retourne la norme du vecteur
Vector.prototype.norm = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y);
}
// Retourne le carré de la norme du vecteur
Vector.prototype.norm2 = function(){
	return this.x*this.x + this.y*this.y;
}
// Assigne les valeurs du vecteur u au vecteur
Vector.prototype.equal = function(u){
	return (this.x == u.x && this.y == u.y);
}
// Effectue le produit scalaire du vecteur avec le vecteur u
Vector.prototype.scalarProduct = function(u){
	return this.x*u.x + this.y*u.y;
}
// Effectue le produit vectoriel du vecteur avec le vecteur u
Vector.prototype.vectorProduct = function(u){
	return this.x*u.y - this.y*u.x;
}
// Calcul l'angle que fait le vecteur avec le vecteur w
Vector.prototype.angleWith = function(w){
	var v = this.normalize();
	var u = w.normalize();
	return (u.vectorProduct(v) > 0)?Math.acos(v.scalarProduct(u)):-Math.acos(v.scalarProduct(u));
}
// Retourne le vecteur directement normal au vecteur
Vector.prototype.normal = function(){
	return new Vector(this.y, -this.x);
}
// Ajoute le vecteur u au vecteur
Vector.prototype.plus = function(u){
	return new Vector(this.x + u.x, this.y + u.y);
}
// Multiplie le vecteur par le scalaire a
Vector.prototype.multiply = function(a){
	return new Vector(this.x*a, this.y*a);
}
// Soustrait le vecteur u au vecteur
Vector.prototype.minus = function(u){
	return new Vector(this.x - u.x, this.y - u.y);
}
// Multiplie le vecteur par -1
Vector.prototype.reverse = function(){
	return new Vector(-this.x, -this.y);
}
// Norme le vecteur, ou le laisse nul si c'était le cas
Vector.prototype.normalize = function(){
	var norm = this.norm();
	if(norm != 0)
	{
		return this.multiply(1/norm);
	}
	else
	{
		return new Vector(0,0);
	}
}
// Si b renseigné, tourne le vecteur de l'angle Theta tel que cos(Theta) = a et sin(Theta) = b. Sinon, tourne le vecteur de l'angle a
Vector.prototype.rotate = function(a, b){
	var x = this.x, y = this.y;
	if(typeof b !== "undefined")
	{
		x = a*this.x-b*this.y;
		y = b*this.x+a*this.y;
	}
	else
	{
		var c = Math.cos(a), s = Math.sin(a);
		x = c*this.x-s*this.y;
		y = s*this.x+c*this.y;
	}
	return new Vector(x, y);
}
// Retourne les coordonnées du vecteur sous la forme "V : [x,y]"
Vector.prototype.debug = function(){
	return 'Vector ['+this.x+', '+this.y+']';
}