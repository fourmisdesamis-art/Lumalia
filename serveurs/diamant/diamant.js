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

    if(gradient1){
        gradient1.style.transform=
        `translate(${x*35}px,${y*35}px)`;
    }

    if(gradient2){
        gradient2.style.transform=
        `translate(${-x*35}px,${-y*35}px)`;
    }

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
".section,.hero-card,.stat-card,.feature-card,.news-card,.gallery-grid img,.map-card"
).forEach(element=>{

    element.classList.add("hidden");

    observer.observe(element);

});

/*==================================================
            ANIMATION HERO
==================================================*/

window.addEventListener("load",()=>{

    const hero=document.querySelector(".hero-content");

    if(hero){

        hero.animate([

            {
                opacity:0,
                transform:"translateY(60px)"
            },

            {
                opacity:1,
                transform:"translateY(0)"
            }

        ],{

            duration:900,
            easing:"ease-out",
            fill:"forwards"

        });

    }

});

/*==================================================
            COMPTEURS ANIMÉS
==================================================*/

function animateCounter(id,target){

    const element=document.getElementById(id);

    if(!element) return;

    let current=0;

    const increment=Math.max(1,Math.ceil(target/80));

    function update(){

        current+=increment;

        if(current>=target){

            element.textContent=target;
            return;

        }

        element.textContent=current;

        requestAnimationFrame(update);

    }

    update();

}

window.addEventListener("load",()=>{

    animateCounter("countriesCount",0);
    animateCounter("citiesCount",0);
    animateCounter("playersCount",0);

});

/*==================================================
            JOUEURS EN LIGNE
==================================================*/

const onlinePlayers=document.getElementById("onlinePlayers");

if(onlinePlayers){

    onlinePlayers.textContent="0 connecté";

}

/*==================================================
            GALERIE PLEIN ÉCRAN
==================================================*/

document.querySelectorAll(".gallery-grid img").forEach(image=>{

    image.addEventListener("click",()=>{

        const overlay=document.createElement("div");

        overlay.className="image-overlay";

        overlay.innerHTML=`
            <img src="${image.src}" alt="">
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener("click",()=>{

            overlay.remove();

        });

    });

});

/*==================================================
        EFFET LUMIÈRE SUR LES CARTES
==================================================*/

document.querySelectorAll(
".hero-card,.stat-card,.feature-card,.news-card,.map-card"
).forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect=card.getBoundingClientRect();

        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        card.style.background=`
        radial-gradient(circle at ${x}px ${y}px,
        rgba(0,217,255,.16),
        rgba(255,255,255,.05) 60%)
        `;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.background="var(--glass)";

    });

});

/*==================================================
            NAVBAR AU SCROLL
==================================================*/

const header=document.querySelector(".header");

window.addEventListener("scroll",()=>{

    if(!header) return;

    if(window.scrollY>80){

        header.style.background="rgba(8,8,18,.92)";
        header.style.backdropFilter="blur(22px)";
        header.style.boxShadow="0 10px 35px rgba(0,0,0,.35)";

    }else{

        header.style.background="rgba(10,10,20,.75)";
        header.style.backdropFilter="blur(18px)";
        header.style.boxShadow="none";

    }

});

/*==================================================
        SCROLL FLUIDE DES ANCRES
==================================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

    anchor.addEventListener("click",(e)=>{

        const target=document.querySelector(anchor.getAttribute("href"));

        if(!target) return;

        e.preventDefault();

        target.scrollIntoView({

            behavior:"smooth",
            block:"start"

        });

    });

});

/*==================================================
            COPYRIGHT
==================================================*/

console.log("%cLumalia","font-size:22px;color:#00d9ff;font-weight:bold;");
console.log("%cServeur Diamant chargé avec succès !","color:#8b5cf6;");
