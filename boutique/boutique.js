/*==================================================
                LUMALIA
             SERVEUR DIAMANT
==================================================*/

/*==================================================
            PARALLAX BACKGROUND
==================================================*/

const gradientLeft=document.querySelector(".gradient-left");
const gradientRight=document.querySelector(".gradient-right");

document.addEventListener("mousemove",(e)=>{

    const x=e.clientX/window.innerWidth;
    const y=e.clientY/window.innerHeight;

    if(gradientLeft){

        gradientLeft.style.transform=
        `translate(${x*35}px,${y*35}px)`;

    }

    if(gradientRight){

        gradientRight.style.transform=
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
".shop-card,.coin-card,.faq-item,.section-title"
).forEach(element=>{

    element.classList.add("hidden");

    observer.observe(element);

});

/*==================================================
                HERO
==================================================*/

window.addEventListener("load",()=>{

    const hero=document.querySelector(".hero-content");

    if(!hero) return;

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
            EFFET LUMIÈRE SUR LES CARTES
==================================================*/

document.querySelectorAll(
".shop-card,.coin-card,.faq-item"
).forEach(card=>{

    card.addEventListener("mousemove",(e)=>{

        const rect=card.getBoundingClientRect();

        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        card.style.background=`
        radial-gradient(circle at ${x}px ${y}px,
        rgba(0,217,255,.18),
        rgba(255,255,255,.05) 45%)
        `;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.background="var(--glass)";

    });

});

/*==================================================
            BOUTONS D'ACHAT
==================================================*/

document.querySelectorAll(".buy-button").forEach(button=>{

    button.addEventListener("click",(e)=>{

        e.preventDefault();

        button.innerHTML=`
            <i class="fa-solid fa-cart-shopping"></i>
            Bientôt disponible
        `;

        button.style.pointerEvents="none";

        button.style.opacity=".85";

    });

});

/*==================================================
            ANIMATION DES PRIX
==================================================*/

document.querySelectorAll(".price").forEach(price=>{

    price.addEventListener("mouseenter",()=>{

        price.animate([

            {
                transform:"scale(1)"
            },

            {
                transform:"scale(1.12)"
            },

            {
                transform:"scale(1)"
            }

        ],{

            duration:400

        });

    });

});

/*==================================================
            EFFET SUR LES LUMACOINS
==================================================*/

document.querySelectorAll(".coin-card").forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.animate([

            {
                transform:"translateY(0)"
            },

            {
                transform:"translateY(-8px)"
            }

        ],{

            duration:250,
            fill:"forwards"

        });

    });

});

/*==================================================
            NAVBAR AU SCROLL
==================================================*/

const header=document.querySelector(".header");

window.addEventListener("scroll",()=>{

    if(window.scrollY>80){

        header.style.background="rgba(8,8,20,.92)";
        header.style.boxShadow="0 10px 35px rgba(0,0,0,.35)";

    }else{

        header.style.background="rgba(10,10,20,.75)";
        header.style.boxShadow="none";

    }

});

/*==================================================
            BOUTON RETOUR EN HAUT
==================================================*/

const topButton=document.createElement("button");

topButton.innerHTML='<i class="fa-solid fa-arrow-up"></i>';

topButton.className="back-top";

document.body.appendChild(topButton);

topButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,
        behavior:"smooth"

    });

});

window.addEventListener("scroll",()=>{

    if(window.scrollY>500){

        topButton.classList.add("visible");

    }else{

        topButton.classList.remove("visible");

    }

});

/*==================================================
            ANIMATION HERO
==================================================*/

const badge=document.querySelector(".hero-badge");

if(badge){

    setInterval(()=>{

        badge.animate([

            {
                transform:"scale(1)"
            },

            {
                transform:"scale(1.05)"
            },

            {
                transform:"scale(1)"
            }

        ],{

            duration:1800

        });

    },2500);

}

/*==================================================
            SCROLL ACTIF
==================================================*/

document.querySelectorAll('a[href^="#"]').forEach(link=>{

    link.addEventListener("click",(e)=>{

        e.preventDefault();

        const target=document.querySelector(
            link.getAttribute("href")
        );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

/*==================================================
            FIN
==================================================*/

console.log(
"%cBoutique Lumalia chargée !",
"color:#
