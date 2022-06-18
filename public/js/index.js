async function showProject(id) {
    try {
        const url = new URL('http://127.0.0.1:5000/showproject');
        url.searchParams.append('projectId', id);
        window.location.href = url;
    } catch (error) {
        currentURL = window.location.href;
        currentURL = currentURL.replace('home', 'showproject');
        const url = new URL(currentURL);
        url.searchParams.append('projectId', id);
        window.location.href = url;
    }
}