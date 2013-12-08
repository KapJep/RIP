function t(str){

	var lang = navigator.language; 
	lang = lang.substring(0,2);

	var translations = {
		"el" : {
			"Find out whether your favourite actor is still with us." : "Μάθε αν ο αγαπημένος σου ηθοποιός είναι ακόμα μαζί μας.",
			"Name" : "Όνομα",
			"Search" : "Αναζήτηση",
			"Searching..." : "Αναζήτηση..."
		}
	}

	if(translations[lang]){
		return translations[lang][str];
	}
	else {
		return str;
	}
}
