/* =========================================================
   AMUTHA RUBY — 1:1 CONSULTATION LANDING PAGE
========================================================= */


/* 1. CONFIG — EDIT THIS BLOCK ONLY

   BOOKING_URL : where every "Register Now" button goes.
                 Put your payment link or registration form here.
                 Leave "#offer" to scroll to the offer section instead.
   OPEN_IN_NEW : true  -> opens in a new tab
                 false -> opens in the same tab
   PRICE       : shown on the hero frame and the price band.
   NOTE        : the small line under every button.
   BAR_NOTE    : the line inside the mobile sticky footer.
   BAR_AFTER   : how far down the page (in pixels) the sticky footer appears.
                 0 = automatically, after the hero.
   RAIL_SPEED  : testimonial scroll speed in pixels per second.
*/
var CONFIG = {
  BOOKING_URL: "#offer",
  OPEN_IN_NEW: false,
  PRICE:       "₹199",
  NOTE:        "₹199 · Live on Zoom",
  BAR_NOTE:    "",
  BAR_AFTER:   0,
  RAIL_SPEED:  26
};


var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* 2. FILL PRICE AND NOTE TEXT */
(function fillText(){
  document.querySelectorAll(".js-price").forEach(function (el) {
    el.textContent = CONFIG.PRICE;
  });
  document.querySelectorAll(".js-note").forEach(function (el) {
    el.textContent = CONFIG.NOTE;
  });
  document.querySelectorAll(".js-bar-note").forEach(function (el) {
    el.textContent = CONFIG.BAR_NOTE;
  });
})();


