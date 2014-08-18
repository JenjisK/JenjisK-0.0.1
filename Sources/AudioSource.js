/*
	Cette classe liée à un élément scénique
	lui permet de jouer un son. L'élément audio est du type
	HTMLAudioElement.
	Le "range" est la distance au delà de laquelle cette source ne
	s'entend plus.
	
	Reste à définir de quelle manière le son doit décroître depuis
	le centre de la source jusqu'aux bords
	
	METHODES A FAIRE
 */
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
	/* PROPERTIES OF AUDIOSOURCE */
		// Max Range Of AudioSource
		this.range = 0;
}