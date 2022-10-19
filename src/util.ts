const util = {
  getBroswer() {
    let sys: any = {};
    const ua = navigator.userAgent.toLowerCase();
    let s;
    (s = ua.match(/edge\/([\d.]+)/))
      ? (sys.edge = s[1])
      : (s = ua.match(/rv:([\d.]+)\) like gecko/))
      ? (sys.ie = s[1])
      : (s = ua.match(/msie ([\d.]+)/))
      ? (sys.ie = s[1])
      : (s = ua.match(/firefox\/([\d.]+)/))
      ? (sys.firefox = s[1])
      : (s = ua.match(/chrome\/([\d.]+)/))
      ? (sys.chrome = s[1])
      : (s = ua.match(/opera.([\d.]+)/))
      ? (sys.opera = s[1])
      : (s = ua.match(/version\/([\d.]+).*safari/))
      ? (sys.safari = s[1])
      : 0;

    if (sys.edge) return { broswer: 'Edge', version: sys.edge };
    if (sys.ie) return { broswer: 'IE', version: sys.ie };
    if (sys.firefox) return { broswer: 'Firefox', version: sys.firefox };
    if (sys.chrome) return { broswer: 'Chrome', version: sys.chrome };
    if (sys.opera) return { broswer: 'Opera', version: sys.opera };
    if (sys.safari) return { broswer: 'Safari', version: sys.safari };

    return { broswer: '', version: '0' };
  },
  getSystem() {
    const sUserAgent = navigator.userAgent;
    const isWin = navigator.platform == 'Win32' || navigator.platform == 'Windows';
    const isMac =
      navigator.platform == 'Mac68K' ||
      navigator.platform == 'MacPPC' ||
      navigator.platform == 'Macintosh' ||
      navigator.platform == 'MacIntel';
    if (isMac) return 'Mac';
    const isUnix = navigator.platform == 'X11' && !isWin && !isMac;
    if (isUnix) return 'Unix';
    const isLinux = String(navigator.platform).indexOf('Linux') > -1;
    if (isLinux) return 'Linux';
    if (isWin) {
      const isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1;
      if (isWin2K) return 'Win2000';
      const isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1;
      if (isWinXP) return 'WinXP';
      const isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1;
      if (isWin2003) return 'Win2003';
      const isWinVista = sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1;
      if (isWinVista) return 'WinVista';
      const isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1;
      if (isWin7) return 'Win7';
      const isWin10 = sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1;
      if (isWin10) return 'Win10';
    }
    return 'other';
  },
};

export default util;
