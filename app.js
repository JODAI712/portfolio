// app.js (mobile safe + BFCache safe)
(() => {
  const root = document.documentElement;

  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // ---------- Footer year ----------
  function initYear() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------- Theme ----------
  function initTheme() {
    const themeBtn = $("#themeBtn");
    if (!themeBtn) return;

    function setTheme(theme) {
      root.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
    }

    const saved = localStorage.getItem("theme");
    setTheme(saved ? saved : "light");

    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // ---------- Copy helpers ----------
  function initCopy() {
    const copyHint = $("#copyHint");

    async function copyText(text, label) {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        if (copyHint) copyHint.textContent = `คัดลอกแล้ว: ${label}`;
      } catch (e) {
        if (copyHint) copyHint.textContent = "คัดลอกไม่สำเร็จ (แนะนำเปิดผ่าน HTTPS / GitHub Pages)";
      }
    }

    const phoneText = $("#phoneText")?.textContent?.trim() || "";
    const emailText = $("#emailText")?.textContent?.trim() || "";
    const lineText = $("#lineText")?.textContent?.trim() || "";

    $("#copyPhoneBtn")?.addEventListener("click", () => copyText(phoneText, phoneText));
    $("#copyEmailBtn")?.addEventListener("click", () => copyText(emailText, emailText));
    $("#copyLineBtn")?.addEventListener("click", () => copyText(lineText, lineText));
  }

  // ---------- Modal (Preview) ----------
  const modalState = { modal: null, frame: null, titleEl: null, openNew: null };

  function bindModal() {
    modalState.modal = $("#certModal");
    modalState.frame = $("#certFrame");
    modalState.titleEl = $("#certModalTitle");
    modalState.openNew = $("#certOpenNew");
  }

  function openModal(src, title) {
    const { modal, frame, titleEl, openNew } = modalState;
    if (!modal || !frame || !openNew) return;
    if (titleEl) titleEl.textContent = title || "Preview";
    frame.src = src || "";
    openNew.href = src || "#";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    const { modal, frame } = modalState;
    if (!modal || !frame) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    frame.src = "";
    document.body.classList.remove("no-scroll");
  }

  function initModal() {
    bindModal();
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cert]");
      if (btn) {
        openModal(btn.getAttribute("data-cert"), btn.getAttribute("data-cert-title"));
        return;
      }
      if (e.target.closest('[data-close="1"]')) closeModal();
    });
  }

  // ---------- Mobile drawer ----------
  const drawerState = { drawer: null, navBtn: null };

  function bindDrawer() {
    drawerState.drawer = $("#drawer");
    drawerState.navBtn = $("#navBtn");
  }

  function openDrawer() {
    const { drawer, navBtn } = drawerState;
    if (!drawer) return;
    drawer.classList.add("show");
    drawer.setAttribute("aria-hidden", "false");
    navBtn?.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }

  function closeDrawer() {
    const { drawer, navBtn } = drawerState;
    if (!drawer) return;
    drawer.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
    navBtn?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  function initDrawer() {
    bindDrawer();
    drawerState.navBtn?.addEventListener("click", () => {
      if (drawerState.drawer?.classList.contains("show")) closeDrawer();
      else openDrawer();
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest('[data-drawer-close="1"]')) closeDrawer();
      if (e.target.closest('[data-drawer-link="1"]')) closeDrawer();
    });
  }

  // ---------- Reveal (IntersectionObserver) ----------
  let revealObserver = null;

  function initReveal() {
    const revealEls = $$(".section, .dev-card, .card, .chips, .grid-3");
    revealEls.forEach((el) => el.classList.add("reveal"));

    if (revealObserver) revealObserver.disconnect();

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "40px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    const skillPanel = $(".skill-panel");
    if (skillPanel) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              skillPanel.classList.add("show-bars");
              obs.unobserve(skillPanel);
            }
          });
        },
        { threshold: 0.2 }
      );
      obs.observe(skillPanel);
    }
  }

  function forceShowAll() {
    $$(".reveal").forEach((el) => el.classList.add("show"));
  }

  function resetScrollLocks() {
    document.body.classList.remove("no-scroll");
    closeDrawer();
    closeModal();
  }

  function initAll() {
    initYear();
    initTheme();
    initCopy();
    initModal();
    initDrawer();
    initReveal();
  }

  // init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll, { once: true });
  } else {
    initAll();
  }

  // BFCache fix (iOS Safari Back/Forward)
  window.addEventListener("pageshow", (e) => {
    resetScrollLocks();
    // iOS Safari บางครั้งไม่ set persisted แต่ยังเป็น BFCache
    initReveal();
    setTimeout(forceShowAll, 80);
  });

  window.addEventListener("pagehide", () => resetScrollLocks());

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      closeModal();
    }
  });
})();
