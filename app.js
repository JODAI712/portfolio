const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const yearEl = document.getElementById("year");

const emailText = document.getElementById("emailText")?.textContent?.trim() || "";
const lineText  = document.getElementById("lineText")?.textContent?.trim() || "";
const phoneText  = document.getElementById("phoneText")?.textContent?.trim() || "";

const copyPhoneBtn = document.getElementById("copyPhoneBtn");
const copyEmailBtn = document.getElementById("copyEmailBtn");
const copyLineBtn = document.getElementById("copyLineBtn");
const copyHint = document.getElementById("copyHint");

// ปี footer
yearEl.textContent = new Date().getFullYear();

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
}

// โหลดธีมที่เคยเลือกไว้
const saved = localStorage.getItem("theme");
setTheme(saved ? saved : "light");

// สลับธีม
themeBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// คัดลอกข้อความ
async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    copyHint.textContent = `คัดลอกแล้ว: ${label}`;
  } catch (e) {
    copyHint.textContent = "คัดลอกไม่สำเร็จ (แนะนำเปิดผ่าน HTTPS / GitHub Pages)";
  }
}
copyPhoneBtn?.addEventListener("click", () => copyText(phoneText, phoneText));
copyEmailBtn?.addEventListener("click", () => copyText(emailText, emailText));
copyLineBtn?.addEventListener("click", () => copyText(lineText, lineText));

// ===== Scroll Reveal (IntersectionObserver) =====
const revealEls = document.querySelectorAll(".section, .dev-card, .card, .chips, .grid-3");

revealEls.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      io.unobserve(entry.target); // โผล่ครั้งเดียวพอ
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

const skillPanel = document.querySelector(".skill-panel");
if (skillPanel) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        skillPanel.classList.add("show-bars");
        obs.unobserve(skillPanel);
      }
    });
  }, { threshold: 0.2 });

  obs.observe(skillPanel);
}

// ===== Mobile Drawer =====
const navBtn = document.getElementById("navBtn");
const drawer = document.getElementById("drawer");

function openDrawer(){
  if(!drawer) return;
  drawer.classList.add("show");
  drawer.setAttribute("aria-hidden","false");
  navBtn?.setAttribute("aria-expanded","true");
  document.body.classList.add("no-scroll");
}

function closeDrawer(){
  if(!drawer) return;
  drawer.classList.remove("show");
  drawer.setAttribute("aria-hidden","true");
  navBtn?.setAttribute("aria-expanded","false");
  document.body.classList.remove("no-scroll");
}

navBtn?.addEventListener("click", () => {
  if(drawer?.classList.contains("show")) closeDrawer();
  else openDrawer();
});

document.addEventListener("click", (e) => {
  // ปิดเมื่อกด backdrop หรือปุ่มปิด
  if(e.target.closest('[data-drawer-close="1"]')) closeDrawer();

  // กดลิงก์แล้วปิดอัตโนมัติ
  if(e.target.closest('[data-drawer-link="1"]')) closeDrawer();
});

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && drawer?.classList.contains("show")) closeDrawer();
});