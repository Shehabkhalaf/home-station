
const headerEl = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        headerEl.classList.add('header-scrolled')
    } else if (window.scrollY <= 50) {
        headerEl.classList.remove('header-scrolled')
    }
})
$(function(){
    $('.selectpicker').selectpicker();
});
            var counter=1;
        setInterval(function(){
            document.getElementById('radio'+counter).checked=true;
            counter++;
            if(counter > 3){
                counter=1
            }
        })

$(document).scroll(function() {
    var i = $(this).scrollTop();
    if (i > 100) {
    $('.wppBtn').fadeIn();
    } else {
    $('.wppBtn').fadeOut();
    }
});
        
    let mainimg = document.getElementById("mainimg");
        let btn = document.getElementsByClassName("btn");
        btn[0].onclick = function () {
            mainimg.src = "img/1.jpg"
        }
        btn[1].onclick = function () {
            mainimg.src = "img/2.jpg"
        }
        btn[2].onclick = function () {
            mainimg.src = "img/3.jpg"
}
