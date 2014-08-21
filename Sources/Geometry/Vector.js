/* VECTOR */ // WORKS
/* NOTATIONS :
		i,j,l = entiers indices de tableaux / boucles for
		u,v,w = Vectors
		x,y = abcisses et ordonnées des Vectors
*/

/* CLASS - VECTOR */
function Vector(x,y)
{
	this.x = x;
	this.y = y;
}
/* METHODS - VECTOR */
	/* GETTERS */
	Vector.prototype.duplicate = function(){ 		// Retourne une copie (mêmes coordonnées) de THIS
		return new Vector(this.x, this.y);
	}
	Vector.prototype.norm = function(){ 			// Retourne la norme de THIS
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	Vector.prototype.norm2 = function(){ 			// Retourne la norme au carré de THIS
		return this.x*this.x + this.y*this.y;
	}
	Vector.prototype.normal = function(){ 			// Retourne le vecteur directement normal à THIS
		return new Vector(this.y, -this.x);
	}
	Vector.prototype.angle = function(w){			// TO TEST - Détermine l'angle entre THIS et w
		var v = Vector.normalize(this);
		var u = Vector.normalize(w);
		return (Vector.vectorProduct(v,u) > 0)?Math.acos(Vector.scalarProduct(v,u)):-Math.acos(Vector.scalarProduct(v,u));
	}
	/* SETTERS */
	Vector.prototype.setNorm = function(newNorm){ 	// Défini newNorme comme nouvelle norme de THIS
		var norm = this.norm();
		if(norm != 0)
		{
			this.x = this.x * newNorm / norm;
			this.y = this.y * newNorm / norm;
		}
	}
	/* INTERNAL OPERATORS */
	Vector.prototype.plus = function(u){ 			// Ajoute u à THIS
		this.x += u.x;
		this.y += u.y;
		return this;
	}
	Vector.prototype.minus = function(u){ 			// Retire u à THIS
		this.x -= u.x;
		this.y -= u.y;
		return this;
	}
	Vector.prototype.multiply = function(a){ 		// Multiplie THIS par a
		this.x *= a
		this.y *= a;
		return this;
	}
	Vector.prototype.reverse = function(){ 			// Inverse le sens de THIS
		this.multiply(-1);
		return this;
	}
	Vector.prototype.normalize = function(){ 		// Défini la norme de THIS à 1
		var norm = this.norm();
		if(norm != 0)
		{
			this.multiply(1/norm);
		}
		return this;
	}
	Vector.prototype.rotate = function(a, b){ 		// Fait tourner THIS d'un angle a OU d'un angle c tel que cos(c)=a et sin(c)=b
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
		return this;
	}

/* FUNCTIONS - VECTORS */
Vector.plus = function(u, v){
	return u.duplicate().plus(v);
}
Vector.minus = function(u, v){
	return u.duplicate().minus(v);
}
Vector.multiply = function(u, a){
	return u.duplicate().multiply(a);
}
Vector.equal = function(u, v){
	return (u.x == v.x && u.y == v.y);
}
Vector.scalarProduct = function(u, v){
	return u.x*v.x + u.y*v.y;
}
Vector.vectorProduct = function(u, v){
	return u.x*v.y - u.y*v.x;
}
Vector.angle = function(u, v){
	return u.duplicate().angle(v);
}
Vector.normalize = function(u){
	return u.duplicate().normalize();
}
Vector.rotate = function(u, a, b){
	return u.duplicate().rotate(a, b);
}
Vector.reverse = function(u){
	return u.duplicate().reverse();
}
Vector.setNorm = function(u, newNorm){
	return u.duplicate().setNorm(newNorm);
}
Vector.normal = function(u){
	return u.duplicate().normal();
}



