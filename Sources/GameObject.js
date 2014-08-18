function GameObject(name)
{
	/* IDENTITE OF GAMEOBJECT */
		// Name
		this.name = (name == null)?"GameObject":name;
		// Parent
		this.parent = null;
		// Childs
		this.childs = new Array();
	
	/* TRANSFORM OF GAMEOBJECT */
		// Position x
		this.x = 0;
		// Position y
		this.y = 0;
		// Rotation z
		this.z = 0;
	
	/* COMPONENTS OF GAMEOBJECT */
		// Meshes
		this.meshes = new Array();
		// Colliders
		this.colliders = new Array();
		// AudioSources
		this.audioSources = new Array();
		// AudioListeners
		this.audioListeners = new Array();
		// Cameras
		this.cameras = new Array();
}
