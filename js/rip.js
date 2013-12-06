function anazitisi(){

	$(".list-group").hide().empty();
	actor = document.getElementById("actor").value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","https://api.themoviedb.org/3/search/person?api_key=d44e0ac5ceac0c812a5ffa8c7cc72ef0&query="+actor,true);

	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			r = eval ("(" + xmlhttp.responseText + ")");
			// to sosto einai r.total_results, alla prepei na vroume pos paei sto next page
			if (r.results.length>0){
				var i;
				for (i=0;i<r.results.length;i++){

					var age = 88;
					var name = r.results[i].name;
					var id = 

					https://api.themoviedb.org/3/person/8167?api_key=d44e0ac5ceac0c812a5ffa8c7cc72ef0

					var new_list_item = $("<li class='list-group-item'></li>");
					var new_span = $("<span class='badge'>"+age+"</span>");

					$(new_list_item).appendTo(".list-group").append(new_span,name);
				}
				$(".list-group").slideDown("slow");
			}
		}
	}
	xmlhttp.send();
}
