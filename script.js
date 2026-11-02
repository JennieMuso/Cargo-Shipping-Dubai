const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.site-header');
const navAnchors = [...navLinks.querySelectorAll('a')];

function positionNavLiquid(link) {
  if (!link || window.innerWidth <= 680) return;
  const navRect = navLinks.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  navLinks.style.setProperty('--liquid-x', `${linkRect.left - navRect.left}px`);
  navLinks.style.setProperty('--liquid-width', `${linkRect.width}px`);
}

function setActiveLink(link) {
  navAnchors.forEach(item => item.classList.toggle('is-active', item === link));
  positionNavLiquid(link);
}

menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navAnchors.forEach(link => link.addEventListener('click', () => {
  setActiveLink(link);
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observedSections = navAnchors
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const link = navAnchors.find(item => item.getAttribute('href') === `#${visible.target.id}`);
  if (link) setActiveLink(link);
}, { rootMargin: '-30% 0px -55% 0px', threshold: [0, .25, .5, .75] });

observedSections.forEach(section => sectionObserver.observe(section));

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 48);
}

window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', () => positionNavLiquid(document.querySelector('.nav-links .is-active')));
updateHeader();
requestAnimationFrame(() => positionNavLiquid(document.querySelector('.nav-links .is-active')));

const gallery = document.querySelector('.service-gallery');
document.querySelector('.gallery-prev').addEventListener('click', () => gallery.scrollBy({ left: -gallery.clientWidth * .7, behavior: 'smooth' }));
document.querySelector('.gallery-next').addEventListener('click', () => gallery.scrollBy({ left: gallery.clientWidth * .7, behavior: 'smooth' }));

document.querySelector('#quote-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const body = `Veyra shipment enquiry\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\nShipment details:\n${data.get('details')}`;
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'veyra-shipment-enquiry.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

const aboutCopy = document.querySelector('.about-scroll-copy');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (aboutCopy) {
  const words = aboutCopy.textContent.trim().split(/\s+/);
  aboutCopy.innerHTML = words.map(word => `<span class="copy-word">${word}</span>`).join(' ');
}

if (window.gsap && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-intro > *', { y: 20, opacity: 0, stagger: .13, duration: .8, ease: 'power2.out' });
  gsap.from('.hero-name', { clipPath: 'inset(100% 0 0 0)', y: 28, duration: 1.05, delay: .25, ease: 'power3.out' });
  gsap.to('.hero', { backgroundPosition: 'center 58%', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.copy-word', { color: '#102c34', stagger: .035, ease: 'none', scrollTrigger: { trigger: '.about-scroll-copy', start: 'top 78%', end: 'bottom 46%', scrub: true } });
  gsap.from('.mosaic-main', { clipPath: 'inset(0 0 100% 0)', duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.mosaic', start: 'top 82%' } });
  gsap.from('.mosaic-top, .mosaic-stat, .mosaic-small', { y: 24, opacity: 0, stagger: .09, duration: .62, ease: 'power2.out', scrollTrigger: { trigger: '.mosaic', start: 'top 78%' } });
  for (const section of document.querySelectorAll('.section:not(.about)')) {
    gsap.from(section.querySelectorAll('h2, .section-intro p, .service-card, .process-steps > div, .faq-list details'), {
      scrollTrigger: { trigger: section, start: 'top 88%' },
      y: 22,
      opacity: 0,
      stagger: .07,
      duration: .65,
      ease: 'power2.out'
    });
  }
} else if (aboutCopy) {
  aboutCopy.querySelectorAll('.copy-word').forEach(word => { word.style.color = '#102c34'; });
}
