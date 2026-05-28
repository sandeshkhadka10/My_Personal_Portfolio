/* ----- NAVIGATION BAR FUNCTION ----- */
function myMenuFunction(){
  var menuBtn = document.getElementById("myNavMenu");

  if(menuBtn.className === "nav-menu"){
    menuBtn.className += " responsive";
  } else {
    menuBtn.className = "nav-menu";
  }
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
});

/* ----- ADD SHADOW ON NAVIGATION BAR WHILE SCROLLING ----- */
window.onscroll = function() {headerShadow()};

function headerShadow() {
  const navHeader =document.getElementById("header");

  if (document.body.scrollTop > 50 || document.documentElement.scrollTop >  50) {

    navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
    navHeader.style.height = "70px";
    navHeader.style.lineHeight = "70px";

  } else {

    navHeader.style.boxShadow = "none";
    navHeader.style.height = "90px";
    navHeader.style.lineHeight = "90px";

  }
}


/* ----- TYPING EFFECT ----- */
var typingEffect = new Typed(".typedText",{
  strings : ["Build Improve."],
  loop : true,
  typeSpeed : 100, 
  backSpeed : 80,
  backDelay : 2000
})


/* ----- ## -- SCROLL REVEAL ANIMATION -- ## ----- */
const sr = ScrollReveal({
      origin: 'top',
      distance: '80px',
      duration: 2000,
      reset: true     
})

/* -- HOME -- */
sr.reveal('.featured-text-card',{})
sr.reveal('.featured-name',{delay: 100})
sr.reveal('.featured-text-info',{delay: 200})
sr.reveal('.featured-text-btn',{delay: 200})
sr.reveal('.social_icons',{delay: 200})
sr.reveal('.featured-image',{delay: 300})


/* -- PROJECT BOX -- */
sr.reveal('.project-box',{interval: 200})
sr.reveal('.education-card',{interval: 160})
sr.reveal('.experience-card',{interval: 160})

/* -- HEADINGS -- */
sr.reveal('.top-header',{})

/* ----- ## -- SCROLL REVEAL LEFT_RIGHT ANIMATION -- ## ----- */

/* -- ABOUT INFO & CONTACT INFO -- */
const srLeft = ScrollReveal({
origin: 'left',
distance: '80px',
duration: 2000,
reset: true
})

srLeft.reveal('.about-info',{delay: 100})
srLeft.reveal('.contact-card',{interval: 120})

/* -- ABOUT SKILLS & FORM BOX -- */
const srRight = ScrollReveal({
origin: 'right',
distance: '80px',
duration: 2000,
reset: true
})

srRight.reveal('.skills-box',{delay: 100})



/* ----- CHANGE ACTIVE LINK ----- */

const sections = document.querySelectorAll('section[id]')

function scrollActive() {
const scrollY = window.scrollY;

sections.forEach(current =>{
  const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 50,
    sectionId = current.getAttribute('id')

  if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) { 

      document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active-link')

  }  else {

    document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active-link')

  }
})
}

window.addEventListener('scroll', scrollActive)

// Jump to contact section when clicking Hire Me button
let hireMeBtn = document.getElementById("hireMeBtn");
let contactSection = document.getElementById("contact");

if (hireMeBtn && contactSection) {
  hireMeBtn.addEventListener("click", () => {
    contactSection.scrollIntoView({ behavior : "smooth"});
  });
}


// making darkmode and lightmode feature
let darkMode = document.getElementById("icon");
darkMode.addEventListener("click",function(){
  document.body.classList.toggle("dark-mode");
  if(document.body.classList.contains("dark-mode")){
    icon.src = "assests/sun.png";
  }else{
    icon.src = "assests/moon.png";
  }
});

// project slider with swipe and pagination
const projectTrack = document.querySelector(".project-track");
const projectCards = projectTrack
  ? Array.from(projectTrack.querySelectorAll(".project-card"))
  : [];
const projectPrev = document.querySelector(".project-nav.prev");
const projectNext = document.querySelector(".project-nav.next");
const projectDots = document.getElementById("projectDots");

if (projectTrack && projectCards.length > 0) {
  let activeIndex = 0;
  let rafId = null;
  let touchStartX = null;

  const updateButtons = () => {
    if (projectPrev) {
      projectPrev.disabled = false;
    }
    if (projectNext) {
      projectNext.disabled = false;
    }
  };

  const updateDots = () => {
    if (!projectDots) {
      return;
    }
    const dots = Array.from(projectDots.querySelectorAll(".project-dot"));
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
      dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
    });
  };

  const setActiveIndex = (index) => {
    activeIndex = index;
    updateButtons();
    updateDots();
  };

  const normalizeIndex = (index) => {
    const totalProjects = projectCards.length;
    return ((index % totalProjects) + totalProjects) % totalProjects;
  };

  const scrollToIndex = (index, behavior = "smooth") => {
    const nextIndex = normalizeIndex(index);
    const targetCard = projectCards[nextIndex];
    if (!targetCard) {
      return;
    }
    targetCard.scrollIntoView({
      behavior,
      block: "nearest",
      inline: "start"
    });
    setActiveIndex(nextIndex);
  };

  const findClosestIndex = () => {
    const trackRect = projectTrack.getBoundingClientRect();
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    projectCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const distance = Math.abs(cardRect.left - trackRect.left);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  };

  const handleScroll = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      const closestIndex = findClosestIndex();
      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    });
  };

  if (projectDots) {
    projectCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "project-dot";
      dot.setAttribute("aria-label", `Go to project ${index + 1}`);
      dot.addEventListener("click", () => scrollToIndex(index));
      projectDots.appendChild(dot);
    });
  }

  if (projectPrev) {
    projectPrev.addEventListener("click", () => scrollToIndex(activeIndex - 1));
  }
  if (projectNext) {
    projectNext.addEventListener("click", () => scrollToIndex(activeIndex + 1));
  }

  projectTrack.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  projectTrack.addEventListener("touchend", (event) => {
    if (touchStartX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;
    const swipeThreshold = 40;
    const lastProjectIndex = projectCards.length - 1;

    if (swipeDistance > swipeThreshold && activeIndex === lastProjectIndex) {
      scrollToIndex(0);
    } else if (swipeDistance < -swipeThreshold && activeIndex === 0) {
      scrollToIndex(lastProjectIndex);
    }

    touchStartX = null;
  }, { passive: true });

  projectTrack.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => scrollToIndex(activeIndex, "auto"));

  scrollToIndex(0, "auto");
}