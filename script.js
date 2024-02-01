const form = document.getElementById('myForm');
const resultElement = document.getElementById('result');
let timeoutId;


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const search = document.getElementById('search').value;
  const originName = search.split(' ').join('');
  fetchAndDisplayRepos(originName);
});

const searchInput = document.getElementById('search');
searchInput.addEventListener('keyup', () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    const search = searchInput.value;
    const originName = search.split(' ').join('');
    fetchAndDisplayRepos(originName);
  }, 300);
});

function fetchAndDisplayRepos(originName) {
  resultElement.innerHTML = `
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
`;

  fetch(`https://api.github.com/users/${originName}/repos`)
    .then((result) => result.json())
    .then((data) => {
      if (data.length === 0) {
        resultElement.innerHTML = '<p>No repositories found for the given user</p>';
        return;
      }
      resultElement.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Name Repo</th>
              <th scope="col">Language</th>
              <th scope="col">Link repo</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(repo => `
              <tr>
                <td>${repo.name}</td>
                <td>${repo.language || 'N/A'}</td>
                <td><a href='https://github.com/${originName}/${repo.name}'> ${repo.html_url}</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    })
    .catch(() => {
      resultElement.innerHTML = '<p>User not found</p>';
    });
};