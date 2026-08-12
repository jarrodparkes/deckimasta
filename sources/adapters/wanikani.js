/**
 * WaniKani data source adapter.
 * Maps assignments + vocabulary subjects into the shared KaniKai Word shape.
 *
 * Auth: reads the API token from localStorage (wk_conversation_token).
 * Callers may also pass { token } in load options for one-off use.
 */
(function (global) {
  "use strict";

  const KaniKai = global.KaniKai;
  if (!KaniKai || typeof KaniKai.registerSource !== "function") {
    throw new Error(
      "KaniKai source registry must be loaded before the WaniKani adapter.",
    );
  }

  const API_BASE = "https://api.wanikani.com/v2";
  const TOKEN_KEY = "wk_conversation_token";
  const REVISION = "20170710";

  function sourceError(message, code, cause) {
    const error = new Error(message);
    error.code = code;
    if (cause) error.cause = cause;
    return error;
  }

  function getStoredToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || "";
    } catch {
      return "";
    }
  }

  function resolveToken(options = {}) {
    const fromOptions =
      options.token != null ? String(options.token).trim() : "";
    return fromOptions || getStoredToken();
  }

  async function apiGet(path, token) {
    const response = await fetch(API_BASE + path, {
      headers: {
        Authorization: "Bearer " + token,
        "Wanikani-Revision": REVISION,
      },
    });

    if (!response.ok) {
      let detail = "";
      try {
        const data = await response.json();
        detail = data.error || data.message || "";
      } catch {}
      if (response.status === 401) {
        throw sourceError("WaniKani API token was rejected.", "AUTH_REJECTED");
      }
      throw sourceError(
        detail || "WaniKani API error (" + response.status + ").",
        "API_ERROR",
      );
    }

    return response.json();
  }

  async function getAllPages(path, token) {
    const results = [];
    let url = path;

    while (url) {
      const data = await apiGet(url, token);
      results.push(...data.data);
      url = data.pages?.next
        ? new URL(data.pages.next).pathname + new URL(data.pages.next).search
        : null;
    }

    return results;
  }

  /**
   * Best-effort "last studied / touched" timestamp for an assignment.
   * Prefers the latest of resource update + progress milestones.
   */
  function assignmentLastSeenAt(assignment) {
    const d = assignment.data || {};
    const candidates = [
      assignment.data_updated_at,
      d.burned_at,
      d.passed_at,
      d.resurrected_at,
      d.started_at,
    ];

    let latest = null;
    let latestMs = -Infinity;
    for (const value of candidates) {
      if (!value) continue;
      const ms = new Date(value).getTime();
      if (!Number.isFinite(ms)) continue;
      if (ms >= latestMs) {
        latestMs = ms;
        latest = value;
      }
    }
    return latest;
  }

  function readingsAsAlternatives(subjectData) {
    const readings = subjectData.readings || [];
    const primary = readings.find((r) => r.primary)?.reading;
    const rest = readings
      .map((r) => r.reading)
      .filter((reading) => reading && reading !== primary);
    return [primary, ...rest].filter(Boolean);
  }

  function meaningsFromSubject(subjectData) {
    return (subjectData.meanings || [])
      .map((m) => m.meaning)
      .filter(Boolean)
      .slice(0, 3);
  }

  function mapAssignmentToWord(assignment, subject) {
    const d = subject.data || {};
    const startedAt = assignment.data?.started_at || null;
    const lastSeenAt = assignmentLastSeenAt(assignment) || startedAt;

    return KaniKai.createWord({
      id: String(subject.id),
      word: d.characters || "",
      alternatives: readingsAsAlternatives(d),
      meanings: meaningsFromSubject(d),
      created_at: startedAt,
      last_seen_at: lastSeenAt,
      parts_of_speech: d.parts_of_speech || [],
    });
  }

  async function fetchSubjectsByIds(ids, token) {
    const subjects = [];
    for (let i = 0; i < ids.length; i += 100) {
      const batch = ids.slice(i, i + 100).join(",");
      const data = await apiGet(
        "/subjects?ids=" +
          encodeURIComponent(batch) +
          "&types=vocabulary&per_page=100",
        token,
      );
      subjects.push(...data.data);
    }
    return subjects;
  }

  /**
   * @param {object} [options]
   * @param {string} [options.token]
   * @param {string|Date|null} [options.since]  Prefetch hint; final look-back is applied by applyLoadOptions.
   * @returns {Promise<object[]>}
   */
  async function load(options = {}) {
    const token = resolveToken(options);
    if (!token) {
      throw sourceError("WaniKani API token required.", "AUTH_REQUIRED");
    }

    const loadOptions =
      typeof KaniKai.createLoadOptions === "function"
        ? KaniKai.createLoadOptions(options)
        : { since: options.since || null };

    // Assignments are authoritative for when the user started / last touched an item.
    // When `since` is set, updated_after prefetches recently touched rows (aligned with last_seen_at).
    let query =
      "/assignments?subject_types=vocabulary&started=true&per_page=100";
    if (loadOptions.since) {
      query += "&updated_after=" + encodeURIComponent(loadOptions.since);
    }

    const assignments = await getAllPages(query, token);
    if (!assignments.length) return [];

    const ids = [...new Set(assignments.map((a) => a.data.subject_id))];
    const subjects = await fetchSubjectsByIds(ids, token);
    const byId = new Map(subjects.map((s) => [s.id, s]));

    const words = [];
    for (const assignment of assignments) {
      const subject = byId.get(assignment.data.subject_id);
      if (!subject) continue;
      words.push(mapAssignmentToWord(assignment, subject));
    }

    return words;
  }

  function createUI(ctx) {
    const t = ctx.t;
    const setStatus = ctx.setStatus;

    const panel = document.createElement("div");
    panel.id = "tokenCard";
    panel.className = "token-panel";
    panel.innerHTML = `
      <div class="token-compact">
        <div>
          <strong data-i18n="connectTitle">Connect WaniKani</strong>
          <p class="help" data-i18n="tokenSavedCompact">Token saved on this device.</p>
        </div>
        <button id="expandToken" class="secondary" type="button" data-i18n="manageToken">Manage token</button>
      </div>
      <div class="token-body">
        <p class="help" style="margin-top:0" data-i18n="tokenHelp">Your API token is stored only in this browser. It is never included in this project file.</p>
        <label for="token" data-i18n="tokenLabel">WaniKani API token</label>
        <input id="token" type="password" autocomplete="off" data-i18n="tokenPlaceholder" data-i18n-attr="placeholder" placeholder="Paste your API token here">
        <div class="actions">
          <button id="saveToken" type="button" data-i18n="saveToken">Save token</button>
          <button id="clearToken" class="secondary" type="button" data-i18n="forgetToken">Forget token</button>
          <button id="collapseToken" class="secondary" type="button" hidden data-i18n="done">Done</button>
        </div>
        <details>
          <summary data-i18n="tokenFaqSummary">Where do I get my token?</summary>
          <p data-i18n="tokenFaqBody">In WaniKani, open your account settings and find the API Tokens section. Create a token with read access. This app only needs read access to your assignments and subjects.</p>
        </details>
      </div>
    `;

    const tokenInput = panel.querySelector("#token");
    const collapseToken = panel.querySelector("#collapseToken");

    function hasStoredToken() {
      return Boolean(getStoredToken());
    }

    function setTokenCollapsed(collapsed) {
      panel.classList.toggle("collapsed", collapsed);
      collapseToken.hidden = !hasStoredToken() || collapsed;
    }

    function getToken() {
      return tokenInput.value.trim() || getStoredToken();
    }

    function saveToken() {
      const token = tokenInput.value.trim();
      if (!token) {
        setStatus(t("pasteTokenFirst"), "error");
        return;
      }
      localStorage.setItem(TOKEN_KEY, token);
      tokenInput.value = "";
      setStatus(t("tokenSaved"), "success");
      setTokenCollapsed(true);
    }

    function clearToken() {
      localStorage.removeItem(TOKEN_KEY);
      tokenInput.value = "";
      setStatus(t("tokenForgotten"), "success");
      setTokenCollapsed(false);
    }

    panel.querySelector("#saveToken").addEventListener("click", saveToken);
    panel.querySelector("#clearToken").addEventListener("click", clearToken);
    panel
      .querySelector("#expandToken")
      .addEventListener("click", () => setTokenCollapsed(false));
    collapseToken.addEventListener("click", () => {
      if (hasStoredToken()) setTokenCollapsed(true);
    });

    return {
      panel,
      getLoadOptions() {
        return { token: getToken() };
      },
      prepareLoad() {
        if (getToken()) return true;
        setTokenCollapsed(false);
        setStatus(t("enterTokenFirst"), "error");
        return false;
      },
      messageForError(error) {
        if (error && error.code === "AUTH_REQUIRED")
          return t("enterTokenFirst");
        if (error && error.code === "AUTH_REJECTED") return t("tokenRejected");
        return null;
      },
      suppressStatus() {
        return panel.classList.contains("collapsed");
      },
      onActivate() {
        if (hasStoredToken()) setTokenCollapsed(true);
        else setTokenCollapsed(false);
      },
    };
  }

  KaniKai.registerSource({
    id: "wanikani",
    label: "WaniKani",
    labelKey: "sourceLabelWanikani",
    descriptionKey: "sourceDescWanikani",
    requiresAuth: true,
    supportsLookBack: true,
    tokenKey: TOKEN_KEY,
    getToken: getStoredToken,
    supportsLanguages({ native, target }) {
      return native === "en" && target === "ja";
    },
    createUI,
    load,
  });
})(window);
