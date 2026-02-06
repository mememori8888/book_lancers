// script.js (for dashboard - index.html)

document.addEventListener('DOMContentLoaded', () => {
    // --- REALISTIC DUMMY DATA ---
    const dummyHistory = [
        { 
            timestamp: '2026-02-05 10:30', 
            isbn: '9784297137819', 
            title: 'スッキリわかるSQL入門 第3版', 
            image: 'https://placehold.jp/150x200.png?text=SQL入門',
            results: [ 
                { site: 'honto', status: 'OK', price: 3080, message: '在庫あり' }, 
                { site: 'rakuten', status: 'OK', price: 3080, message: '在庫あり' }, 
                { site: 'yodobashi', status: 'OK', price: 3080, message: '在庫あり' },
                { site: '7net', status: 'OK', price: 3080, message: 'お取り寄せ(1～3日)' },
                { site: 'kinokuniya', status: 'NG', price: null, message: '在庫僅少' }
            ] 
        },
        { 
            timestamp: '2026-02-05 09:15', 
            isbn: '9784297128138', 
            title: '徹底攻略 情報処理安全確保支援士教科書', 
            image: 'https://placehold.jp/150x200.png?text=支援士教科書',
            results: [ 
                { site: 'honto', status: 'OK', price: 3520, message: '在庫あり' }, 
                { site: 'rakuten', status: 'NG', price: null, message: 'メーカー取り寄せ' }, 
                { site: 'yodobashi', status: 'OK', price: 3520, message: '在庫あり' },
                { site: '7net', status: 'NG', price: null, message: '在庫なし' },
                { site: 'kinokuniya', status: 'OK', price: 3520, message: '店舗在庫あり' }
            ] 
        },
        { 
            timestamp: '2026-02-04 18:00', 
            isbn: '9784839979359', 
            title: 'Web API: The Good Parts', 
            image: 'https://placehold.jp/150x200.png?text=Web+API',
            results: [ 
                { site: 'honto', status: 'OK', price: 2640, message: '在庫あり' }, 
                { site: 'rakuten', status: 'OK', price: 2640, message: '在庫あり' }, 
                { site: 'yodobashi', status: 'NG', price: null, message: '販売終了' },
                { site: '7net', status: 'OK', price: 2640, message: '在庫あり' },
                { site: 'kinokuniya', status: 'NG', price: null, message: '出版社在庫切れ' }
            ] 
        },
        { 
            timestamp: '2026-02-04 15:20', 
            isbn: '9784774193248', 
            title: 'パーフェクトPHP', 
            image: 'https://placehold.jp/150x200.png?text=PHP',
            results: [ 
                { site: 'honto', status: 'LOCAL', message: '自家在庫にありました' }
            ] 
        },
        { 
            timestamp: '2026-02-03 11:45', 
            isbn: '9999999999999', 
            title: '存在しない書籍', 
            image: 'https://placehold.jp/150x200.png?text=Not+Found',
            results: [ 
                { site: 'honto', status: 'NG', price: null, message: '商品が見つかりません' },
                { site: 'rakuten', status: 'NG', price: null, message: '商品が見つかりません' },
                { site: 'yodobashi', status: 'NG', price: null, message: '商品が見つかりません' },
                { site: '7net', status: 'NG', price: null, message: '商品が見つかりません' },
                { site: 'kinokuniya', status: 'NG', price: null, message: '商品が見つかりません' }
            ] 
        },
    ];

    const dummyPendingOrders = {
        'honto': { current: 8500, target: 10000 },
        'rakuten': { current: 2500, target: 5000 },
        'yodobashi': { current: 12000, target: 10000 },
        '7net': { current: 0, target: 3000 },
    };

    const dummySettings = {
        'honto': { minOrder: 10000, keywords: '在庫あり, お取り寄せ' },
        'rakuten': { minOrder: 5000, keywords: '在庫あり, 1-2日以内に発送' },
        'yodobashi': { minOrder: 10000, keywords: '在庫あり' },
        '7net': { minOrder: 3000, keywords: '在庫あり, お取り寄せ' },
        'kinokuniya': { minOrder: 15000, keywords: '在庫あり, 店舗在庫あり' },
    };
    // --- END OF DUMMY DATA ---

    // --- INITIALIZE ---
    updateSummaryCards(dummyHistory, dummyPendingOrders);
    renderPendingOrders(dummyPendingOrders);
    renderAdvancedSettings(dummySettings);
    renderHistoryTable(dummyHistory);
    setupModal();

    // --- EVENT LISTENERS ---
    const historySearchInput = document.getElementById('history-search');
    historySearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = dummyHistory.filter(item => 
            item.isbn.includes(searchTerm) || item.title.toLowerCase().includes(searchTerm)
        );
        renderHistoryTable(filteredData);
    });

    document.getElementById('save-settings-btn').addEventListener('click', (e) => {
        const btn = e.target;
        btn.textContent = '保存中...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = '設定を保存';
            btn.disabled = false;
            // Show a temporary success message
            const feedback = document.createElement('span');
            feedback.textContent = '保存しました！';
            feedback.style.color = 'green';
            feedback.style.marginLeft = '10px';
            btn.parentNode.insertBefore(feedback, btn.nextSibling);
            setTimeout(() => feedback.remove(), 2000);
        }, 1000);
    });


    // --- FUNCTIONS ---

    function updateSummaryCards(history, pending) {
        const processingCount = history.length;
        const pendingSiteCount = Object.values(pending).filter(p => p.current > 0 && p.current < p.target).length;
        const pendingTotalValue = Object.values(pending).reduce((acc, p) => acc + p.current, 0);

        document.getElementById('processing-count').textContent = processingCount;
        document.getElementById('pending-site-count').textContent = pendingSiteCount;
        document.getElementById('pending-total-value').textContent = `¥${pendingTotalValue.toLocaleString()}`;
    }

    function renderPendingOrders(pending) {
        const container = document.getElementById('pending-orders-container');
        container.innerHTML = '';
        for (const site in pending) {
            const order = pending[site];
            const progress = Math.min((order.current / order.target) * 100, 100);
            const remaining = Math.max(0, order.target - order.current);
            
            const card = document.createElement('div');
            card.className = 'pending-order-card';
            card.id = `pending-${site}`;
            card.innerHTML = `
                <h4>${site}</h4>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%;"></div>
                </div>
                <p class="pending-details">
                    現在 ¥${order.current.toLocaleString()} / 目標 ¥${order.target.toLocaleString()}
                </p>
                <p class="pending-remaining">あと ¥${remaining.toLocaleString()} で自動発注</p>
                <button class="manual-order-btn" data-site="${site}">手動で発注</button>
            `;
            container.appendChild(card);
        }

        // Add event listeners for manual order buttons
        document.querySelectorAll('.manual-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.target;
                const site = button.dataset.site;
                const card = document.getElementById(`pending-${site}`);
                
                button.textContent = '処理中...';
                button.disabled = true;

                setTimeout(() => {
                    card.innerHTML = `<p style="text-align: center; padding: 1rem;">発注処理が完了しました。</p>`;
                    setTimeout(() => card.remove(), 1500);
                }, 1000);
            });
        });
    }

    function renderAdvancedSettings(settings) {
        const tbody = document.getElementById('advanced-settings-table').querySelector('tbody');
        tbody.innerHTML = '';
        for (const site in settings) {
            const setting = settings[site];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${site}</td>
                <td><input type="number" class="setting-input" value="${setting.minOrder}"></td>
                <td><input type="text" class="setting-input" value="${setting.keywords}"></td>
                <td><input type="number" class="setting-input" value="1"></td>
            `;
            tbody.appendChild(row);
        }
    }

    function renderHistoryTable(data) {
        const tbody = document.getElementById('history-table').querySelector('tbody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">データがありません。</td></tr>';
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            
            let overallStatus;
            if (item.results.some(r => r.status === 'LOCAL')) {
                overallStatus = '<span class="status-badge status-local">自家在庫</span>';
            } else if (item.results.some(r => r.status === 'OK')) {
                overallStatus = '<span class="status-badge status-ok">在庫あり</span>';
            } else {
                overallStatus = '<span class="status-badge status-ng">在庫なし/エラー</span>';
            }

            row.innerHTML = `
                <td>${item.timestamp}</td>
                <td>${item.isbn}</td>
                <td>${item.title}</td>
                <td>${overallStatus}</td>
                <td>
                    <button class="action-btn view-details-btn" data-isbn="${item.isbn}" data-timestamp="${item.timestamp}">詳細</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners for the new "Details" buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const isbn = e.target.dataset.isbn;
                const timestamp = e.target.dataset.timestamp;
                const dataItem = dummyHistory.find(d => d.isbn === isbn && d.timestamp === timestamp);
                if (dataItem) {
                    openDetailsModal(dataItem);
                }
            });
        });
    }

    function setupModal() {
        const modal = document.getElementById('details-modal');
        const closeBtn = document.querySelector('.modal-close');
        closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    function openDetailsModal(dataItem) {
        const modal = document.getElementById('details-modal');
        const modalContent = document.querySelector('.modal-content-body');

        let resultsHtml;
        if (dataItem.results.some(r => r.status === 'LOCAL')) {
            resultsHtml = `<div class="modal-result-item local-found">${dataItem.results[0].message}</div>`;
        } else {
            resultsHtml = dataItem.results.map(result => `
                <div class="modal-result-item">
                    <span class="modal-site-name">${result.site}</span>
                    <span class="modal-status ${result.status === 'OK' ? 'status-ok' : 'status-ng'}">
                        ${result.message}
                        ${result.price ? ` - ¥${result.price.toLocaleString()}` : ''}
                    </span>
                </div>
            `).join('');
        }

        modalContent.innerHTML = `
            <div class="modal-header">
                <img src="${dataItem.image}" alt="${dataItem.title}" class="modal-book-image">
                <div class="modal-book-info">
                    <h3>${dataItem.title}</h3>
                    <p><strong>ISBN:</strong> ${dataItem.isbn}</p>
                    <p><strong>検索日時:</strong> ${dataItem.timestamp}</p>
                </div>
            </div>
            <div class="modal-results">
                <h4>検索結果</h4>
                ${resultsHtml}
            </div>
        `;
        modal.style.display = 'block';
    }
});
