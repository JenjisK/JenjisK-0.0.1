/* WARNING */
/* Ces quelques fonctions sont provisoires et devront être recodées/renommées */
// Retourne la position de l'objet par rapport au coin haut-gauche de la page
function z_object_position(obj)
{
	var position = new Vector(0,0);
	do
	{
		position = position.plus(new Vector(obj.offsetLeft, obj.offsetTop));
	}
	while(obj = obj.offsetParent);
	
	return position.duplicate();
}
// Retourne la position du clique sur l'objet relativement à sa position
function z_object_click_position(object, e)
{
	var position_object = new Vector(object.offsetLeft, object.offsetTop);
	var position = new Vector(e.clientX, e.clientY);
	return position.minus(position_object);
}
// Pour le moment ne fait rien
function approx(a)
{
	return a;
}
function depprox(a)
{
	return a;
}
// Trace un cercle
CanvasRenderingContext2D.prototype.drawCircle = function(circle)
{
	// On crée le cercle
	this.beginPath();
	if(circle instanceof CircleCollider)
	{
		this.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI, false);
	}
	
	// On affiche le cercle
	this.strokeStyle = 'rgb(0,0,0)';
	this.stroke();
}
CanvasRenderingContext2D.prototype.drawArc = function(arc)
{
	// On crée le cercle
	this.beginPath();
	if(typeof arc.center != "undefined")
	{
		this.arc(arc.center.x, arc.center.y, arc.radius, arc.beta, arc.beta+arc.alpha, arc.alpha<0);
	}
	
	// On affiche le cercle
	this.strokeStyle = 'rgb(0,0,0)';
	this.stroke();
}
CanvasRenderingContext2D.prototype.drawSegment = function(segment)
{
	// On crée le segment
	this.beginPath();
	this.moveTo(segment.u.x, segment.u.y);
	this.lineTo(segment.v.x, segment.v.y);
	
	// On affiche le cercle
	this.strokeStyle = 'rgb(0,0,0)';
	this.stroke();
}
CanvasRenderingContext2D.prototype.drawVector = function(vector)
{
	this.drawSegment(new Segment(new Vector(0,0), vector));
}
CanvasRenderingContext2D.prototype.clear = function()
{
	this.clearRect(0,0,1000, 1000);
}

CanvasRenderingContext2D.prototype.drawPolygon = function(polygon)
{
	for (var i = 0; i < polygon.vertices.length-1; i++) {
		this.drawSegment(new Segment(polygon.vertices[i], polygon.vertices[i+1]));
	}
	this.drawSegment(new Segment(polygon.vertices[polygon.vertices.length-1], polygon.vertices[0]));
}