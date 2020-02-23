function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
}

window.addEventListener('scroll', (e) => {
    var el = document.getElementsByClassName('information-line')[0];
    console.log(el)
    if (isScrolledIntoView(el)) {
        el.classList.add('animate')
    }
})