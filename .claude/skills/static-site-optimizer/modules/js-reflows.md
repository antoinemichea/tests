# JavaScript Forced Reflows Module

## Purpose

Détecter et éliminer les forced reflows (layout thrashing) dans le JavaScript pour:
- ✅ **Performance**: -20 à -100ms Total Blocking Time
- ✅ **Smooth scrolling**: 60 FPS garanti pendant scroll
- ✅ **Responsiveness**: Meilleure interaction utilisateur
- ✅ **Battery life**: Moins de CPU utilisé

## Problem Statement

### What is a Forced Reflow?

Un **forced reflow** (ou **layout thrashing**) se produit quand JavaScript:
1. **Lit** une propriété géométrique (`offsetHeight`, `scrollTop`, etc.)
2. **Force** le navigateur à recalculer le layout immédiatement
3. **Se répète** dans une boucle ou un event listener

**Example**:
```javascript
// ❌ FORCED REFLOW (60x par seconde au scroll)
window.addEventListener('scroll', () => {
  sections.forEach(section => {
    const top = section.offsetTop;        // 🔴 Reflow!
    const height = section.offsetHeight;  // 🔴 Reflow!
    // ... utilise top et height
  });
});
```

**Impact**:
- 60 reflows/seconde = 60ms+ bloqué
- Scroll janky (FPS drop à 30 ou moins)
- TBT (Total Blocking Time) élevé
- Poor user experience

### Layout Properties (Cause Reflows)

Reading these properties forces layout recalculation:

**Element dimensions**:
- `offsetWidth`, `offsetHeight`
- `offsetTop`, `offsetLeft`
- `clientWidth`, `clientHeight`
- `clientTop`, `clientLeft`

**Scrolling**:
- `scrollTop`, `scrollLeft`
- `scrollWidth`, `scrollHeight`

**Position**:
- `getBoundingClientRect()`
- `getClientRects()`

**Computed styles**:
- `getComputedStyle()`
- Any computed property access

**Document**:
- `document.body.scrollTop`
- `window.scrollY`, `window.pageYOffset`

