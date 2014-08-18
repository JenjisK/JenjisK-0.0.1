/* 
	image est un élément javascript natif de type HTMLImageElement.
	sx est l'abcisse de départ du clipage
	sy est l'ordonnée de départ du clipage
	swidth est la largeur à clipper
	sheight est la hauteur à clipper
	
	METHODES A FAIRE
 */
function Mesh(img)
{
	/* IDENTITY OF MESH */
		this.image = (img == null)?null:img;
	/* TRANSFORM OF MESH */
		// Position x
		this.x = 0;
		// Position y
		this.y = 0;
		// Rotation z
		this.z = 0;
	/* TRANSFORM OF IMAGE - Cf. canvas.context.drawImage */
		// Start Position x
		this.sx = 0;
		// Start Position y
		this.sy = 0;
		// Clip Width
		this.swidth = 0;
		// Clip Height
		this.sheight = 0;
}