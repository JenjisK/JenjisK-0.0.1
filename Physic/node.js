/* NODE 
	Deviendra GAMEOBJECT
*/

function Node(name)
{
	this.name = name;
	this.parent = false;
	this.childs = new Array();
	
	this.position = new Vector(0,0);
	this.rotation = 0;
	
	this.mesh = false;
	this.meshLayer = false;
	
	this.collider = false;
	this.colliderLayers = false;
	this.colliding = false;
	
	this.triggerBox = false;
	this.triggerFunction = false;
	this.triggerLayers = new Array();
}
Node.prototype.absolutePosition = function(){
	if(this.parent != false)
	{
		return this.position.plus(this.parent.absolutePosition().rotate(this.parent.rotation));
	}
	else
	{
		return this.position;
	}
}
/* A DITER */
Node.prototype.collide = function(node){
	var c = false;
	
	if(this != node)
	{
		if(this.collider && node.collider)
		{
			var thisPosition = this.absolutePosition();
			var nodePosition = node.absolutePosition();
			
			this.collider.rotate(this.rotation);
			node.collider.rotate(node.rotation);
			
			this.collider.translate(thisPosition);
			node.collider.translate(nodePosition);
			
			c = this.collider.intersectShape(node.collider);
			
			this.collider.translate(thisPosition.reverse());
			node.collider.translate(nodePosition.reverse());
			
			this.collider.rotate(-this.rotation);
			node.collider.rotate(-node.rotation);
		}
		for(var k = 0; k < this.childs.length; k++)
		{
			c = (c || this.childs[k].collide(node));
			if(c)
			{
				break;
			}
		}
	}
	
	return c;
}
Node.prototype.addChild = function(node){
	node.parent = this;
	this.childs.push(node);
}
Node.prototype.debug = function(){
	return '[NODE]';
}
Node.prototype.absoluteCollider = function(){
	return this.collider.translate(this.absolutePosition());
}
Node.prototype.hasAncester = function(node){
	if(this.parent)
	{
		if(this.parrent == node)
		{
			return true;
		}
		else
		{
			return this.parent.hasAncester(node);
		}
	}
	else
	{
		return false;
	}
}
Node.prototype.translate = function(direction){
	this.position = this.position.plus(direction);
}