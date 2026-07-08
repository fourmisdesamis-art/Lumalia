/*==================================================
                LUMALIA ARTICLES V2
==================================================*/

/*==================================================
                VARIABLES
==================================================*/

const articles = document.querySelectorAll(".article-card");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search");

/*==================================================
                APPARITION
==================================================*/

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});

/*==================================================
                FILTRES
==================================================*/

filterButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        filterButtons.forEach(btn=>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category =
            button.dataset.filter;

        articles.forEach(article=>{

            if(
                category==="all" ||
                article.dataset.category===category
            ){

                article.style.display="block";

                article.animate([

                    {
                        opacity:0,
                        transform:"translateY(25px)"
                    },

                    {
                        opacity:1,
                        transform:"translateY(0)"
                    }

                ],{

                    duration:350,
                    fill:"forwards"

                });

            }

            else{

                article.style.display="none";

            }

        });

    });

});

/*==================================================
                RECHERCHE
==================================================*/

if(searchInput){

    searchInput.addEventListener("input",()=>{

        const value =
            searchInput.value.toLowerCase();

        articles.forEach(article=>{

            const title =
                article.querySelector("h3")
                .textContent
                .toLowerCase();

            const text =
                article.querySelector("p")
                .textContent
                .toLowerCase();

            if(
                title.includes(value) ||
                text.includes(value)
            ){

                article.style.display="block";

            }

            else{

                article.style.display="none";

            }

        });

    });

}

/*==================================================
            APPARITION AU SCROLL
==================================================*/

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.animate([

                {
                    opacity:0,
                    transform:"translateY(50px)"
                },

                {
                    opacity:1,
                    transform:"translateY(0)"
                }

            ],{

                duration:700,
                easing:"ease",
                fill:"forwards"

            });

            observer.unobserve(entry.target);

        }

    });

},{
    threshold:.15
});

articles.forEach(article=>{

    article.style.opacity="0";

    observer.observe(article);

});

/*==================================================
            EFFET 3D DES CARTES
==================================================*/

articles.forEach(article=>{

    article.addEventListener("mousemove",(e)=>{

        const rect=article.getBoundingClientRect();

        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        const rotateY=((x/rect.width)-0.5)*10;
        const rotateX=((y/rect.height)-0.5)*-10;

        article.style.transform=
        `perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)`;

    });

    article.addEventListener("mouseleave",()=>{

        article.style.transform=
        "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";

    });

});

/*==================================================
            PARALLAX DU FOND
==================================================*/

const gradients=document.querySelectorAll(".gradient");

document.addEventListener("mousemove",(e)=>{

    const x=e.clientX/window.innerWidth;
    const y=e.clientY/window.innerHeight;

    gradients.forEach((gradient,index)=>{

        const speed=(index+1)*20;

        gradient.style.transform=
        `translate(${x*speed}px,${y*speed}px)`;

    });

});

/*==================================================
            BOUTON RETOUR EN HAUT
==================================================*/

const backToTop=document.createElement("button");

backToTop.innerHTML='<i class="fa-solid fa-arrow-up"></i>';

backToTop.className="back-to-top";

document.body.appendChild(backToTop);

window.addEventListener("scroll",()=>{

    if(window.scrollY>500){

        backToTop.classList.add("show");

    }else{

        backToTop.classList.remove("show");

    }

});

backToTop.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/*==================================================
            PARTICULES LUMINEUSES
==================================================*/

const background=document.querySelector(".background");

for(let i=0;i<20;i++){

    const particle=document.createElement("span");

    particle.className="particle";

    particle.style.left=Math.random()*100+"%";

    particle.style.top=Math.random()*100+"%";

    particle.style.animationDuration=
    (6+Math.random()*8)+"s";

    particle.style.animationDelay=
    Math.random()*6+"s";

    background.appendChild(particle);

}

/*==================================================
            ANIMATION DU TITRE
==================================================*/

const heroTitle=document.querySelector(".hero h1");

if(heroTitle){

    heroTitle.animate([

        {
            transform:"translateY(20px)",
            opacity:0
        },

        {
            transform:"translateY(0)",
            opacity:1
        }

    ],{

        duration:900,

        easing:"ease-out",

        fill:"forwards"

    });

}
