let listLength = document.getElementsByClassName('noteCard').length;
if (listLength == 0) {
    console.log(listLength);
    document.getElementsByClassName('myProjects')[0].innerHTML = `<h6 style = "text-align: center; color: white; margin: auto;">Nothing to show. Upload your projects now!</h6>`
}

async function showProject(id) {
        currentURL = window.location.href;
        currentURL = currentURL.replace('myprojects', 'showproject');
        const url = new URL(currentURL);
        url.searchParams.append('projectId', id);
        window.location.href = url;
}