
let autocomplete = document.querySelector('.autocomplete');
let autocompleteOptions = autocomplete.querySelectorAll('.autocompete__option')
let input = document.querySelector('.findRepos__input')
let selectedRepos = document.querySelector('.selectedRepos')
let repoTemplate = selectedRepos.querySelector('.repo')
let repos;

const debounce = (fn, debounceTime) => {
 
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, arguments), debounceTime);
    };
  
  };

  const debounceUpgrade = debounce(upgradeOptions, 1000);

async function getRepos() {
    let value = ''
    if (input.value !== undefined) value = '/' + input.value;



    let response = await fetch(`https://api.github.com/search/repositories?q=Q${value}&per_page=5`);


    if (response.ok) { 
        let json = await response.json();
        return json.items;
    } else if (response.status === 403) {
        console.log('GitHub задаёт ограничение на кол-во запосров. Немного подождите и попробуйте ещё раз.');
    } else {
        console.log('Неизвестная ошибка.');
      }

}

async function upgradeOptions() {
    
    try {
        repos = await getRepos();
        for (let i = 0; i < autocompleteOptions.length; i++) {
        if (repos.length == 0 || input.value == 0) {
            autocompleteOptions[i].style.display = 'none';
        } else {
            autocompleteOptions[i].style.display = 'block';   
        autocompleteOptions[i].textContent = repos[Object.keys(repos)[i]].name;
        }
        }
    } catch {
        console.log('Проблемы с загрузкой данных');
    }
}


autocomplete.addEventListener('click', async function(event) {

    input.value = '';
    
    for (let i = 0; i < autocompleteOptions.length; i++) {
        if (repos.length == 0 || input.value == 0) {
            autocompleteOptions[i].style.display = 'none';
        } else {
            autocompleteOptions[i].style.display = 'block';   
        }
    }

    let clone = repoTemplate.cloneNode(true);
    let name = clone.querySelector('.repo__name');
    let owner = clone.querySelector('.repo__owner');
    let stars = clone.querySelector('.repo__stars');
    let repo = repos.find((item) => {
        return item.name === event.target.textContent;
    })
    let cross = clone.querySelector('.repo__cross');

    try {
        name.textContent = 'Name: ' + repo.name;
        owner.textContent = 'Owner: ' + repo.owner.login;
        stars.textContent = 'Stars: ' + repo.stargazers_count;
        clone.style.display = 'block';
     

        cross.addEventListener('click', function() {
            clone.remove();
        })


        selectedRepos.append(clone);

    } catch (err) {
    }


})



input.addEventListener('keyup', function() {
    debounceUpgrade();
})



