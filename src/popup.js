document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('search').value + " recipe";
    if (query) {
        searchRecipes(query);
    }
});

function searchRecipes(query) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>Searching for recipes related to: <strong>${query}</strong></p>`;

    const cx_key = '';
    const api_key = '';

    fetch(`https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx_key}&key=${api_key}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the entire response
            if (data.items) {
                displayResults(data.items);
            } else {
                resultsDiv.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultsDiv.innerHTML = `<p>Error fetching results: ${error.message}</p>`;
        });
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    results.slice(0, 3).forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result');

        const thumbnailLink = result.pagemap?.cse_image?.[0]?.src || '';


        resultDiv.innerHTML = `
          <a href="${result.link}" target="_blank">
<!--            <h3>${result.title}</h3>-->
                ${thumbnailLink ? `<img src="${thumbnailLink}" alt="${result.title}" class="thumbnail">` : ''}</a>
                <div class="result-text">
                    <a href="${result.link}" target="_blank"><h3>${result.title}</h3></a>
                    <div>
<!--                        <button onclick="openRecipePage('${result.link}')">Open</button>-->
                        <button onclick="saveBookmark('${result.title}', '${result.link}')">Save</button>
                    </div>
                </div>
<!--          <button onclick="openRecipePage('${result.link}')">Open</button>-->
<!--          <button onclick="saveBookmark('${result.title}', '${result.link}')">Save</button>-->
    `;
        resultsDiv.appendChild(resultDiv);
    });
}

function openRecipePage(url) {
    chrome.tabs.create({ url: url });
}

function saveBookmark(title, url) {
    chrome.bookmarks.create({
        'title': title,
        'url': url
    });
}

