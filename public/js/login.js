function toggleVisibility() {
    let visibilitySwitch = document.getElementById(`userPassword`);
    let toggle = document.getElementById(`passwordVisibilityIcon`);
    if (visibilitySwitch.type === `password`) {
        document.getElementById(`userPassword`).type = `text`;
        toggle.setAttribute(`src`, `https://cdn-icons-png.flaticon.com/512/633/633633.png`);
    }
    else {
        document.getElementById(`userPassword`).type = `password`;
        toggle.setAttribute(`src`, `https://cdn-icons-png.flaticon.com/512/633/633655.png`);
    }
}