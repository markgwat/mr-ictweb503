
/**
 * DOM elements
 */

var ideasUL = document.getElementById('ideas');

/**
 * Event Listeners
 */

document.addEventListener("DOMContentLoaded", function(e) { 
  
	readIdeas();

});

document.addEventListener('change', function(e){

	var changed = e.target;

	if(changed.matches('#idea_create')){

		createIdea(changed.value);

		changed.value = '';
	}

	if(changed.matches('.idea_edit')){

		updateIdea(changed.closest('.idea'));
	}

});

document.addEventListener('click', function(e){

	var clicked = e.target;

	if(clicked.matches('.idea_delete')){

		deleteIdea(clicked.closest('.idea'));
	}

});


/** 
 * Functions
 */

function readIdeas(){

	jQuery.ajax(
		{
	    	url: 'https://www.getdone.pw/wp-json/wp/v2/idea',
	    	method: 'GET',
		}
	).done(function(response){

		// render Ideas
		renderIdeas(response, ideasUL);

	});

}


// render the ideas into the container
function renderIdeas(ideas, container){
	
	// render from sratch on every call
	container.innerHTML = '';

	for(var i = 0; i < ideas.length; i++){
		var idea = ideas[i];
		var ideasTemplate =  `
		<div class="form-group idea" id="${idea.id}">
				<input class="idea_edit" type="text" value="${idea.title.rendered}"/>
				<button class="idea_delete btn-warning">Delete</button>
		</div>
		`;
		container.innerHTML += ideasTemplate;
	}
}


function createIdea(title){
	jQuery.ajax({
		url: 'https://www.getdone.pw/wp-json/wp/v2/idea', 
		method: 'POST',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('auth_token'));
		},
		data: {
			title: title,
			status: 'publish'
		}
	}).done(function(response){
		readIdeas();
	});
}

function updateIdea(idea){

	var input = idea.querySelector('input[type=text]');

	jQuery.ajax({
		url: 'https://www.getdone.pw/wp-json/wp/v2/idea/' + idea.id,
		method: 'POST',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('auth_token'));
		},
		data: {
			'title': input.value,
			'status': 'publish'
		}
	})
	.done(function(response){
		input.value = response.title.rendered;
		console.log(response);
	});

}

function deleteIdea(idea){

	jQuery.ajax({
		url: 'https://www.getdone.pw/wp-json/wp/v2/idea/' + idea.id,
		method: 'DELETE',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('auth_token'));
		}
	})
	.done(function(response){
		readIdeas();
	})
}