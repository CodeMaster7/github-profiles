'use strict'
// GET /users/{ username } ---- https://docs.github.com/en/rest/reference/users#get-a-user
// GET /users/{ username }/repos ----- https://docs.github.com/en/rest/reference/repos#list-repositories-for-a-user
const API_URL = 'https://api.github.com/users/'
const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')

async function getUser(username) {
	try {
		const { data } = await axios(API_URL + username)

		createUserCard(data)
        getRepos(username)
	} catch (err) {
        console.log(err)
		if (err.status == 404) {
			createErrorCard('No profile with this username')
		}
	}
}

async function getRepos (username) {
    try {
		const { data } = await axios(API_URL + username + '/repos?sort=created')

		addReposToCard(data)
	} catch (err) {
		createErrorCard('Problem fetching repos')
	}
}

function createUserCard (user) {
    const card_HTML = `
        <div class="card">
                <div>
                    <img src="${user.avatar_url}" class="avatar" alt="${user.name}">
                </div>
                <div class="user-info">
                    <h2>${user.name}</h2>
                    <p>${user.bio}</p>

                    <ul>
                        <li>${user.followers} <strong>Followers</strong></li>
                        <li>${user.following} <strong>Following</strong></li>
                        <li>${user.public_repos} <strong>Repos</strong></li>
                    </ul>

                    <div id="repos"></div>
                </div>
            </div>
    `
    main.innerHTML = card_HTML
}

function createErrorCard (message) {
    const error_card_HTML = `
        <div class="card">
            <h1>${message}</h1>
        </div>
    `

    main.innerHTML = error_card_HTML
}

function addReposToCard (repos) {
    const reposEl = document.getElementById('repos')

    repos.slice(0, 10).forEach( repo => {
        const repoEl = document.createElement('a')
        repoEl.classList.add('repo')
        repoEl.href = repo.html_url
        repoEl.target = '_blank'
        repoEl.innerText = repo.name

        reposEl.appendChild(repoEl)
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if (user) {
        getUser(user)
        search.value = ''
    }
})