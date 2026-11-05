const pageMenuButton = document.querySelector('.menu-toggle');
const pageNav = document.querySelector('.nav-links');
const pageHeader = document.querySelector('.site-header');
const pageNavLinks = pageNav ? [...pageNav.querySelectorAll('a')] : [];

function positionPageLiquid(link) {
  if (!link || !pageNav || window.innerWidth <= 680) return;
  const navRect = pageNav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  pageNav.style.setProperty('--liquid-x', `${linkRect.left - navRect.left}px`);
  pageNav.style.setProperty('--liquid-width', `${linkRect.width}px`);
}

if (pageMenuButton && pageNav) {
  pageMenuButton.addEventListener('click', () => {
    const open = pageNav.classList.toggle('open');
    pageMenuButton.setAttribute('aria-expanded', String(open));
    pageMenuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  pageNavLinks.forEach(link => link.addEventListener('click', () => {
    pageNav.classList.remove('open');
    pageMenuButton.setAttribute('aria-expanded', 'false');
  }));
}

const pageHero = document.querySelector('.page-hero, .service-detail-hero');

function updatePageHeader() {
  if (!pageHeader) return;
  const heroBoundary = pageHero
    ? pageHero.offsetTop + pageHero.offsetHeight - pageHeader.offsetHeight
    : 36;
  pageHeader.classList.toggle('is-scrolled', window.scrollY >= heroBoundary);
}

window.addEventListener('scroll', updatePageHeader, { passive: true });
window.addEventListener('resize', () => {
  positionPageLiquid(document.querySelector('.nav-links .is-active'));
  updatePageHeader();
});
updatePageHeader();
requestAnimationFrame(() => positionPageLiquid(document.querySelector('.nav-links .is-active')));

const detailMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pageWordReveals = [...document.querySelectorAll('.display-statement')];

pageWordReveals.forEach(text => {
  const words = text.textContent.trim().split(/\s+/);
  text.innerHTML = words.map(word => `<span class="page-copy-word">${word}</span>`).join(' ');
});

document.querySelectorAll('[data-smooth-details] details').forEach(detail => {
  const summary = detail.querySelector('summary');
  let transitionToken = 0;
  summary.addEventListener('click', event => {
    event.preventDefault();
    const shouldOpen = !detail.classList.contains('is-expanded');
    const token = ++transitionToken;
    if (shouldOpen) {
      detail.open = true;
      requestAnimationFrame(() => {
        if (token === transitionToken) detail.classList.add('is-expanded');
      });
      return;
    }
    detail.classList.remove('is-expanded');
    window.setTimeout(() => {
      if (token === transitionToken && !detail.classList.contains('is-expanded')) detail.open = false;
    }, detailMotionReduced ? 180 : 460);
  });
});

const pageEnquiryForm = document.querySelector('[data-enquiry-form]');
if (pageEnquiryForm) {
  pageEnquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      'Veyra shipment enquiry',
      '',
      `Name: ${data.get('name') || ''}`,
      `Work email: ${data.get('email') || ''}`,
      `Preferred service: ${data.get('service') || 'Not sure yet'}`,
      '',
      'Shipment details:',
      data.get('details') || ''
    ];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'veyra-shipment-enquiry.txt';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  const enterY = detailMotionReduced ? 0 : 34;
  gsap.from('[data-hero-reveal]', {
    y: enterY,
    opacity: 0,
    stagger: detailMotionReduced ? .03 : .11,
    duration: detailMotionReduced ? .3 : .8,
    ease: 'power3.out'
  });
  gsap.from('.page-hero-media, .service-detail-hero img', detailMotionReduced
    ? { opacity: 0, duration: .35, ease: 'power2.out' }
    : { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power3.out' });
  document.querySelectorAll('[data-reveal-group]').forEach(group => {
    gsap.from(group.children, {
      scrollTrigger: { trigger: group, start: 'top 86%' },
      y: enterY,
      opacity: 0,
      stagger: detailMotionReduced ? .02 : .08,
      duration: detailMotionReduced ? .28 : .68,
      ease: 'power2.out'
    });
  });
  document.querySelectorAll('[data-text-reveal]:not(.display-statement)').forEach(text => {
    gsap.from(text, {
      scrollTrigger: { trigger: text, start: 'top 88%' },
      y: detailMotionReduced ? 0 : 48,
      opacity: 0,
      duration: detailMotionReduced ? .3 : .85,
      ease: 'power3.out'
    });
  });

  pageWordReveals.forEach(text => {
    const finalColor = text.closest('.page-section--navy') ? '#ffffff' : '#102c34';
    const words = text.querySelectorAll('.page-copy-word');
    if (detailMotionReduced) {
      gsap.set(words, { color: finalColor });
      return;
    }
    gsap.to(words, {
      color: finalColor,
      stagger: .035,
      ease: 'none',
      scrollTrigger: {
        trigger: text,
        start: 'top 78%',
        end: 'bottom 46%',
        scrub: true
      }
    });
  });
} else {
  pageWordReveals.forEach(text => {
    const finalColor = text.closest('.page-section--navy') ? '#ffffff' : '#102c34';
    text.querySelectorAll('.page-copy-word').forEach(word => { word.style.color = finalColor; });
  });
}
