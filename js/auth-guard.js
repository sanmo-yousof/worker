/**
 * Universal Authentication Guard & Client Middleware
 * Synchronizes sessions across Next.js and static HTML pages.
 */

const AUTH_COOKIE = 'findworkers_auth_token';
const USER_COOKIE = 'findworkers_user_session';

const DEMO_USER = {
  id: 'usr_sarah_connor',
  name: 'Sarah Connor',
  email: 'sarah.connor@cyberdyne.io',
  company: 'Cyberdyne Systems',
  role: 'client',
  domain: 'Software & Coding',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  escrowBalance: 5900,
};

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
}

function eraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
}

function generateSimpleToken(user) {
  const payload = {
    sub: user.id || 'usr_' + Math.random().toString(36).substring(2, 9),
    email: user.email || DEMO_USER.email,
    name: user.name || DEMO_USER.name,
    company: user.company || DEMO_USER.company,
    role: 'client',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  } catch (e) {
    return 'fw_token_' + Date.now();
  }
}

function isTokenValid(token) {
  if (!token || typeof token !== 'string') return false;
  const trimmed = token.trim();
  if (trimmed.length < 10) return false;
  try {
    const payload = JSON.parse(decodeURIComponent(escape(atob(trimmed))));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (e) {
    return trimmed.startsWith('fw_token_') || trimmed.length >= 20;
  }
}

function getCurrentUser() {
  const cookieVal = getCookie(USER_COOKIE);
  if (cookieVal) {
    try {
      return JSON.parse(decodeURIComponent(cookieVal));
    } catch (e) {}
  }
  try {
    const stored = localStorage.getItem(USER_COOKIE);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return null;
}

function isAuthenticated() {
  const token = getCookie(AUTH_COOKIE) || localStorage.getItem(AUTH_COOKIE);
  return isTokenValid(token);
}

function establishSession(user, rememberMe = true) {
  const token = generateSimpleToken(user);
  const days = rememberMe ? 30 : 1;
  setCookie(AUTH_COOKIE, token, days);
  setCookie(USER_COOKIE, encodeURIComponent(JSON.stringify(user)), days);
  try {
    localStorage.setItem(AUTH_COOKIE, token);
    localStorage.setItem(USER_COOKIE, JSON.stringify(user));
  } catch (e) {}
  return token;
}

function terminateSession() {
  eraseCookie(AUTH_COOKIE);
  eraseCookie(USER_COOKIE);
  eraseCookie('auth_token');
  try {
    localStorage.removeItem(AUTH_COOKIE);
    localStorage.removeItem(USER_COOKIE);
    localStorage.removeItem('auth_token');
  } catch (e) {}
}

/**
 * Route Guard for Protected Pages (e.g. dashboard.html)
 */
function enforceClientAuth() {
  if (!isAuthenticated()) {
    const current = encodeURIComponent(window.location.pathname.split('/').pop() || 'dashboard.html');
    window.location.replace(`login.html?callbackUrl=${current}&reason=auth_required`);
  }
}

/**
 * Route Guard for Auth Pages (e.g. login.html, signup.html)
 */
function redirectIfAlreadyLoggedIn() {
  if (isAuthenticated()) {
    const params = new URLSearchParams(window.location.search);
    const callback = params.get('callbackUrl') || 'dashboard.html';
    let target = 'dashboard.html';
    if (callback && !callback.includes('login') && !callback.includes('signup')) {
      target = decodeURIComponent(callback);
    }
    window.location.replace(target);
  }
}

/**
 * Synchronize Header Page Routing for Authorized & Unauthorized Users
 */
function syncHeaderRouting() {
  const isAuth = isAuthenticated();
  const user = isAuth ? (getCurrentUser() || DEMO_USER) : null;

  // 1. Update Right Header CTAs Container (#headerAuthNav)
  const authNav = document.getElementById('headerAuthNav');
  if (authNav) {
    if (isAuth && user) {
      authNav.innerHTML = `
        <a href="dashboard.html" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>${user.name || 'Client Console'}</span>
          <span class="text-[10px] text-emerald-600 font-mono uppercase bg-emerald-100/80 px-1.5 py-0.5 rounded font-bold">Console ↗</span>
        </a>
        <button type="button" onclick="FindWorkersAuth.terminateSession(); window.location.reload();" class="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer" title="Sign Out">
          Sign Out
        </button>
      `;
    } else {
      authNav.innerHTML = `
        <a href="login.html" class="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 px-2.5 py-2 transition-colors">
          Client Log In
        </a>
        <a href="signup.html" class="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm">
          Client Sign Up
        </a>
      `;
    }
  }

  // 2. Update Top Bar Actions Container (#topBarAuthNav)
  const topBarNav = document.getElementById('topBarAuthNav');
  if (topBarNav) {
    if (isAuth && user) {
      topBarNav.innerHTML = `
        <a href="dashboard.html" class="hover:text-white transition-colors text-emerald-300 font-medium">🏢 Console (${user.name})</a>
        <span>•</span>
        <a href="#" onclick="FindWorkersAuth.terminateSession(); window.location.reload(); return false;" class="hover:text-white transition-colors">Sign Out</a>
      `;
    } else {
      topBarNav.innerHTML = `
        <a href="login.html" class="hover:text-white transition-colors">Client Console</a>
        <span>•</span>
        <a href="login.html" class="hover:text-white transition-colors">Enterprise Sign In</a>
      `;
    }
  }

  // 3. Update Main Navigation Bar (#mainDesktopNav)
  const mainNav = document.getElementById('mainDesktopNav');
  if (mainNav) {
    const currentPath = window.location.pathname.split('/').pop() || 'outlier-preview.html';
    const isFreelancers = currentPath.includes('freelancers');
    const isProfile = currentPath.includes('seller-profile');
    const isDashboard = currentPath.includes('dashboard');

    if (isAuth) {
      mainNav.innerHTML = `
        <a href="freelancers.html" class="${isFreelancers ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-950'} transition-colors">Freelancers</a>
        <a href="seller-profile.html" class="${isProfile ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-950'} transition-colors">Top Profile</a>
        <a href="dashboard.html" class="${isDashboard ? 'text-emerald-700 font-bold' : 'text-slate-700 font-bold hover:text-emerald-700'} transition-colors">Client Dashboard</a>
        <a href="outlier-preview.html#why-outlier" class="text-slate-600 hover:text-slate-950 transition-colors">Why Outlier</a>
        <a href="outlier-preview.html#testimonials" class="text-slate-600 hover:text-slate-950 transition-colors">Stories</a>
      `;
    } else {
      mainNav.innerHTML = `
        <a href="freelancers.html" class="${isFreelancers ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-950'} transition-colors">Freelancers</a>
        <a href="seller-profile.html" class="${isProfile ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-950'} transition-colors">Top Profile</a>
        <a href="outlier-preview.html#why-outlier" class="text-slate-600 hover:text-slate-950 transition-colors">Why Outlier</a>
        <a href="outlier-preview.html#testimonials" class="text-slate-600 hover:text-slate-950 transition-colors">Stories</a>
      `;
    }
  }

  // 4. Update Mobile Drawer Actions Container (#mobileAuthNav)
  const mobileAuth = document.getElementById('mobileAuthNav');
  if (mobileAuth) {
    if (isAuth && user) {
      mobileAuth.innerHTML = `
        <a href="dashboard.html" class="w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm text-center flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>${user.name || 'Client Console'} ↗</span>
        </a>
        <button type="button" onclick="FindWorkersAuth.terminateSession(); window.location.reload();" class="w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors text-center cursor-pointer">
          Sign Out
        </button>
      `;
    } else {
      mobileAuth.innerHTML = `
        <a href="login.html" class="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 text-sm text-center font-medium">Client Log In</a>
        <a href="signup.html" class="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm text-center">Client Sign Up</a>
      `;
    }
  }
}

// Auto-run header sync when DOM is loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncHeaderRouting);
  } else {
    syncHeaderRouting();
  }
}

// Global export for vanilla scripts
window.FindWorkersAuth = {
  AUTH_COOKIE,
  USER_COOKIE,
  DEMO_USER,
  getCookie,
  setCookie,
  eraseCookie,
  isTokenValid,
  getCurrentUser,
  isAuthenticated,
  establishSession,
  terminateSession,
  enforceClientAuth,
  redirectIfAlreadyLoggedIn,
  syncHeaderRouting,
};
