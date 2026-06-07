const BAIDU_SCRIPT_ID = "baidu-analytics-script";

export function injectBaiduAnalytics(token: string) {
  if (typeof window === "undefined") return false;
  if (!token?.trim()) return false;
  if (document.getElementById(BAIDU_SCRIPT_ID)) return false;

  const script = document.createElement("script");
  script.id = BAIDU_SCRIPT_ID;
  script.dataset.baiduAnalytics = "true";
  script.async = true;
  script.src = `https://hm.baidu.com/hm.js?${token}`;
  document.head.appendChild(script);
  return true;
}
