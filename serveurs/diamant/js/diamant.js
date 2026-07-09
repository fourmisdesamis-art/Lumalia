/*==================================================
                LUMALIA DIAMANT
==================================================*/

/*==================================================
                PARALLAX
==================================================*/

const gradient1=document.querySelector(".gradient1");
const gradient2=document.querySelector(".gradient2");

document.addEventListener("mousemove",(e)=>{

    const x=e.clientX/window.innerWidth;
    const y=e.clientY/window.innerHeight;

    gradient1.style.transform=
    `translate(${x*40}px,${y*40}px)`;

    gradient2.style.transform=
    `translate(${-x*40}px,${-y*40}px)`;

});

/*==================================================
            APPARITION AU SCROLL
==================================================*/

const observer=new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:.15
});

document.querySelectorAll(
    ".info-card,.news-grid article,.stats-grid div,.gallery-grid img"
).forEach(el=>{

    el.classList.add("hidden");

    observer.observe(el);

});

