let discogs = "https://api.discogs.com/oauth/request_token";
let discogsBaseUrl = "https://api.discogs.com/database/search?";

function getData(searchEntry, callback, pageNumber) {
	console.log("pageNumber", pageNumber);
	$(".js-search-results").html("");
	let request = {
		q: searchEntry,
		key: "bgZeLMbaTgrMJXHkppzG",
		secret: "KdEBhprqXmmRUCiLugLfIUBWuxYGlDHW",
		per_page: 15,
		page: pageNumber,
		type: "master"
		}

	$.ajax({
		url: discogsBaseUrl,
		type: "GET",
		dataType: "json",
		data: request,
		})
		.done(function(data) {
			// results [] = list of results that match search criteria.
			console.log(data);
			for(let i = 0; i < data.results.length; i++) {
			let resourceUrl = data.results[i].resource_url;
			console.log(resourceUrl);
			//getCredits(resourceUrl)
		};
			displaySearchData(data);
		})
		.fail(function(data) {
			console.log(data.pagination)
	});
};

function getOutput(item) {
  let title = item.title;
  let thumb = item.thumb;
  let style = item.style;

  let output = '<li class="output"><a href="#">' +
  '<div>' +
  '<img src=" ' + thumb + ' ">' +
  '</div>' +
  '<h3>' + title + '</h3>' + 
  '</div>' + '</a>' +
  '</li>';
  return output;
}

// GETS THE "EXTRAARTIST" OBJECT
// CALLED WITHIN  displayCredits
function getCredits(discogsMasterReleaseUrl) {
	//let discogsMasterReleaseUrl = "https://api.discogs.com/masters/"
	let creditRequest = {
		key: "bgZeLMbaTgrMJXHkppzG",
		secret: "KdEBhprqXmmRUCiLugLfIUBWuxYGlDHW",
	}

	$.ajax({
		url: discogsMasterReleaseUrl,
		type: "GET",
		dataType: "json",
		data: creditRequest
	})
	.done(function(data) {
		//console.log(data)
		for (let i = 0; i < data.tracklist.length; i++) {
			console.log(data.tracklist[i].extraartists);
			let extraartists = data.tracklist[i].extraartists;
			for (let j = 0; j < extraartists.length; j++) {
				console.log(`${extraartists[j].name}: ${extraartists[j].role}`);
				$(".individual_credits").append(`<li>${extraartists[j].role}: <span class="recording-info">${extraartists[j].name}</span></li>`);
			}
		}
	})
	.fail(function(data) {
		return 
	})
}

function displaySearchData(data) {
	if(data.results) {
  		data.results.forEach(function(item) {
	     	let output = getOutput(item);
	     	let li = $(output);
	     	displayCredits(li, item, data);
	     	$(".js-search-results").append(li);
    	});
	}
	else if (data.results === []){
		$(".js-search-results").append("No results matching search");
	}
	$(".next").show();
}	

function getAdditionalInfo(item)  {
	let additionalInfo = 
	`<li class="single-results">Genre: <span class="recording-info">${item.genre}</span></li>` +
	`<li class="single-results">Label: <span class="recording-info">${item.label}</span></li>` +
	`<li class="single-results">Format: <span class="recording-info">${item.format}</span></li>` +
	`<li class="single-results">Country: <span class="recording-info">${item.country}</span></li>` +
	`<li class="single-results">Year: <span class="recording-info">${item.year}</span></li>` +
	`<img class="lightbox_thumb" src=${item.thumb}></img>` ;
	return additionalInfo
}

function displayCredits(li, item, data) {
	let additionalInfo = getAdditionalInfo(item);
	li.find("a").on("click", function(e) {
		console.log(item);
		$(".search_bar").hide();
		$(".lightbox").css("display", "block");
		e.preventDefault();
		let resourceUrl = item.resource_url;
		console.log(resourceUrl);
		getCredits(resourceUrl);
		$(".additional_info").append(additionalInfo);
	});
	$("span").on("click", function(e) {
		$(".search_bar").show();
		$(".lightbox").css("display", "none");
		$(".additional_info").empty();
		$(".individual_credits").empty();
	});
	$(window).on("click", function(e) {
		if(e.currentTarget == $(".lightbox")) {
		$(".lightbox").css("display", "none");	
		$(".search_bar").show();
		}
	});
}


function navigate(pageNumber) {
	pageNumber = 1;
	$(".next").on("click", function(e) {
		console.log(e);
		let query = $(".search").val();
		query = sessionStorage.getItem("search");
		console.log(query, "query");
		pageNumber++;
		//MAKES ANOTHER API REQUEST W/ pageNumber AS ARGUMENT
		getData(query, displaySearchData, pageNumber);
	     $(".js-search-results").empty();
		if (pageNumber > 1) {
			$(".prev").show();
		};
		console.log(pageNumber);
	});
	$(".prev").on("click", function(e) {
		let query = $(".search").val();
		pageNumber--;
		getData(query, displaySearchData, pageNumber);
		console.log(pageNumber);
		if (pageNumber < 2) {
			$(".prev").hide();
		};
	})
}

function submit() {
	$(".search_bar").submit(function(e) {
		e.preventDefault();
		let query = $(".search").val();
		sessionStorage.setItem("search", query);
		getData(query, displaySearchData, navigate);
		$(".search").val("");
	});

}

$(function() {
	$(".page-btn").hide();
	submit();
});

