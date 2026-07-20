/* ==========================================================================
   ZL Travel Agency — cinematic interactions
   ========================================================================== */

/* ---- GoHighLevel (GHL) config ------------------------------------------- */
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/msuaI0zMYgN5H5jBXUbY/webhook-trigger/0eQ1fPEuQsmNdei6uNyb";
const GHL_BOOKING_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/msuaI0zMYgN5H5jBXUbY/webhook-trigger/rkeDNZpJwrQNQj0HpvtQ";
const LAST_LEAD_KEY = "lastLeadData";
const SCROLL_POPUP_KEY = "zl_scroll_popup_shown";
const BOOKING_TIMEZONE = "America/Chicago";
const BOOKING_TIMEZONE_LABEL = "US Central Time (CST/CDT)";
const BOOKING_CALENDAR_NAME = "zltravelconsultationbooking";
const BOOKING_TYPE = "30-minute-consultation";
const HOME_URL = "index.html";

const slugify = (val) => (val || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    special_ref: params.get("ref") || params.get("special_ref") || ""
  };
};

const postToGhl = async (payload) => {
  const res = await fetch(GHL_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Webhook request failed");
};

const postToBookingWebhook = async (payload) => {
  const res = await fetch(GHL_BOOKING_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Booking webhook request failed");
};

const saveLastLeadData = (payload) => {
  sessionStorage.setItem(LAST_LEAD_KEY, JSON.stringify(payload));
};

const getLastLeadData = () => {
  try {
    return JSON.parse(sessionStorage.getItem(LAST_LEAD_KEY) || "null");
  } catch {
    return null;
  }
};

const getBookingSource = (source) => {
  if (source === "contact-page-form") return "contact-page-booking";
  if (source === "homepage-form") return "homepage-booking";
  return "website-booking";
};

const pad2 = (n) => String(n).padStart(2, "0");

const PHONE_COUNTRIES = [
  { code: "+1", label: "US +1" },
  { code: "+1", label: "CA +1" },
  { code: "+44", label: "UK +44" },
  { code: "+52", label: "MX +52" },
  { code: "+61", label: "AU +61" },
  { code: "+91", label: "IN +91" },
  { code: "+49", label: "DE +49" },
  { code: "+33", label: "FR +33" },
  { code: "+39", label: "IT +39" },
  { code: "+81", label: "JP +81" }
];

const formatDateMMDDYYYY = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + "-" + digits.slice(2);
  return digits.slice(0, 2) + "-" + digits.slice(2, 4) + "-" + digits.slice(4);
};

const parseMMDDYYYY = (value, { allowPast = false } = {}) => {
  const m = (value || "").trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;
  const month = parseInt(m[1], 10);
  const day = parseInt(m[2], 10);
  const year = parseInt(m[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  if (!allowPast) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return null;
  }
  return { month: m[1], day: m[2], year: m[3] };
};

const attachDateMask = (input) => {
  if (!input || input.dataset.dateMask) return;
  input.dataset.dateMask = "1";
  if (!input.placeholder) input.placeholder = "MM-DD-YYYY";
  input.setAttribute("inputmode", "numeric");
  input.addEventListener("input", () => {
    input.value = formatDateMMDDYYYY(input.value);
  });
};

const initPhoneFields = () => {
  document.querySelectorAll('input[name="phone"]').forEach((input) => {
    if (input.closest(".field-phone")) return;
    const wrap = document.createElement("div");
    wrap.className = "field-phone";
    const select = document.createElement("select");
    select.name = "phone_country";
    select.className = "phone-country";
    select.setAttribute("aria-label", "Country code");
    PHONE_COUNTRIES.forEach((country, index) => {
      const opt = document.createElement("option");
      opt.value = country.code;
      opt.textContent = country.label;
      if (index === 0) opt.selected = true;
      select.appendChild(opt);
    });
    input.placeholder = input.placeholder || "(555) 123-4567";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(select);
    wrap.appendChild(input);
  });
};

const formatPhoneNumber = (countryCode, phone) => {
  const number = (phone || "").trim();
  if (!number) return "";
  return (countryCode || "+1") + " " + number;
};

const formatTimeLabel = (hour, minute = 0) => {
  const h12 = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return pad2(h12) + ":" + pad2(minute) + " " + ampm;
};

const buildBookingTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    slots.push({ hour, minute: 0, value: pad2(hour) + ":00", label: formatTimeLabel(hour, 0) });
  }
  return slots;
};

