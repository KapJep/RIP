// Api key file
import { apiKey } from "./the_config.js";

function anazitisi() {
	// Cache frequently accessed elements
	const searchButton = $("#btnS");
	const actorInput = $("#actor");
	const listGroup = $(".list-group");

	// Disable search button and change the text
	searchButton.prop("disabled", true).text("Searching...");

	// Empty the list
	listGroup.hide().empty();

	// Get the search query, sanitize the input and empty the field
	const actor = actorInput.val().trim();
	actorInput.val("");

	// Perform the search and handle the results
	performSearch(actor, listGroup, searchButton)
		.then(() => {
			// Enable search button again after a delay
			setTimeout(() => {
				searchButton.prop("disabled", false).text("Search");
			}, 5000);
		})
		.catch((error) => {
			// Handle errors
			console.error(error);
			searchButton.prop("disabled", false).text("Search");
		});
}

// Function to perform the search
async function performSearch(actor, listGroup, searchButton, page = 1, pageSize = 10) {
	// Declare the API URL
	const apiUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${actor}&page=${page}`;

	try {
		// Fetch the search results from the API
		const data = await fetchJson(apiUrl);

		// Get the actor data for each search result
		const actors = await getActors(data.results.slice(0, pageSize));

		// Create an actor card for each actor
		const actorCards = actors.map(createActorCard);

		// Append the actor cards to the list group and show it
		appendActorCards(actorCards, listGroup);
		listGroup.show();

		// Check if there are more pages and add a "Load More" button
		if (data.total_pages > page) {
			addLoadMoreButton(actor, listGroup, searchButton, page + 1, pageSize);
		}

	} catch (error) {
		// Handle errors
		console.error(error);
	} finally {
		// Enable search button again
		searchButton.prop("disabled", false).text("Search");
	}
}

// Function to fetch JSON data from a URL
async function fetchJson(url) {
	const response = await fetch(url);
	return response.json();
}


// Function to get the actor data for each search result
async function getActors(actorArray) {
	// Map each search result to a Promise that resolves to the actor data
	const promises = actorArray.map(async (actorInfo) => {
		const id = actorInfo.id;
		const actor = await getActor(id);
		return actor;
	});
	// Wait for all Promises to resolve and return the actor data
	return Promise.all(promises);
}

// Function to get the actor data for a single actor ID
async function getActor(actorId) {
	// Declare the API URL
	const apiUrl = `https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`;

	// Fetch the actor data from the API and return the relevant properties
	const data = await fetchJson(apiUrl);
	return {
		id: data.id,
		name: data.name,
		deathday: data.deathday ? data.deathday : "N/A",
		birthday: data.birthday ? data.birthday : "N/A",
		image: data.profile_path ? "https://image.tmdb.org/t/p/w185" + data.profile_path : "https://via.placeholder.com/185x278?text=No+Image",
	};
}

// Function to create an actor card HTML string
function createActorCard(actor) {
	// Declare icons
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

	// Create the actor card HTML string
	let new_span;
	if (!actor.deathday || actor.deathday === "undefined") {
		new_span = $("<span class='text-center'>" + icon_question + " N/A</span>");
	} else if (actor.deathday.indexOf("-") >= 0) {
		new_span = $("<span class='text-center'>" + icon_rip + "R.I.P.</span>");
	} else {
		new_span = $("<span class='text-center'>" + icon_heart + " ALIVE</span>");
	}

	const new_actor = `
		<div class='w-56 flex flex-col border rounded items-center shadow-lg transition duration-150 hover:shadow-sm hover:bg-slate-200 hover:rounded-none'>
			<a class='p-4 inline-flex flex-col' href='http://www.themoviedb.org/person/${actor.id}' target='_blank'>
				<span class='text-center'>${actor.name}</span>
				<img class="rounded w-40 my-2 mx-auto shadow  aspect-square object-cover min-w-full skeleton-image" src="${actor.image}" alt="${actor.name}">
				<span class='text-center'>Birthday: ${actor.birthday}</span>
				<span class='text-center'>Deathday: ${actor.deathday}</span>
				${new_span.prop('outerHTML')}
			</a>
		</div>
	`;
	return new_actor;
}

// Function to append the actor cards to the list group
function appendActorCards(actorCards, listGroup) {
	if (actorCards.length === 0) {
		listGroup.append("<div class='list-group-item'>No results found</div>");
	} else {
		listGroup.append(actorCards.join(""));
	}
}

// Function to add a "Load More" button to the list group
function addLoadMoreButton(actor, listGroup, searchButton, nextPage) {
	const loadMoreButton = $("<button>")
		.addClass("bg-slate-900 hover:bg-slate-400 text-white py-3 px-8 rounded my-2 mx-auto")
		.text("Load More")
		.click(() => {
			loadMoreButton.prop("disabled", true).text("Loading...");
			performSearch(actor, listGroup, searchButton, nextPage)
				.then(() => {
					loadMoreButton.remove();
				})
				.catch((error) => {
					console.error(error);
					loadMoreButton.prop("disabled", false).text("Load More");
				});
		});
	listGroup.append($("<div>").addClass("contents").append(loadMoreButton));
}

$("#actor").keypress(function (e) {
	if (e.keyCode == 13) {
		anazitisi();
	}
})

$("#btnS").click(function () {
	anazitisi();
})
