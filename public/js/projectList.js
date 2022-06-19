async function showProject(id) {
        currentURL = window.location.href;
        currentURL = currentURL.replace('projects', 'showproject');
        const url = new URL(currentURL);
        url.searchParams.append('projectId', id);
        window.location.href = url;
}