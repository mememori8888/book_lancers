// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.querySelector('.spinner');
    const buttonText = document.querySelector('.button-text');
    const resultsContainer = document.getElementById('results-container');
    const isbnTextarea = document.getElementById('isbn-list');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isbnList = isbnTextarea.value.trim().split('\n').filter(isbn => isbn.trim() !== '');
        
        if (isbnList.length === 0) {
            alert('有効なISBNコードを1つ以上入力してください。');
            return;
        }

        const invalidIsbns = isbnList.filter(isbn => !/^\d{13}$/.test(isbn.trim()));
        if (invalidIsbns.length > 0) {
            alert(`以下のISBNコードの形式が正しくありません (13桁の数字):\n${invalidIsbns.join('\n')}`);
            return;
        }

        // Disable form and show spinner
        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';
        buttonText.textContent = `検索中... (0/${isbnList.length})`;
        resultsContainer.innerHTML = '<p>各サイトの結果を待っています...</p>';

        try {
            let completedCount = 0;
            const allResults = [];

            for (const isbn of isbnList) {
                console.log(`Simulating search for ISBN: ${isbn}`);
                
                const issueUrl = await createNewIssue(isbn);
                
                await new Promise(resolve => setTimeout(resolve, 1500)); // Shorter wait for batch simulation

                const results = getSimulatedResults(isbn, issueUrl);
                allResults.push(...results);
                
                completedCount++;
                buttonText.textContent = `検索中... (${completedCount}/${isbnList.length})`;
                
                // Display results progressively
                displayResults(allResults, isbnList.length);
            }

            resultsContainer.innerHTML += `<p><strong>一括検索がすべて完了しました。</strong></p>`;


        } catch (error) {
            console.error('Error during search process:', error);
            resultsContainer.innerHTML = `<p class="status-ng">エラーが発生しました。詳細はコンソールを確認してください。</p>`;
        } finally {
            // Re-enable form
            submitBtn.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = '一括検索実行';
        }
    });

    // Placeholder function to simulate creating a GitHub issue
    async function createNewIssue(isbn) {
        // In a real implementation, this would use the GitHub API
        // For now, we just log it and return a fake URL
        console.log('Simulating GitHub Issue creation for', isbn);
        const issueNumber = Math.floor(Math.random() * 1000) + 1;
        const fakeIssueUrl = `https://github.com/mememori8888/book_lancers/issues/${issueNumber}`;
        
        // Don't flood the UI with issue creation messages in batch mode
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

        // Group results by ISBN
        return [{
            isbn: isbn,
            details: sites.map(site => {
                const success = Math.random() > 0.3; // 70% chance of success
                return {
                    site: site.name,
                    logo: site.logo,
                    status: success ? 'OK' : 'NG',
                    message: success ? `在庫あり - ¥${Math.floor(Math.random() * 2000) + 1000}` : '商品が見つかりません',
                    url: issueUrl // Link back to the issue for details
                };
            })
        }];
    }

    function displayResults(results, totalIsbns) {
        if (resultsContainer.querySelector('h3') === null) {
             resultsContainer.innerHTML = `<h3>検索結果 (${results.length}/${totalIsbns} 件)</h3>`;
        } else {
            resultsContainer.querySelector('h3').textContent = `検索結果 (${results.length}/${totalIsbns} 件)`;
        }


        results.forEach(resultGroup => {
            // Avoid re-rendering existing cards
            if (document.getElementById(`result-isbn-${resultGroup.isbn}`)) {
                return;
            }

            const card = document.createElement('div');
            card.className = 'result-card-group';
            card.id = `result-isbn-${resultGroup.isbn}`;

            const overallStatus = resultGroup.details.some(r => r.status === 'OK') ? 'status-ok' : 'status-ng';

            let detailsHtml = resultGroup.details.map(detail => `
                <div class="result-detail-item">
                    <img src="${detail.logo}" alt="${detail.site} dummy logo" class="site-logo-small">
                    <span class="site-name-small">${detail.site}:</span>
                    <span class="status-small ${detail.status === 'OK' ? 'status-ok' : 'status-ng'}">${detail.message}</span>
                </div>
            `).join('');

            card.innerHTML = `
                <div class="result-summary">
                    <span class="isbn-title">ISBN: ${resultGroup.isbn}</span>
                    <span class="status-badge ${overallStatus}">${overallStatus === 'status-ok' ? '在庫あり' : '在庫なし/エラー'}</span>
                </div>
                <div class="result-details">
                    ${detailsHtml}
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }
});

