function no_history(hostname: string) {
    let history_text =
        document.getElementById('history') || document.createElement('div');
    while (history_text.firstChild)
        history_text.removeChild(history_text.firstChild);
    history_text.textContent = `No history for ${hostname}.`;
}

function getActiveTab() {
    return browser.tabs.query({ active: true, currentWindow: true });
}

function getFilteredData(
    histories: browser.history.HistoryItem[],
    tabURL: URL,
    filters: { path: boolean; title: boolean }
) {
    const currentTabFirstPath =
        tabURL.pathname === '/' ? '' : tabURL.pathname.split('/')[1];
    let filterCriteriaDom =
        document.querySelector('#filter-criteria') ||
        document.createElement('input');
    filterCriteriaDom.innerHTML = filters.path
        ? `${tabURL.hostname}/${currentTabFirstPath}`
        : tabURL.hostname;
    const filteredByPath = histories.filter(history => {
        if (history.url === undefined) return false;
        const historyUrl = new URL(history.url);
        const historyUrlFirstPath =
            historyUrl.pathname === '/' ? '' : historyUrl.pathname.split('/')[1];
        return filters.path
            ? historyUrl.hostname === tabURL.hostname &&
            historyUrlFirstPath === currentTabFirstPath
            : historyUrl.hostname === tabURL.hostname;
    });
    const filteredByPathTitle = filters.title
        ? filteredByPath.filter(history => history?.title)
        : filteredByPath;
    return filteredByPathTitle;
}

function renderDom(data: browser.history.HistoryItem[]) {
    let list =
        document.getElementById('history') || document.createElement('div');
    list.innerHTML = '';
    data.forEach(history => {
        let li = document.createElement('div');
        let titleLink = document.createElement('a');
        let urlLink = document.createElement('a');
        let lastVisit = document.createElement('span');
        let totalVisit = document.createElement('span');
        let url = document.createTextNode(history?.url || '');
        let title = document.createTextNode(history?.title || '[NO TITLE]');
        li.className = 'display';

        titleLink.href = history?.url || '';
        titleLink.target = '_blank';
        titleLink.appendChild(title);
        titleLink.className = 'history-title';
        urlLink.href = history?.url || '';
        urlLink.target = '_blank';
        urlLink.appendChild(url);
        urlLink.className = 'history-url';
        lastVisit.className = 'last-visit';
        lastVisit.innerHTML = new Date(history.lastVisitTime || 0).toLocaleString();
        totalVisit.className = 'total-visit';
        totalVisit.innerHTML = (history?.visitCount || 0).toString();

        li.appendChild(titleLink);
        li.appendChild(document.createElement('br'));
        li.appendChild(urlLink);
        li.appendChild(document.createElement('br'));
        li.appendChild(lastVisit);
        li.appendChild(totalVisit);

        list.appendChild(li);
    });
}

function renderHistory() {
    getActiveTab().then(tabs => {
        let pathFilterEl = <HTMLInputElement>(
            (document.querySelector('#path-filter') ||
                document.createElement('input'))
        );
        let titleFilterEl = <HTMLInputElement>(
            (document.querySelector('#title-filter') ||
                document.createElement('input'))
        );
        const currentURL = <URL>(
            (tabs[0]?.url ? new URL(tabs[0].url) : new URL('about:blank'))
        );
        let searchingHistory = browser.history.search({ text: currentURL.hostname, maxResults: 1000 });
        searchingHistory.then(results => {
            if (results.length < 1) {
                no_history(currentURL.hostname);
            } else {
                const data = getFilteredData(results, currentURL, {
                    path: pathFilterEl.checked,
                    title: titleFilterEl.checked,
                });
                renderDom(data)
            }
        });
    });
}

renderHistory();
const pathFilter =
    document.querySelector('#path-filter') || document.createElement('input');
const titleFilter =
    document.querySelector('#title-filter') || document.createElement('input');
pathFilter.addEventListener('click', renderHistory);
titleFilter.addEventListener('click', renderHistory);