const buildBookingPayload = (leadData, dateValue, timeValue) => {
  const parsed = parseMMDDYYYY(dateValue);
  if (!parsed) throw new Error("Invalid date");
  const { month, day, year } = parsed;
  const [hour, minute] = timeValue.split(":").map(Number);
  const tags = [...new Set([...(leadData.tags || []), "appointment-request"])];
  return {
    ...leadData,
    tags,
    event_type: "appointment-booking",
    appointment_date: month + "-" + day + "-" + year,
    appointment_time: timeValue,
    appointment_time_label: formatTimeLabel(hour, minute),
    appointment_start: year + "-" + month + "-" + day + "T" + timeValue + ":00",
    timezone: BOOKING_TIMEZONE,
    timezone_label: BOOKING_TIMEZONE_LABEL,
    calendar_name: BOOKING_CALENDAR_NAME,
    booking_type: BOOKING_TYPE,
    booking_source: getBookingSource(leadData.source),
    submitted_at: new Date().toISOString(),
    page_url: window.location.href
  };
};

const showBookingSuccessPopup = () => {
  let popup = document.getElementById("bookingSuccessPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "bookingSuccessPopup";
    popup.className = "booking-success-popup";
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-labelledby", "bookingSuccessTitle");
    popup.innerHTML =
      '<div class="booking-success-popup__overlay" data-close-success></div>' +
      '<div class="booking-success-popup__panel">' +
        '<button type="button" class="booking-success-popup__close" data-close-success aria-label="Close"><i class="ti ti-x"></i></button>' +
        '<span class="k">You\'re all set</span>' +
        '<h3 id="bookingSuccessTitle">Appointment <span class="italic">booked!</span></h3>' +
        '<p>Thank you! We received your appointment request and will confirm by email shortly.</p>' +
        '<button type="button" class="btn btn--gold" data-close-success>Back to home <i class="ti ti-home"></i></button>' +
      '</div>';
    document.body.appendChild(popup);

    const goHome = () => {
      window.location.href = HOME_URL;
    };

    popup.querySelectorAll("[data-close-success]").forEach((el) => {
      el.addEventListener("click", goHome);
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && popup && !popup.hidden) goHome();
    });
  }

  popup.hidden = false;
  popup.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  popup.querySelector(".btn")?.focus();
};

