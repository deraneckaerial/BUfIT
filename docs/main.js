/* ============================================================
   BUfIT — Main JavaScript
   Navbar scroll | Mobile menu | Terminal typewriter
   Scroll fade-in | FAQ accordion | Smooth scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. NAVBAR: Scroll-State
  ------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  /* -------------------------------------------------------
     2. HAMBURGER MENU
  ------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when any nav link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* -------------------------------------------------------
     3. TERMINAL TYPEWRITER
  ------------------------------------------------------- */
  const terminalBody = document.getElementById('terminal-body');

  // Each entry: text to type, CSS class, ms to wait BEFORE typing this line
  const terminalLines = [
    { text: 'analyzing risk profile...',              cls: 'prompt',  pause: 500  },
    { text: 'job: Senior Software Engineer',          cls: 'prompt',  pause: 700  },
    { text: 'income: 95.000 EUR/Jahr',                cls: 'prompt',  pause: 600  },
    { text: 'BU coverage recommended: 4.500 EUR/Monat', cls: 'prompt', pause: 700 },
    { text: 'match found: Swiss Life BU Premium',     cls: 'prompt',  pause: 800  },
    { text: '[✓ DONE]',                               cls: 'success', pause: 600  },
  ];

  function typeCharacters(el, text, speed, onDone) {
    let i = 0;
    function tick() {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        setTimeout(tick, speed);
      } else if (onDone) {
        onDone();
      }
    }
    tick();
  }

  function runTerminal() {
    if (!terminalBody) return;
    terminalBody.innerHTML = '';

    // Blinking cursor element (shared, appended after last typed char)
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';

    let lineIdx = 0;

    function showLine() {
      if (lineIdx >= terminalLines.length) {
        // All done: remove cursor
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        return;
      }

      const { text, cls, pause } = terminalLines[lineIdx];
      lineIdx++;

      setTimeout(() => {
        // Create line element
        const lineEl = document.createElement('span');
        lineEl.className = 'terminal-line ' + cls;
        terminalBody.appendChild(lineEl);

        // Move cursor to after this line element during typing
        terminalBody.appendChild(cursor);

        typeCharacters(lineEl, text, 26, () => {
          // Insert newline after typing completes
          terminalBody.insertBefore(document.createTextNode('\n'), cursor);
          showLine();
        });
      }, pause);
    }

    // Append cursor initially so it blinks while waiting
    terminalBody.appendChild(cursor);
    showLine();
  }

  // Trigger once hero section enters viewport
  const heroSection = document.querySelector('.hero');

  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runTerminal();
        heroObserver.disconnect();
      }
    }, { threshold: 0.2 });
    heroObserver.observe(heroSection);
  } else {
    runTerminal();
  }


  /* -------------------------------------------------------
     4. SCROLL FADE-IN (IntersectionObserver)
  ------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback for older browsers
    fadeEls.forEach(el => el.classList.add('visible'));
  }


  /* -------------------------------------------------------
     5. FAQ ACCORDION
  ------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items first
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle the clicked item
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });


  /* -------------------------------------------------------
     6. SMOOTH SCROLL for anchor links (offset for sticky nav)
  ------------------------------------------------------- */
  const NAV_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href   = link.getAttribute('href');
      const target = href.length > 1 ? document.querySelector(href) : null;
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
