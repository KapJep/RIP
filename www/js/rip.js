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
// τελικά χρησιμοποίησα το async/await γιατί είναι πιο εύκολο και κατανοητό
async function performSearch(actor, $list_group, $btnS) {
	const url = `https://api.themoviedb.org/3/search/person?api_key=d44e0ac5ceac0c812a5ffa8c7cc72ef0&query=${actor}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		const actor_array = data.results;
		const len = actor_array.length;

		if (len > 0) {
			const promises = actor_array.map(async (actorInfo) => {
				id = actorInfo.id;
				const actor = await get_actor(id);
				return actor;
			});

			const actors = await Promise.all(promises);

			actors.forEach(actor => {
				let new_span;
				if (!actor.deathday || actor.deathday === "undefined") {
					new_span = $("<span class='badge bdg-width glyphicon bi bi-question-circle'> N/A</span>");
				} else if (actor.deathday.indexOf("-") >= 0) {
					new_span = $("<span class='badge bdg-width glyphicon bi bi-slash-circle-fill bg-dark'> R.I.P.</span>");
				} else {
					new_span = $("<span class='badge bdg-width glyphicon bi bi-heart-fill bg-success'> ALIVE</span>");
				}

				const new_list_item = $("<li class='list-group-item'></li>");
				const new_actor_name_link = $(`<a class="text-start" href = 'http://www.themoviedb.org/person/${actor.id}' target="_blank"> ${actor.name}</a> `);

				new_list_item.append(new_span, new_actor_name_link);
				$list_group.append(new_list_item);
			});
		}
	} catch (error) {
		console.error(error);
	} finally {
		$list_group.slideDown("slow");
		$btnS.attr("disabled", false);
		$btnS.text(t("Αναζήτηση"));
	}
}

// Θα προσπαθήσω να γράψω την get_actor με async/await αντι για promises
async function get_actor(id) {
	const url = `https://api.themoviedb.org/3/person/${id}?api_key=d44e0ac5ceac0c812a5ffa8c7cc72ef0`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		const actor = {
			id: data.id,
			name: data.name,
			deathday: data.deathday ? data.deathday : "N/A"
		};
		return actor;
	} catch (error) {
		console.error(error);
		throw error;
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
