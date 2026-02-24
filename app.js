const root = document.documentElement;

const defaults = {
  theme: 'light',
  glass: 52,   // percent
  blur: 16,    // px
  radius: 24,  // px
};

function getSettings() {
  return {
    theme: localStorage.getItem('mc_theme') || defaults.theme,
    glass: Number(localStorage.getItem('mc_glass') || defaults.glass),
    blur: Number(localStorage.getItem('mc_blur') || defaults.blur),
    radius: Number(localStorage.getItem('mc_radius') || defaults.radius),
  };
}

function applySettings() {
  const s = getSettings();
  root.classList.toggle('dark', s.theme === 'dark');
  root.style.setProperty('--glass', `${s.glass}%`);
  root.style.setProperty('--blurPx', `${s.blur}px`);
  root.style.setProperty('--radiusPx', `${s.radius}px`);

  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = s.theme === 'dark' ? '☀️' : '🌙';

  const glass = document.getElementById('glassRange');
  const blur = document.getElementById('blurRange');
  const radius = document.getElementById('radiusRange');
  const gv = document.getElementById('glassVal');
  const bv = document.getElementById('blurVal');
  const rv = document.getElementById('radiusVal');

  if (glass) glass.value = String(s.glass);
  if (blur) blur.value = String(s.blur);
  if (radius) radius.value = String(s.radius);
  if (gv) gv.textContent = `${s.glass}%`;
  if (bv) bv.textContent = `${s.blur}px`;
  if (rv) rv.textContent = `${s.radius}px`;
}

function setTheme(theme) {
  localStorage.setItem('mc_theme', theme);
  applySettings();
}

window.toggleThemeIcon = function () {
  const s = getSettings();
  setTheme(s.theme === 'dark' ? 'light' : 'dark');
};

window.setGlass = function (v) {
  localStorage.setItem('mc_glass', String(v));
  applySettings();
};
window.setBlur = function (v) {
  localStorage.setItem('mc_blur', String(v));
  applySettings();
};
window.setRadius = function (v) {
  localStorage.setItem('mc_radius', String(v));
  applySettings();
};

applySettings();