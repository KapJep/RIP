// Api key file
import { apiKey } from "./the_config.js";


function anazitisi() {
	// Let's cache elements we access frequently for performance
	var $btnS = $("#btnS");
	var $actor = $("#actor");
	var $list_group = $(".list-group");

	// Disable search button and change the text
	$btnS.attr("disabled", true);
	$btnS.text("Searching...");

	// Empty the list
	$list_group.hide().empty();

	//get the search query and empty the field
	const actor = $actor.val();
	$actor.val("");

	performSearch(actor, $list_group, $btnS);


	//enable search button again, wait for 10 sec and change the text
	setTimeout(function () {
		document.getElementById("btnS").disabled = false;
		document.getElementById("btnS").innerHTML = "Search";
	}, 10000);
}

// Θα προσπαθήσω να γράψω την performSearch με promises αντι για callbacks
// τελικά χρησιμοποίησα το async/await γιατί είναι πιο εύκολο και κατανοητό
async function performSearch(actor, $list_group, $btnS) {
	/* declare api url */
	const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${actor}`;
	console.log(url);
	/* declare icons */
	const icon_heart = '<svg class="inline-block w-6" ' +
		'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">' +
		'<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 ' +
		'15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 ' +
		'2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 ' +
		'01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>';
	const icon_question = '<svg class="inline-block w-6" ' +
		'xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">' +
		'<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 ' +
		'1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>';
	const icon_rip = '<svg class="inline-block w-6" ' +
		'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">' +
		'<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" /></svg>';


	try {
		const response = await fetch(url);
		const data = await response.json();
		const actor_array = data.results;
		const len = actor_array.length;

		if (len > 0) {
			const promises = actor_array.map(async (actorInfo) => {
				const id = actorInfo.id;
				const actor = await get_actor(id);
				return actor;
			});


			const actors = await Promise.all(promises);

			actors.forEach(actor => {
				let new_span;
				if (!actor.deathday || actor.deathday === "undefined") {
					new_span = $("<span class='text-center'>" + icon_question + " N/A</span>");
				} else if (actor.deathday.indexOf("-") >= 0) {
					new_span = $("<span class='text-center'>" + icon_rip + "R.I.P.</span>");
				} else {
					new_span = $("<span class='text-center'>" + icon_heart + " ALIVE</span>");
				}

				const new_list_item = $("<li class='w-48 flex flex-col border rounded items-center list-group-item'></li>");
				const new_actor_name_link = $(`<a class="text-center my-2" href = 'http://www.themoviedb.org/person/${actor.id}' target="_blank"> ${actor.name}</a> `);
				const new_actor_image = $(`<img class="rounded w-36 my-2" src="${actor.image}" alt="${actor.name}">`);
				const new_actor_birthday = $(`<span class='text-center'>Birthday: ${actor.birthday}</span>`);
				const new_actor_deathday = $(`<span class='text-center'>Deathday: ${actor.deathday}</span>`);

				new_list_item.append(new_actor_name_link, new_actor_image, new_actor_birthday, new_actor_deathday, new_span);
				$list_group.append(new_list_item);
			});
		}
	} catch (error) {
		console.error(error);
	} finally {
		$list_group.slideDown("slow");
		$btnS.attr("disabled", false);
		$btnS.text("Search");
	}
}

// Θα προσπαθήσω να γράψω την get_actor με async/await αντι για promises
async function get_actor(id) {
	const url = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		const actor = {
			id: data.id,
			name: data.name,
			deathday: data.deathday ? data.deathday : "N/A",
			birthday: data.birthday ? data.birthday : "N/A",
			image: data.profile_path ? "https://image.tmdb.org/t/p/w185" + data.profile_path : "https://via.placeholder.com/185x278?text=No+Image",

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
