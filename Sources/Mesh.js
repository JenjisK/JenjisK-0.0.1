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
		// Image Width
		this.width = 0;
		// Image Height
		this.height = 0;
		// Start Position x
		this.sx = 0;
		// Start Position y
		this.sy = 0;
		// Clip Width
		this.swidth = 0;
		// Clip Height
		this.sheight = 0;
}