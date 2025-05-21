// === WBD GSAP FX Library ===
gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

// === WBD GSAP FX Config ===
const wbdFXPresets = {
  "fade-in": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "scale-up": {
    from: { scale: 0.6 },
    to: { scale: 1 },
  },
  "scale-down": {
    from: { scale: 1.4 },
    to: { scale: 1 },
  },
  "slide-in-left": {
    from: { x: -10 },
    to: { x: 0 },
  },
  "slide-in-right": {
    from: { x: 10 },
    to: { x: 0 },
  },
  "slide-in-up": {
    from: { y: 10 },
    to: { y: 0 },
  },
  "slide-in-down": {
    from: { y: -10 },
    to: { y: 0 },
  },
  rotate: {
    from: { rotation: -90, opacity: 0 },
    to: { rotation: 0, opacity: 1 },
  },
  "blur-in": {
    from: { opacity: 0, filter: "blur(8px)" },
    to: { opacity: 1, filter: "blur(0px)" },
  },
};

// === Mobile detection helper ===
function isMobile() {
  return window.innerWidth <= 768;
}

// === Reusable style rule check ===
function shouldRunStyle(el) {
  const styleStr = el.dataset.style || "";
  return !(isMobile() && styleStr.includes("mobile:off"));
}

// === Animate Element or SplitText ===
function animateWBDGSAP(el) {
  if (!shouldRunStyle(el)) return;

  let targets = el;

  // === Handle SplitText ===
  const classSplit = el.classList.contains("wbd-split-chars")
    ? "chars"
    : el.classList.contains("wbd-split-words")
    ? "words"
    : el.classList.contains("wbd-split-lines")
    ? "lines"
    : null;

  const splitType = el.dataset.split || classSplit;

  if (splitType && ["chars", "words", "lines"].includes(splitType)) {
    if (!el.querySelector(".char, .word, .line")) {
      const split = new SplitText(el, {
        type: splitType,
        preserveWhitespace: true,
      });

      targets = split[splitType];

      // Clean up protected nested elements
      el.querySelectorAll(".wbd-no-split .char, .wbd-no-split .word").forEach(
        (span) => {
          const parent = span.parentNode;
          parent.replaceChild(document.createTextNode(span.textContent), span);
        }
      );
    }
  }

  let fromVars = {};
  let toVars = [];

  // === Slide distance detection ===
  let slideDistance = el.dataset.distance
    ? parseFloat(el.dataset.distance)
    : null;
  if (!slideDistance) {
    const distClass = Array.from(el.classList).find((cls) =>
      cls.startsWith("wbd-slide-distance-")
    );
    if (distClass) {
      slideDistance = parseFloat(distClass.replace("wbd-slide-distance-", ""));
    }
  }

  // === Scale override detection ===
  let customScale = el.dataset.scale ? parseFloat(el.dataset.scale) : null;

  const effects = el.dataset.style
    ? el.dataset.style.split(" ")
    : Object.keys(wbdFXPresets).filter((key) =>
        el.classList.contains(`wbd-${key}`)
      );

  effects.forEach((effect) => {
    const key = effect.replace("wbd-", "");
    const preset = wbdFXPresets[key];

    if (preset) {
      const fromCopy = { ...preset.from };
      const toCopy = { ...preset.to };

      if (
        key.startsWith("slide-") &&
        slideDistance != null &&
        !isNaN(slideDistance)
      ) {
        const isVertical = key === "slide-up" || key === "slide-down";
        const axis = isVertical ? "y" : "x";
        const isNegative = key === "slide-left" || key === "slide-up";
        fromCopy[axis] = isNegative ? -slideDistance : slideDistance;
        toCopy[axis] = 0;
      }

      if (
        (key === "scale-up" || key === "scale-down") &&
        customScale != null &&
        !isNaN(customScale)
      ) {
        fromCopy.scale = customScale;
      }

      if (key === "blur-in") {
        let blurAmount = el.dataset.blur || "8";
        const blurClass = Array.from(el.classList).find((cls) =>
          cls.startsWith("wbd-blur-")
        );
        if (blurClass) {
          blurAmount = blurClass.replace("wbd-blur-", "");
        }
        fromCopy.filter = `blur(${blurAmount}px)`;
        toCopy.filter = "blur(0px)";
      }

      Object.assign(fromVars, fromCopy);
      toVars.push(toCopy);
    }
  });

  const finalToVars = Object.assign({}, ...toVars);

  // === Handle easing ===
  let ease = el.dataset.ease || "power2.out";
  const easeClass = Array.from(el.classList).find((cls) =>
    cls.startsWith("wbd-ease-")
  );
  if (easeClass) {
    ease = easeClass.replace("wbd-ease-", "").replace(/-/g, ".");
  }

  const duration = el.dataset.duration ? parseFloat(el.dataset.duration) : 0.6;
  const stagger = el.dataset.stagger ? parseFloat(el.dataset.stagger) : 0.05;
  const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;

  gsap.set(targets, fromVars);

  gsap.to(targets, {
    ...finalToVars,
    scrollTrigger: {
      trigger: el,
      start: el.dataset.start || "top 80%",
      toggleActions: el.dataset.toggle || "play none none reverse",
    },
    duration,
    stagger,
    delay,
    ease,
  });
}

