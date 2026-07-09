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

/*==================================================
            COMPTEURS ANIMÉS
==================================================*/

const counters=document.querySelectorAll(".stats-grid h3");

const counterObserver=new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(!entry.isIntersecting) return;

        const counter=entry.target;

        const target=parseInt(counter.dataset.target)||0;

        let current=0;

        const increment=Math.max(1,Math.ceil(target/80));

        const update=()=>{

            current+=increment;

            if(current>=target){

                counter.textContent=target;

                return;

            }

            counter.textContent=current;

            requestAnimationFrame(update);

        };

        update();

        counterObserver.unobserve(counter);

    });

},{
    threshold:.5
});

counters.forEach(counter=>{

    counterObserver.observe(counter);

});

/*==================================================
            GALERIE PLEIN ÉCRAN
==================================================*/

const galleryImages=document.querySelectorAll(".gallery-grid img");

galleryImages.forEach(img=>{

    img.addEventListener("click",()=>{

        const overlay=document.createElement("div");

        overlay.className="image-overlay";

        overlay.innerHTML=`
            <img src="${img.src}" alt="">
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
".info-card,.news-grid article,.stats-grid div"
).forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect=card.getBoundingClientRect();

        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        card.style.background=`
        radial-gradient(circle at ${x}px ${y}px,
        rgba(0,217,255,.15),
        rgba(255,255,255,.05) 45%)
        `;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.background="var(--glass)";

    });

});

/*==================================================
            HERO ANIMATION
==================================================*/

window.addEventListener("load",()=>{

    const hero=document.querySelector(".hero-content");

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

});

/*==================================================
            GALERIE PLEIN ÉCRAN
==================================================*/

const galleryImages=document.querySelectorAll(".gallery-grid img");

galleryImages.forEach(img=>{

    img.addEventListener("click",()=>{

        const overlay=document.createElement("div");

        overlay.className="image-overlay";

        overlay.innerHTML=`
            <img src="${img.src}" alt="">
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
".info-card,.news-grid article,.stats-grid div"
).forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect=card.getBoundingClientRect();

        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        card.style.background=`
        radial-gradient(circle at ${x}px ${y}px,
        rgba(0,217,255,.15),
        rgba(255,255,255,.05) 45%)
        `;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.background="var(--glass)";

    });

});

/*==================================================
            HERO ANIMATION
==================================================*/

window.addEventListener("load",()=>{

    const hero=document.querySelector(".hero-content");

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

});
