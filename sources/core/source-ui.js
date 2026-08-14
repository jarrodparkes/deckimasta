/**
 * Host helpers for adapter-provided UI.
 *
 * Optional WordSource.createUI(ctx) may return:
 *   {
 *     setup?: HTMLElement,          // rendered above the shared load card
 *     panel?: HTMLElement,          // rendered inside the load card
 *     getLoadOptions?: () => object,
 *     prepareLoad?: () => boolean,  // return false to abort load
 *     messageForError?: (error) => string|null,
 *     suppressStatus?: () => boolean,
 *     applyTranslations?: () => void,
 *     onActivate?: () => void,
 *     onDeactivate?: () => void,
 *     destroy?: () => void
 *   }
 *
 * ctx: { t, setStatus }
 */
(function (global) {
  "use strict";

  const DeckiMasta = (global.DeckiMasta = global.DeckiMasta || {});

  /**
   * @param {{ setupHost: HTMLElement, panelHost: HTMLElement }} hosts
   */
  function createSourceUIHost(hosts) {
    const setupHost = hosts.setupHost;
    const panelHost = hosts.panelHost;
    let active = null;

    function clear(node) {
      while (node.firstChild) node.removeChild(node.firstChild);
    }

    function deactivate() {
      if (!active) return;
      if (typeof active.onDeactivate === "function") active.onDeactivate();
      if (typeof active.destroy === "function") active.destroy();
      clear(setupHost);
      clear(panelHost);
      active = null;
    }

    /**
     * @param {object|null} source
     * @param {object} ctx
     * @returns {object|null}
     */
    function activate(source, ctx) {
      deactivate();
      if (!source || typeof source.createUI !== "function") return null;

      const ui = source.createUI(ctx) || {};
      active = ui;

      if (ui.setup) setupHost.appendChild(ui.setup);
      if (ui.panel) {
        ui.panel.classList.add("source-panel");
        panelHost.appendChild(ui.panel);
      }
      if (typeof ui.onActivate === "function") ui.onActivate();
      return active;
    }

    function getActive() {
      return active;
    }

    return {
      activate,
      deactivate,
      getActive
    };
  }

  DeckiMasta.createSourceUIHost = createSourceUIHost;
})(window);
