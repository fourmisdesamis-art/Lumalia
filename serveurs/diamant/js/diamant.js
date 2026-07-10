/*==================================================
                    HERO
==================================================*/

.hero{
    margin-top:90px;
    height:650px;
    position:relative;
}

.hero-image{
    position:relative;
    width:100%;
    height:100%;
    background:
        linear-gradient(rgba(5,10,25,.65),rgba(5,10,25,.85)),
        url("../../images/diamant-banner.jpg") center/cover;
    display:flex;
    justify-content:center;
    align-items:center;
}

.overlay{
    position:absolute;
    inset:0;
    background:linear-gradient(to bottom,transparent,rgba(8,9,19,.9));
}

.hero-content{
    position:relative;
    z-index:2;
    width:min(1300px,92%);
    display:flex;
    align-items:center;
    gap:60px;
}

.server-icon{
    width:180px;
    height:180px;
    border-radius:35px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:90px;
    background:rgba(255,255,255,.08);
    backdrop-filter:blur(20px);
    border:1px solid var(--border);
    box-shadow:0 0 35px rgba(0,217,255,.25);
}

.hero-content h1{
    font-size:72px;
    font-weight:800;
    margin:15px 0;
    background:linear-gradient(90deg,var(--blue),var(--purple),white);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
}

.hero-content p{
    max-width:720px;
    font-size:19px;
    line-height:34px;
    color:var(--text);
}

.status{
    display:inline-flex;
    align-items:center;
    gap:10px;
    padding:8px 18px;
    border-radius:30px;
    background:rgba(0,217,255,.12);
    color:var(--blue);
    font-weight:600;
    border:1px solid rgba(0,217,255,.3);
}

.status i{
    font-size:10px;
}

/*==================================================
                HERO BUTTONS
==================================================*/

.hero-buttons{
    display:flex;
    gap:20px;
    margin-top:35px;
    flex-wrap:wrap;
}

.play-button,
.secondary-button{
    padding:16px 32px;
    border-radius:15px;
    text-decoration:none;
    color:white;
    font-weight:700;
    transition:.3s;
}

.play-button{
    background:linear-gradient(90deg,var(--blue),var(--purple));
}

.secondary-button{
    background:rgba(255,255,255,.06);
    border:1px solid var(--border);
}

.play-button:hover,
.secondary-button:hover{
    transform:translateY(-4px);
    box-shadow:0 0 25px rgba(0,217,255,.25);
}

/*==================================================
                SERVER INFO
==================================================*/

.server-info{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:18px;
    margin-top:45px;
}

.server-info div{
    background:var(--glass);
    border:1px solid var(--border);
    backdrop-filter:blur(18px);
    border-radius:18px;
    padding:18px;
}

.server-info h3{
    font-size:14px;
    color:#9bb0c9;
    margin-bottom:8px;
    font-weight:600;
}

.server-info span{
    font-size:18px;
    font-weight:700;
    color:white;
}

/*==================================================
                MAIN LAYOUT
==================================================*/

.main{
    width:min(1400px,92%);
    margin:70px auto;
    display:grid;
    grid-template-columns:280px 1fr;
    gap:35px;
}

.sidebar{
    position:sticky;
    top:110px;
    height:fit-content;
    background:var(--glass);
    border:1px solid var(--border);
    border-radius:22px;
    padding:25px;
    backdrop-filter:blur(20px);
}

.sidebar h3{
    margin-bottom:20px;
    font-size:24px;
}

.sidebar ul{
    list-style:none;
}

.sidebar li{
    margin-bottom:8px;
}

.sidebar a{
    display:block;
    padding:14px 16px;
    border-radius:12px;
    text-decoration:none;
    color:var(--text);
    transition:.3s;
}

.sidebar li.active a,
.sidebar a:hover{
    background:rgba(0,217,255,.12);
    color:white;
}

/*==================================================
                    HERO
==================================================*/

.hero{
    margin-top:90px;
    height:650px;
    position:relative;
}

.hero-image{
    position:relative;
    width:100%;
    height:100%;
    background:
        linear-gradient(rgba(5,10,25,.65),rgba(5,10,25,.85)),
        url("../../images/diamant-banner.jpg") center/cover;
    display:flex;
    justify-content:center;
    align-items:center;
}

.overlay{
    position:absolute;
    inset:0;
    background:linear-gradient(to bottom,transparent,rgba(8,9,19,.9));
}

.hero-content{
    position:relative;
    z-index:2;
    width:min(1300px,92%);
    display:flex;
    align-items:center;
    gap:60px;
}

.server-icon{
    width:180px;
    height:180px;
    border-radius:35px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:90px;
    background:rgba(255,255,255,.08);
    backdrop-filter:blur(20px);
    border:1px solid var(--border);
    box-shadow:0 0 35px rgba(0,217,255,.25);
}

.hero-content h1{
    font-size:72px;
    font-weight:800;
    margin:15px 0;
    background:linear-gradient(90deg,var(--blue),var(--purple),white);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
}

.hero-content p{
    max-width:720px;
    font-size:19px;
    line-height:34px;
    color:var(--text);
}

.status{
    display:inline-flex;
    align-items:center;
    gap:10px;
    padding:8px 18px;
    border-radius:30px;
    background:rgba(0,217,255,.12);
    color:var(--blue);
    font-weight:600;
    border:1px solid rgba(0,217,255,.3);
}

.status i{
    font-size:10px;
}

/*==================================================
                HERO BUTTONS
==================================================*/

.hero-buttons{
    display:flex;
    gap:20px;
    margin-top:35px;
    flex-wrap:wrap;
}

