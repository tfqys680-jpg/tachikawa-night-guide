// 立川ナイトガイド アニメーション（依存ライブラリなし・軽量）
// prefers-reduced-motion のユーザーには何もしない（要素は最初から表示されたまま）
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // ---- イントロ（1セッション1回・トップのみ） ----
  var isTop = /(?:^|\/)(index\.html)?$/.test(location.pathname);
  if (isTop && !sessionStorage.getItem("introShown")) {
    sessionStorage.setItem("introShown", "1");
    var intro = document.createElement("div");
    intro.id = "intro";
    var logo = document.createElement("img");
    logo.src = "assets/logo.png";
    logo.alt = "立川ナイトガイド";
    intro.appendChild(logo);
    document.body.appendChild(intro);
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      intro.classList.add("out");
      document.body.style.overflow = "";
      setTimeout(function () { intro.remove(); }, 800);
    }, 1500);
  }

  // ---- スクロールリビール ----
  var targets = document.querySelectorAll(
    ".sec-title, .sec-lead, .store-card, .job-card, .tbl, .flow li, .faq details, .notice, .hero h1, .hero p, .hero .badges, .hero .btn-row"
  );
  var groupIndex = {};
  targets.forEach(function (el) {
    el.classList.add("reveal");
    var key = el.parentElement ? Array.prototype.indexOf.call(document.querySelectorAll("section, .hero"), el.closest("section, .hero")) : 0;
    groupIndex[key] = (groupIndex[key] || 0);
    el.style.transitionDelay = Math.min(groupIndex[key] * 90, 450) + "ms";
    groupIndex[key]++;
  });
  // スクロール位置ベースの判定（IntersectionObserverが発火しない環境でも確実に動く）
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight - 40 && r.bottom > 0;
  }
  var pending = Array.prototype.slice.call(targets);
  function check() {
    pending = pending.filter(function (el) {
      if (inView(el)) { el.classList.add("is-in"); return false; }
      return true;
    });
    if (pending.length === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { check(); ticking = false; });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("wheel", onScroll, { passive: true });
  window.addEventListener("touchmove", onScroll, { passive: true });
  check();
  setTimeout(check, 400); // フォント読み込み後のレイアウト変化に追従
  // 保険: スクロールイベントが取れない環境でも最終的に全要素を表示する
  var guard = setInterval(function () {
    check();
    if (pending.length === 0) clearInterval(guard);
  }, 1500);
  setTimeout(function () {
    clearInterval(guard);
    pending.forEach(function (el) { el.classList.add("is-in"); });
    pending = [];
  }, 15000);

  // ---- ブランドマーキー（トップのヒーロー直下） ----
  var hero = document.querySelector(".hero");
  if (isTop && hero) {
    var mq = document.createElement("div");
    mq.className = "marquee";
    mq.setAttribute("aria-hidden", "true");
    var track = document.createElement("div");
    track.className = "marquee-track";
    var unit = "TACHIKAWA NIGHT GUIDE ✦ 立川ナイトガイド ✦ CABARET CLUB ✦ GIRLS BAR ✦ CONCEPT CAFE ✦ ";
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    span1.textContent = unit + unit;
    span2.textContent = unit + unit;
    track.appendChild(span1);
    track.appendChild(span2);
    mq.appendChild(track);
    hero.insertAdjacentElement("afterend", mq);
  }
})();