const initBookingModal = () => {
  if (document.getElementById("bookingModal")) return null;

  const modal = document.createElement("div");
  modal.id = "bookingModal";
  modal.className = "booking-modal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-labelledby", "bookingModalTitle");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML =
    '<div class="booking-modal__overlay" data-close></div>' +
    '<div class="booking-modal__panel">' +
      '<button type="button" class="booking-modal__close" data-close aria-label="Close"><i class="ti ti-x"></i></button>' +
      '<div class="booking-modal__body">' +
        '<span class="eyebrow">Free consultation</span>' +
        '<h3 id="bookingModalTitle">Book your <span class="italic">appointment</span></h3>' +
        '<p class="booking-modal__sub">Choose a date and time (US Central). We\'ll confirm by email.</p>' +
        '<form id="bookingForm" novalidate>' +
          '<div class="form-msg"></div>' +
          '<div class="field"><label for="bookingDate">Date</label><input id="bookingDate" name="appointment_date" type="text" placeholder="MM-DD-YYYY" inputmode="numeric" required></div>' +
          '<div class="field"><label>Time (US Central)</label><div class="booking-times" id="bookingTimes"></div></div>' +
          '<button type="submit" class="btn btn--gold">Confirm appointment <i class="ti ti-calendar-check"></i></button>' +
        '</form>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  const bookingForm = modal.querySelector("#bookingForm");
  const bookingBody = modal.querySelector(".booking-modal__body");
  const bookingMsg = bookingForm.querySelector(".form-msg");
  const dateInput = modal.querySelector("#bookingDate");
  const timesWrap = modal.querySelector("#bookingTimes");
  attachDateMask(dateInput);
  const slots = buildBookingTimeSlots();
  let selectedTime = "";

  timesWrap.innerHTML = slots.map((slot) =>
    '<button type="button" class="booking-time" data-time="' + slot.value + '">' + slot.label + "</button>"
  ).join("");

  timesWrap.querySelectorAll(".booking-time").forEach((btn) => {
    btn.addEventListener("click", () => {
      timesWrap.querySelectorAll(".booking-time").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      selectedTime = btn.dataset.time;
    });
  });

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const resetModal = () => {
    bookingForm.reset();
    bookingMsg.className = "form-msg";
    bookingMsg.textContent = "";
    selectedTime = "";
    timesWrap.querySelectorAll(".booking-time").forEach((b) => b.classList.remove("sel"));
    bookingBody.hidden = false;
    bookingForm.querySelector("button[type=submit]").disabled = false;
  };

  const openModal = () => {
    const leadData = getLastLeadData();
    if (!leadData) {
      alert("Please submit the contact form first, then book your appointment.");
      return;
    }
    resetModal();
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    dateInput.focus();
  };

  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && !modal.hidden) closeModal();
  });

  bookingForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const leadData = getLastLeadData();
    if (!leadData) {
      bookingMsg.className = "form-msg err";
      bookingMsg.textContent = "Please submit the contact form first.";
      return;
    }
    if (!dateInput.value.trim()) {
      bookingMsg.className = "form-msg err";
      bookingMsg.textContent = "Please enter a date.";
      return;
    }
    if (!parseMMDDYYYY(dateInput.value.trim())) {
      bookingMsg.className = "form-msg err";
      bookingMsg.textContent = "Please enter a valid future date (MM-DD-YYYY).";
      return;
    }
    if (!selectedTime) {
      bookingMsg.className = "form-msg err";
      bookingMsg.textContent = "Please choose a time slot.";
      return;
    }
    const btn = bookingForm.querySelector("button[type=submit]");
    btn.disabled = true;
    const label = btn.innerHTML;
    btn.innerHTML = "Booking…";
    try {
      await postToBookingWebhook(buildBookingPayload(leadData, dateInput.value, selectedTime));
      closeModal();
      resetModal();
      showBookingSuccessPopup();
    } catch (e) {
      bookingMsg.className = "form-msg err";
      bookingMsg.textContent = "Something went wrong. Please call (515) 918-1919 or email Sales@ZLTravelAgency.com.";
      btn.disabled = false;
      btn.innerHTML = label;
    }
  });

  return { openModal };
};

const isHomePage = () => {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, "") || "/";
  return path === "/" || path === "/index.html" || path === "/home" || path === "/home/index.html";
};

