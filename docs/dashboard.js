// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DUMMY DATA ---
    // In a real application, this data would be fetched from the Google Sheet API.
    // This is a placeholder to simulate the data structure.
    const dummyData = [
        { timestamp: '2026-02-05 10:30', isbn: '9784003220818', title: 'こころ', results: [ { site: 'honto', status: 'OK' }, { site: 'rakuten', status: 'OK' }, { site: 'yodobashi', status: 'NG' } ] },
        { timestamp: '2026-02-05 09:15', isbn: '9784101010016', title: '人間失格', results: [ { site: 'honto', status: 'OK' }, { site: 'rakuten', status: 'OK' }, { site: 'yodobashi', status: 'NG' } ] },
        { timestamp: '2026-02-04 18:00', isbn: '9784798157578', title: 'Clean Architecture', results: [ { site: 'honto', status: 'OK' }, { site: 'rakuten', status: 'OK' }, { site: 'yodobashi', status: 'OK' } ] },
        { timestamp: '2026-02-04 15:20', isbn: '9784003220818', title: 'こころ', results: [ { site: 'honto', status: 'OK' }, { site: 'rakuten', status: 'NG' }, { site: 'yodobashi', 'status': 'NG' } ] },
        { timestamp: '2026-02-03 11:45', isbn: '9784873117386', title: 'ゼロから作るDeep Learning', results: [ { site: 'honto', status: 'OK' }, { site: 'rakuten', status: 'OK' }, { site: 'yodobashi', status: 'OK' } ] },
    ];

    const sites = ['honto', 'rakuten', 'yodobashi', '7net', 'kinokuniya'];

    // --- INITIALIZE ---
    updateSummaryCards(dummyData);
    renderSiteStatusChart(dummyData, sites);
    renderSiteSettings(sites);
    renderHistoryTable(dummyData);

    // --- EVENT LISTENERS ---
    const historySearchInput = document.getElementById('history-search');
    historySearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = dummyData.filter(item => 
            item.isbn.includes(searchTerm) || item.title.toLowerCase().includes(searchTerm)
        );
        renderHistoryTable(filteredData);
    });

    // --- FUNCTIONS ---

    function updateSummaryCards(data) {
        const totalSearches = data.length;
        const totalResults = data.reduce((acc, item) => acc + item.results.length, 0);
        const successfulResults = data.reduce((acc, item) => acc + item.results.filter(r => r.status === 'OK').length, 0);
        const errorResults = totalResults - successfulResults;
        const successRate = totalResults > 0 ? Math.round((successfulResults / totalResults) * 100) : 0;

        document.getElementById('total-searches').querySelector('.summary-value').textContent = totalSearches;
        document.getElementById('success-rate').querySelector('.summary-value').textContent = `${successRate}%`;
        document.getElementById('error-count').querySelector('.summary-value').textContent = errorResults;
    }

    function renderSiteStatusChart(data, allSites) {
        const ctx = document.getElementById('siteStatusChart').getContext('2d');
        
        const siteStats = allSites.reduce((acc, site) => {
            acc[site] = { total: 0, success: 0 };
            return acc;
        }, {});

        data.forEach(item => {
            item.results.forEach(result => {
                if (siteStats[result.site]) {
                    siteStats[result.site].total++;
                    if (result.status === 'OK') {
                        siteStats[result.site].success++;
                    }
                }
            });
        });

        const labels = Object.keys(siteStats);
        const successRates = labels.map(site => {
            const stats = siteStats[site];
            return stats.total > 0 ? (stats.success / stats.total) * 100 : 0;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '成功率 (%)',
                    data: successRates,
                    backgroundColor: 'rgba(74, 144, 226, 0.6)',
                    borderColor: 'rgba(74, 144, 226, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function renderSiteSettings(allSites) {
        const container = document.getElementById('site-settings');
        container.innerHTML = '';
        allSites.forEach(site => {
            const settingHTML = `
                <div class="setting-item">
                    <input type="checkbox" id="site-${site}" name="${site}" checked>
                    <label for="site-${site}">${site}</label>
                </div>
            `;
            container.innerHTML += settingHTML;
        });
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
            
            const overallStatus = item.results.every(r => r.status === 'OK') 
                ? '<span class="status-badge status-ok">成功</span>'
                : (item.results.some(r => r.status === 'OK') 
                    ? '<span class="status-badge status-partial">一部成功</span>' 
                    : '<span class="status-badge status-ng">失敗</span>');

            row.innerHTML = `
                <td>${item.timestamp}</td>
                <td>${item.isbn}</td>
                <td>${item.title}</td>
                <td>${overallStatus}</td>
                <td><button class="action-btn">再検索</button></td>
            `;
            tbody.appendChild(row);
        });
    }
});
