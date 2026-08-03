/**
 * ZL Travel Specials loader
 * Public page reads /specials/data.json (plus optional localStorage preview for admins).
 */
(function (global) {
  const STORAGE_KEY = "zl_specials_data";
  const PREVIEW_FLAG = "zl_specials_preview";

  function normalize(payload) {
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.specials)
        ? payload.specials
        : [];
    return list
      .filter((item) => item && item.active !== false)
      .map((item) => ({
        id: item.id || item.slug || "",
        slug: item.slug || item.id || "",
        title: item.title || "Travel Special",
        description: item.description || "",
        image_url: item.image_url || item.image || "",
        tag: item.tag || "Limited-Time Offer",
        expires: item.expires || item.expires_at || "",
        active: item.active !== false,
        created_at: item.created_at || "",
      }))
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }

  async function fetchDataJson() {
    const res = await fetch("/specials/data.json?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load specials");
    return res.json();
  }

  function readPreview() {
    try {
      if (sessionStorage.getItem(PREVIEW_FLAG) !== "1") return null;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  async function loadSpecials() {
    const preview = readPreview();
    if (preview) return normalize(preview);
    const data = await fetchDataJson();
    return normalize(data);
  }

  function subscribeSpecials(callback) {
    loadSpecials()
      .then((list) => callback(list))
      .catch(() => callback([]));
  }

  global.ZLSpecials = {
    STORAGE_KEY,
    PREVIEW_FLAG,
    normalize,
    loadSpecials,
    subscribeSpecials,
    fetchDataJson,
  };
})(window);
