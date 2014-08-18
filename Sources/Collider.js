/* 

*/
function Collider()
{
	/* IDENTITY OF COLLIDER */
		// Layer
		this.layer = null;
	/* TRANSFORM OF COLLIDER */
		// Position x
		this.x = 0;
		// Position y
		this.y = 0;
		// Rotation z
		this.z = 0;
	/* PROPERTIES OF COLLIDER */
		// Is Trigger (précise que le Collider est en fait un Trigger (= zone de déclenchement))
		this.isTrigger = false;
		
}