/* ==========================================================================
   ZL Travel Agency — cinematic interactions
   ========================================================================== */

/* ---- GoHighLevel (GHL) config -------------------------------------------
   OPTION A (recommended): paste your GHL Inbound Webhook URL below.
   OPTION B: replace the <form id="leadForm"> with a GHL embed iframe.
------------------------------------------------------------------------- */
const GHL_WEBHOOK_URL = ""; // <-- paste your GHL inbound webhook URL here

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const toTop  = document.querySelector(".totop");
  const hero   = document.querySelector(".hero");

  /* Hero intro */
  if (hero) requestAnimationFrame(() => hero.classList.add("ready"));

  /* Sticky header + back-to-top */
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    if (toTop) toTop.classList.toggle("show", y > 700);
    parallax(y);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Parallax elements */
  const pxEls = [...document.querySelectorAll("[data-px]")];
  function parallax(y){
    pxEls.forEach(el => {
      const speed = parseFloat(el.dataset.px) || 0.15;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height/2) - window.innerHeight/2;
      el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
    });
  }

  /* Mobile nav */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle){
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));

  /* Scroll reveal */
  const io = new IntersectionObserver((e) => {
    e.forEach(x => { if (x.isIntersecting){ x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { threshold: 0.16 });
  document.querySelectorAll("[data-animate], .reveal-img").forEach(el => io.observe(el));

  /* Count-up */
  const cio = new IntersectionObserver((e) => {
    e.forEach(x => {
      if (!x.isIntersecting) return;
      const el = x.target, target = parseFloat(el.dataset.count), suf = el.dataset.suffix || "";
      let c = 0, step = target / 55;
      const t = () => { c += step; if (c >= target){ el.textContent = target + suf; } else { el.textContent = Math.round(c) + suf; requestAnimationFrame(t); } };
      t(); cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));

  /* Testimonial slider */
  const slides = document.querySelectorAll(".tst__slide");
  const dots = document.querySelectorAll(".tst__dots button");
  if (slides.length){
    let i = 0, timer;
    const go = (n) => { slides[i].classList.remove("active"); dots[i]?.classList.remove("active");
      i = (n + slides.length) % slides.length; slides[i].classList.add("active"); dots[i]?.classList.add("active"); };
    dots.forEach((d, n) => d.addEventListener("click", () => { go(n); reset(); }));
    const reset = () => { clearInterval(timer); timer = setInterval(() => go(i+1), 6500); };
    reset();
  }

  /* ---- Trip Finder quiz -------------------------------------------------- */
  const quiz = document.getElementById("quiz");
  if (quiz){
    const steps = [...quiz.querySelectorAll(".quiz-step")];
    const bar = quiz.querySelector(".quiz-progress i");
    const backs = quiz.querySelectorAll(".quiz-back");
    const answers = {};
    let s = 0;
    const total = steps.length;
    const show = (n) => {
      steps[s].classList.remove("active"); s = n; steps[s].classList.add("active");
      bar.style.width = ((s+1)/total*100) + "%";
    };
    quiz.querySelectorAll(".quiz-opt").forEach(opt => {
      opt.addEventListener("click", () => {
        const step = opt.closest(".quiz-step");
        step.querySelectorAll(".quiz-opt").forEach(o => o.classList.remove("sel"));
        opt.classList.add("sel");
        answers[step.dataset.key] = opt.dataset.val;
        setTimeout(() => { if (s < total-1) show(s+1); if (s === total-1) buildResult(); }, 260);
      });
    });
    backs.forEach(b => b.addEventListener("click", () => { if (s>0) show(s-1); }));

    function buildResult(){
      const map = {
        beach:{t:"An All-Inclusive Beach Escape", d:"Sun, sand, and zero logistics — a resort where everything's covered so everyone just relaxes."},
        cruise:{t:"A Tailored Family Cruise", d:"One floating resort, many destinations, and something fun for every age at each stop."},
        culture:{t:"A European Adventure", d:"Castles, coastlines and cities — curated so you experience Europe without the overwhelm."},
        adventure:{t:"A Caribbean Discovery", d:"Turquoise water, island exploring and unforgettable moments, planned end to end."}
      };
      const pick = map[answers.vibe] || map.beach;
      const rt = quiz.querySelector(".quiz-result");
      rt.querySelector("h3").textContent = pick.t;
      rt.querySelector("p").textContent = pick.d;
      const hidden = document.querySelector("#leadForm [name=destination]");
      const cta = rt.querySelector("a");
      cta.addEventListener("click", () => {
        const dest = document.querySelector("#leadForm [name=destination]");
        if (dest && answers.vibe){
          const m = {beach:"All-inclusive resort",cruise:"Cruise",culture:"Europe",adventure:"Caribbean / Mexico"};
          [...dest.options].forEach(o => { if (o.value === m[answers.vibe]) dest.value = o.value; });
        }
        const who = document.querySelector("#leadForm [name=travelers]");
        if (who && answers.who) who.value = answers.who;
      });
    }
  }

  /* ---- Lead form -> GHL -------------------------------------------------- */
  const form = document.getElementById("leadForm");
  if (form){
    const msg = form.querySelector(".form-msg");
    const show = (type, text) => { msg.className = "form-msg " + type; msg.textContent = text; msg.scrollIntoView({behavior:"smooth",block:"center"}); };
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const data = Object.fromEntries(new FormData(form).entries());
      data.source = "Website"; data.page = location.href;
      if (!GHL_WEBHOOK_URL){
        show("ok", "Thanks " + (data.first_name || "") + "! Your request was captured. (Connect the GHL webhook to route this live.)");
        form.reset(); return;
      }
      btn.disabled = true; const label = btn.textContent; btn.textContent = "Sending…";
      try{
        await fetch(GHL_WEBHOOK_URL, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
        show("ok", "Thank you! We received your request and will be in touch within one business day.");
        form.reset();
      }catch(e){
        show("err", "Something went wrong. Please call (515) 918-1919 or email Sales@ZLTravelAgency.com.");
      }finally{ btn.disabled = false; btn.textContent = label; }
    });
  }

  /* FAQ accordion */
  document.querySelectorAll(".faq__item").forEach(item => {
    const q = item.querySelector(".faq__q");
    const a = item.querySelector(".faq__a");
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq__item.open").forEach(o => {
        o.classList.remove("open"); o.querySelector(".faq__a").style.maxHeight = null;
      });
      if (!open){ item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
});
