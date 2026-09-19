/* =========================================================
   LUMALIA — bbcode.js
   Convertisseur BBcode → HTML sécurisé
   =========================================================
   Usage :
     LumaBBCode.render("[b]gras[/b]")
     → "<strong>gras</strong>"
   ========================================================= */

(function () {
  // ---------- Échappe le HTML pour éviter les injections ----------
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---------- Valide une URL (http, https, ou chemin relatif) ----------
  function isSafeUrl(url) {
    if (!url) return false;
    const trimmed = url.trim();
    return /^(https?:\/\/|\/)/i.test(trimmed);
  }

  // ---------- Valide une couleur CSS ----------
  function isSafeColor(color) {
    if (!color) return false;
    return /^#[0-9a-f]{3,8}$/i.test(color) ||
           /^rgb(a)?\([\d\s,\.%]+\)$/i.test(color) ||
           /^[a-z]+$/i.test(color);
  }

  // ---------- Parse le BBcode ----------
  function parse(input) {
    if (!input) return "";

    // 1. Échappe tout le HTML brut d'abord (sécurité)
    let text = escapeHtml(input);

    // 2. Code block (on le traite en priorité pour ne pas toucher à l'intérieur)
    text = text.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, function (_, code) {
      return '<pre class="bb-code"><code>' + code + "</code></pre>";
    });

    // 3. Citations
    text = text.replace(/\[quote(?:=([^\]]+))?\]([\s\S]*?)\[\/quote\]/gi, function (_, author, content) {
      const authorStr = author ? '<cite>' + author + "</cite>" : "";
      return '<blockquote class="bb-quote">' + authorStr + "<p>" + content + "</p></blockquote>";
    });

    // 4. Spoiler
    text = text.replace(/\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi, function (_, content) {
      return '<details class="bb-spoiler"><summary>Spoiler</summary><div>' + content + "</div></details>";
    });

    // 5. Images
    text = text.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, function (_, url) {
      const clean = url.trim();
      if (!isSafeUrl(clean)) return "[image invalide]";
      return '<img src="' + clean + '" alt="" class="bb-img" loading="lazy">';
    });

    // 6. Liens
    text = text.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, function (_, url, label) {
      const clean = url.trim();
      if (!isSafeUrl(clean)) return label;
      return '<a href="' + clean + '" target="_blank" rel="noopener noreferrer" class="bb-link">' + label + "</a>";
    });

    // 7. Couleurs
    text = text.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, function (_, color, content) {
      if (!isSafeColor(color)) return content;
      return '<span style="color:' + color + '">' + content + "</span>";
    });

    // 8. Taille
    text = text.replace(/\[size=(\d+)\]([\s\S]*?)\[\/size\]/gi, function (_, size, content) {
      const n = Math.min(Math.max(parseInt(size, 10), 8), 48);
      return '<span style="font-size:' + n + 'px">' + content + "</span>";
    });

    // 9. Alignements
    text = text.replace(/\[center\]([\s\S]*?)\[\/center\]/gi, '<div class="bb-center">$1</div>');
    text = text.replace(/\[right\]([\s\S]*?)\[\/right\]/gi, '<div class="bb-right">$1</div>');
    text = text.replace(/\[left\]([\s\S]*?)\[\/left\]/gi, '<div class="bb-left">$1</div>');

    // 10. Gras, italique, souligné, barré
    text = text.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, "<strong>$1</strong>");
    text = text.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, "<em>$1</em>");
    text = text.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, "<u>$1</u>");
    text = text.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, "<s>$1</s>");

    // 11. Listes
    text = text.replace(/\[list\]([\s\S]*?)\[\/list\]/gi, function (_, content) {
      const items = content.split(/\[\*\]/).filter(function (s) { return s.trim(); });
      return "<ul class=\"bb-list\">" + items.map(function (i) { return "<li>" + i.trim() + "</li>"; }).join("") + "</ul>";
    });
    text = text.replace(/\[list=1\]([\s\S]*?)\[\/list\]/gi, function (_, content) {
      const items = content.split(/\[\*\]/).filter(function (s) { return s.trim(); });
      return "<ol class=\"bb-list\">" + items.map(function (i) { return "<li>" + i.trim() + "</li>"; }).join("") + "</ol>";
    });

        // 12. Séparateur horizontal
    text = text.replace(/\[hr\]/gi, '<hr class="bb-hr">');

    // 13. YouTube
    text = text.replace(/\[youtube\]([\s\S]*?)\[\/youtube\]/gi, function (_, url) {
      const clean = url.trim();
      // Extrait l'ID de la vidéo
      const match = clean.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (!match) return "[vidéo YouTube invalide]";
      const id = match[1];
      return '<div class="bb-video"><iframe src="https://www.youtube.com/embed/' + id + '" title="YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
    });

    // 14. Sauts de ligne (après avoir traité le reste)
    text = text.replace(/\n/g, "<br>");

    return text;
  }

  // ---------- API globale ----------
  window.LumaBBCode = {
    render: parse,
    escape: escapeHtml,
    isSafeUrl: isSafeUrl
  };
})();
