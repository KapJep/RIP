﻿$( function(){
	$( ".translatable" ).each( function(){
		var str = $( this ).data( "transl" );
		var translated_str = t(str);
		if (this.id=="actor"){
			$(this).attr("placeholder",translated_str);
		}
		else {
			$(this).text(translated_str);
		}
	})
})

function anazitisi(){
	//disable search button and change the text
	document.getElementById("btnS").disabled = true;
	document.getElementById("btnS").innerHTML = t("Searching...") ;

	//empty the list
	$(".list-group").hide().empty();

	//get the search query and empty the field
	actor = $("#actor").val();
	$("#actor").val("");

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
						var new_span = $("<span class='badge bdg-width glyphicon glyphicon glyphicon-question-sign'> N/A</span>");
					}
					else if (actor.deathday.indexOf("-") >= 0) {
						var new_span = $("<span class='badge bdg-width glyphicon glyphicon-ban-circle'> R.I.P.</span>");
					}
					else {
						var new_span = $("<span class='badge bdg-width glyphicon glyphicon-heart'> ALIVE</span>");
					}

					var new_list_item = $("<li class='list-group-item'></li>");
					var new_actor_name_link = $("<a target=_blank href='http://www.themoviedb.org/person/"+id+"'>"+actor.name+"</a>");
					
					$(new_list_item).appendTo(".list-group").append(new_span,new_actor_name_link);
				}
				$(".list-group").slideDown("slow");
				document.getElementById("btnS").disabled = false;
				document.getElementById("btnS").innerHTML = t("Search");
			}
		}
	}
	xmlhttp.send();
	//enable search button again, wait for 10 sec and change the text
	setTimeout(function(){
		document.getElementById("btnS").disabled = false;
		document.getElementById("btnS").innerHTML = "Αναζήτηση";
	},10000);
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

$("#actor").keypress(function (e) {
	if (e.keyCode == 13) {
		anazitisi();
	}
})

$("#btnS").click(function(){
	anazitisi();
})
