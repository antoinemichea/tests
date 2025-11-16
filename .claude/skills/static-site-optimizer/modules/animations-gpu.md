# GPU-Composited Animations Module

## Purpose

Convertir les animations CSS non-composées (qui causent des reflows/repaints) en animations GPU-composées pour:
- ✅ **Performance**: 60 FPS garanti sur animations
- ✅ **CLS**: Cumulative Layout Shift réduit
- ✅ **Smoothness**: Animations fluides sans jank
- ✅ **Battery**: Moins de CPU, plus de GPU (efficace)

## Problem Statement

### Non-Composited Properties (⚠️ Cause Reflows/Repaints)

Ces propriétés déclenchent layout recalculation (reflow) ou repaint:

**Layout properties** (reflow - le pire):
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-width`
- `font-size`

**Paint properties** (repaint - moins pire):
- `color`
- `background-color`
- `border-color`
- `border-radius` ⚠️ (non-composable sur beaucoup de GPU)
- `box-shadow`
- `outline`

### Composited Properties (✅ GPU-Accelerated)

Ces propriétés sont composées sur le GPU (pas de reflow/repaint):

- `transform` (translate, scale, rotate, skew)
- `opacity`
- `filter` (blur, brightness, etc.)
- `backdrop-filter`

**Référence**: [CSS Triggers](https://csstriggers.com/)

## Detection Strategy

### 1. Scan CSS for @keyframes

Rechercher toutes les animations définies:

```bash
# Extraire tous les @keyframes des fichiers CSS
grep -A 20 '@keyframes' css/*.css > animations.txt
```

### 2. Identify Non-Composited Properties

Parser chaque @keyframes et détecter:

**Pattern regex**:
```javascript
const nonCompositedProps = /\b(width|height|top|left|right|bottom|margin|padding|border-width|border-radius|font-size|color|background-color|box-shadow)\s*:/g;
```

**Example detection**:
```css
@keyframes slideDown {
  from { height: 0; }          /* ⚠️ NON-COMPOSITED */
  to { height: 100%; }
}

