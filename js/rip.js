function anazitisi(){

	$(".list-group").hide().empty();
	actor = document.getElementById("actor").value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","https://api.themoviedb.org/3/search/person?api_key=d44e0ac5ceac0c812a5ffa8c7cc72ef0&query="+actor,true);

	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			r = eval ("(" + xmlhttp.responseText + ")");

			var actor_array = r.results;
			var len = actor_array.length;

			console.log(len);
			// to sosto einai r.total_results, alla prepei na vroume pos paei sto next page
			if (len>0){
				var i;
				for (i=0;i<len;i++){

					var id = actor_array[i].id;
					var actor = get_actor(id);

					if (actor.deathday == null) {
						var new_span = $("<span class='badge glyphicon glyphicon-heart'>&nbsp;</span>");
					}
					else if (actor.deathday.indexOf("-") >= 0) {
						var new_span = $("<span class='badge'>R.I.P.</span>");
					}
					else {
						var new_span = $("<span class='badge glyphicon glyphicon-heart'>&nbsp;</span>");
					}

					var new_list_item = $("<li class='list-group-item'></li>");
					
					$(new_list_item).appendTo(".list-group").append(new_span,actor.name);
				}
				$(".list-group").slideDown("slow");
			}
		}
	}
	xmlhttp.send();
}

function get_actor (id) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","https://api.themoviedb.org/3/person/"+id+"?api_key=d44e0ac5ceac0c812a5ffa8c7cc72ef0",false);
	xmlhttp.send();
	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		r = eval ("(" + xmlhttp.responseText + ")");
		return r;
	}
}