/* 3. APPLY BOOKING LINK TO EVERY CTA */
(function applyBookingLink(){
  var url = CONFIG.BOOKING_URL;
  if (!url || url === "#offer") return;

  document.querySelectorAll(".js-book").forEach(function (el) {
    el.setAttribute("href", url);
    if (CONFIG.OPEN_IN_NEW) {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  });
})();


/* 4. AUTO STAGGER
   Any [data-stagger="ms"] container hands its revealing children a
   rising --d delay, so rows arrive one after another instead of
   all snapping in together. data-start="ms" offsets the whole group. */
(function stagger(){
  document.querySelectorAll("[data-stagger]").forEach(function (box) {
    var step  = parseFloat(box.getAttribute("data-stagger")) || 80;
    var start = parseFloat(box.getAttribute("data-start"))   || 0;

    Array.prototype.forEach.call(box.children, function (child, i) {
      var target = child.hasAttribute("data-reveal")
        ? child
        : child.querySelector("[data-reveal]");
      if (target) target.style.setProperty("--d", ((start + i * step) / 1000) + "s");
      /* file-tab columns carry their own delay */
      if (child.classList.contains("fold__col")) {
        child.style.setProperty("--d", ((start + i * step) / 1000) + "s");
      }
    });
  });

  /* the lines inside the two folders cascade, left folder first */
  document.querySelectorAll("[data-stagger-li]").forEach(function (box) {
    var step = parseFloat(box.getAttribute("data-stagger-li")) || 80;
    box.querySelectorAll(".fold__col").forEach(function (col, ci) {
      col.querySelectorAll("li").forEach(function (li, i) {
        li.style.setProperty("--d2", ((i * step) + (ci * 140) + 420) / 1000 + "s");
      });
    });
  });
})();


/* 5. SCROLL REVEAL
   Watches [data-reveal] plus the two framed portraits, which use
   .is-in to settle their own scale, brackets and rules. */
(function reveal(){
  var items = document.querySelectorAll("[data-reveal], .orb, .slant, .fold");
  if (!items.length) return;

  var showAll = function () {
    items.forEach(function (el) { el.classList.add("is-in"); });
  };

  if (REDUCED || !("IntersectionObserver" in window)) { showAll(); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

  items.forEach(function (el) { io.observe(el); });

  /* anything already on screen at load shows straight away */
  var showVisible = function () {
    items.forEach(function (el) {
      var box = el.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.96 && box.bottom > 0) {
        el.classList.add("is-in");
      }
    });
  };
  showVisible();
  window.addEventListener("load", showVisible);

  /* safety net — content is never left invisible */
  setTimeout(showVisible, 1200);
})();


/* 6. FAQ ACCORDION */
(function faq(){
  var buttons = document.querySelectorAll(".faq__q");
  if (!buttons.length) return;

  var closeRow = function (row) {
    row.classList.remove("is-open");
    row.querySelector(".faq__q").setAttribute("aria-expanded", "false");
    row.querySelector(".faq__a").style.maxHeight = null;
  };

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row    = btn.closest(".faq__row");
      var panel  = row.querySelector(".faq__a");
      var isOpen = row.classList.contains("is-open");

      document.querySelectorAll(".faq__row.is-open").forEach(closeRow);

      if (!isOpen) {
        row.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  window.addEventListener("resize", function () {
    var open = document.querySelector(".faq__row.is-open .faq__a");
    if (open) open.style.maxHeight = open.scrollHeight + "px";
  }, { passive: true });
})();


/* 7. HEADER BACKGROUND ON SCROLL */
(function header(){
  var el = document.getElementById("hdr");
  if (!el) return;

  var onScroll = function () {
    el.classList.toggle("is-stuck", window.scrollY > 40);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();


/* 8. MOBILE STICKY BAR */
(function bar(){
  var el   = document.getElementById("bar");
  var hero = document.getElementById("top");
  if (!el || !hero) return;

  var ticking = false;

  var update = function () {
    var trigger = CONFIG.BAR_AFTER || hero.offsetHeight * 0.7;
    el.classList.toggle("is-on", window.scrollY > trigger);
    ticking = false;
  };

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", update, { passive: true });
  update();
})();


/* 9. FOOTER YEAR */
(function year(){
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();


/* 10. TESTIMONIAL RAIL — continuous soft marquee
   The second set is cloned here, so you only edit the first set in
   the HTML. Keeps moving on mobile (2 cards) and desktop (3 cards);
   eases to a stop under a mouse pointer only. */
(function rail(){
  var el    = document.querySelector(".rail");
  var track = el && el.querySelector(".rail__track");
  var set   = track && track.querySelector(".rail__set");
  if (!el || !track || !set || REDUCED) return;

  /* clone the set for a seamless loop */
  var clone = set.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  clone.querySelectorAll("img").forEach(function (img) { img.alt = ""; });
  track.appendChild(clone);

  var SPEED = CONFIG.RAIL_SPEED;
  var EASE  = 4;

  var offset  = 0;
  var current = SPEED;
  var target  = SPEED;
  var last    = null;
  var half    = 0;
  var running = true;

  function measure(){
    half = set.getBoundingClientRect().width;
  }

   var paused = false;

  /* tap or click a card to stop the movement — tap again to start it */
  el.addEventListener("click", function (e) {
    if (!e.target.closest(".shot")) return;
    paused = !paused;
    target = paused ? 0 : SPEED;
    el.classList.toggle("is-paused", paused);
  });

  /* hover pause on pointer devices — never overrides a tap-pause */
  if (window.matchMedia("(hover: hover)").matches) {
    el.addEventListener("mouseenter", function(){ target = 0; });
    el.addEventListener("mouseleave", function(){ if (!paused) target = SPEED; });
    el.addEventListener("focusin",    function(){ target = 0; });
    el.addEventListener("focusout",   function(){ if (!paused) target = SPEED; });
  }
  
  /* stop the loop while the section is off screen */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
      if (running) { last = null; requestAnimationFrame(step); }
    }, { threshold: 0 }).observe(el);
  }

  document.addEventListener("visibilitychange", function () {
    last = null;
    if (!document.hidden && running) requestAnimationFrame(step);
  });

  function step(now){
    if (!running || document.hidden) return;

    if (last === null) last = now;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (half <= 0) measure();

    current += (target - current) * Math.min(dt * EASE, 1);

    if (half > 0) {
      offset += current * dt;
      if (offset >= half) offset -= half;
      track.style.transform = "translate3d(" + (-offset) + "px,0,0)";
    }

    requestAnimationFrame(step);
  }

  measure();
  requestAnimationFrame(step);

  window.addEventListener("load", measure);

  el.querySelectorAll("img").forEach(function (img) {
    if (!img.complete) img.addEventListener("load", measure, { once: true });
  });

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { measure(); offset = 0; }, 120);
  }, { passive: true });
})();





/* 11. VIDEO TESTIMONIALS — load the player only on click */
document.addEventListener("click", function (e) {
  var btn = e.target.closest(".vt__play");
  if (!btn) return;

  var id = btn.getAttribute("data-yt");
  if (!id) return;

  var f = document.createElement("div");
  f.className = "vt__frame";
  f.innerHTML =
    '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" ' +
    'title="Student story" ' +
    'allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share" ' +
    'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  btn.replaceWith(f);
});














/* 12. COACH PHOTO ROW
   Swipe or drag the photos sideways at any time.
   With 3 or more photos the row also glides on its own and loops. */
(function gallery(){
  document.querySelectorAll("[data-gal]").forEach(function (gal) {
    var win   = gal.querySelector(".gal__win");
    var track = gal.querySelector(".gal__track");
    if (!win || !track) return;

    var SPEED = 22;
    var off = 0, last = null, span = 0, loop = false;
    var go = false, drag = false, sx = 0, so = 0;

    gal.style.touchAction = "pan-y";
    gal.style.cursor = "grab";
    gal.querySelectorAll("img").forEach(function (i) { i.draggable = false; });

    function overflowing(){ return track.scrollWidth > win.clientWidth + 2; }

    function measure(){
      if (loop) {
        var set = track.firstElementChild;
        span = set ? set.getBoundingClientRect().width + 10 : 0;
      } else {
        span = Math.max(0, track.scrollWidth - win.clientWidth);
      }
    }

    function place(){ track.style.transform = "translate3d(" + (-off) + "px,0,0)"; }

    function clamp(){
      if (span <= 0) { off = 0; return; }
      off = loop ? ((off % span) + span) % span : Math.min(Math.max(off, 0), span);
    }

    /* 3 or more photos: clone the set once so the loop has no seam */
    function build(){
      if (gal.dataset.ready || REDUCED) return;
      if (!overflowing()) { measure(); return; }
      gal.dataset.ready = "1";

      var set = document.createElement("div");
      set.style.cssText = "display:flex;gap:10px;flex:none;height:100%";
      while (track.firstChild) set.appendChild(track.firstChild);
      track.appendChild(set);

      var clone = set.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("img").forEach(function (i) { i.alt = ""; i.draggable = false; });
      track.appendChild(clone);

      loop = true;
      gal.classList.add("is-moving");
      measure();
      go = true; last = null;
      requestAnimationFrame(step);
    }

    function step(now){
      if (!go || drag || document.hidden) return;
      if (last === null) last = now;
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (span <= 0) measure();
      if (span > 0) { off += SPEED * dt; clamp(); place(); }
      requestAnimationFrame(step);
    }

    /* --- swipe / drag — always available --- */
    function down(x, id){
      measure();
      if (span <= 0) return;
      drag = true; sx = x; so = off;
      gal.style.cursor = "grabbing";
      if (id !== undefined && gal.setPointerCapture) {
        try { gal.setPointerCapture(id); } catch (err) {}
      }
    }
    function move(x){
      if (!drag) return;
      off = so - (x - sx);
      clamp(); place();
    }
    function up(){
      if (!drag) return;
      drag = false;
      gal.style.cursor = "grab";
      if (loop) { go = true; last = null; requestAnimationFrame(step); }
    }

    if (window.PointerEvent) {
      gal.addEventListener("pointerdown", function (e) { down(e.clientX, e.pointerId); });
      gal.addEventListener("pointermove", function (e) { move(e.clientX); });
      gal.addEventListener("pointerup",     up);
      gal.addEventListener("pointercancel", up);
    } else {
      gal.addEventListener("touchstart", function (e) { down(e.touches[0].clientX); }, { passive: true });
      gal.addEventListener("touchmove",  function (e) { move(e.touches[0].clientX); }, { passive: true });
      gal.addEventListener("touchend",   up);
      gal.addEventListener("mousedown",  function (e) { e.preventDefault(); down(e.clientX); });
      window.addEventListener("mousemove", function (e) { move(e.clientX); });
      window.addEventListener("mouseup",   up);
    }

    /* pause the glide while the section is off screen or the tab is hidden */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        if (!loop) return;
        go = en[0].isIntersecting;
        if (go) { last = null; requestAnimationFrame(step); }
      }, { threshold: 0 }).observe(gal);
    }
    document.addEventListener("visibilitychange", function () {
      last = null;
      if (!document.hidden && go && loop) requestAnimationFrame(step);
    });

    if (window.matchMedia("(hover: hover)").matches) {
      gal.addEventListener("mouseenter", function () { if (loop) go = false; });
      gal.addEventListener("mouseleave", function () {
        if (loop && !drag) { go = true; last = null; requestAnimationFrame(step); }
      });
    }

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { measure(); off = 0; place(); }, 120);
    }, { passive: true });

    gal.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", function () { build(); measure(); }, { once: true });
    });

    build(); measure();
    window.addEventListener("load", function () { build(); measure(); });
    setTimeout(function () { build(); measure(); }, 600);
  });
})();
