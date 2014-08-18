function AudioSource(aud)
{
	/* IDENTITY OF AUDIOSOURCE */
		// Element Html Audio - Contient loop/mute/volume
		this.audio = (aud == null)?null:aud;
	/* TRANSFORM OF AUDIOSOURCE */
		// Position x
		this.x = 0;
		// Position y
		this.y = 0;
		// Rotation z
		this.z = 0;
	/* PROPERTIES OF AUDIOSOURCE */
		// Max Range Of AudioSource
		this.range = 0;
}