**Référence**: [What Forces Layout/Reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

## Detection Strategy

### 1. Scan JavaScript Files

Rechercher les patterns problématiques:

```bash
# Détecter les lectures de propriétés layout dans boucles
grep -nE '(forEach|for|while).*\{' js/*.js | \
  grep -A 10 'offset|client|scroll|getBoundingClientRect'
```

### 2. Common Anti-Patterns

**Anti-Pattern 1: Loop + Layout Read**
```javascript
// ❌ BAD: Lit offsetHeight dans forEach
sections.forEach(section => {
  const height = section.offsetHeight;  // Reflow à chaque itération
  section.style.marginTop = height / 2 + 'px';
});
```

**Anti-Pattern 2: Scroll Event + Layout Read**
```javascript
// ❌ BAD: Lit offsetTop à chaque scroll event (60x/sec)
window.addEventListener('scroll', () => {
  const headerHeight = header.offsetHeight;  // Reflow
  const targetTop = target.offsetTop;        // Reflow
  // ...
});
```

**Anti-Pattern 3: Read-Write-Read Pattern**
```javascript
// ❌ BAD: Read → Write → Read (force 2 reflows)
const width1 = el1.offsetWidth;     // Reflow
el2.style.width = '100px';          // Invalidate layout
const width2 = el2.offsetWidth;     // Forced reflow!
```

**Anti-Pattern 4: Repeated Access**
```javascript
// ❌ BAD: Accède plusieurs fois à la même propriété
function handleScroll() {
  if (window.scrollY > 100) {        // Read 1
    // ...
  }
  if (window.scrollY > 500) {        // Read 2 (peut causer reflow si DOM modifié entre-temps)
    // ...
  }
}
```

### 3. Detection Regex Patterns

```javascript
// Pattern 1: forEach/for + layout properties
/(forEach|for\s*\(|while\s*\()[\s\S]{0,200}(offsetHeight|offsetTop|offsetWidth|clientHeight|clientWidth|scrollTop|getBoundingClientRect)/

// Pattern 2: Scroll event + layout read
/addEventListener\s*\(\s*['"]scroll['"][\s\S]{0,300}(offsetHeight|offsetTop|getBoundingClientRect)/

// Pattern 3: Repeated property access
/(offsetHeight|offsetTop|scrollY|pageYOffset)[\s\S]{10,200}\1/

// Pattern 4: getComputedStyle in loop
/(forEach|for\s*\()[\s\S]{0,100}getComputedStyle/
```

## Optimization Strategies

### Strategy 1: Cache Dimensions + Resize Listener

**Before**:
```javascript
// ❌ Forced reflow à chaque scroll (60x/sec)
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;      // 🔴 Reflow
    const sectionHeight = section.offsetHeight;      // 🔴 Reflow
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      // Activate section
    }
  });
});
```

**After**:
```javascript
// ✅ Cache dimensions, 0 reflows pendant scroll
const sections = document.querySelectorAll('.section');
let sectionCache = [];

function updateSectionCache() {
  sectionCache = Array.from(sections).map(section => ({
    id: section.getAttribute('id'),
    top: section.offsetTop - 100,
    height: section.offsetHeight,
    bottom: section.offsetTop - 100 + section.offsetHeight,
    link: document.querySelector('.nav__link[href*=' + section.getAttribute('id') + ']')
  }));
}

// Initial cache
if (sections.length > 0) {
  updateSectionCache();

  // Recalculate uniquement au resize (debounced)
  window.addEventListener('resize', debounce(updateSectionCache, 250));
}

// Utilisation du cache (0 reflow)
const handleScrollActive = throttle(() => {
  const scrollY = window.pageYOffset;  // Une seule lecture

  sectionCache.forEach(section => {
    if (section.link) {
      if (scrollY > section.top && scrollY <= section.bottom) {
        section.link.classList.add('active');
      } else {
        section.link.classList.remove('active');
      }
    }
  });
}, 100);  // Throttle scroll events

window.addEventListener('scroll', handleScrollActive);
```

**Key improvements**:
- ✅ Dimensions cachées dans `sectionCache`
- ✅ Mise à jour uniquement au `resize` (rare)
- ✅ Scroll handler lit cache (0 reflow)
- ✅ Throttle pour réduire appels (100ms)

### Strategy 2: RequestAnimationFrame for Reads

**Before**:
```javascript
// ❌ Smooth scroll avec reflow synchrone
navLink.addEventListener('click', (e) => {
  e.preventDefault();
  const targetSection = document.querySelector(e.target.hash);
  const headerHeight = header.offsetHeight;          // 🔴 Forced reflow
  const targetPosition = targetSection.offsetTop - headerHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
});
```

**After**:
```javascript
// ✅ Cache header height + requestAnimationFrame
let cachedHeaderHeight = 0;

function updateHeaderHeight() {
  cachedHeaderHeight = header ? header.offsetHeight : 0;
}

// Initial measurement
updateHeaderHeight();

// Update on resize (debounced)
window.addEventListener('resize', debounce(updateHeaderHeight, 250));

// Use cache in click handler
navLink.addEventListener('click', (e) => {
  e.preventDefault();
  const targetSection = document.querySelector(e.target.hash);

  if (targetSection) {
    // Schedule read for next frame (non-blocking)
    requestAnimationFrame(() => {
      const targetPosition = targetSection.offsetTop - cachedHeaderHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  }
});
```

**Key improvements**:
- ✅ Header height caché
- ✅ `requestAnimationFrame` pour async read
- ✅ Non-blocking pour UI

### Strategy 3: Batch Reads, Then Batch Writes

**Before**:
```javascript
// ❌ Read-Write-Read-Write pattern (forced reflows)
elements.forEach(el => {
  const width = el.offsetWidth;        // Read (reflow 1)
  el.style.height = width + 'px';      // Write (invalidate)
  const height = el.offsetHeight;      // Read (reflow 2)
  el.style.marginTop = height / 2;     // Write
});
```

**After**:
```javascript
// ✅ Batch reads first, then batch writes (FastDOM pattern)
// Phase 1: Read (measure)
const measurements = Array.from(elements).map(el => ({
  element: el,
  width: el.offsetWidth    // All reads together (1 reflow total)
}));

// Phase 2: Write (mutate)
measurements.forEach(({ element, width }) => {
  element.style.height = width + 'px';
  element.style.marginTop = width / 2 + 'px';
  // All writes together (no reflows)
});
```

**Key improvements**:
- ✅ Séparer lecture (measure) et écriture (mutate)
- ✅ 1 reflow au lieu de N reflows
- ✅ Pattern FastDOM

### Strategy 4: Debounce & Throttle Utilities

Ajouter ces utilitaires si absents:

```javascript
// Debounce: Execute once after delay (for resize, input)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle: Execute at most once per interval (for scroll)
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

**Usage**:
```javascript
// Resize: debounce (wait for user to stop resizing)
window.addEventListener('resize', debounce(() => {
  updateCache();
}, 250));

// Scroll: throttle (execute at most every 100ms)
window.addEventListener('scroll', throttle(() => {
  handleScroll();
}, 100));
```

## Common Scenarios & Solutions

### Scenario 1: Active Navigation on Scroll

**Original code** (forced reflows):
```javascript
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;        // 🔴 Reflow
    const sectionTop = current.offsetTop - 100;        // 🔴 Reflow
    const sectionId = current.getAttribute('id');
    const link = document.querySelector('.nav__link[href*=' + sectionId + ']');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      link?.classList.add('active');
    } else {
      link?.classList.remove('active');
    }
  });
});
```

**Optimized code** (0 reflows):
```javascript
const sections = document.querySelectorAll('.section');
let sectionCache = [];

