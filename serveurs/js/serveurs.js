/*==================================================
                LUMALIA SERVEURS
==================================================*/

/*==================================================
            ANIMATION DES CARTES
==================================================*/

const cards = document.querySelectorAll(".server-card");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";
            entry.target.style.transform="translateY(0)";

        }

    });

},{
    threshold:0.15
});

cards.forEach(card=>{

    card.style.opacity="0";
    card.style.transform="translateY(50px)";
    card.style.transition=".6s ease";

    observer.observe(card);

});

/*==================================================
            EFFET AU SURVOL
==================================================*/

cards.forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect=card.getBoundingClientRect();

        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        card.style.background=
        `radial-gradient(circle at ${x}px ${y}px,
        rgba(88,216,255,.12),
        rgba(17,24,45,1) 60%)`;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.background="";

    });

});

/*==================================================
            COMPTEUR DE JOUEURS
==================================================*/

const counters = document.querySelectorAll(".player-count");

const counterObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(!entry.isIntersecting) return;

        const counter = entry.target;

        const target = Number(counter.dataset.count);

        let current = 0;

        const increment = Math.max(1, Math.ceil(target / 60));

        const timer = setInterval(()=>{

            current += increment;

            if(current >= target){

                current = target;

                clearInterval(timer);

            }

            counter.textContent = current;

        },20);

        counterObserver.unobserve(counter);

    });

},{
    threshold:0.5
});

counters.forEach(counter=>{

    counterObserver.observe(counter);

});

/*==================================================
            BOUTONS "DÉCOUVRIR"
==================================================*/

const buttons = document.querySelectorAll(".server-button");

buttons.forEach(button=>{

    button.addEventListener("mouseenter",()=>{

        button.style.transform="translateY(-4px) scale(1.02)";

    });

    button.addEventListener("mouseleave",()=>{

        button.style.transform="translateY(0) scale(1)";

    });

});

/*==================================================
            PARALLAX DE LA BANNIÈRE
==================================================*/

const hero = document.querySelector(".hero");

document.addEventListener("mousemove",(e)=>{

    if(!hero) return;

    const x = (e.clientX/window.innerWidth - 0.5) * 20;
    const y = (e.clientY/window.innerHeight - 0.5) * 20;

    hero.style.transform = `translate(${x}px,${y}px)`;

});

/*==================================================
            ANIMATION DU TITRE
==================================================*/

const title = document.querySelector(".hero h1");

if(title){

    setInterval(()=>{

        title.animate([

            {transform:"translateY(0px)"},
            {transform:"translateY(-5px)"},
            {transform:"translateY(0px)"}

        ],{

            duration:2500,
            easing:"ease-in-out"

        });

    },2500);

}

/*==================================================
            SCROLL EN DOUCEUR
==================================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

    anchor.addEventListener("click",(e)=>{

        e.preventDefault();

        const target=document.querySelector(anchor.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

/*==================================================
            CHARGEMENT
==================================================*/

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});
