// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.querySelector('.spinner');
    const buttonText = document.querySelector('.button-text');
    const resultsContainer = document.getElementById('results-container');
    const isbnTextarea = document.getElementById('isbn-list');
    const checkLocalInventoryCheckbox = document.getElementById('check-local-inventory');

    // --- Start of Realistic Dummy Data ---
    const dummyBookData = {
        "9784297137819": {
            title: "スッキリわかるSQL入門 第3版",
            author: "中山 清喬, 飯田 理恵",
            publisher: "翔泳社",
            sites: {
                honto: { success: true, message: "在庫あり", price: 3080 },
                rakuten: { success: true, message: "在庫あり", price: 3080 },
                yodobashi: { success: true, message: "在庫あり", price: 3080 },
                '7net': { success: true, message: "お取り寄せ(1～3日)", price: 3080 },
                kinokuniya: { success: false, message: "在庫僅少", price: null },
            }
        },
        "9784297128138": {
            title: "徹底攻略 情報処理安全確保支援士教科書 令和5年度",
            author: "瀬戸 美月",
            publisher: "インプレス",
            sites: {
                honto: { success: true, message: "在庫あり", price: 3520 },
                rakuten: { success: false, message: "メーカー取り寄せ", price: null },
                yodobashi: { success: true, message: "在庫あり", price: 3520 },
                '7net': { success: false, message: "在庫なし", price: null },
                kinokuniya: { success: true, message: "店舗在庫あり", price: 3520 },
            }
        },
        "9784839979359": {
            title: "Web API: The Good Parts",
            author: "水野 貴明",
            publisher: "マイナビ出版",
            sites: {
                honto: { success: true, message: "在庫あり", price: 2640 },
                rakuten: { success: true, message: "在庫あり", price: 2640 },
                yodobashi: { success: false, message: "販売終了", price: null },
                '7net': { success: true, message: "在庫あり", price: 2640 },
                kinokuniya: { success: false, message: "出版社在庫切れ", price: null },
            }
        },
        "9784774193248": { // This ISBN will be used for the "local inventory" demo
            title: "パーフェクトPHP (PERFECT SERIES)",
            author: "小川 雄大",
            publisher: "技術評論社",
            sites: {
                honto: { success: true, message: "在庫あり", price: 3520 },
                rakuten: { success: true, message: "在庫あり", price: 3520 },
                yodobashi: { success: true, message: "在庫あり", price: 3520 },
                '7net': { success: true, message: "お取り寄せ(1～3日)", price: 3520 },
                kinokuniya: { success: true, message: "店舗在庫あり", price: 3520 },
            }
        },
        "9999999999999": { // Dummy for "not found" cases
            title: "存在しない書籍",
            author: "不明",
            publisher: "不明",
            sites: {
                honto: { success: false, message: "商品が見つかりません", price: null },
                rakuten: { success: false, message: "商品が見つかりません", price: null },
                yodobashi: { success: false, message: "商品が見つかりません", price: null },
                '7net': { success: false, message: "商品が見つかりません", price: null },
                kinokuniya: { success: false, message: "商品が見つかりません", price: null },
            }
        }
    };
    const localInventoryIsbn = "9784774193248";
    // --- End of Realistic Dummy Data ---

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
        const checkLocalInventory = checkLocalInventoryCheckbox.checked;

        try {
            let completedCount = 0;
            const allResults = [];

            for (const isbn of isbnList) {
                console.log(`Simulating search for ISBN: ${isbn}`);
                
                // Simulate a short delay for each ISBN search
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

                const results = getSimulatedResults(isbn, checkLocalInventory);
                allResults.push(results);
                
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

    // Updated function to generate simulated results from dummy data
    function getSimulatedResults(isbn, checkLocal) {
        const bookData = dummyBookData[isbn] || dummyBookData["9999999999999"];
        const sites = [
            { id: 'honto', name: 'honto', logo: 'https://placehold.jp/50x50.png?text=honto' },
            { id: 'rakuten', name: 'Rakuten', logo: 'https://placehold.jp/50x50.png?text=Rakuten' },
            { id: 'yodobashi', name: 'Yodobashi', logo: 'https://placehold.jp/50x50.png?text=Yodobashi' },
            { id: '7net', name: '7net', logo: 'https://placehold.jp/50x50.png?text=7net' },
            { id: 'kinokuniya', name: 'Kinokuniya', logo: 'https://placehold.jp/50x50.png?text=Kinokuniya' },
        ];

        // Simulate local inventory check
        if (checkLocal && isbn === localInventoryIsbn) {
            return {
                isbn: isbn,
                title: bookData.title,
                isLocal: true, // Flag for local inventory
                details: [] // No need to scrape other sites
            };
        }

        return {
            isbn: isbn,
            title: bookData.title,
            isLocal: false,
            details: sites.map(site => {
                const siteResult = bookData.sites[site.id];
                return {
                    site: site.name,
                    logo: site.logo,
                    status: siteResult.success ? 'OK' : 'NG',
                    message: siteResult.price ? `${siteResult.message} - ¥${siteResult.price}` : siteResult.message,
                    url: `https://github.com/mememori8888/book_lancers/issues/${Math.floor(Math.random() * 1000) + 1}`
                };
            })
        };
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

            let detailsHtml;
            let overallStatus;

            if (resultGroup.isLocal) {
                detailsHtml = `<div class="result-detail-item local-inventory-found">自家在庫にありました。ECサイトの検索をスキップしました。</div>`;
                overallStatus = 'status-local';
            } else {
                overallStatus = resultGroup.details.some(r => r.status === 'OK') ? 'status-ok' : 'status-ng';
                detailsHtml = resultGroup.details.map(detail => `
                    <div class="result-detail-item">
                        <img src="${detail.logo}" alt="${detail.site} dummy logo" class="site-logo-small">
                        <span class="site-name-small">${detail.site}:</span>
                        <span class="status-small ${detail.status === 'OK' ? 'status-ok' : 'status-ng'}">${detail.message}</span>
                    </div>
                `).join('');
            }
            
            const statusText = {
                'status-ok': '在庫あり',
                'status-ng': '在庫なし/エラー',
                'status-local': '自家在庫'
            };

            card.innerHTML = `
                <div class="result-summary">
                    <div>
                        <span class="isbn-title">ISBN: ${resultGroup.isbn}</span>
                        <span class="book-title">${resultGroup.title}</span>
                    </div>
                    <span class="status-badge ${overallStatus}">${statusText[overallStatus]}</span>
                </div>
                <div class="result-details">
                    ${detailsHtml}
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }
});