document.addEventListener("DOMContentLoaded", () => {
  initPhoneFields();
  document.querySelectorAll('[name="travel_dates"]').forEach(attachDateMask);

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
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
  document.querySelectorAll("[data-animate], .reveal-img").forEach(el => io.observe(el));
  // Ensure reveal overlays don't stay stuck covering images
  setTimeout(() => {
    document.querySelectorAll(".reveal-img:not(.in)").forEach(el => el.classList.add("in"));
  }, 2500);

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
  const bookingModal = form ? initBookingModal() : null;
  if (form){
    const msg = form.querySelector(".form-msg");
    const showError = (text) => {
      msg.className = "form-msg err";
      msg.textContent = text;
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    const getFormMeta = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes("contact")) {
        return { source: "contact-page-form", tags: ["lead-captured", "contact-form"], lead_source: "Website Contact Form" };
      }
      return { source: "homepage-form", tags: ["lead-captured", "homepage-form"], lead_source: "Website Contact Form" };
    };
    const buildPayload = (data) => {
      const utm = getUtmParams();
      const { source, tags, lead_source } = getFormMeta();
      let message = (data.message || "").trim();
      const extras = [];
      if (data.travelers) extras.push("Travelers: " + data.travelers);
      if (data.budget) extras.push("Budget: " + data.budget);
      if (extras.length) message = message ? message + "\n\n" + extras.join("\n") : extras.join("\n");
      return {
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        phone: formatPhoneNumber(data.phone_country, data.phone),
        destination: data.destination || "",
        travel_dates: data.travel_dates ? formatDateMMDDYYYY(data.travel_dates) : "",
        tripType: slugify(data.destination),
        message,
        source,
        lead_source,
        special_ref: utm.special_ref,
        tags,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        submitted_at: new Date().toISOString(),
        page_url: window.location.href
      };
    };
    const showSuccess = (firstName) => {
      form.querySelectorAll(".field, button[type=submit], .form-note").forEach((el) => {
        el.style.display = "none";
      });
      msg.className = "form-msg ok form-success";
      msg.innerHTML =
        "<strong>Thank you" + (firstName ? ", " + firstName : "") + "!</strong>" +
        "<p>We received your request and will be in touch within one business day.</p>" +
        '<button type="button" class="btn btn--gold form-book-btn">Book Appointment <i class="ti ti-calendar"></i></button>';
      msg.querySelector(".form-book-btn")?.addEventListener("click", () => {
        bookingModal?.openModal();
      });
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.first_name?.trim() || !data.email?.trim() || !data.phone?.trim()) {
        showError("Please fill in your first name, email, and phone.");
        return;
      }
      btn.disabled = true;
      const label = btn.innerHTML;
      btn.innerHTML = "Sending…";
      try {
        const payload = buildPayload(data);
        await postToGhl(payload);
        saveLastLeadData(payload);
        showSuccess(data.first_name.trim());
      } catch (e) {
        showError("Something went wrong. Please call (515) 918-1919 or email Sales@ZLTravelAgency.com.");
        btn.disabled = false;
        btn.innerHTML = label;
      }
    });
  }

  /* ---- Home scroll popup -> GHL -------------------------------------------- */
  const scrollPopup = document.getElementById("scrollPopup");
  if (scrollPopup && isHomePage()){
    const popupForm = document.getElementById("scrollPopupForm");
    const popupBody = scrollPopup.querySelector(".scroll-popup__body");
    const popupThanks = scrollPopup.querySelector(".scroll-popup__thanks");
    const popupMsg = popupForm?.querySelector(".form-msg");
    let popupOpen = false;

    const openPopup = () => {
      if (popupOpen || sessionStorage.getItem(SCROLL_POPUP_KEY)) return;
      popupOpen = true;
      sessionStorage.setItem(SCROLL_POPUP_KEY, "1");
      scrollPopup.hidden = false;
      scrollPopup.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      scrollPopup.querySelector("#spf-fn")?.focus();
    };

    const closePopup = () => {
      scrollPopup.hidden = true;
      scrollPopup.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      popupOpen = false;
    };

    const checkScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      if (window.scrollY / maxScroll >= 0.6) {
        openPopup();
        window.removeEventListener("scroll", checkScroll);
      }
    };

    if (!sessionStorage.getItem(SCROLL_POPUP_KEY)) {
      window.addEventListener("scroll", checkScroll, { passive: true });
      checkScroll();
    }

    scrollPopup.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", closePopup);
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && !scrollPopup.hidden) closePopup();
    });

    if (popupForm){
      popupForm.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const btn = popupForm.querySelector("button[type=submit]");
        const data = Object.fromEntries(new FormData(popupForm).entries());
        if (!data.first_name?.trim() || !data.email?.trim()) {
          popupMsg.className = "form-msg err";
          popupMsg.textContent = "Please fill in your first name and email.";
          return;
        }
        btn.disabled = true;
        const label = btn.innerHTML;
        btn.innerHTML = "Sending…";
        const utm = getUtmParams();
        const payload = {
          firstName: data.first_name.trim(),
          lastName: (data.last_name || "").trim(),
          email: data.email.trim(),
          phone: "",
          destination: data.destination || "",
          source: "home-scroll-popup",
          lead_source: "Website Home Scroll Popup",
          tags: ["lead-captured", "home-scroll-popup"],
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          submitted_at: new Date().toISOString(),
          page_url: window.location.href
        };
        try {
          await postToGhl(payload);
          popupBody.hidden = true;
          popupThanks.hidden = false;
          setTimeout(closePopup, 2200);
        } catch (e) {
          popupMsg.className = "form-msg err";
          popupMsg.textContent = "Something went wrong. Please try again or call (515) 918-1919.";
          btn.disabled = false;
          btn.innerHTML = label;
        }
      });
    }
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