// Cache section dimensions
function updateSectionCache() {
  sectionCache = Array.from(sections).map(section => ({
    id: section.getAttribute('id'),
    top: section.offsetTop - 100,
    height: section.offsetHeight,
    link: document.querySelector('.nav__link[href*=' + section.getAttribute('id') + ']')
  }));
}

// Initialize cache
if (sections.length > 0) {
  updateSectionCache();
  window.addEventListener('resize', debounce(updateSectionCache, 250));
}

// Scroll handler using cache
const handleScrollActive = throttle(() => {
  const scrollY = window.pageYOffset;

  sectionCache.forEach(section => {
    if (section.link) {
      const isActive = scrollY > section.top && scrollY <= section.top + section.height;
      section.link.classList.toggle('active', isActive);
    }
  });
}, 100);

window.addEventListener('scroll', handleScrollActive);
```

### Scenario 2: Sticky Header

**Original code**:
```javascript
window.addEventListener('scroll', () => {
  if (window.scrollY >= 80) {
    header.classList.add('scroll-header');
  } else {
    header.classList.remove('scroll-header');
  }
});
```

**Optimized code**:
```javascript
// This is already optimal (reads window.scrollY only once)
// But we can add throttle for better performance

const handleHeaderScroll = throttle(() => {
  header.classList.toggle('scroll-header', window.scrollY >= 80);
}, 100);

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
```

**Key improvements**:
- ✅ Throttle scroll events
- ✅ Passive listener (better scroll performance)
- ✅ Toggle instead of add/remove

### Scenario 3: Smooth Scroll to Section

**Original code**:
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const headerHeight = header.offsetHeight;       // 🔴 Reflow on every click
    const targetPos = target.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPos,
      behavior: 'smooth'
    });
  });
});
```

**Optimized code**:
```javascript
// Cache header height
let cachedHeaderHeight = 0;

function updateHeaderHeight() {
  cachedHeaderHeight = header ? header.offsetHeight : 0;
}

updateHeaderHeight();
window.addEventListener('resize', debounce(updateHeaderHeight, 250));

// Smooth scroll with cached dimensions
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      requestAnimationFrame(() => {
        const targetPos = target.offsetTop - cachedHeaderHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      });
    }
  });
});
```

