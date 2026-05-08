/* ============================================================
 * scm-deploy-pill — vanilla helper
 * ------------------------------------------------------------
 * Usage:
 *   const dp = SCM.deployPill.mount(el, {
 *     state: 'deployed',     // 'deployed' | 'undeployed' | 'partial'
 *     label: '전개중',
 *   });
 *   dp.setState('undeployed', '미전개');
 * ============================================================ */

(function (root) {
  var STATES = ['deployed', 'undeployed', 'partial'];
  var DEFAULT_LABEL = { deployed: '전개중', undeployed: '미전개', partial: '일부 전개' };

  function mount(el, opts) {
    if (!el) return null;
    var options = opts || {};
    el.classList.add('scm-deploy-pill');

    function clearStateCls() {
      STATES.forEach(function (s) { el.classList.remove('scm-deploy-pill--' + s); });
    }

    function setState(state, label) {
      clearStateCls();
      if (state && STATES.indexOf(state) !== -1) el.classList.add('scm-deploy-pill--' + state);
      var labelEl = el.querySelector('.scm-deploy-pill__pill');
      if (labelEl) {
        var dot = labelEl.querySelector('.scm-deploy-pill__dot');
        var text = label != null ? label : DEFAULT_LABEL[state] || '';
        labelEl.innerHTML = '';
        if (dot) labelEl.appendChild(dot);
        else {
          var d = document.createElement('span');
          d.className = 'scm-deploy-pill__dot';
          labelEl.appendChild(d);
        }
        labelEl.appendChild(document.createTextNode(text));
      }
    }

    if (options.state) setState(options.state, options.label);

    return { el: el, setState: setState };
  }

  root.SCM = root.SCM || {};
  root.SCM.deployPill = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
