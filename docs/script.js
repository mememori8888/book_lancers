// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.querySelector('.spinner');
    const buttonText = document.querySelector('.button-text');
    const resultsContainer = document.getElementById('results-container');
    const isbnInput = document.getElementById('isbn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isbn = isbnInput.value.trim();
        if (!isbn || !/^\d{13}$/.test(isbn)) {
            alert('有効な13桁のISBNコードを入力してください。');
            return;
        }

        // Disable form and show spinner
        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';
        buttonText.textContent = '検索中...';
        resultsContainer.innerHTML = '<p>各サイトの結果を待っています...</p>';

        try {
            // This is a placeholder for what will eventually be a GitHub API call
            // For this portfolio demonstration, we will simulate the process.
            console.log(`Simulating search for ISBN: ${isbn}`);
            
            // Simulate API call and workflow run
            const issueUrl = await createNewIssue(isbn);
            
            // Simulate waiting for results
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Simulate fetching results from the issue comment
            const results = getSimulatedResults(isbn, issueUrl);
            
            displayResults(results);

        } catch (error) {
            console.error('Error during search process:', error);
            resultsContainer.innerHTML = `<p class="status-ng">エラーが発生しました。詳細はコンソールを確認してください。</p>`;
        } finally {
            // Re-enable form
            submitBtn.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = '検索実行';
        }
    });

    // Placeholder function to simulate creating a GitHub issue
    async function createNewIssue(isbn) {
        // In a real implementation, this would use the GitHub API
        // For now, we just log it and return a fake URL
        console.log('Simulating GitHub Issue creation...');
        const issueNumber = Math.floor(Math.random() * 1000) + 1;
        const fakeIssueUrl = `https://github.com/mememori8888/book_lancers/issues/${issueNumber}`;
        
        resultsContainer.innerHTML = `
            <p>GitHub Issueを作成しました: <a href="${fakeIssueUrl}" target="_blank">${fakeIssueUrl}</a></p>
            <p>GitHub Actionsの実行結果を待っています... (これはデモです)</p>
        `;
        
        return fakeIssueUrl;
    }

    // Placeholder function to generate simulated results
    function getSimulatedResults(isbn, issueUrl) {
        const sites = [
            { name: 'honto', logo: 'https://placehold.jp/50x50.png?text=honto' },
            { name: 'rakuten', logo: 'https://placehold.jp/50x50.png?text=Rakuten' },
            { name: 'yodobashi', logo: 'https://placehold.jp/50x50.png?text=Yodobashi' },
            { name: '7net', logo: 'https://placehold.jp/50x50.png?text=7net' },
            { name: 'kinokuniya', logo: 'https://placehold.jp/50x50.png?text=Kinokuniya' },
        ];

        return sites.map(site => {
            const success = Math.random() > 0.3; // 70% chance of success
            return {
                site: site.name,
                logo: site.logo,
                status: success ? 'OK' : 'NG',
                message: success ? '在庫あり' : '商品が見つかりません',
                url: issueUrl // Link back to the issue for details
            };
        });
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ''; // Clear previous results or messages

        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">結果を取得できませんでした。</p>';
            return;
        }

        results.forEach(result => {
            const card = document.createElement('div');
            card.className = 'result-card';

            const statusClass = result.status === 'OK' ? 'status-ok' : 'status-ng';

            card.innerHTML = `
                <img src="${result.logo}" alt="${result.site} dummy logo" class="site-logo">
                <div class="info">
                    <h3 class="site-name">${result.site}</h3>
                    <p class="status ${statusClass}">${result.message}</p>
                </div>
                <div class="result-link">
                    <a href="${result.url}" target="_blank">詳細表示</a>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }
});