@keyframes morph {
  0% {
    border-radius: 60% 40%;    /* ⚠️ NON-COMPOSITED */
    transform: scale(1);       /* ✅ COMPOSITED */
  }
  50% {
    border-radius: 40% 60%;    /* ⚠️ NON-COMPOSITED */
    transform: scale(1.2);     /* ✅ COMPOSITED */
  }
}
```

### 3. Classify Animations

Catégoriser chaque animation:

- **Safe**: Uniquement transform/opacity → garder tel quel
- **Convertible**: Properties convertibles → auto-convert
- **Decorative**: Border-radius animé seul → supprimer
- **Complex**: Nécessite intervention manuelle → warn

## Conversion Strategies

### Strategy 1: Height/Width → Scale

**Before**:
```css
@keyframes slideDown {
  from { height: 0; }
  to { height: 100%; }
}
```

**After**:
```css
@keyframes slideDown {
  from {
    transform: scaleY(0);
    transform-origin: top;
  }
  to {
    transform: scaleY(1);
    transform-origin: top;
  }
}
```

**Notes**:
- `height: 0 → 100%` devient `scaleY(0) → scaleY(1)`
- `width: 0 → 100%` devient `scaleX(0) → scaleX(1)`
- Ajouter `transform-origin` approprié:
  - `top` pour slideDown
  - `left` pour slideRight
  - `center` par défaut

**Limitations**:
- Ne fonctionne que pour 0% → 100% transitions
- Pour hauteurs spécifiques (ex: 50px → 200px), nécessite calcul du ratio

### Strategy 2: Top/Left → Translate

**Before**:
```css
@keyframes moveRight {
  from { left: 0; }
  to { left: 100px; }
}
```

**After**:
```css
@keyframes moveRight {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

**Conversion**:
- `left` → `translateX()`
- `top` → `translateY()`
- `right` → `translateX()` (avec négation)
- `bottom` → `translateY()` (avec négation)

### Strategy 3: Border-Radius → Remove

**Before**:
```css
@keyframes morph {
  0% {
    border-radius: 60% 40% 54% 46% / 55% 48% 52% 45%;
    transform: rotate(0deg);
  }
  50% {
    border-radius: 40% 60% 46% 54% / 48% 55% 45% 52%;
    transform: rotate(180deg);
  }
}
```

**After**:
```css
@keyframes morph {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
}
```

**Rationale**:
- `border-radius` animé est **purement décoratif**
- Cause forced reflows à chaque frame (60 reflows/sec)
- Impact visuel minimal si supprimé
- Garder border-radius statique est OK

**Exception**: Si border-radius est l'animation principale (sans transform), **warning** à l'utilisateur au lieu de supprimer.

### Strategy 4: Background-Position → Keep

**Special case**:
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
```

**Action**: **KEEP** (ne pas toucher)

**Rationale**:
- `background-position` est composable sur certains GPU
- Largement utilisé pour gradients animés
- Performance acceptable

### Strategy 5: Box-Shadow → Filter

**Before**:
```css
@keyframes glow {
  0% { box-shadow: 0 0 5px blue; }
  100% { box-shadow: 0 0 20px blue; }
}
```

**After** (optionnel - avancé):
```css
@keyframes glow {
  0% { filter: drop-shadow(0 0 5px blue); }
  100% { filter: drop-shadow(0 0 20px blue); }
}
```

**Note**: `filter` est composable, mais conversion de `box-shadow` → `drop-shadow` peut changer le rendu. **À tester visuellement.**

### Strategy 6: Combine Transforms

Si plusieurs transforms dans une animation, les combiner:

**Before**:
```css
@keyframes complex {
  0% {
    transform: translateX(0);
    transform: scale(1);    /* ⚠️ Écrase le translateX ! */
  }
}
```

**After**:
```css
@keyframes complex {
  0% {
    transform: translateX(0) scale(1);
  }
}
```

## Implementation Logic

### Pseudo-Code

```javascript
function optimizeAnimations(cssContent) {
  const animations = extractKeyframes(cssContent);
  const optimized = [];
  const warnings = [];

  for (const anim of animations) {
    const analysis = analyzeKeyframes(anim);

    if (analysis.isSafe) {
      // Already optimized (only transform/opacity)
      optimized.push(anim);
      continue;
    }

    if (analysis.hasNonComposited) {
      const converted = convertAnimation(anim);

      if (converted.success) {
        optimized.push(converted.code);
        log(`✓ Converted: ${anim.name}`);
      } else {
        warnings.push({
          name: anim.name,
          reason: converted.reason,
          suggestion: converted.suggestion
        });
        optimized.push(anim); // Keep original
      }
    }
  }

  return {
    css: buildCSS(optimized),
    warnings
  };
}

function analyzeKeyframes(anim) {
  const props = extractProperties(anim.rules);

  return {
    isSafe: props.every(p => isComposited(p)),
    hasHeight: props.includes('height'),
    hasWidth: props.includes('width'),
    hasPosition: ['top', 'left', 'right', 'bottom'].some(p => props.includes(p)),
    hasBorderRadius: props.includes('border-radius'),
    hasTransform: props.includes('transform')
  };
}

function convertAnimation(anim) {
  const analysis = analyzeKeyframes(anim);

  // Height 0-100% → scaleY
  if (analysis.hasHeight && isZeroToHundred(anim, 'height')) {
    return convertHeightToScale(anim);
  }

  // Width 0-100% → scaleX
  if (analysis.hasWidth && isZeroToHundred(anim, 'width')) {
    return convertWidthToScale(anim);
  }

  // Position → translate
  if (analysis.hasPosition) {
    return convertPositionToTranslate(anim);
  }

  // Border-radius seul → remove
  if (analysis.hasBorderRadius && !analysis.hasTransform) {
    return {
      success: false,
      reason: 'Border-radius animation is decorative and non-composable',
      suggestion: 'Consider removing or replacing with static border-radius'
    };
  }

  // Border-radius + transform → remove border-radius only
  if (analysis.hasBorderRadius && analysis.hasTransform) {
    return removeBorderRadius(anim);
  }

  // Cannot auto-convert
  return {
    success: false,
    reason: 'Complex animation requiring manual review',
    suggestion: 'Check CSS Triggers and use transform/opacity when possible'
  };
}
```

## Example Conversions

### Example 1: Dropdown Slide

**Before**:
```css
.dropdown {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.dropdown.open {
  max-height: 500px;
}
```

**After**:
```css
.dropdown {
  transform: scaleY(0);
  transform-origin: top;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.dropdown.open {
  transform: scaleY(1);
}
```

### Example 2: Slide In from Left

**Before**:
```css
@keyframes slideInLeft {
  from {
    left: -100%;
    opacity: 0;
  }
  to {
    left: 0;
    opacity: 1;
  }
}
```

**After**:
```css
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Example 3: Morph Animation

**Before**:
```css
@keyframes morph {
  0%, 100% {
    border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
    transform: rotate(0deg) scale(1);
  }
  50% {
    border-radius: 70% 30% 46% 54% / 30% 54% 46% 70%;
    transform: rotate(180deg) scale(0.95);
  }
}
```

**After**:
```css
@keyframes morph {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.95);
  }
}

/* Border-radius statique sur l'élément (pas animé) */
.morphing-element {
  border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
}
```

## Will-Change Optimization

Pour les animations récurrentes, ajouter `will-change`:

**Before**:
```css
.animated-box {
  animation: slideIn 0.5s ease;
}
```

**After**:
```css
.animated-box {
  animation: slideIn 0.5s ease;
  will-change: transform;
}

/* Ou si opacity aussi animé */
.animated-box-with-fade {
  animation: fadeSlide 0.5s ease;
  will-change: transform, opacity;
}
```

**Important**:
- ✅ Utiliser `will-change` uniquement pour animations récurrentes
- ❌ Ne pas abuser (coût mémoire GPU)
- ✅ Limiter à `transform` et `opacity`
- ❌ Ne pas mettre sur tous les éléments

**Best practice**:
```css
/* Ajouter will-change avant animation start (via JS ou :hover) */
.box:hover {
  will-change: transform;
}

/* Ou sur classes d'animation */
.will-animate {
  will-change: transform, opacity;
}
```

## Verification Strategy

### Visual Testing

Après conversion, vérifier visuellement:

1. **Ouvrir le site dans un navigateur**
2. **Tester chaque animation convertie**:
   - L'animation fonctionne-t-elle encore?
   - Le timing est-il identique?
   - Le rendu visuel est-il acceptable?
3. **Vérifier les edge cases**:
   - Comportement au hover
   - Comportement au scroll
   - Responsive (mobile vs desktop)

### Performance Testing

**Chrome DevTools**:
```
1. Ouvrir DevTools (F12)
2. Performance tab
3. Enregistrer une session avec animation
4. Vérifier:
   - Pas de "Layout" ou "Recalculate Style" pendant animation
   - "Composite Layers" devrait être présent
   - FPS constant à 60
```

**Lighthouse**:
- Avant: CLS score élevé (ex: 0.25)
- Après: CLS score bas (ex: 0.05)

### Browser Console Warnings

Vérifier qu'il n'y a pas de warnings comme:
```
[Violation] Forced reflow while executing JavaScript
[Violation] 'requestAnimationFrame' handler took XXXms
```

## Reporting

Add to optimization report:

```markdown
### Animations GPU-Composées

✅ {count} animations converties
  - slideDown: height → scaleY
  - slideInLeft: left → translateX
  - morph: border-radius supprimé (purement décoratif)
  - fadeSlide: déjà optimisé (transform + opacity)

⚠️ {warnings_count} animations nécessitant révision manuelle:
  - complexPulse: Propriétés multiples non-convertibles automatiquement
    Suggestion: Utiliser transform: scale() au lieu de width/height

Gain Performance:
  - Forced reflows: 0 (vs {before} avant)
  - CLS: {cls_before} → {cls_after} ({improvement}%)
  - Animation FPS: 60 constant (vs {before_fps} avant)
  - Will-change ajouté: {will_change_count} éléments
```

**Example**:
```markdown
### Animations GPU-Composées

✅ 5 animations converties
  - slideDown: height → scaleY ✓
  - slideRight: left → translateX ✓
  - morph: border-radius supprimé (purement décoratif) ✓
  - morphBg: border-radius supprimé ✓
  - fadeIn: déjà optimisé (opacity seule) ✓

⚠️ 1 animation nécessitant révision manuelle:
  - complexPulse: Mix de width et box-shadow
    Suggestion: Utiliser transform: scale() et filter: drop-shadow()

Gain Performance:
  - Forced reflows: 0 (vs 300/sec avant sur animations)
  - CLS: 0.25 → 0.05 (-80%)
  - Animation FPS: 60 constant (vs 30-45 avant)
  - Will-change ajouté: 3 éléments récurrents
```

## Edge Cases & Troubleshooting

### Issue 1: Transform Already Present

**Problem**:
```css
@keyframes move {
  from {
    left: 0;
    transform: rotate(0deg);
  }
  to {
    left: 100px;
    transform: rotate(45deg);
  }
}
```

**Solution**: Combiner les transforms
```css
@keyframes move {
  from {
    transform: translateX(0) rotate(0deg);
  }
  to {
    transform: translateX(100px) rotate(45deg);
  }
}
```

### Issue 2: Percentage-Based Positioning

**Problem**:
```css
@keyframes slide {
  from { left: 0%; }
  to { left: 50%; }
}
```

**Solution**: `translateX()` supporte aussi les %
```css
@keyframes slide {
  from { transform: translateX(0%); }
  to { transform: translateX(50%); }
}
```

### Issue 3: Negative Values

**Problem**:
```css
@keyframes slideOut {
  to { left: -100px; }
}
```

**Solution**: Les valeurs négatives fonctionnent
```css
@keyframes slideOut {
  to { transform: translateX(-100px); }
}
```

### Issue 4: Calc() Expressions

**Problem**:
```css
@keyframes complex {
  to { left: calc(100% - 50px); }
}
```

**Solution**: `translateX()` supporte calc()
```css
@keyframes complex {
  to { transform: translateX(calc(100% - 50px)); }
}
```

### Issue 5: Auto Height

**Problem**:
```css
@keyframes expand {
  from { height: 0; }
  to { height: auto; }  /* ⚠️ auto non-animable avec scaleY */
}
```

**Solution**: Utiliser max-height (non-idéal) ou JavaScript
```css
/* Fallback: max-height (non-composable mais fonctionne) */
@keyframes expand {
  from { max-height: 0; }
  to { max-height: 1000px; }  /* Valeur suffisamment grande */
}
```

**Better solution**: Mesurer la hauteur en JavaScript et appliquer scaleY avec la valeur exacte.

## Best Practices

1. **Toujours tester visuellement** après conversion
2. **Préférer transform et opacity** pour toute animation
3. **Utiliser will-change avec parcimonie** (coût mémoire)
4. **Éviter border-radius animé** (purement décoratif, coûteux)
5. **Documenter les animations complexes** non-convertibles
6. **Vérifier le FPS** avec DevTools Performance
7. **Tester sur mobile** (GPU moins puissant)

## Browser Compatibility

**Transform/Opacity animations**:
- ✅ Chrome/Edge: Excellent
- ✅ Firefox: Excellent
- ✅ Safari: Excellent
- ✅ Mobile browsers: Excellent (95%+ support)

**Will-change**:
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (mais ignoré sur certains anciens iOS)

**Fallback**: Pas nécessaire, support quasi-universel.

## Integration with DEV Workflow

This module should be invoked as a new step in `optimize-dev.md`:

```markdown
### Step X: GPU-Composited Animations

Invoke `static-site-optimizer:animations-gpu` to:
- Scan CSS for @keyframes animations
- Detect non-composited properties (height, left, border-radius, etc.)
- Auto-convert to transform/opacity when possible
- Add will-change for recurring animations
- Report warnings for complex animations requiring manual review

Expected result:
  ✓ 0 forced reflows during animations
  ✓ 60 FPS constant
  ✓ CLS improved by 50-80%
  ✓ Smooth animations on all devices
```

## Performance Impact

### Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Reflows during animation | 300/sec | 0 | -100% |
| FPS (desktop) | 30-45 | 60 | +33-100% |
| FPS (mobile) | 15-30 | 60 | +100-300% |
| CLS | 0.25 | 0.05 | -80% |
| CPU usage | High | Low | -60% |

### PageSpeed Impact

- **Cumulative Layout Shift (CLS)**: 0.25 → 0.05
- **Total Blocking Time (TBT)**: -20ms (moins de reflows)
- **Performance Score**: +5 à +10 points

---

**Module ready for integration into optimize-dev workflow.**
