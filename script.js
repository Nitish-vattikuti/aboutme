var typed = new Typed(".text", {
    strings: ["Programming" ,"Testing", "Web Development"],
    typeSpeed:100,
    backSpeed:100,
    backDelay:1000,
    loop:true
});

document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.navbar a').forEach(l => l.classList.remove('active-oval'));
        this.classList.add('active-oval');
    });
});