### Scenario 4: Parallax Scrolling

**Original code**:
```javascript
const parallaxElements = document.querySelectorAll('.parallax');

window.addEventListener('scroll', () => {
  parallaxElements.forEach(el => {
    const rect = el.getBoundingClientRect();  // 🔴 Forced reflow
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    el.style.transform = `translateY(${rate}px)`;
  });
});
```

**Optimized code**:
```javascript
const parallaxElements = document.querySelectorAll('.parallax');

const handleParallax = throttle(() => {
  const scrolled = window.pageYOffset;  // Read once

  // Use requestAnimationFrame for smooth animation
  requestAnimationFrame(() => {
    parallaxElements.forEach(el => {
      const rate = scrolled * 0.5;
      el.style.transform = `translateY(${rate}px)`;
      // No getBoundingClientRect needed for simple parallax
    });
  });
}, 16);  // ~60fps

window.addEventListener('scroll', handleParallax, { passive: true });
```

## Automated Code Transformations

### Transformation 1: Extract Section Cache

**Detect**:
```javascript
// Pattern: forEach + offsetTop/offsetHeight in scroll handler
window.addEventListener('scroll', () => {
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    // ...
  });
});
```

**Generate**:
```javascript
// Add cache variable
let sectionCache = [];

// Add cache function
function updateSectionCache() {
  sectionCache = Array.from(sections).map(section => ({
    id: section.getAttribute('id'),
    top: section.offsetTop,
    height: section.offsetHeight
    // Add other properties as needed
  }));
}

// Initialize
updateSectionCache();
window.addEventListener('resize', debounce(updateSectionCache, 250));

// Replace forEach with cache access
window.addEventListener('scroll', throttle(() => {
  sectionCache.forEach(section => {
    const top = section.top;      // From cache
    const height = section.height;
    // ... rest of code
  });
}, 100));
```

### Transformation 2: Add Throttle/Debounce

**Detect**:
```javascript
window.addEventListener('scroll', () => {
  // handler code
});
```

**Generate**:
```javascript
const handleScroll = throttle(() => {
  // handler code
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });
```

### Transformation 3: Cache Static Dimensions

**Detect**:
```javascript
// Pattern: offsetHeight in event listener (not in loop)
element.addEventListener('click', () => {
  const height = header.offsetHeight;  // Read on every click
  // ...
});
```

**Generate**:
```javascript
// Add cache variable
let cachedHeaderHeight = 0;

function updateHeaderHeight() {
  cachedHeaderHeight = header ? header.offsetHeight : 0;
}

updateHeaderHeight();
window.addEventListener('resize', debounce(updateHeaderHeight, 250));

// Use cache
element.addEventListener('click', () => {
  const height = cachedHeaderHeight;  // From cache
  // ...
});
```

## Utilities to Add

If not present, add these utilities to the JavaScript:

```javascript
/**
 * Debounce function - Execute once after delay
 * Use for: resize, input, window events
 */
function debounce(func, wait = 250) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - Execute at most once per interval
 * Use for: scroll, mousemove, continuous events
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

## Reporting

Add to optimization report:

```markdown
### JS Optimisé (Forced Reflows Éliminés)

✅ Cache dimensions: {section_count} sections
  - offsetTop/offsetHeight cachés
  - Mise à jour uniquement au resize (debounced 250ms)
  - Forced reflows: {before} → 0

✅ Throttle/Debounce appliqués:
  - Scroll events: throttle 100ms
  - Resize events: debounce 250ms
  - Impact: -{event_reduction}% d'appels

✅ RequestAnimationFrame ajouté:
  - {rAF_count} handlers optimisés
  - Lecture dimensions async (non-bloquant)

Impact Performance:
  - Total Blocking Time: {tbt_before}ms → {tbt_after}ms (-{tbt_reduction}ms)
  - Scroll FPS: {fps_before} → 60 FPS constant
  - Reflows: {reflows_before}/sec → 0
```

**Example**:
```markdown
### JS Optimisé (Forced Reflows Éliminés)

