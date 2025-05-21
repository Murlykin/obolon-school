gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const yHeight = 300;
const triggerStart = "top 60%";
const isOIMobile = window.innerWidth <= 768;
const duration = isOIMobile ? 4 : 2; // slower on mobile

// Ball 1: left to right
gsap.to(".ball1", {
    scrollTrigger: {
        trigger: ".oi-rg__tennisBall",
        start: triggerStart
    },
    duration,
    ease: "power1.inOut",
    motionPath: {
        path: [
            { x: -250, y: -yHeight * 0.3 },
            { x: window.innerWidth / 2, y: yHeight },
            { x: window.innerWidth + 250, y: yHeight * 0.15 }
        ],
        curviness: 0
    },
    rotation: 360,
    transformOrigin: "50% 50%"
});

gsap.to(".shadow1", {
    scrollTrigger: {
        trigger: ".oi-rg__tennisBall",
        start: triggerStart
    },
    duration,
    ease: "power1.inOut",
    motionPath: {
        path: [
            { x: -250, y: yHeight },
            { x: window.innerWidth / 2, y: yHeight },
            { x: window.innerWidth + 250, y: yHeight }
        ],
        curviness: 0
    }
});

// Ball 2: right to left
gsap.set(".ball2", { x: window.innerWidth + 250, y: 300 });
gsap.set(".shadow2", { x: window.innerWidth + 250, y: 0 });

gsap.to(".ball2", {
    scrollTrigger: {
        trigger: ".oi-rg__tennisBall2",
        start: triggerStart
    },
    duration,
    ease: "power1.inOut",
    motionPath: {
        path: [
            { x: window.innerWidth + 250, y: 0 },
            { x: window.innerWidth / 2 + 250, y: yHeight },
            { x: -250, y: -yHeight * 0.3 }
        ],
        curviness: 0
    },
    rotation: -360,
    transformOrigin: "50% 50%"
});

gsap.to(".shadow2", {
    scrollTrigger: {
        trigger: ".oi-rg__tennisBall2",
        start: triggerStart
    },
    duration,
    ease: "power1.inOut",
    motionPath: {
        path: [
            { x: window.innerWidth + 250, y: yHeight },
            { x: window.innerWidth / 2, y: yHeight },
            { x: -250, y: yHeight }
        ],
        curviness: 0
    }
});

// Ball 3: left to right
gsap.to(".ball3", {
    scrollTrigger: {
        trigger: ".oi-rg__tennisBall3",
        start: triggerStart
    },
    duration,
    ease: "power1.inOut",
    motionPath: {
        path: [
            { x: -250, y: -yHeight * 0.3 },
            { x: window.innerWidth / 2, y: yHeight },
            { x: window.innerWidth + 250, y: yHeight * 0.15 }
        ],
        curviness: 0
    },
    rotation: 360,
    transformOrigin: "50% 50%"
});

gsap.to(".shadow3", {
    scrollTrigger: {
        trigger: ".oi-rg__tennisBall3",
        start: triggerStart
    },
    duration,
    ease: "power1.inOut",
    motionPath: {
        path: [
            { x: -250, y: yHeight },
            { x: window.innerWidth / 2, y: yHeight },
            { x: window.innerWidth + 250, y: yHeight }
        ],
        curviness: 0
    }
});

// Additional scroll-triggered animations (unchanged)
gsap.to("#tablets", {
    x: "55%",
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#tablets",
        start: "top 85%",
        end: "top 25%",
        scrub: true
    }
});

gsap.to("#laptop", {
    x: "-55%",
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#laptop",
        start: "top 85%",
        end: "top 25%",
        scrub: true
    }
});