.play-button,
.secondary-button{
    padding:16px 32px;
    border-radius:15px;
    text-decoration:none;
    color:white;
    font-weight:700;
    transition:.3s;
}

.play-button{
    background:linear-gradient(90deg,var(--blue),var(--purple));
}

.secondary-button{
    background:rgba(255,255,255,.06);
    border:1px solid var(--border);
}

.play-button:hover,
.secondary-button:hover{
    transform:translateY(-4px);
    box-shadow:0 0 25px rgba(0,217,255,.25);
}

/*==================================================
                SERVER INFO
==================================================*/

.server-info{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:18px;
    margin-top:45px;
}

.server-info div{
    background:var(--glass);
    border:1px solid var(--border);
    backdrop-filter:blur(18px);
    border-radius:18px;
    padding:18px;
}

.server-info h3{
    font-size:14px;
    color:#9bb0c9;
    margin-bottom:8px;
    font-weight:600;
}

.server-info span{
    font-size:18px;
    font-weight:700;
    color:white;
}

/*==================================================
                MAIN LAYOUT
==================================================*/

.main{
    width:min(1400px,92%);
    margin:70px auto;
    display:grid;
    grid-template-columns:280px 1fr;
    gap:35px;
}

.sidebar{
    position:sticky;
    top:110px;
    height:fit-content;
    background:var(--glass);
    border:1px solid var(--border);
    border-radius:22px;
    padding:25px;
    backdrop-filter:blur(20px);
}

.sidebar h3{
    margin-bottom:20px;
    font-size:24px;
}

.sidebar ul{
    list-style:none;
}

.sidebar li{
    margin-bottom:8px;
}

.sidebar a{
    display:block;
    padding:14px 16px;
    border-radius:12px;
    text-decoration:none;
    color:var(--text);
    transition:.3s;
}

.sidebar li.active a,
.sidebar a:hover{
    background:rgba(0,217,255,.12);
    color:white;
}

/*==================================================
                    HERO
==================================================*/

.hero{
    margin-top:90px;
    height:650px;
    position:relative;
}

.hero-image{
    position:relative;
    width:100%;
    height:100%;
    background:
        linear-gradient(rgba(5,10,25,.65),rgba(5,10,25,.85)),
        url("../../images/diamant-banner.jpg") center/cover;
    display:flex;
    justify-content:center;
    align-items:center;
}

.overlay{
    position:absolute;
    inset:0;
    background:linear-gradient(to bottom,transparent,rgba(8,9,19,.9));
}

.hero-content{
    position:relative;
    z-index:2;
    width:min(1300px,92%);
    display:flex;
    align-items:center;
    gap:60px;
}

.server-icon{
    width:180px;
    height:180px;
    border-radius:35px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:90px;
    background:rgba(255,255,255,.08);
    backdrop-filter:blur(20px);
    border:1px solid var(--border);
    box-shadow:0 0 35px rgba(0,217,255,.25);
}

.hero-content h1{
    font-size:72px;
    font-weight:800;
    margin:15px 0;
    background:linear-gradient(90deg,var(--blue),var(--purple),white);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
}

.hero-content p{
    max-width:720px;
    font-size:19px;
    line-height:34px;
    color:var(--text);
}

.status{
    display:inline-flex;
    align-items:center;
    gap:10px;
    padding:8px 18px;
    border-radius:30px;
    background:rgba(0,217,255,.12);
    color:var(--blue);
    font-weight:600;
    border:1px solid rgba(0,217,255,.3);
}

.status i{
    font-size:10px;
}

/*==================================================
                HERO BUTTONS
==================================================*/

.hero-buttons{
    display:flex;
    gap:20px;
    margin-top:35px;
    flex-wrap:wrap;
}

.play-button,
.secondary-button{
    padding:16px 32px;
    border-radius:15px;
    text-decoration:none;
    color:white;
    font-weight:700;
    transition:.3s;
}

.play-button{
    background:linear-gradient(90deg,var(--blue),var(--purple));
}

.secondary-button{
    background:rgba(255,255,255,.06);
    border:1px solid var(--border);
}

.play-button:hover,
.secondary-button:hover{
    transform:translateY(-4px);
    box-shadow:0 0 25px rgba(0,217,255,.25);
}

/*==================================================
                SERVER INFO
==================================================*/

.server-info{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:18px;
    margin-top:45px;
}

.server-info div{
    background:var(--glass);
    border:1px solid var(--border);
    backdrop-filter:blur(18px);
    border-radius:18px;
    padding:18px;
}

.server-info h3{
    font-size:14px;
    color:#9bb0c9;
    margin-bottom:8px;
    font-weight:600;
}

.server-info span{
    font-size:18px;
    font-weight:700;
    color:white;
}

/*==================================================
                MAIN LAYOUT
==================================================*/

.main{
    width:min(1400px,92%);
    margin:70px auto;
    display:grid;
    grid-template-columns:280px 1fr;
    gap:35px;
}

.sidebar{
    position:sticky;
    top:110px;
    height:fit-content;
    background:var(--glass);
    border:1px solid var(--border);
    border-radius:22px;
    padding:25px;
    backdrop-filter:blur(20px);
}

.sidebar h3{
    margin-bottom:20px;
    font-size:24px;
}

.sidebar ul{
    list-style:none;
}

.sidebar li{
    margin-bottom:8px;
}

.sidebar a{
    display:block;
    padding:14px 16px;
    border-radius:12px;
    text-decoration:none;
    color:var(--text);
    transition:.3s;
}

.sidebar li.active a,
.sidebar a:hover{
    background:rgba(0,217,255,.12);
    color:white;
}