✅ Cache dimensions: 7 sections
  - offsetTop/offsetHeight cachés (7 sections)
  - Mise à jour uniquement au resize (debounced 250ms)
  - Forced reflows: 420/sec → 0 pendant scroll

✅ Throttle/Debounce appliqués:
  - Scroll events: throttle 100ms (6 handlers)
  - Resize events: debounce 250ms (3 handlers)
  - Impact: -83% d'appels d'event handlers

✅ RequestAnimationFrame ajouté:
  - 2 smooth scroll handlers optimisés
  - Lecture dimensions async (non-bloquant)

✅ Utilitaires ajoutés:
  - debounce() function (250ms default)
  - throttle() function (100ms default)

Impact Performance:
  - Total Blocking Time: 180ms → 95ms (-85ms, -47%)
  - Scroll FPS: 35-45 → 60 FPS constant
  - Reflows: 420/sec → 0 pendant scroll
  - PageSpeed TBT score: +12 points
```

## Verification Checklist

After optimization:

- [ ] **Utilities added**: debounce() and throttle() functions present
- [ ] **Cache implemented**: Dimension cache for loops/frequent reads
- [ ] **Resize listeners**: Cache update on resize (debounced)
- [ ] **Scroll optimized**: Throttle applied to scroll handlers
- [ ] **RAF used**: requestAnimationFrame for layout reads when appropriate
- [ ] **Passive listeners**: `{ passive: true }` on scroll/touch events
- [ ] **Visual testing**: All interactions work correctly
- [ ] **Performance testing**: Chrome DevTools shows 0 forced reflows during scroll

## Testing Strategy

### Chrome DevTools Performance

1. **Open DevTools** → Performance tab
2. **Start recording**
3. **Scroll the page** for 5 seconds
4. **Stop recording**
5. **Analyze**:
   - ✅ No "Recalculate Style" or "Layout" in scroll events
   - ✅ FPS constant at 60
   - ✅ Main thread not blocked

### Lighthouse

- **Before**: TBT (Total Blocking Time) = 180ms
- **After**: TBT = 95ms
- **Target**: TBT < 200ms (good), < 150ms (excellent)

### Console Warnings

Check for violations:
```
[Violation] Forced reflow while executing JavaScript took XXms
[Violation] 'scroll' handler took XXms
```

Should be **0 violations** after optimization.

## Integration with DEV Workflow

This module should be invoked as a new step in `optimize-dev.md`:

```markdown
### Step X: JavaScript Forced Reflows Optimization

Invoke `static-site-optimizer:js-reflows` to:
- Scan JavaScript for forced reflow patterns
- Cache dimensions (offsetTop, offsetHeight, etc.)
- Add debounce/throttle to event listeners
- Apply requestAnimationFrame for async reads
- Add passive event listeners where applicable
- Report performance improvements

Expected result:
  ✓ 0 forced reflows during scroll
  ✓ TBT reduced by 30-50%
  ✓ 60 FPS constant during interactions
  ✓ Smooth user experience
```

## Best Practices

1. **Read once, use many**: Cache layout properties
2. **Batch reads, batch writes**: FastDOM pattern
3. **Throttle scroll**: Max 10 calls/second (100ms)
4. **Debounce resize**: Wait 250ms after resize ends
5. **Use requestAnimationFrame**: For async layout reads
6. **Passive listeners**: For scroll/touch (no preventDefault)
7. **Profile often**: Use DevTools Performance tab
8. **Test on low-end devices**: Mobile has weaker CPUs

## Performance Impact

### Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Reflows during scroll | 420/sec | 0 | -100% |
| Total Blocking Time | 180ms | 95ms | -47% |
| Scroll FPS | 35-45 | 60 | +33-71% |
| Event handler calls | 600/sec | 100/sec | -83% |

### PageSpeed Impact

- **TBT**: 180ms → 95ms (-47%)
- **FID (First Input Delay)**: Improved responsiveness
- **Performance Score**: +8 to +15 points

---

**Module ready for integration into optimize-dev workflow.**
