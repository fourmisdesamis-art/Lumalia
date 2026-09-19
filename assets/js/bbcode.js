/* =========================================================
   LUMALIA — bbcode.js
   Convertisseur BBcode → HTML sécurisé
   ========================================================= */

(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function isSafeUrl(url) {
    if (!url) return false;
    var trimmed = url.trim();
    return /^(https?:\/\/|\/)/i.test(trimmed);
  }

  function isSafeColor(color) {
    if (!color) return false;
    return /^#[0-9a-f]{3,8}$/i.test(color) ||
           /^rgb(a)?\([\d\s,\.%]+\)$/i.test(color) ||
           /^[a-z]+$/i.test(color);
  }

  function parse(input) {
    if (!input) return "";

    var text = escapeHtml(input);

    // Code block (priorité max)
    text = text.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, function (_, code) {
      return '<pre class="bb-code"><code>' + code + "</code></pre>";
    });

    // Citations
    text = text.replace(/\[quote(?:=([^\]]+))?\]([\s\S]*?)\[\/quote\]/gi, function (_, author, content) {
      var authorStr = author ? '<cite>' + author + "</cite>" : "";
      return '<blockquote class="bb-quote">' + authorStr + "<p>" + content + "</p></blockquote>";
    });

    // Spoiler
    text = text.replace(/\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi, function (_, content) {
      return '<details class="bb-spoiler"><summary>Spoiler</summary><div>' + content + "</div></details>";
    });

    // Images
    text = text.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, function (_, url) {
      var clean = url.trim();
      if (!isSafeUrl(clean)) return "[image invalide]";
      return '<img src="' + clean + '" alt="" class="bb-img" loading="lazy">';
    });

    // Liens
    text = text.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, function (_, url, label) {
      var clean = url.trim();
      if (!isSafeUrl(clean)) return label;
      return '<a href="' + clean + '" target="_blank" rel="noopener noreferrer" class="bb-link">' + label + "</a>";
    });

    // Couleurs
    text = text.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, function (_, color, content) {
      if (!isSafeColor(color)) return content;
      return '<span style="color:' + color + '">' + content + "</span>";
    });

    // Taille
    text = text.replace(/\[size=(\d+)\]([\s\S]*?)\[\/size\]/gi, function (_, size, content) {
      var n = Math.min(Math.max(parseInt(size, 10), 8), 48);
      return '<span style="font-size:' + n + 'px">' + content + "</span>";
    });

    // Alignements
    text = text.replace(/\[center\]([\s\S]*?)\[\/center\]/gi, '<div class="bb-center">$1</div>');
    text = text.replace(/\[right\]([\s\S]*?)\[\/right\]/gi, '<div class="bb-right">$1</div>');
    text = text.replace(/\[left\]([\s\S]*?)\[\/left\]/gi, '<div class="bb-left">$1</div>');

    // Gras, italique, souligné, barré
    text = text.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, "<strong>$1</strong>");
    text = text.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, "<em>$1</em>");
    text = text.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, "<u>$1</u>");
    text = text.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, "<s>$1</s>");

    // Listes
    text = text.replace(/\[list\]([\s\S]*?)\[\/list\]/gi, function (_, content) {
      var items = content.split(/\[\*\]/).filter(function (s) { return s.trim(); });
      return "<ul class=\"bb-list\">" + items.map(function (i) { return "<li>" + i.trim() + "</li>"; }).join("") + "</ul>";
    });
    text = text.replace(/\[list=1\]([\s\S]*?)\[\/list\]/gi, function (_, content) {
      var items = content.split(/\[\*\]/).filter(function (s) { return s.trim(); });
      return "<ol class=\"bb-list\">" + items.map(function (i) { return "<li>" + i.trim() + "</li>"; }).join("") + "</ol>";
    });

    // Séparateur horizontal
    text = text.replace(/\[hr\]/gi, '<hr class="bb-hr">');

    // YouTube
    text = text.replace(/\[youtube\]([\s\S]*?)\[\/youtube\]/gi, function (_, url) {
      var clean = url.trim();
      var match = clean.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (!match) return "[vidéo YouTube invalide]";
      var id = match[1];
      return '<div class="bb-video"><iframe src="https://www.youtube.com/embed/' + id + '" title="YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
    });

    // Mentions @pseudo
    text = text.replace(/@([a-zA-Z0-9_-]{3,16})/g, '<span class="bb-mention">@$1</span>');

    // Sauts de ligne
    text = text.replace(/\n/g, "<br>");

    return text;
  }

  window.LumaBBCode = {
    render: parse,
    escape: escapeHtml,
    isSafeUrl: isSafeUrl
  };
})();
