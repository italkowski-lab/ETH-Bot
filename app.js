/* ===== Ethernaly · ETH Agent — interactions ===== */
(function () {
  "use strict";

  /* ---- sticky header ---- */
  var header = document.querySelector("header");
  function onScroll() {
    if (window.scrollY > 12) header.classList.add("solid");
    else header.classList.remove("solid");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- reveal on scroll ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- chat demo ---- */
  var phone = document.getElementById("phone");
  var body = document.getElementById("chatBody");
  var whoEl = document.getElementById("chatWho");
  var switchEl = document.getElementById("channelSwitch");
  if (!phone || !body) return;

  // Scenarios — each rotates to showcase versatility across rubros.
  var scenarios = [
    {
      who: "Clínica San Andrés",
      turns: [
        { from: "user", text: "Hola, ¿atienden los sábados?" },
        { from: "bot",  text: "¡Hola! Sí 😊 Atendemos sábados de 9 a 13 h. ¿Querés que te agende un turno?" },
        { from: "user", text: "Sí, con la Dra. Ferreyra" },
        { from: "bot",  text: "Tengo disponible el sábado 14 a las 10:30 h. ¿Te lo reservo?" }
      ]
    },
    {
      who: "Club Atlético del Sur",
      turns: [
        { from: "user", text: "¿Cuánto sale la cuota de socio?" },
        { from: "bot",  text: "La cuota mensual es de $9.500 e incluye pileta y gimnasio. ¿Te paso cómo asociarte?" },
        { from: "user", text: "Dale" },
        { from: "bot",  text: "Genial. Podés asociarte online en 3 minutos desde este link 👉 socios.clubsur.com 💳" }
      ]
    },
    {
      who: "TecnoServ · Soporte",
      turns: [
        { from: "user", text: "No me funciona el pedido #4821" },
        { from: "bot",  text: "Lo veo: tu pedido salió hoy y llega mañana entre 9 y 13 h 📦 ¿Necesitás algo más?" },
        { from: "user", text: "Quiero hablar con una persona" },
        { from: "bot",  text: "Por supuesto, te derivo con un asesor del equipo ahora mismo. Un momento 🙌" }
      ]
    }
  ];

  var sIdx = 0;
  var timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function wait(ms) { return new Promise(function (r) { timers.push(setTimeout(r, ms)); }); }

  function now() {
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes();
    return (h % 12 || 12) + ":" + (m < 10 ? "0" + m : m) + " " + (h < 12 ? "a.m." : "p.m.");
  }

  function addMsg(turn) {
    var el = document.createElement("div");
    el.className = "msg " + turn.from;
    el.textContent = turn.text;
    var t = document.createElement("span");
    t.className = "tt";
    t.textContent = now();
    el.appendChild(t);
    body.appendChild(el);
    trim();
  }

  function addTyping() {
    var el = document.createElement("div");
    el.className = "typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    el.dataset.typing = "1";
    body.appendChild(el);
    return el;
  }

  function trim() {
    // keep the panel from overflowing — drop oldest when too many
    while (body.children.length > 7) body.removeChild(body.firstChild);
  }

  var running = true;

  async function playScenario(sc) {
    body.innerHTML = "";
    whoEl.textContent = sc.who;
    await wait(500);
    for (var i = 0; i < sc.turns.length; i++) {
      if (!running) return;
      var turn = sc.turns[i];
      if (turn.from === "bot") {
        var typ = addTyping();
        await wait(950 + Math.random() * 500);
        if (!running) return;
        if (typ.parentNode) typ.parentNode.removeChild(typ);
      } else {
        await wait(700);
      }
      if (!running) return;
      addMsg(turn);
      await wait(turn.from === "bot" ? 1500 : 650);
    }
    await wait(2600);
  }

  async function loop() {
    while (running) {
      await playScenario(scenarios[sIdx]);
      if (!running) return;
      sIdx = (sIdx + 1) % scenarios.length;
    }
  }

  function restart() {
    running = false;
    clearTimers();
    setTimeout(function () { running = true; loop(); }, 60);
  }

  // pause when offscreen to save cycles
  var demoObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !running) { running = true; loop(); }
      else if (!e.isIntersecting) { running = false; clearTimers(); }
    });
  }, { threshold: 0.05 });
  demoObserver.observe(phone);

  loop();

  /* ---- channel switch ---- */
  if (switchEl) {
    var pill = switchEl.querySelector(".pill");
    var btns = switchEl.querySelectorAll("button");
    function setPill(btn) {
      pill.style.width = btn.offsetWidth + "px";
      pill.style.transform = "translateX(" + (btn.offsetLeft - 5) + "px)";
    }
    function selectChannel(ch, btn) {
      switchEl.dataset.ch = ch;
      phone.dataset.ch = ch;
      btns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      setPill(btn);
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { selectChannel(b.dataset.ch, b); });
    });
    // init
    var first = switchEl.querySelector("button.active") || btns[0];
    requestAnimationFrame(function () { setPill(first); });
    window.addEventListener("resize", function () {
      var cur = switchEl.querySelector("button.active");
      if (cur) setPill(cur);
    });
  }

  /* ---- demo form → email to Ethernaly ---- */
  // ┌─────────────────────────────────────────────────────────────────┐
  // │  ENVÍO AUTOMÁTICO: pegá acá tu Form ID de Formspree.             │
  // │  1) Entrá a https://formspree.io y creá un form (gratis).        │
  // │  2) Te da una URL como https://formspree.io/f/abcdwxyz           │
  // │  3) Copiá SOLO el id final ("abcdwxyz") entre las comillas:      │
  // └─────────────────────────────────────────────────────────────────┘
  var FORMSPREE_ID = "xpqeqzqd"; // ← ej: "abcdwxyz"  (vacío = abre el correo del visitante)
  var RECIPIENTS = ["ivant@ethernaly.com", "marianob@ethernaly.com", "diegom@ethernaly.com"];

  var form = document.getElementById("demoForm");
  if (form) {
    var btn = document.getElementById("submitBtn");
    var errEl = document.getElementById("formError");
    var okEl = document.getElementById("formSuccess");

    function fieldVal(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }
    function showSuccess() {
      form.style.display = "none";
      if (okEl) okEl.classList.add("show");
    }
    function showError(msg) {
      if (errEl) { errEl.textContent = msg; errEl.classList.add("show"); }
      if (btn) { btn.disabled = false; btn.textContent = "Solicitá una demo"; }
    }

    // Fallback sin servidor: abre el correo del visitante con los 3 destinatarios.
    function sendViaMailto() {
      var org = fieldVal("f-org") || "una organización";
      var subject = "Nueva solicitud de demo de ETH Agent — " + org;
      var body = [
        "Nueva solicitud de demo de ETH Agent desde la web:", "",
        "Nombre: " + (fieldVal("f-nombre") || "—"),
        "Organización: " + (fieldVal("f-org") || "—"),
        "Email: " + (fieldVal("f-email") || "—"),
        "WhatsApp: " + (fieldVal("f-wa") || "—"),
        "Rubro: " + (fieldVal("f-rubro") || "—"),
        "", "Mensaje:", fieldVal("f-msg") || "—"
      ].join("\n");
      window.location.href = "mailto:" + RECIPIENTS.join(",") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      showSuccess();
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (errEl) errEl.classList.remove("show");

      if (!FORMSPREE_ID) { sendViaMailto(); return; }

      // Envío automático vía Formspree (el mail se manda solo).
      if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }
      var data = new FormData(form);
      data.append("_subject", "Nueva solicitud de demo de ETH Agent — " + (fieldVal("f-org") || "web"));

      fetch("https://formspree.io/f/" + FORMSPREE_ID, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      }).then(function (res) {
        if (res.ok) { showSuccess(); }
        else {
          res.json().then(function (d) {
            var m = (d && d.errors && d.errors[0] && d.errors[0].message) ||
              "No pudimos enviar el formulario. Probá de nuevo o escribinos por WhatsApp.";
            showError(m);
          }).catch(function () {
            showError("No pudimos enviar el formulario. Probá de nuevo o escribinos por WhatsApp.");
          });
        }
      }).catch(function () {
        showError("No pudimos enviar el formulario. Revisá tu conexión o escribinos por WhatsApp.");
      });
    });
  }
})();
