$(function () {
	$(".translatable").each(function () {
		var str = $(this).data("transl");
		var translated_str = t(str);
		if (this.id == "actor") {
			$(this).attr("placeholder", translated_str);
		}
		else {
			$(this).text(translated_str);
		}
	})
})

function anazitisi() {
	// Let's cache elements we access frequently for performance
	var $btnS = $("#btnS");
	var $actor = $("#actor");
	var $list_group = $(".list-group");

	// Disable search button and change the text
	$btnS.attr("disabled", true);
	$btnS.text(t("Searching..."));

	// Empty the list
	$list_group.hide().empty();

	//get the search query and empty the field
	const actor = $actor.val();
	$actor.val("");

	performSearch(actor, $list_group, $btnS);


	//enable search button again, wait for 10 sec and change the text
	setTimeout(function () {
		document.getElementById("btnS").disabled = false;
		document.getElementById("btnS").innerHTML = "Αναζήτηση";
	}, 10000);
}

// Θα προσπαθήσω να γράψω την performSearch με promises αντι για callbacks
function performSearch(actor, $list_group, $btnS) {
	const url = `https://api.themoviedb.org/3/search/person?api_key=d44e0ac5ceac0c812a5ffa8c7cc72ef0&query=${actor}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			const actor_array = data.results;
			const len = actor_array.length;

			if (len > 0) {
				for (let i = 0; i < len; i++) {
					const id = actor_array[i].id;
					const actor = get_actor(id);

					let new_span;
					if (actor.deathday == null) {
						new_span = $("<span class='badge bdg-width glyphicon glyphicon glyphicon-question-sign'> N/A</span>");
					}
					else if (actor.deathday.indexOf("-") >= 0) {
						new_span = $("<span class='badge bdg-width glyphicon glyphicon-ban-circle'> R.I.P.</span>");
					}
					else {
						new_span = $("<span class='badge bdg-width glyphicon glyphicon-heart'> ALIVE</span>");
					}
					const new_list_item = $("<li class='list-group-item'></li>");
					const new_actor_name_link = $(`<a a target = _blank href = 'http://www.themoviedb.org/person/${id}' > ${actor.name}</a> `);

					new_list_item.append(new_span, new_actor_name_link);
					$list_group.append(new_list_item);
				}
			}
		})
		.catch(error => console.error(error))
		.finally(() => {
			$list_group.slideDown("slow");
			$btnS.attr("disabled", false);
			$btnS.text(t("Αναζήτηση"));
		});
};

// Διόρθωσα των κώδικα για να χρησιμοποιεί cached elements και να μην κάνει κάθε φορά query στο DOM
// function performSearch(actor, $list_group, $btnS) {
// 	const xmlhttp = new XMLHttpRequest();
// 	xmlhttp.open("GET", "https://api.themoviedb.org/3/search/person?api_key=d44e0ac5ceac0c812a5ffa8c7cc72ef0&query=" + actor, true);

// 	xmlhttp.onreadystatechange = function () {
// 		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
// 			const r = JSON.parse(xmlhttp.responseText);
// 			const actor_array = r.results;
// 			const len = actor_array.length;

// 			// to sosto einai r.total_results, alla prepei na vroume pos paei sto next page
// 			if (len > 0) {
// 				for (let i = 0; i < len; i++) {
// 					var id = actor_array[i].id;
// 					var actor = get_actor(id);

// 					let new_span;
// 					if (actor.deathday == null) {
// 						new_span = $("<span class='badge bdg-width glyphicon glyphicon glyphicon-question-sign'> N/A</span>");
// 					}
// 					else if (actor.deathday.indexOf("-") >= 0) {
// 						new_span = $("<span class='badge bdg-width glyphicon glyphicon-ban-circle'> R.I.P.</span>");
// 					}
// 					else {
// 						new_span = $("<span class='badge bdg-width glyphicon glyphicon-heart'> ALIVE</span>");
// 					}

// 					const new_list_item = $("<li class='list-group-item'></li>");
// 					const new_actor_name_link = $(`<a a target = _blank href = 'http://www.themoviedb.org/person/${id}' > ${ actor.name }</a> `);

// 					new_list_item.appendTo($list_group).append(new_span, new_actor_name_link);
// 				}

// 				$list_group.slideDown("slow");
// 				$btnS.attr("disabled", false);
// 				$btnS.text(t("Search"));
// 			}
// 		}
// 	};
// 	xmlhttp.send();
// }

function get_actor(id) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "https://api.themoviedb.org/3/person/" + id + "?api_key=d44e0ac5ceac0c812a5ffa8c7cc72ef0", false);
	xmlhttp.send();
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		r = eval("(" + xmlhttp.responseText + ")");
		return r;
	}
}

$("#actor").keypress(function (e) {
	if (e.keyCode == 13) {
		anazitisi();
	}
})

$("#btnS").click(function () {
	anazitisi();
})