// === Parallax ===
function initWBDParallax(root = document) {
  const parallaxEls = root.querySelectorAll(
    '.wbd-parallax-img, .wbd-gsap-trigger[data-style*="parallax"]'
  );

  gsap.utils.toArray(parallaxEls).forEach((el) => {
    if (!shouldRunStyle(el)) return;

    if (!el.dataset.wbdParallax) {
      el.dataset.wbdParallax = "true";

      const distance = el.dataset.distance
        ? parseFloat(el.dataset.distance)
        : -100;
      const target = el.tagName === "IMG" ? el : el.querySelector("img");

      if (target) {
        gsap.fromTo(
          target,
          { y: distance },
          {
            y: 0,
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }
  });
}

// === Pinning ===
function initWBDPin(root = document) {
  root.querySelectorAll(".wbd-pin").forEach((el) => {
    if (!el.dataset.wbdPinned) {
      el.dataset.wbdPinned = "true";

      ScrollTrigger.create({
        trigger: el,
        start: el.dataset.pinStart || "top top",
        end: el.dataset.pinEnd || "+=100%",
        pin: true,
        pinSpacing: "false",
        scrub: el.dataset.pinScrub === "true" ? true : false,
      });
    }
  });
}

// === FLIP ===
function initWBDFlip(root = document) {
  root.querySelectorAll(".wbd-flip-trigger").forEach((el) => {
    if (!el.dataset.wbdFlipped) {
      el.dataset.wbdFlipped = "true";

      const targetClass = el.dataset.flipTo || "flipped";

      ScrollTrigger.create({
        trigger: el,
        start: el.dataset.flipStart || "top 80%",
        once: true,
        onEnter: () => {
          const state = Flip.getState(el);
          el.classList.add(targetClass);
          Flip.from(state, {
            duration: parseFloat(el.dataset.flipDuration) || 0.8,
            ease: el.dataset.flipEase || "power2.out",
          });
        },
      });
    }
  });
}

// === Master Init ===
function initWBDGSAPFX(root = document) {
  root.querySelectorAll(".wbd-gsap-trigger").forEach((el) => {
    if (!el.dataset.wbdAnimated) {
      el.dataset.wbdAnimated = "true";
      animateWBDGSAP(el);
    }
  });

  initWBDParallax(root);
  initWBDPin(root);
  initWBDFlip(root);
}

// === Reset ===
function resetWBDGSAPFX() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  initWBDGSAPFX();
}

// === Global API ===
window.WBDGSAPFX = {
  init: initWBDGSAPFX,
  animate: animateWBDGSAP,
  initParallax: initWBDParallax,
  initPin: initWBDPin,
  initFlip: initWBDFlip,
  reset: resetWBDGSAPFX,
};

// === Auto Init on DOM Ready ===
document.addEventListener("DOMContentLoaded", () => initWBDGSAPFX());

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
