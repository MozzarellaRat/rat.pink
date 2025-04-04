function ENCRYPT(e) {
	function t(e, t) {
		return e << t | e >>> 32 - t
	}

	function o(e) {
		var t, o = "";
		for (t = 7; t >= 0; t--) o += (e >>> 4 * t & 15).toString(16);
		return o
	}
	var n, r, i, a, s, c, l, u, d, h = new Array(80),
		g = 1732584193,
		w = 4023233417,
		f = 2562383102,
		m = 271733878,
		p = 3285377520,
		v = (e = function(e) {
			e = e.replace(/\r\n/g, "\n");
			for (var t = "", o = 0; o < e.length; o++) {
				var n = e.charCodeAt(o);
				n < 128 ? t += String.fromCharCode(n) : n > 127 && n < 2048 ? (t += String.fromCharCode(n >> 6 | 192), t += String.fromCharCode(63 & n | 128)) : (t += String.fromCharCode(n >> 12 | 224), t += String.fromCharCode(n >> 6 & 63 | 128), t += String.fromCharCode(63 & n | 128))
			}
			return t
		}(e)).length,
		y = new Array;
	for (r = 0; r < v - 3; r += 4) i = e.charCodeAt(r) << 24 | e.charCodeAt(r + 1) << 16 | e.charCodeAt(r + 2) << 8 | e.charCodeAt(r + 3), y.push(i);
	switch (v % 4) {
		case 0:
			r = 2147483648;
			break;
		case 1:
			r = e.charCodeAt(v - 1) << 24 | 8388608;
			break;
		case 2:
			r = e.charCodeAt(v - 2) << 24 | e.charCodeAt(v - 1) << 16 | 32768;
			break;
		case 3:
			r = e.charCodeAt(v - 3) << 24 | e.charCodeAt(v - 2) << 16 | e.charCodeAt(v - 1) << 8 | 128
	}
	for (y.push(r); y.length % 16 != 14;) y.push(0);
	for (y.push(v >>> 29), y.push(v << 3 & 4294967295), n = 0; n < y.length; n += 16) {
		for (r = 0; r < 16; r++) h[r] = y[n + r];
		for (r = 16; r <= 79; r++) h[r] = t(h[r - 3] ^ h[r - 8] ^ h[r - 14] ^ h[r - 16], 1);
		for (a = g, s = w, c = f, l = m, u = p, r = 0; r <= 19; r++) d = t(a, 5) + (s & c | ~s & l) + u + h[r] + 1518500249 & 4294967295, u = l, l = c, c = t(s, 30), s = a, a = d;
		for (r = 20; r <= 39; r++) d = t(a, 5) + (s ^ c ^ l) + u + h[r] + 1859775393 & 4294967295, u = l, l = c, c = t(s, 30), s = a, a = d;
		for (r = 40; r <= 59; r++) d = t(a, 5) + (s & c | s & l | c & l) + u + h[r] + 2400959708 & 4294967295, u = l, l = c, c = t(s, 30), s = a, a = d;
		for (r = 60; r <= 79; r++) d = t(a, 5) + (s ^ c ^ l) + u + h[r] + 3395469782 & 4294967295, u = l, l = c, c = t(s, 30), s = a, a = d;
		g = g + a & 4294967295, w = w + s & 4294967295, f = f + c & 4294967295, m = m + l & 4294967295, p = p + u & 4294967295
	}
	return (d = o(g) + o(w) + o(f) + o(m) + o(p)).toLowerCase()
}

function createBlockingRequest(e, t) {
	if (-1 !== t.indexOf("http://") || -1 !== t.indexOf("https://") || "manifest.json" === t) {
		var o = new XMLHttpRequest;
		return o.open(e, t, !1), o
	}
	return null
}

function createNonBlockingRequest(e, t) {
	if (-1 !== t.indexOf("http://") || -1 !== t.indexOf("https://") || "manifest.json" === t) {
		var o = new XMLHttpRequest;
		return o.open(e, t, !0), o
	}
	return null
}

function fetchClusterUrl() {
	var e = window.userEmail.split("@")[1],
		t = createBlockingRequest("get", checkClusterURL + "/crextn/cluster?domain=" + e + "&reasonCode=" + window.clusterFound),
		o = localStorage.getItem("cluster");
	if (o && 2 == (o = o.split(",")).length) {
		var n = 0;
		if ((n = (new Date).getTime() / 1e3 - o[1]) < 0 && (n = 31622400), n < 31536e3 && "UNKNOWN_SCHOOL" != o[0] && "unknown" != window.ClusterUrl) {
			if (window.clusterUrl = o[0], window.clusterFound = window.clusterStatus.FOUND, "UNKNOWN_SCHOOL" !== window.clusterUrl && "AVOID_OS" !== window.clusterUrl && "unknown" !== window.clusterUrl) return 1 == window.needToReloadTabs && (window.needToReloadTabs = 0, checkAllLoadedTabs()), latencyCheck(), getGeolocationStatus(), void getFeatureConfig();
			if (n < 3600 && "AVOID_OS" == window.clusterUrl) return void(window.clusterFound = window.clusterStatus.AVOID_OS)
		} else if (n < 3600 && ("UNKNOWN_SCHOOL" == o[0] || "unknown" == window.ClusterUrl)) return window.clusterUrl = o[0], void("UNKNOWN_SCHOOL" == window.clusterUrl && (window.clusterFound = window.clusterStatus.UNKNOWN_SCHOOL))
	}
	t.onreadystatechange = function() {
		if (4 == t.readyState && 200 == t.status) {
			var e = t.responseText.trim();
			window.debugIWF = 0, -1 !== e.lastIndexOf("_disableIWF") ? (window.clusterUrl = e.slice(0, e.lastIndexOf("_disableIWF")), window.debugIWF = 1, localStorage.clear()) : -1 !== e.lastIndexOf("_updateIWF") ? (window.clusterUrl = e.slice(0, e.lastIndexOf("_updateIWF")), window.debugIWF = 2, downloadIWFList(), downloadNonCIPA()) : (window.clusterUrl = e, localStorage.setItem("cluster", window.clusterUrl + "," + (new Date).getTime() / 1e3)), window.clusterFound = window.clusterStatus.FOUND, setupIWF(), getGeolocationStatus(), getFeatureConfig(), "UNKNOWN_SCHOOL" != window.clusterUrl ? "AVOID_OS" != window.clusterUrl ? "UNKNOWN_SCHOOL" !== window.clusterUrl && "AVOID_OS" !== window.clusterUrl && "unknown" !== window.clusterUrl && latencyCheck() : window.clusterFound = window.clusterStatus.AVOID_OS : window.clusterFound = window.clusterStatus.UNKNOWN_SCHOOL
		} else window.clusterFound = window.clusterStatus.ERROR
	};
	try {
		t.send()
	} catch (e) {
		console.log("Send error uc4")
	}!0 === forceClusterUrl && (window.clusterUrl = DEBUG_clusterUrl, window.clusterFound = 1, getGeolocationStatus(), getFeatureConfig()), setupOrReload()
}

function fetchDNS() {
	domainCheck = checkClusterURL.replace(/http:\/\/|https:\/\//gi, "");
	var e = createBlockingRequest("get", "https://dns.google.com/resolve?name=" + domainCheck + "&type=A");
	e.onreadystatechange = function() {
		if (200 == e.status) {
			var t = JSON.parse(e.responseText.trim());
			"object" == typeof t && (t.Answer.length >= 2 ? (window.checkClusterURL = "https://" + t.Answer[1].data, fetchClusterUrl()) : 1 == t.Answer.length && (window.checkClusterURL = "https://" + t.Answer[0].data, fetchClusterUrl()))
		}
	}, e.send()
}

function fetchUserAPI() {
	chrome.identity.getProfileUserInfo(function(e) {
		var t = e.email;
		!0 === forceUserEmail && (t = DEBUG_userEmail), "" !== t ? (window.userEmail = t, window.userFound = window.userStatus.FOUND, fetchClusterUrl()) : (window.clusterFound = window.clusterStatus.AVOID_OS, window.clusterUrl = "AVOID_OS")
	})
}

function skipCacheAndLogAlways(e, t) {
	if (checkDomain(t, "twitter.com")) return 1;
	if (checkDomain(t, "facebook.com")) return 1;
	let o = new URL(t);
	return googleDomains.indexOf(o.hostname.replace(/(^www\.)|(^\.)/, "")) >= 0 && !checkDomain(t, "mail.google.com") && !checkDomain(t, "drive.google.com") ? 1 : checkDomain(t, "youtube.com") ? 1 : SearchEngines.some(e => checkDomain(t, e)) ? 1 : 0
}

function isBlockingInProgress(e, t) {
	return new Promise(function(o, n) {
		chrome.tabs.get(e, function(e) {
			if (e && "loading" == e.status) {
				var n = new URL(t);
				if (checkDomain(t, "securly.com") && n.pathname.startsWith("/blocked") || checkDomain(t, "iheobagjkfklnlikgihanlhcddjoihkg") && n.pathname.startsWith("/blocked")) return void o(!0);
				if (void 0 !== e.pendingUrl && (n = new URL(e.pendingUrl), checkDomain(e.pendingUrl, "securly.com") && n.pathname.startsWith("/blocked") || checkDomain(e.pendingUrl, "iheobagjkfklnlikgihanlhcddjoihkg") && n.pathname.startsWith("/blocked"))) return void o(!0)
			}
			o(!1)
		})
	})
}

function getLocation(e) {
	var t = document.createElement("a");
	return t.href = e, t
}

function interceptOrNot(e) {
	var t = 0,
		o = e.type,
		n = e.url,
		r = getLocation(n).hostname,
		i = getLocation(n).pathname;
	if (window.clusterFound == window.clusterStatus.AVOID_OS || "AVOID_OS" == window.clusterUrl || "UNKNOWN_SCHOOL" == window.clusterUrl) return t = 0;
	if (0 === e.url.indexOf("file")) return 0;
	var a = n.replace(/^https?\:\/\//i, "");
	a = a.replace(/^www\.\b/i, "");
	var s = new URL(n),
		c = a.length;
	"/" === a.charAt(c - 1) && (a = a.slice(0, -1));
	var l = ENCRYPT(a);
	if (null !== localStorage.getItem(l)) return window.featureConfig.isAwareOnly || window.featureConfig.isDiscernMode ? 0 : (takeDenyActionTabs("G", "BL", "", window.btoa(a), e.tabId), t = 0);
	if (window.failedOpenObj && window.failedOpenObj.isFailedOpen()) {
		if (window.featureConfig.isAwareOnly) return 0;
		if (window.failedOpenObj.isWideOpenMode()) t = 0;
		else {
			0 == r.indexOf("www.") && (r = r.substr(4));
			var u = ENCRYPT(r),
				d = localStorage.getItem("NC:" + u);
			null == d || "main_frame" != o && "sub_frame" != o || takeToFailedOpenBlockedPage(e.tabId, r, d)
		}
		return t
	}
	if (checkDomain(n, "youtube.com") || (n = n.toLowerCase()), checkDomain(n, "google.com") && s.pathname.includes("/maps/") && s.pathname.includes("/place/")) return t = 1;
	if ("sub_frame" == e.frameType && e.initiator.includes("embeds.googleusercontent.com") && "object" === e.type) return t = 1;
	if ("main_frame" !== o && "sub_frame" !== o && "xmlhttprequest" !== o) return t = 0;
	if (checkDomain(n, "securly.com")) {
		if (t = 0, s.pathname.includes("crextn/debug") && "xmlhttprequest" != o) {
			var h = getDebugInfo();
			h.sourceFunction = "interceptOrNot", sendDebugInfo(h)
		}
		return t
	}
	return checkDomain(n, "baidu.com") && s.pathname.includes("/s") && "xmlhttprequest" == o && "1" === s.searchParams.get("mod") ? t = 1 : checkDomain(n, "google.com") && s.pathname.includes("/plusappui/mutate") && "xmlhttprequest" == o ? t = 1 : isGoogleHost(s.hostname) ? (t = 0, "xmlhttprequest" != o && "main_frame" != o ? t = 0 : checkDomain(n, "accounts.google.com") || checkDomain(n, "docs.google.com") || s.pathname.includes("/calendar/") || checkDomain(n, "code.google.com") || s.pathname.includes("/cloudprint") || s.pathname.includes("/_/chrome/newtab") || checkDomain(n, "appengine.google.com") || s.pathname.includes("/complete/search") || s.pathname.includes("/webhp") ? t = 0 : checkDomain(n, "meet.google.com") ? t = 1 : s.pathname.includes("/search") || "#q" === s.hash || checkDomain(n, "translate.google.com") || checkDomain(n, "remotedesktop.google.com") ? t = 1 : checkDomain(n, "mail.google.com") && "main_frame" == o ? t = 1 : checkDomain(n, "drive.google.com") && "main_frame" == o ? t = 1 : checkDomain(n, "sites.google.com") && "main_frame" == o ? t = 1 : checkDomain(n, "hangouts.google.com") && "main_frame" == o ? t = 1 : checkDomain(n, "plus.google.com") && "main_frame" == o ? t = 1 : "main_frame" == o && s.pathname.startsWith("/logos") ? t = 1 : 0) : checkDomain(n, "youtube.com") && "main_frame" == o ? t = 1 : checkDomain(n, "youtube.com") && "sub_frame" == o && s.pathname.includes("embed") ? t = 1 : checkDomain(n, "youtube.com") && (s.pathname.includes("watch_fragments_ajax") || s.pathname.includes("doubleclick/DARTIframe.html") || s.pathname.includes("ad_data_204") || s.pathname.includes("annotations_invideo") || s.pathname.includes("api/stats/atr") || s.pathname.includes("get_video_info")) ? t = 0 : checkDomain(n, "youtube.com") && s.pathname.includes("youtubei/v1/search") || s.pathname.includes("/results") ? 1 : "main_frame" != o && "sub_frame" != o || !checkDomain(n, "youtube.com") ? checkDomain(n, "facebook.com") && "sub_frame" == o ? t = 0 : checkDomain(n, "bing.com") && s.pathname.includes("/fd/fb") || checkDomain(n, "ssl.bing.com") || s.pathname.includes("/passport.aspx") ? t = 0 : checkDomain(n, "bing.com") && "sub_frame" === o ? t = 1 : "main_frame" == o || "sub_frame" == o && 1 == window.checkiFrames ? t = 1 : t : s.pathname.includes("youtubei/v1/search") ? 1 : "/" == i ? 1 : s.pathname.includes("/results") || s.pathname.includes("/watch") ? s.searchParams.has("pbj") && 1 === parseInt(s.searchParams.get("pbj")) ? 0 : t = 1 : 0
}

function getBlockUrl(e, t, o, n, r) {
	var i = "domainblockedforuser",
		a = "";
	"GL" == e && (i = "GEO"), "-1" != o && (i = "safesearch", a = window.btoa(o));
	var s = "";
	if ("BL" != t && "BL_SRCH" != t && "WL" != t && "WL_SRCH" != t || (s = t), "BL" != t && "BL_SRCH" != t || (i = "G" == e ? "globalblacklist" : "policyblacklist", t = "BL"), "WL" != t && "WL_SRCH" != t || (i = "whitelistonly", t = "WL"), "BANNED" == t && (i = "banned"), "unknown" != window.clusterUrl) {
		var c = window.atob(n),
			l = c.substr(c.indexOf("://") + 3);
		n = window.btoa(l);
		var u = "";
		return u = window.clusterUrl.replace("/crextn", "") + "/blocked?useremail=" + window.userEmail + "&reason=" + i + "&categoryid=" + t + "&policyid=" + e + "&keyword=" + a + "&url=" + n + "&ver=" + window.version + (1 == r ? "&subFrame=1" : "") + "&extension_id=" + chrome.runtime.id + "&internal_ip=" + window.currentUserInternalIp, window.geoLat && window.geoLng && (u += "&lat=" + window.geoLat + "&lng=" + window.geoLng), s && (u += "&listType=" + s), u
	}
}

function takeDenyActionTabs(e, t, o, n, r, i, a) {
	invalidateSkipListCaching(n, !1), clearWebCache(n), window.brokredRequest = [];
	var s = "domainblockedforuser",
		c = "";
	"GL" == e && (s = "GEO"), "-1" != o && (s = "safesearch", c = window.btoa(o));
	var l = "";
	if ("BL" != t && "BL_SRCH" != t && "WL" != t && "WL_SRCH" != t || (l = t), "BL" != t && "BL_SRCH" != t || (s = "G" == e ? "globalblacklist" : "policyblacklist", t = "BL"), "BANNED" == t && (s = "banned"), "WL" != t && "WL_SRCH" != t || (s = "whitelistonly", t = "WL"), "unknown" != window.clusterUrl) {
		var u = window.atob(n),
			d = u.substr(u.indexOf("://") + 3);
		n = window.btoa(d);
		var h = window.clusterUrl.replace("/crextn", ""),
			g = window.userEmail,
			w = "";
		return w = h + "/blocked?useremail=" + g + "&reason=" + s + "&categoryid=" + t + "&policyid=" + e + "&keyword=" + c + "&url=" + n + "&ver=" + window.version + (1 == i ? "&subFrame=1" : "") + "&extension_id=" + chrome.runtime.id + "&internal_ip=" + window.currentUserInternalIp, window.geoLat && window.geoLng && (w += "&lat=" + window.geoLat + "&lng=" + window.geoLng), l && (w += "&listType=" + l), void 0 !== a && a && (w += "&rebroker=1"), void isBlockingInProgress(r, "http://" + window.atob(n)).then(function(e) {
			e || setBlockedPage(r, w)
		}).catch(function(e) {
			console.log("exception in checking blocking progress", r), setBlockedPage(r, w)
		})
	}
}

function setBlockedPage(e, t) {
	-1 == e && (e = null), e > 0 && (window.tabsBeingBlocked[e] = t, chrome.tabs.get(e, t => {
		var o = new URL(t.url);
		"chrome:" !== !o.protocol || "chrome-extension:" !== !o.protocol || checkDomain(t.url, "securly.com") || chrome.tabs.executeScript(e, {
			allFrames: !0,
			code: "window.stop(); window.location = '';",
			runAt: "document_start"
		}, function() {})
	})), chrome.tabs.update(e, {
		url: "chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html"
	}, function() {
		chrome.runtime.lastError
	}), chrome.tabs.update(e, {
		url: t
	}, function() {
		chrome.runtime.lastError && (chrome.tabs.get(e, e => {
			-1 !== e.groupId && chrome.tabs.create({
				url: t
			}, function() {
				chrome.runtime.lastError ? console.error("Error opening new tab:", chrome.runtime.lastError.message) : chrome.tabs.remove(e.id, function() {
					chrome.runtime.lastError && console.error("Error closing saved group tab:", chrome.runtime.lastError.message)
				})
			})
		}), console.log("some error while redirecting to blocked page", chrome.runtime.lastError), setTimeout(function() {
			chrome.tabs.update(null, {
				url: t
			}, function() {})
		}, 500))
	})
}

function takeDenyAction(e, t, o) {
	invalidateSkipListCaching(o, !1), clearWebCache(o);
	var n = "domainblockedforuser";
	if ("0" == e && "-1" == t) return {
		cancel: !0
	};
	var r = "";
	if ("BL" != t && "BL_SRCH" != t && "WL" != t && "WL_SRCH" != t || (r = t), "BL" != t && "BL_SRCH" != t || (n = "G" == e ? "globalblacklist" : "policyblacklist", t = "BL"), "BANNED" == t && (n = "banned"), "unknown" == window.clusterUrl) return {
		cancel: !0
	};
	var i = window.atob(o),
		a = i.substr(i.indexOf("://") + 3);
	o = window.btoa(a);
	var s = window.clusterUrl.replace("/crextn", "") + "/blocked?useremail=" + window.userEmail + "&reason=" + n + "&categoryid=" + t + "&policyid=" + e + "&url=" + o + "&ver=" + window.version + (1 == window.isSubFrame ? "&subFrame=1" : "") + "&extension_id=" + chrome.runtime.id + "&internal_ip=" + window.currentUserInternalIp;
	return window.geoLat && window.geoLng && (s += "&lat=" + window.geoLat + "&lng=" + window.geoLng), r && (s += "&listType=" + r), {
		redirectUrl: s
	}
}

function takeSafeSearchAction(e, t) {
	var o = new URL(t);
	if (googleDomains.indexOf(o.hostname.replace(/(^www\.)|(^\.)/, "")) >= 0) {
		if ((o.pathname.includes("/search") || "#q" === o.hash) && "active" != o.searchParams.get("safe")) return o.searchParams.set("safe", "active"), o.href
	} else {
		if (checkDomain(t, "bing.com") && "strict" != o.searchParams.get("adlt")) return o.searchParams.set("adlt", "strict"), o.href;
		if (checkDomain(t, "search.yahoo.com") && "r" != o.searchParams.get("vm")) return o.searchParams.set("vm", "r"), o.href
	}
	return t
}

function takeCreativeCommonImageSearchAction(e) {
	var t = new URL(e);
	return googleDomains.indexOf(t.hostname.replace(/(^www\.)|(^\.)/, "")) >= 0 && ("isch" === t.searchParams.get("tbm") || "2" === t.searchParams.get("udm")) ? (!t.searchParams.has("tbs") || "sur:cl" !== t.searchParams.get("tbs")) && (t.searchParams.set("tbs", "sur:cl"), t.href) : !checkDomain(e, "bing.com") || !t.pathname.includes("/images/search") || t.pathname.includes("/ck/") || t.searchParams.has("qft") && " filterui:licenseType-Any" === t.searchParams.get("qft") ? !checkDomain(e, "images.search.yahoo") || !t.pathname.startsWith("/search/images") || t.searchParams.has("imgl") && "cc" === t.searchParams.get("imgl") ? e : (t.searchParams.set("imgl", "cc"), t.href) : (t.searchParams.set("qft", "+filterui:licenseType-Any"), t.href)
}

function getYtSSRequestHeaders(e, t) {
	var o = new URL(e);
	if (o.pathname.includes("/results") || o.pathname.includes("/search") || o.pathname.includes("/watch")) {
		for (var n = "", r = 0; r < t.length; ++r)
			if ("Cookie" === t[r].name) {
				n = t[r].value, t.splice(r, 1);
				break
			} if ("" == n) t.push({
			name: "Cookie",
			value: "PREF=f2=8000000"
		});
		else {
			var i = 0,
				a = n.split("; ");
			for (r = 0; r < a.length; ++r) - 1 != a[r].indexOf("PREF") && (-1 == a[r].indexOf("f2=8000000") && (a[r] += "&f2=8000000"), i = 1), -1 != a[r].indexOf("SID=") && (a[r] = "");
			0 == i && a.push("PREF=f2=8000000");
			var s = "";
			for (r = 0; r < a.length; ++r) s += a[r], s += "; ";
			s = s.substring(0, s.length - 2), t.push({
				name: "Cookie",
				value: s
			})
		}
	}
	return t
}

function getPauseAction(e) {
	return invalidateSkipListCaching(e, !0), clearWebCache(e), window.brokredRequest = [], "unknown" == window.clusterUrl ? {
		cancel: !0
	} : {
		redirectUrl: window.clusterUrl.replace("/crextn", "") + "/paused"
	}
}

function takePauseActionTabs(e, t) {
	var o = getPauseAction(e);
	if (void 0 !== o.redirectUrl) {
		var n = o.redirectUrl;
		chrome.tabs.update(t, {
			url: "chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html"
		}, r), chrome.tabs.update(t, {
			url: n
		}, r), setTimeout(function() {
			chrome.tabs.update(null, {
				url: n
			}, r)
		}, 500)
	}

	function r() {
		chrome.runtime.lastError
	}
}

function takeToFailedOpenBlockedPage(e, t, o) {
	var n = btoa(t);
	r = [], 0 != (Math.pow(2, 3) & o) && r.push("Pornography"), 0 != (Math.pow(2, 4) & o) && r.push("Drugs"), 0 != (Math.pow(2, 5) & o) && r.push("Gambling");
	var r = btoa(r.join(", "));
	window.brokredRequest = [], chrome.tabs.update(e, {
		url: "chrome-extension://iheobagjkfklnlikgihanlhcddjoihkg/blocked.html?site=" + n + "&category=" + r
	}, function() {
		chrome.runtime.lastError
	})
}

function checkSkipListCaching(e) {
	var t = "",
		o = document.createElement("a");
	o.href = e.url;
	var n = cleanURL(o.hostname.toLowerCase()),
		r = Math.floor(Date.now() / 1e3),
		i = Object.keys(window.skipList);
	if (i && -1 != i.indexOf(n)) {
		if (t = n, ttlForDomain = window.skipList[n].ttl, lastBrokerCall = window.skipList[n].last_broker_call, -1 == ttlForDomain) return 0;
		if (r - lastBrokerCall < ttlForDomain) return 0
	}
	for (var a = 0; a < i.length; a++) {
		if (-1 != i[a].indexOf("*"))
			if (window.skipList[i[a]].regx.test(cleanURL(e.url))) {
				if (t = i[a], ttlForDomain = window.skipList[i[a]].ttl, lastBrokerCall = window.skipList[i[a]].last_broker_call, -1 == ttlForDomain) return 0;
				if (r - lastBrokerCall < ttlForDomain) return 0
			}
	}
	return t.length > 0 && (window.skipList[t].last_broker_call = r), 1
}

function invalidateSkipListCaching(e, t) {
	url = window.atob(e);
	var o = Object.keys(window.skipList);
	if (t)
		for (var n = 0; n < o.length; n++) window.skipList[o[n]].last_broker_call = 0;
	else {
		var r = document.createElement("a");
		r.href = url;
		var i = cleanURL(r.hostname.toLowerCase());
		o && -1 != o.indexOf(i) && (window.skipList[i].last_broker_call = 0);
		for (n = 0; n < o.length; n++) {
			if (-1 != o[n].indexOf("*")) window.skipList[o[n]].regx.test(cleanURL(url)) && (window.skipList[o[n]].last_broker_call = 0)
		}
	}
}

function isClusterURLAvailable() {
	return window.userEmail && "UNKNOWN_SCHOOL" !== window.clusterUrl && "AVOID_OS" !== window.clusterUrl && "unknown" !== window.clusterUrl
}

function setupOrReload() {
	window.userFound == window.userStatus.FOUND && window.clusterFound == window.clusterStatus.FOUND ? ("UNKNOWN_SCHOOL" !== window.clusterUrl && "AVOID_OS" !== window.clusterUrl && "unknown" !== window.clusterUrl && 1 == window.needToReloadTabs && (window.needToReloadTabs = 0, checkAllLoadedTabs()), setTimeout(function() {
		fetchClusterUrl()
	}, 18e5), sessionStorage.clear()) : window.clusterFound == window.clusterStatus.AVOID_OS ? (window.needToReloadTabs = 1, setTimeout(function() {
		fetchClusterUrl()
	}, 18e5), sessionStorage.clear()) : (console.log("https://www.securly.com/crextn/blocked?useremail=" + window.userEmail + "&reason=notregistered&cu=" + window.clusterUrl + "&uf=" + window.userFound + "&cf=" + window.clusterFound + "&ver=" + window.version + "&url="), setTimeout(function() {
		fetchClusterUrl()
	}, 18e5))
}

function getGeolocationStatus() {
	if ("unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
		var e = createBlockingRequest("get", window.clusterUrl + "/getGeoStatus?userEmail=" + window.userEmail);
		e.onload = function() {
			window.geolocation = parseInt(e.responseText.trim()), window.geolocation && (getGeolocation(), null != window.geoIntervalId && clearInterval(window.geoIntervalId), window.geoIntervalId = setInterval(function() {
				getGeolocation()
			}, 6e4))
		};
		try {
			e.send()
		} catch (e) {
			console.log("Geolocation request error.")
		}
	}
}

function getGeolocation() {
	navigator.geolocation.getCurrentPosition(function(e) {
		window.geoLat = e.coords.latitude, window.geoLng = e.coords.longitude
	}, function(e) {
		console.log("Geolocation error occurred. Error code: " + e.code)
	}, {
		timeout: 3e4,
		maximumAge: 3e5
	})
}

function getRemoteIPGeo() {
	if ("unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
		var e = createBlockingRequest("get", window.clusterUrl + "/getGeoStatus?ip=1");
		e.onload = function() {
			e.responseText.trim() != window.geoLastIP && (getGeolocation(), window.geoLastIP = e.responseText.trim())
		};
		try {
			e.send()
		} catch (e) {
			console.log("Geolocation remote IP request error.")
		}
	}
}

function getVersion(e) {
	var t = createBlockingRequest("GET", "manifest.json");
	t.onload = function(e) {
		var o = JSON.parse(t.responseText);
		window.version = o.version
	};
	try {
		t.send()
	} catch (e) {
		console.log("Send error u2")
	}
}

function getQueryVariable(e, t) {
	var o = document.createElement("a");
	o.href = e;
	for (var n = o.search.replace(/\?/, "").split("&"), r = 0; r < n.length; r++) {
		var i = n[r].split("=");
		if (decodeURIComponent(i[0]) == t) return decodeURIComponent(i[1])
	}
	return ""
}

function normalizeHostname(e) {
	var t = e;
	return 0 == e.indexOf("www.") ? t = e.substr(4) : 0 == e.indexOf("m.") && (t = e.substr(2)), t
}

function extractTranslateHostname(e) {
	var t = "translate.google.com",
		o = getQueryVariable(e, "u");
	if ("" != o) {
		var n = (o = (o = (o = (o = decodeURIComponent(o)).toLowerCase()).replace("http://", "")).replace("https://", "")).indexOf("/");
		t = -1 != n ? o.substr(0, n) : o
	}
	return t
}

function sendDebugInfo(e) {
	var t = window.clusterUrl + "/debug",
		o = new XMLHttpRequest;
	o.open("POST", t), o.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	try {
		o.send(JSON.stringify(e))
	} catch (e) {
		console.log("Send error u3")
	}
}

function checkAllLoadedTabs() {
	window.needToReloadTabs = 0, chrome.tabs.query({}, function(e) {
		for (var t = 0; t < e.length; t++) checkDomain(e[t].url, "securly.com") || -1 == e[t].url.indexOf("http://") && -1 == e[t].url.indexOf("https://") || chrome.tabs.reload(e[t].id)
	})
}

function clearWebCache(e) {
	var t = (new Date).getTime() - 3e5;
	chrome.browsingData.removeCache({
		since: t
	}, function() {
		chrome.runtime.lastError
	});
	try {
		var o = window.atob(e),
			n = new URL(o).hostname.replace("www.", "");
		chrome.browsingData.remove({
			origins: ["https://" + n, "https://www." + n]
		}, {
			cacheStorage: !0,
			fileSystems: !0,
			indexedDB: !0,
			localStorage: !0,
			pluginData: !0,
			serviceWorkers: !0,
			webSQL: !0
		}, function() {})
	} catch (t) {
		console.log("Clearing web cache failed. b64Url" + e)
	}
}

function getDebugInfo() {
	var e = {
		clusterUrl: window.clusterUrl,
		userEmail: window.userEmail
	};
	if ("unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
		var t = createBlockingRequest("get", window.clusterUrl.replace("crextn", "app/session"));
		t.onerror = function() {
			e.sessionInfo = "Network Error", console.log(e)
		}, t.onload = function() {
			e.sessionInfo = t.responseText
		}, t.send();
		for (var o = ["http://www.maxim.com", "http://www.amazon.com", "http://www.google.com", "http://www.bing.com", "http://search.yahoo.com", "http://www.youtube.com", "http://mail.google.com", "http://plus.google.com", "http://www.facebook.com", "http://docs.google.com", "http://drive.google.com", "http://sites.google.com"], n = 0; n < o.length; n++) {
			e = getFilteringInfo(o[n], e)
		}
	}
	return e
}

function getFilteringInfo(e, t) {
	var o = createBlockingRequest("get", siteUrlToBrokerUrl(e));
	return o.onerror = function() {
		t[e] = "Network Error"
	}, o.onload = function() {
		t[e] = o.responseText.trim()
	}, o.send(), t
}

function siteUrlToBrokerUrl(e) {
	var t = document.createElement("a");
	t.href = e;
	var o = t.hostname.toLowerCase(),
		n = window.btoa(e);
	return window.geolocation ? window.clusterUrl + "/broker?useremail=" + window.userEmail + "&reason=crextn&host=" + o + "&url=" + n + "&msg=&ver=" + window.version + "&cu=" + window.clusterUrl + "&uf=" + window.userFound + "&cf=" + window.clusterFound + "&lat=" + window.geoLat + "&lng=" + window.geoLng : window.clusterUrl + "/broker?useremail=" + window.userEmail + "&reason=crextn&host=" + o + "&url=" + n + "&msg=&ver=" + window.version + "&cu=" + window.clusterUrl + "&uf=" + window.userFound + "&cf=" + window.clusterFound
}

function selfClusterCheckBeforeBroker() {
	("unknown" === window.clusterUrl || window.clusterFound !== window.clusterStatus.FOUND && window.clusterFound !== window.clusterStatus.AVOID_OS) && (window.needToReloadTabs = 0, fetchClusterUrl())
}

function downloadIWFList() {
	localStorage.clear();
	var e = createNonBlockingRequest("get", "http://cdn1.securly.com/iwf-encode.txt");
	e.onreadystatechange = function() {
		if (4 == e.readyState)
			if (200 == e.status) {
				String.prototype.replaceAll = function(e, t) {
					return this.split(e).join(t)
				};
				for (var t = e.responseText.replaceAll("\r", "").trim().split("\n"), o = 0; o < t.length; o++) localStorage.setItem(t[o], "1");
				var n = new Date;
				localStorage.setItem("currIWFTime", n)
			} else console.log("iwf error", e.status)
	}, e.send()
}

function downloadNonCIPA() {
	var e = createNonBlockingRequest("get", "http://cdn1.securly.com/non-cipa-encode.txt");
	e.onreadystatechange = function() {
		if (4 == e.readyState)
			if (200 == e.status) {
				String.prototype.replaceAll = function(e, t) {
					return this.split(e).join(t)
				};
				for (var t = e.responseText.replaceAll("\r", "").trim().split("\n"), o = 0; o < t.length; o++) {
					var n = t[o].split(",");
					localStorage.setItem("NC:" + n[0], n[1])
				}
			} else console.log("non-cipa error", e.status)
	}, e.send()
}

function downloadPhraseMatch() {
	const e = createNonBlockingRequest("get", "http://cdn1.securly.com/pmatch.json");
	e.onreadystatechange = function() {
		if (4 == e.readyState)
			if (200 == e.status) try {
				const t = CryptoJS.AES.decrypt(e.responseText, phraseMatchPassPhrase).toString(CryptoJS.enc.Utf8);
				t && t.length > 0 && (phraseMatchList = JSON.parse(t))
			} catch (e) {
				console.error("parse error for phrase match", e)
			} else console.error("download error for phrase match", e.status)
	}, e.send()
}

function setupIWF() {
	var e = (new Date).getTime(),
		t = Date.parse(localStorage.getItem("currIWFTime"));
	isNaN(t) ? isNaN(t) && 0 === window.debugIWF && (downloadIWFList(), downloadNonCIPA(), downloadPhraseMatch()) : e - t >= window.IWFTimeout && (downloadIWFList(), downloadNonCIPA(), downloadPhraseMatch())
}

function myB64Encode(e, t) {
	for (var o = window.btoa(e).split(""), n = 0; n < o.length; n++) o[n] = myB64EncodeHelper(o[n], t);
	return o.join("")
}

function myB64EncodeHelper(e, t) {
	var o = e.charCodeAt(0);
	return "0" <= e && e <= "9" ? (o += t %= 10) > "9".charCodeAt(0) && (o -= 10) : "A" <= e && e <= "Z" ? (o += t %= 26) > "Z".charCodeAt(0) && (o -= 26) : "a" <= e && e <= "z" && (o += t %= 26) > "z".charCodeAt(0) && (o -= 26), String.fromCharCode(o)
}

function getCookies() {
	for (var e = document.cookie.split(";"), t = {}, o = 0; o < e.length; o++) {
		var n = e[o].split("=");
		t[(n[0] + "").trim()] = unescape(n[1])
	}
	return t
}

function setCookie(e, t, o) {
	var n = 0;
	if (o) {
		var r = new Date;
		r.setTime(r.getTime() + 60 * o * 60 * 1e3), n = "expires=" + r.toUTCString()
	}
	document.cookie = e + "=" + t + ";" + n + ";path=/"
}

function setClassroomCookies() {
	chrome.cookies.getAll({
		domain: "securly.com",
		name: "live_session"
	}, function(e) {
		e && e.length > 0 ? setCookie("live_session", e[0].value, 5) : setCookie("live_session", "0", 5)
	}), chrome.cookies.getAll({
		domain: "securly.com",
		name: "classroom_enabled"
	}, function(e) {
		e && e.length > 0 ? setCookie("classroom_enabled", e[0].value, 1440) : setCookie("classroom_enabled", "0", 1440)
	})
}

function setClearCacheCookie(e) {
	var t = new URL(window.clusterUrl).host;
	chrome.cookies.getAll({
		domain: t,
		name: "crextn_clear_cache_at"
	}, function(t) {
		if (t && t.length > 0) {
			var o = getCookies();
			setCookie("crextn_clear_cache_at", t[0].value), console.debug("[setClearCacheCookie]", "crextn_clear_cache_at cookie updated", t[0].value), void 0 !== o.crextn_clear_cache_at && o.crextn_clear_cache_at != decodeURIComponent(t[0].value) && (console.debug("[setClearCacheCookie]", "session cleared and rebrokering loaded tabs"), sessionStorage.clear(), rebrokerLoadedTabs(e))
		}
	})
}

function clearCacheIfTTLExpired() {
	var e = getCookies();
	void 0 !== e.crextn_clear_cache_at ? (new Date).getTime() >= new Date(e.crextn_clear_cache_at).getTime() && (console.debug("[clearCacheIfTTLExpired]", "session cleared"), sessionStorage.clear()) : console.debug("[clearCacheIfTTLExpired]", "crextn_clear_cache_at cookie not found")
}

function rebrokerLoadedTabs(e, t = !0) {
	e = void 0 === e ? "" : e, chrome.tabs.query({}, function(o) {
		for (var n = 0; n < o.length; n++) o[n].id != e && (t && checkDomain(o[n].url, "securly.com") || -1 == o[n].url.indexOf("http://") && -1 == o[n].url.indexOf("https://") || (o[n].initiator = "", o[n].type = "main_frame", o[n].method = "GET", o[n].tabId = o[n].id, onBeforeRequestListener(o[n], !0)))
	})
}

function doBrokerForClassroom() {
	var e = getCookies();
	if (1 == e.classroom_enabled && void 0 !== e.classroom_enabled) {
		if (1 == e.live_session && void 0 !== e.live_session) return !0;
		var t = Math.floor(Date.now() / 1e3);
		return void 0 !== e.last_broker_call ? t - e.last_broker_call > 300 : (setCookie("last_broker_call", t, 5), !0)
	}
	return !1
}

function latencyPing() {
	var e = Date.now(),
		t = createNonBlockingRequest("get", "https://" + window.latencyAPI + "/ping");
	t.onreadystatechange = function() {
		if (4 == t.readyState && 200 == t.status) {
			var o = Date.now() - e;
			createNonBlockingRequest("get", "https://" + window.latencyAPI + "/latency_report?fid=" + window.fid + "&user=" + window.userEmail + "&latency=" + o).send()
		}
	}, t.send()
}

function latencyCheck() {
	var e = localStorage.getItem("last_latency_check");
	if ((null == e || Math.floor(Date.now() / 1e3) - e >= 86400) && "unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
		var t = createNonBlockingRequest("get", window.clusterUrl + "/internetQualityFeed?userEmail=" + window.userEmail);
		t.onreadystatechange = function() {
			if (4 == t.readyState)
				if (200 == t.status) {
					var e = JSON.parse(t.responseText);
					1 == e.is_active ? (window.fid = e.fid, window.latencyFrequency !== e.frequency && null !== window.latencyInterval && (clearInterval(window.latencyInterval), window.latencyInterval = null), window.latencyFrequency = e.frequency, window.latencyAPI = e.api_server, null === window.latencyInterval && (window.latencyInterval = setInterval(function() {
						latencyPing()
					}, Math.floor(60 * window.latencyFrequency * 1e3)))) : null !== window.latencyInterval && (clearInterval(window.latencyInterval), window.latencyInterval = null), localStorage.setItem("last_latency_check", Math.floor(Date.now() / 1e3))
				} else localStorage.setItem("last_latency_check", Math.floor(Date.now() / 1e3))
		}, t.send()
	}
}

function downloadConfig() {
	var e = createNonBlockingRequest("get", "http://cdn1.securly.com/config.json");
	e.onreadystatechange = function() {
		if (200 == e.status && 4 == e.readyState) {
			if (0 == e.responseText.trim().length) return void(window.skipList = []);
			var t = JSON.parse(e.responseText);
			if (t.skiplist) {
				var o = [];
				t.skiplist.forEach(function(e) {
					var t = Object.keys(e)[0];
					if (void 0 !== t && t.trim().length > 0) {
						if (o[t] = {
								ttl: e[t],
								last_broker_call: 0
							}, -1 != t.indexOf("*")) {
							var n = t.replaceAll(".", "\\.").replaceAll("*", ".*").replaceAll("/", "\\/"),
								r = new RegExp(n);
							o[t].regx = r
						}
						void 0 !== window.skipList[t] && (o[t].last_broker_call = window.skipList[t].last_broker_call)
					}
				}), window.skipList = o
			}
			void 0 !== t.selfharmlist ? window.selfharmlist = t.selfharmlist : window.selfharmlist = [], void 0 !== t.vectorExpansionRules ? window.vectorExpansionRules = t.vectorExpansionRules : window.vectorExpansionRules = {}, void 0 !== t.bullyPhrases ? window.bullyPhrases = decryptPhrases(t.bullyPhrases) : window.bullyPhrases = [], void 0 !== t.wlBullyPhrases ? window.wlBullyPhrases = decryptPhrases(t.wlBullyPhrases) : window.wlBullyPhrases = [], void 0 !== t.thinkTwiceSites ? window.thinkTwiceSites = t.thinkTwiceSites : window.thinkTwiceSites = [], void 0 !== t.ttl && 1e3 * t.ttl != window.currentConfigTTL ? (window.currentConfigTTL = 1e3 * t.ttl, updateTTLForCrextnCacheConfig(window.currentConfigTTL)) : void 0 === t.ttl && window.defaultConfigTTL != window.currentConfigTTL && (window.currentConfigTTL = window.defaultConfigTTL, updateTTLForCrextnCacheConfig(window.defaultConfigTTL)), void 0 !== t.proxyIdentification ? window.proxyIdentification = t.proxyIdentification : window.proxyIdentification = []
		}
	}, e.send(), getInternalIpAddress()
}

function updateTTLForCrextnCacheConfig(e) {
	void 0 !== window.cacheIntervalId && clearInterval(window.cacheIntervalId), window.cacheIntervalId = setInterval(function() {
		downloadConfig()
	}, e)
}

function cleanURL(e) {
	return e.replace(/^(?:https?:\/\/)?/i, "")
}

function stripSafeSearchPramas(e) {
	return ["&safe=active", "\\?safe=active", "&adlt=strict", "\\?adlt=strict", "&vm=r", "\\?vm=r"].map(function(t) {
		e = e.replace(new RegExp(t + "$"), "")
	}), e
}

function isSeachRequest(e, t) {
	var o = new URL(t);
	return !!(googleDomains.indexOf(o.hostname.replace(/(^www\.)|(^\.)/, "")) >= 0 && o.pathname.startsWith("/search") || checkDomain(t, "bing.com") && o.pathname.startsWith("/search") || checkDomain(t, "search.yahoo.com") && o.pathname.startsWith("/search"))
}

function sendSHDataToServer(e, t, o, n) {
	if (isClusterURLAvailable()) {
		t = window.clusterUrl + "/flaggedSearches?search=" + window.btoa(e) + "&url=" + window.btoa(t) + "&match=" + window.btoa(o) + "&domain=" + window.btoa(n) + "&extension_id=" + chrome.runtime.id + "&internal_ip=" + window.currentUserInternalIp;
		window.geolocation && (t = t + "&lat=" + window.geoLat + "&lng=" + window.geoLng);
		var r = createNonBlockingRequest("get", t);
		try {
			r.send()
		} catch (e) {
			console.log("Send self harm data failed")
		}
	}
}

function sendSocialPostToServer(e, t, o, n) {
	if (isClusterURLAvailable()) {
		n = window.clusterUrl + "/socialActivity?msg=" + window.btoa(encodeURIComponent(e)) + "&domain=" + window.btoa(t) + "&context=" + window.btoa(o) + "&url=" + window.btoa(n) + "&extension_id=" + chrome.runtime.id + "&internal_ip=" + window.currentUserInternalIp + "&v2=true";
		window.geolocation && (n = n + "&lat=" + window.geoLat + "&lng=" + window.geoLng);
		var r = createNonBlockingRequest("get", n);
		try {
			r.send()
		} catch (e) {
			console.log("Send social post failed")
		}
	}
}

function removeHTMLTags(e) {
	return null === e || "" === e || void 0 === e ? "" : e.replace(/(<([^>]+)>)/gi, "").replace(/&nbsp;/gi, " ")
}

function decryptPhrases(e) {
	var t = [];
	return e.forEach(function(e) {
		let o = CryptoJS.AES.decrypt(e, window.thinkTwicePassPhrase).toString(CryptoJS.enc.Utf8);
		o && o.length > 0 && t.push(o)
	}), t
}

function getFeatureConfig() {
	if (isClusterURLAvailable()) {
		let e = createNonBlockingRequest("get", window.clusterUrl + "/config");
		e.onreadystatechange = function() {
			if (200 == e.status && 4 == e.readyState) try {
				let t = JSON.parse(e.responseText);
				"object" == typeof t && t && 1 == t.success ? window.featureConfig = t : console.log("Not able to fetch feature config")
			} catch (e) {
				console.log("Not able to fetch feature config")
			}
		}, e.send()
	}
}

function sendThinkTwiceAnalytics(e, t, o, n, r) {
	if (isClusterURLAvailable()) {
		let a = createNonBlockingRequest("POST", window.clusterUrl + "/thinktwice");
		a.onreadystatechange = function() {
			if (200 == a.status && 4 == a.readyState) try {
				let e = JSON.parse(a.responseText);
				"object" == typeof e && e && 1 == e.success ? console.log("Successfully logged think twice analytics") : console.log("Failed to log the think twice analytics")
			} catch (e) {
				console.log("Failed to log the think twice analytics")
			}
		};
		var i = new FormData;
		i.append("tt_id", e), i.append("site", t), i.append("action", o), i.append("typed_text", n), i.append("matched_phrase", r), a.send(i)
	}
}

function sendGoogleChatAnalytics(e) {
	if (isClusterURLAvailable()) {
		var t = new FormData;
		t.append("chatRoomId", e.chatRoomId), t.append("chatMembers", JSON.stringify(e.chatMembers)), t.append("flagged_text", e.flagged_text), t.append("matched_phrase", e.matched_phrase), t.append("context", JSON.stringify(e.context)), t.append("score", e.score), t.append("confidence", e.confidence), t.append("type_detail", e.type_detail);
		const o = createNonBlockingRequest("post", window.clusterUrl + "/gchat?userEmail=" + window.userEmail);
		o.onreadystatechange = function() {
			4 == o.readyState && 200 != o.status && console.log("Error while sending chat to server from captured analytics", o.status)
		};
		try {
			o.send(t)
		} catch (e) {
			console.error("Failed to send chat to server from captured analytics", e)
		}
	}
}

function clearBlob() {
	chrome.cookies.getAll({
		domain: ".securly.com"
	}, function(e) {
		for (var t = 0; t < e.length; t++) - 1 !== e[t].value.indexOf("blob") && (chrome.tabs.query({
			currentWindow: !0
		}, function(e) {
			for (var t = 0; t < e.length; t++) checkDomain(e[t].url, "securly.com") && chrome.tabs.remove(e[t].id)
		}), chrome.cookies.remove({
			url: "https://" + e[t].domain + e[t].path,
			name: e[t].name
		}))
	})
}! function(e, t) {
	"object" == typeof exports ? module.exports = exports = t() : "function" == typeof define && define.amd ? define([], t) : e.CryptoJS = t()
}(this, function() {
	var e, t, o, n, r, i, a, s, c, l = l || function(e, t) {
		var o;
		if ("undefined" != typeof window && window.crypto && (o = window.crypto), !o && "undefined" != typeof window && window.msCrypto && (o = window.msCrypto), !o && "undefined" != typeof global && global.crypto && (o = global.crypto), !o && "function" == typeof require) try {
			o = require("crypto")
		} catch (e) {}
		var n = function() {
				if (o) {
					if ("function" == typeof o.getRandomValues) try {
						return o.getRandomValues(new Uint32Array(1))[0]
					} catch (e) {}
					if ("function" == typeof o.randomBytes) try {
						return o.randomBytes(4).readInt32LE()
					} catch (e) {}
				}
				throw new Error("Native crypto module could not be used to get secure random number.")
			},
			r = Object.create || function() {
				function e() {}
				return function(t) {
					var o;
					return e.prototype = t, o = new e, e.prototype = null, o
				}
			}(),
			i = {},
			a = i.lib = {},
			s = a.Base = {
				extend: function(e) {
					var t = r(this);
					return e && t.mixIn(e), t.hasOwnProperty("init") && this.init !== t.init || (t.init = function() {
						t.$super.init.apply(this, arguments)
					}), t.init.prototype = t, t.$super = this, t
				},
				create: function() {
					var e = this.extend();
					return e.init.apply(e, arguments), e
				},
				init: function() {},
				mixIn: function(e) {
					for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
					e.hasOwnProperty("toString") && (this.toString = e.toString)
				},
				clone: function() {
					return this.init.prototype.extend(this)
				}
			},
			c = a.WordArray = s.extend({
				init: function(e, t) {
					e = this.words = e || [], this.sigBytes = void 0 != t ? t : 4 * e.length
				},
				toString: function(e) {
					return (e || u).stringify(this)
				},
				concat: function(e) {
					var t = this.words,
						o = e.words,
						n = this.sigBytes,
						r = e.sigBytes;
					if (this.clamp(), n % 4)
						for (var i = 0; i < r; i++) {
							var a = o[i >>> 2] >>> 24 - i % 4 * 8 & 255;
							t[n + i >>> 2] |= a << 24 - (n + i) % 4 * 8
						} else
							for (i = 0; i < r; i += 4) t[n + i >>> 2] = o[i >>> 2];
					return this.sigBytes += r, this
				},
				clamp: function() {
					var t = this.words,
						o = this.sigBytes;
					t[o >>> 2] &= 4294967295 << 32 - o % 4 * 8, t.length = e.ceil(o / 4)
				},
				clone: function() {
					var e = s.clone.call(this);
					return e.words = this.words.slice(0), e
				},
				random: function(e) {
					for (var t = [], o = 0; o < e; o += 4) t.push(n());
					return new c.init(t, e)
				}
			}),
			l = i.enc = {},
			u = l.Hex = {
				stringify: function(e) {
					for (var t = e.words, o = e.sigBytes, n = [], r = 0; r < o; r++) {
						var i = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
						n.push((i >>> 4).toString(16)), n.push((15 & i).toString(16))
					}
					return n.join("")
				},
				parse: function(e) {
					for (var t = e.length, o = [], n = 0; n < t; n += 2) o[n >>> 3] |= parseInt(e.substr(n, 2), 16) << 24 - n % 8 * 4;
					return new c.init(o, t / 2)
				}
			},
			d = l.Latin1 = {
				stringify: function(e) {
					for (var t = e.words, o = e.sigBytes, n = [], r = 0; r < o; r++) {
						var i = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
						n.push(String.fromCharCode(i))
					}
					return n.join("")
				},
				parse: function(e) {
					for (var t = e.length, o = [], n = 0; n < t; n++) o[n >>> 2] |= (255 & e.charCodeAt(n)) << 24 - n % 4 * 8;
					return new c.init(o, t)
				}
			},
			h = l.Utf8 = {
				stringify: function(e) {
					try {
						return decodeURIComponent(escape(d.stringify(e)))
					} catch (e) {
						throw new Error("Malformed UTF-8 data")
					}
				},
				parse: function(e) {
					return d.parse(unescape(encodeURIComponent(e)))
				}
			},
			g = a.BufferedBlockAlgorithm = s.extend({
				reset: function() {
					this._data = new c.init, this._nDataBytes = 0
				},
				_append: function(e) {
					"string" == typeof e && (e = h.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
				},
				_process: function(t) {
					var o, n = this._data,
						r = n.words,
						i = n.sigBytes,
						a = this.blockSize,
						s = i / (4 * a),
						l = (s = t ? e.ceil(s) : e.max((0 | s) - this._minBufferSize, 0)) * a,
						u = e.min(4 * l, i);
					if (l) {
						for (var d = 0; d < l; d += a) this._doProcessBlock(r, d);
						o = r.splice(0, l), n.sigBytes -= u
					}
					return new c.init(o, u)
				},
				clone: function() {
					var e = s.clone.call(this);
					return e._data = this._data.clone(), e
				},
				_minBufferSize: 0
			}),
			w = (a.Hasher = g.extend({
				cfg: s.extend(),
				init: function(e) {
					this.cfg = this.cfg.extend(e), this.reset()
				},
				reset: function() {
					g.reset.call(this), this._doReset()
				},
				update: function(e) {
					return this._append(e), this._process(), this
				},
				finalize: function(e) {
					return e && this._append(e), this._doFinalize()
				},
				blockSize: 16,
				_createHelper: function(e) {
					return function(t, o) {
						return new e.init(o).finalize(t)
					}
				},
				_createHmacHelper: function(e) {
					return function(t, o) {
						return new w.HMAC.init(e, o).finalize(t)
					}
				}
			}), i.algo = {});
		return i
	}(Math);
	return function() {
			var e = l,
				t = e.lib.WordArray;
			e.enc.Base64 = {
				stringify: function(e) {
					var t = e.words,
						o = e.sigBytes,
						n = this._map;
					e.clamp();
					for (var r = [], i = 0; i < o; i += 3)
						for (var a = (t[i >>> 2] >>> 24 - i % 4 * 8 & 255) << 16 | (t[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255) << 8 | t[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255, s = 0; s < 4 && i + .75 * s < o; s++) r.push(n.charAt(a >>> 6 * (3 - s) & 63));
					var c = n.charAt(64);
					if (c)
						for (; r.length % 4;) r.push(c);
					return r.join("")
				},
				parse: function(e) {
					var o = e.length,
						n = this._map,
						r = this._reverseMap;
					if (!r) {
						r = this._reverseMap = [];
						for (var i = 0; i < n.length; i++) r[n.charCodeAt(i)] = i
					}
					var a = n.charAt(64);
					if (a) {
						var s = e.indexOf(a); - 1 !== s && (o = s)
					}
					return function(e, o, n) {
						for (var r = [], i = 0, a = 0; a < o; a++)
							if (a % 4) {
								var s = n[e.charCodeAt(a - 1)] << a % 4 * 2,
									c = n[e.charCodeAt(a)] >>> 6 - a % 4 * 2,
									l = s | c;
								r[i >>> 2] |= l << 24 - i % 4 * 8, i++
							} return t.create(r, i)
					}(e, o, r)
				},
				_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
			}
		}(),
		function(e) {
			var t = l,
				o = t.lib,
				n = o.WordArray,
				r = o.Hasher,
				i = t.algo,
				a = [];
			! function() {
				for (var t = 0; t < 64; t++) a[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0
			}();
			var s = i.MD5 = r.extend({
				_doReset: function() {
					this._hash = new n.init([1732584193, 4023233417, 2562383102, 271733878])
				},
				_doProcessBlock: function(e, t) {
					for (var o = 0; o < 16; o++) {
						var n = t + o,
							r = e[n];
						e[n] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8)
					}
					var i = this._hash.words,
						s = e[t + 0],
						l = e[t + 1],
						g = e[t + 2],
						w = e[t + 3],
						f = e[t + 4],
						m = e[t + 5],
						p = e[t + 6],
						v = e[t + 7],
						y = e[t + 8],
						b = e[t + 9],
						k = e[t + 10],
						_ = e[t + 11],
						S = e[t + 12],
						O = e[t + 13],
						C = e[t + 14],
						L = e[t + 15],
						B = i[0],
						R = i[1],
						U = i[2],
						x = i[3];
					R = h(R = h(R = h(R = h(R = d(R = d(R = d(R = d(R = u(R = u(R = u(R = u(R = c(R = c(R = c(R = c(R, U = c(U, x = c(x, B = c(B, R, U, x, s, 7, a[0]), R, U, l, 12, a[1]), B, R, g, 17, a[2]), x, B, w, 22, a[3]), U = c(U, x = c(x, B = c(B, R, U, x, f, 7, a[4]), R, U, m, 12, a[5]), B, R, p, 17, a[6]), x, B, v, 22, a[7]), U = c(U, x = c(x, B = c(B, R, U, x, y, 7, a[8]), R, U, b, 12, a[9]), B, R, k, 17, a[10]), x, B, _, 22, a[11]), U = c(U, x = c(x, B = c(B, R, U, x, S, 7, a[12]), R, U, O, 12, a[13]), B, R, C, 17, a[14]), x, B, L, 22, a[15]), U = u(U, x = u(x, B = u(B, R, U, x, l, 5, a[16]), R, U, p, 9, a[17]), B, R, _, 14, a[18]), x, B, s, 20, a[19]), U = u(U, x = u(x, B = u(B, R, U, x, m, 5, a[20]), R, U, k, 9, a[21]), B, R, L, 14, a[22]), x, B, f, 20, a[23]), U = u(U, x = u(x, B = u(B, R, U, x, b, 5, a[24]), R, U, C, 9, a[25]), B, R, w, 14, a[26]), x, B, y, 20, a[27]), U = u(U, x = u(x, B = u(B, R, U, x, O, 5, a[28]), R, U, g, 9, a[29]), B, R, v, 14, a[30]), x, B, S, 20, a[31]), U = d(U, x = d(x, B = d(B, R, U, x, m, 4, a[32]), R, U, y, 11, a[33]), B, R, _, 16, a[34]), x, B, C, 23, a[35]), U = d(U, x = d(x, B = d(B, R, U, x, l, 4, a[36]), R, U, f, 11, a[37]), B, R, v, 16, a[38]), x, B, k, 23, a[39]), U = d(U, x = d(x, B = d(B, R, U, x, O, 4, a[40]), R, U, s, 11, a[41]), B, R, w, 16, a[42]), x, B, p, 23, a[43]), U = d(U, x = d(x, B = d(B, R, U, x, b, 4, a[44]), R, U, S, 11, a[45]), B, R, L, 16, a[46]), x, B, g, 23, a[47]), U = h(U, x = h(x, B = h(B, R, U, x, s, 6, a[48]), R, U, v, 10, a[49]), B, R, C, 15, a[50]), x, B, m, 21, a[51]), U = h(U, x = h(x, B = h(B, R, U, x, S, 6, a[52]), R, U, w, 10, a[53]), B, R, k, 15, a[54]), x, B, l, 21, a[55]), U = h(U, x = h(x, B = h(B, R, U, x, y, 6, a[56]), R, U, L, 10, a[57]), B, R, p, 15, a[58]), x, B, O, 21, a[59]), U = h(U, x = h(x, B = h(B, R, U, x, f, 6, a[60]), R, U, _, 10, a[61]), B, R, g, 15, a[62]), x, B, b, 21, a[63]), i[0] = i[0] + B | 0, i[1] = i[1] + R | 0, i[2] = i[2] + U | 0, i[3] = i[3] + x | 0
				},
				_doFinalize: function() {
					var t = this._data,
						o = t.words,
						n = 8 * this._nDataBytes,
						r = 8 * t.sigBytes;
					o[r >>> 5] |= 128 << 24 - r % 32;
					var i = e.floor(n / 4294967296),
						a = n;
					o[15 + (r + 64 >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8), o[14 + (r + 64 >>> 9 << 4)] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), t.sigBytes = 4 * (o.length + 1), this._process();
					for (var s = this._hash, c = s.words, l = 0; l < 4; l++) {
						var u = c[l];
						c[l] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8)
					}
					return s
				},
				clone: function() {
					var e = r.clone.call(this);
					return e._hash = this._hash.clone(), e
				}
			});

			function c(e, t, o, n, r, i, a) {
				var s = e + (t & o | ~t & n) + r + a;
				return (s << i | s >>> 32 - i) + t
			}

			function u(e, t, o, n, r, i, a) {
				var s = e + (t & n | o & ~n) + r + a;
				return (s << i | s >>> 32 - i) + t
			}

			function d(e, t, o, n, r, i, a) {
				var s = e + (t ^ o ^ n) + r + a;
				return (s << i | s >>> 32 - i) + t
			}

			function h(e, t, o, n, r, i, a) {
				var s = e + (o ^ (t | ~n)) + r + a;
				return (s << i | s >>> 32 - i) + t
			}
			t.MD5 = r._createHelper(s), t.HmacMD5 = r._createHmacHelper(s)
		}(Math), t = (e = l).lib, o = t.WordArray, n = t.Hasher, r = [], i = e.algo.SHA1 = n.extend({
			_doReset: function() {
				this._hash = new o.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
			},
			_doProcessBlock: function(e, t) {
				for (var o = this._hash.words, n = o[0], i = o[1], a = o[2], s = o[3], c = o[4], l = 0; l < 80; l++) {
					if (l < 16) r[l] = 0 | e[t + l];
					else {
						var u = r[l - 3] ^ r[l - 8] ^ r[l - 14] ^ r[l - 16];
						r[l] = u << 1 | u >>> 31
					}
					var d = (n << 5 | n >>> 27) + c + r[l];
					d += l < 20 ? 1518500249 + (i & a | ~i & s) : l < 40 ? 1859775393 + (i ^ a ^ s) : l < 60 ? (i & a | i & s | a & s) - 1894007588 : (i ^ a ^ s) - 899497514, c = s, s = a, a = i << 30 | i >>> 2, i = n, n = d
				}
				o[0] = o[0] + n | 0, o[1] = o[1] + i | 0, o[2] = o[2] + a | 0, o[3] = o[3] + s | 0, o[4] = o[4] + c | 0
			},
			_doFinalize: function() {
				var e = this._data,
					t = e.words,
					o = 8 * this._nDataBytes,
					n = 8 * e.sigBytes;
				return t[n >>> 5] |= 128 << 24 - n % 32, t[14 + (n + 64 >>> 9 << 4)] = Math.floor(o / 4294967296), t[15 + (n + 64 >>> 9 << 4)] = o, e.sigBytes = 4 * t.length, this._process(), this._hash
			},
			clone: function() {
				var e = n.clone.call(this);
				return e._hash = this._hash.clone(), e
			}
		}), e.SHA1 = n._createHelper(i), e.HmacSHA1 = n._createHmacHelper(i),
		function(e) {
			var t = l,
				o = t.lib,
				n = o.WordArray,
				r = o.Hasher,
				i = t.algo,
				a = [],
				s = [];
			! function() {
				function t(t) {
					for (var o = e.sqrt(t), n = 2; n <= o; n++)
						if (!(t % n)) return !1;
					return !0
				}

				function o(e) {
					return 4294967296 * (e - (0 | e)) | 0
				}
				for (var n = 2, r = 0; r < 64;) t(n) && (r < 8 && (a[r] = o(e.pow(n, .5))), s[r] = o(e.pow(n, 1 / 3)), r++), n++
			}();
			var c = [],
				u = i.SHA256 = r.extend({
					_doReset: function() {
						this._hash = new n.init(a.slice(0))
					},
					_doProcessBlock: function(e, t) {
						for (var o = this._hash.words, n = o[0], r = o[1], i = o[2], a = o[3], l = o[4], u = o[5], d = o[6], h = o[7], g = 0; g < 64; g++) {
							if (g < 16) c[g] = 0 | e[t + g];
							else {
								var w = c[g - 15],
									f = (w << 25 | w >>> 7) ^ (w << 14 | w >>> 18) ^ w >>> 3,
									m = c[g - 2],
									p = (m << 15 | m >>> 17) ^ (m << 13 | m >>> 19) ^ m >>> 10;
								c[g] = f + c[g - 7] + p + c[g - 16]
							}
							var v = n & r ^ n & i ^ r & i,
								y = (n << 30 | n >>> 2) ^ (n << 19 | n >>> 13) ^ (n << 10 | n >>> 22),
								b = h + ((l << 26 | l >>> 6) ^ (l << 21 | l >>> 11) ^ (l << 7 | l >>> 25)) + (l & u ^ ~l & d) + s[g] + c[g];
							h = d, d = u, u = l, l = a + b | 0, a = i, i = r, r = n, n = b + (y + v) | 0
						}
						o[0] = o[0] + n | 0, o[1] = o[1] + r | 0, o[2] = o[2] + i | 0, o[3] = o[3] + a | 0, o[4] = o[4] + l | 0, o[5] = o[5] + u | 0, o[6] = o[6] + d | 0, o[7] = o[7] + h | 0
					},
					_doFinalize: function() {
						var t = this._data,
							o = t.words,
							n = 8 * this._nDataBytes,
							r = 8 * t.sigBytes;
						return o[r >>> 5] |= 128 << 24 - r % 32, o[14 + (r + 64 >>> 9 << 4)] = e.floor(n / 4294967296), o[15 + (r + 64 >>> 9 << 4)] = n, t.sigBytes = 4 * o.length, this._process(), this._hash
					},
					clone: function() {
						var e = r.clone.call(this);
						return e._hash = this._hash.clone(), e
					}
				});
			t.SHA256 = r._createHelper(u), t.HmacSHA256 = r._createHmacHelper(u)
		}(Math),
		function() {
			var e = l,
				t = e.lib.WordArray,
				o = e.enc;
			o.Utf16 = o.Utf16BE = {
				stringify: function(e) {
					for (var t = e.words, o = e.sigBytes, n = [], r = 0; r < o; r += 2) {
						var i = t[r >>> 2] >>> 16 - r % 4 * 8 & 65535;
						n.push(String.fromCharCode(i))
					}
					return n.join("")
				},
				parse: function(e) {
					for (var o = e.length, n = [], r = 0; r < o; r++) n[r >>> 1] |= e.charCodeAt(r) << 16 - r % 2 * 16;
					return t.create(n, 2 * o)
				}
			};

			function n(e) {
				return e << 8 & 4278255360 | e >>> 8 & 16711935
			}
			o.Utf16LE = {
				stringify: function(e) {
					for (var t = e.words, o = e.sigBytes, r = [], i = 0; i < o; i += 2) {
						var a = n(t[i >>> 2] >>> 16 - i % 4 * 8 & 65535);
						r.push(String.fromCharCode(a))
					}
					return r.join("")
				},
				parse: function(e) {
					for (var o = e.length, r = [], i = 0; i < o; i++) r[i >>> 1] |= n(e.charCodeAt(i) << 16 - i % 2 * 16);
					return t.create(r, 2 * o)
				}
			}
		}(),
		function() {
			if ("function" == typeof ArrayBuffer) {
				var e = l.lib.WordArray,
					t = e.init;
				(e.init = function(e) {
					if (e instanceof ArrayBuffer && (e = new Uint8Array(e)), (e instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array) && (e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength)), e instanceof Uint8Array) {
						for (var o = e.byteLength, n = [], r = 0; r < o; r++) n[r >>> 2] |= e[r] << 24 - r % 4 * 8;
						t.call(this, n, o)
					} else t.apply(this, arguments)
				}).prototype = e
			}
		}(),
		function(e) {
			var t = l,
				o = t.lib,
				n = o.WordArray,
				r = o.Hasher,
				i = t.algo,
				a = n.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]),
				s = n.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]),
				c = n.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]),
				u = n.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]),
				d = n.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),
				h = n.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),
				g = i.RIPEMD160 = r.extend({
					_doReset: function() {
						this._hash = n.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
					},
					_doProcessBlock: function(e, t) {
						for (var o = 0; o < 16; o++) {
							var n = t + o,
								r = e[n];
							e[n] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8)
						}
						var i, l, g, b, k, _, S, O, C, L, B, R = this._hash.words,
							U = d.words,
							x = h.words,
							N = a.words,
							D = s.words,
							A = c.words,
							I = u.words;
						_ = i = R[0], S = l = R[1], O = g = R[2], C = b = R[3], L = k = R[4];
						for (o = 0; o < 80; o += 1) B = i + e[t + N[o]] | 0, B += o < 16 ? w(l, g, b) + U[0] : o < 32 ? f(l, g, b) + U[1] : o < 48 ? m(l, g, b) + U[2] : o < 64 ? p(l, g, b) + U[3] : v(l, g, b) + U[4], B = (B = y(B |= 0, A[o])) + k | 0, i = k, k = b, b = y(g, 10), g = l, l = B, B = _ + e[t + D[o]] | 0, B += o < 16 ? v(S, O, C) + x[0] : o < 32 ? p(S, O, C) + x[1] : o < 48 ? m(S, O, C) + x[2] : o < 64 ? f(S, O, C) + x[3] : w(S, O, C) + x[4], B = (B = y(B |= 0, I[o])) + L | 0, _ = L, L = C, C = y(O, 10), O = S, S = B;
						B = R[1] + g + C | 0, R[1] = R[2] + b + L | 0, R[2] = R[3] + k + _ | 0, R[3] = R[4] + i + S | 0, R[4] = R[0] + l + O | 0, R[0] = B
					},
					_doFinalize: function() {
						var e = this._data,
							t = e.words,
							o = 8 * this._nDataBytes,
							n = 8 * e.sigBytes;
						t[n >>> 5] |= 128 << 24 - n % 32, t[14 + (n + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), e.sigBytes = 4 * (t.length + 1), this._process();
						for (var r = this._hash, i = r.words, a = 0; a < 5; a++) {
							var s = i[a];
							i[a] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8)
						}
						return r
					},
					clone: function() {
						var e = r.clone.call(this);
						return e._hash = this._hash.clone(), e
					}
				});

			function w(e, t, o) {
				return e ^ t ^ o
			}

			function f(e, t, o) {
				return e & t | ~e & o
			}

			function m(e, t, o) {
				return (e | ~t) ^ o
			}

			function p(e, t, o) {
				return e & o | t & ~o
			}

			function v(e, t, o) {
				return e ^ (t | ~o)
			}

			function y(e, t) {
				return e << t | e >>> 32 - t
			}
			t.RIPEMD160 = r._createHelper(g), t.HmacRIPEMD160 = r._createHmacHelper(g)
		}(Math),
		function() {
			var e = l,
				t = e.lib.Base,
				o = e.enc.Utf8;
			e.algo.HMAC = t.extend({
				init: function(e, t) {
					e = this._hasher = new e.init, "string" == typeof t && (t = o.parse(t));
					var n = e.blockSize,
						r = 4 * n;
					t.sigBytes > r && (t = e.finalize(t)), t.clamp();
					for (var i = this._oKey = t.clone(), a = this._iKey = t.clone(), s = i.words, c = a.words, l = 0; l < n; l++) s[l] ^= 1549556828, c[l] ^= 909522486;
					i.sigBytes = a.sigBytes = r, this.reset()
				},
				reset: function() {
					var e = this._hasher;
					e.reset(), e.update(this._iKey)
				},
				update: function(e) {
					return this._hasher.update(e), this
				},
				finalize: function(e) {
					var t = this._hasher,
						o = t.finalize(e);
					return t.reset(), t.finalize(this._oKey.clone().concat(o))
				}
			})
		}(),
		function() {
			var e = l,
				t = e.lib,
				o = t.Base,
				n = t.WordArray,
				r = e.algo,
				i = r.SHA1,
				a = r.HMAC,
				s = r.PBKDF2 = o.extend({
					cfg: o.extend({
						keySize: 4,
						hasher: i,
						iterations: 1
					}),
					init: function(e) {
						this.cfg = this.cfg.extend(e)
					},
					compute: function(e, t) {
						for (var o = this.cfg, r = a.create(o.hasher, e), i = n.create(), s = n.create([1]), c = i.words, l = s.words, u = o.keySize, d = o.iterations; c.length < u;) {
							var h = r.update(t).finalize(s);
							r.reset();
							for (var g = h.words, w = g.length, f = h, m = 1; m < d; m++) {
								f = r.finalize(f), r.reset();
								for (var p = f.words, v = 0; v < w; v++) g[v] ^= p[v]
							}
							i.concat(h), l[0]++
						}
						return i.sigBytes = 4 * u, i
					}
				});
			e.PBKDF2 = function(e, t, o) {
				return s.create(o).compute(e, t)
			}
		}(),
		function() {
			var e = l,
				t = e.lib,
				o = t.Base,
				n = t.WordArray,
				r = e.algo,
				i = r.MD5,
				a = r.EvpKDF = o.extend({
					cfg: o.extend({
						keySize: 4,
						hasher: i,
						iterations: 1
					}),
					init: function(e) {
						this.cfg = this.cfg.extend(e)
					},
					compute: function(e, t) {
						for (var o, r = this.cfg, i = r.hasher.create(), a = n.create(), s = a.words, c = r.keySize, l = r.iterations; s.length < c;) {
							o && i.update(o), o = i.update(e).finalize(t), i.reset();
							for (var u = 1; u < l; u++) o = i.finalize(o), i.reset();
							a.concat(o)
						}
						return a.sigBytes = 4 * c, a
					}
				});
			e.EvpKDF = function(e, t, o) {
				return a.create(o).compute(e, t)
			}
		}(),
		function() {
			var e = l,
				t = e.lib.WordArray,
				o = e.algo,
				n = o.SHA256,
				r = o.SHA224 = n.extend({
					_doReset: function() {
						this._hash = new t.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
					},
					_doFinalize: function() {
						var e = n._doFinalize.call(this);
						return e.sigBytes -= 4, e
					}
				});
			e.SHA224 = n._createHelper(r), e.HmacSHA224 = n._createHmacHelper(r)
		}(),
		function(e) {
			var t = l,
				o = t.lib,
				n = o.Base,
				r = o.WordArray,
				i = t.x64 = {};
			i.Word = n.extend({
				init: function(e, t) {
					this.high = e, this.low = t
				}
			}), i.WordArray = n.extend({
				init: function(e, t) {
					e = this.words = e || [], this.sigBytes = void 0 != t ? t : 8 * e.length
				},
				toX32: function() {
					for (var e = this.words, t = e.length, o = [], n = 0; n < t; n++) {
						var i = e[n];
						o.push(i.high), o.push(i.low)
					}
					return r.create(o, this.sigBytes)
				},
				clone: function() {
					for (var e = n.clone.call(this), t = e.words = this.words.slice(0), o = t.length, r = 0; r < o; r++) t[r] = t[r].clone();
					return e
				}
			})
		}(),
		function(e) {
			var t = l,
				o = t.lib,
				n = o.WordArray,
				r = o.Hasher,
				i = t.x64.Word,
				a = t.algo,
				s = [],
				c = [],
				u = [];
			! function() {
				for (var e = 1, t = 0, o = 0; o < 24; o++) {
					s[e + 5 * t] = (o + 1) * (o + 2) / 2 % 64;
					var n = (2 * e + 3 * t) % 5;
					e = t % 5, t = n
				}
				for (e = 0; e < 5; e++)
					for (t = 0; t < 5; t++) c[e + 5 * t] = t + (2 * e + 3 * t) % 5 * 5;
				for (var r = 1, a = 0; a < 24; a++) {
					for (var l = 0, d = 0, h = 0; h < 7; h++) {
						if (1 & r) {
							var g = (1 << h) - 1;
							g < 32 ? d ^= 1 << g : l ^= 1 << g - 32
						}
						128 & r ? r = r << 1 ^ 113 : r <<= 1
					}
					u[a] = i.create(l, d)
				}
			}();
			var d = [];
			! function() {
				for (var e = 0; e < 25; e++) d[e] = i.create()
			}();
			var h = a.SHA3 = r.extend({
				cfg: r.cfg.extend({
					outputLength: 512
				}),
				_doReset: function() {
					for (var e = this._state = [], t = 0; t < 25; t++) e[t] = new i.init;
					this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
				},
				_doProcessBlock: function(e, t) {
					for (var o = this._state, n = this.blockSize / 2, r = 0; r < n; r++) {
						var i = e[t + 2 * r],
							a = e[t + 2 * r + 1];
						i = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8), a = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), (R = o[r]).high ^= a, R.low ^= i
					}
					for (var l = 0; l < 24; l++) {
						for (var h = 0; h < 5; h++) {
							for (var g = 0, w = 0, f = 0; f < 5; f++) {
								g ^= (R = o[h + 5 * f]).high, w ^= R.low
							}
							var m = d[h];
							m.high = g, m.low = w
						}
						for (h = 0; h < 5; h++) {
							var p = d[(h + 4) % 5],
								v = d[(h + 1) % 5],
								y = v.high,
								b = v.low;
							for (g = p.high ^ (y << 1 | b >>> 31), w = p.low ^ (b << 1 | y >>> 31), f = 0; f < 5; f++) {
								(R = o[h + 5 * f]).high ^= g, R.low ^= w
							}
						}
						for (var k = 1; k < 25; k++) {
							var _ = (R = o[k]).high,
								S = R.low,
								O = s[k];
							O < 32 ? (g = _ << O | S >>> 32 - O, w = S << O | _ >>> 32 - O) : (g = S << O - 32 | _ >>> 64 - O, w = _ << O - 32 | S >>> 64 - O);
							var C = d[c[k]];
							C.high = g, C.low = w
						}
						var L = d[0],
							B = o[0];
						L.high = B.high, L.low = B.low;
						for (h = 0; h < 5; h++)
							for (f = 0; f < 5; f++) {
								var R = o[k = h + 5 * f],
									U = d[k],
									x = d[(h + 1) % 5 + 5 * f],
									N = d[(h + 2) % 5 + 5 * f];
								R.high = U.high ^ ~x.high & N.high, R.low = U.low ^ ~x.low & N.low
							}
						R = o[0];
						var D = u[l];
						R.high ^= D.high, R.low ^= D.low
					}
				},
				_doFinalize: function() {
					var t = this._data,
						o = t.words,
						r = (this._nDataBytes, 8 * t.sigBytes),
						i = 32 * this.blockSize;
					o[r >>> 5] |= 1 << 24 - r % 32, o[(e.ceil((r + 1) / i) * i >>> 5) - 1] |= 128, t.sigBytes = 4 * o.length, this._process();
					for (var a = this._state, s = this.cfg.outputLength / 8, c = s / 8, l = [], u = 0; u < c; u++) {
						var d = a[u],
							h = d.high,
							g = d.low;
						h = 16711935 & (h << 8 | h >>> 24) | 4278255360 & (h << 24 | h >>> 8), g = 16711935 & (g << 8 | g >>> 24) | 4278255360 & (g << 24 | g >>> 8), l.push(g), l.push(h)
					}
					return new n.init(l, s)
				},
				clone: function() {
					for (var e = r.clone.call(this), t = e._state = this._state.slice(0), o = 0; o < 25; o++) t[o] = t[o].clone();
					return e
				}
			});
			t.SHA3 = r._createHelper(h), t.HmacSHA3 = r._createHmacHelper(h)
		}(Math),
		function() {
			var e = l,
				t = e.lib.Hasher,
				o = e.x64,
				n = o.Word,
				r = o.WordArray,
				i = e.algo;

			function a() {
				return n.create.apply(n, arguments)
			}
			var s = [a(1116352408, 3609767458), a(1899447441, 602891725), a(3049323471, 3964484399), a(3921009573, 2173295548), a(961987163, 4081628472), a(1508970993, 3053834265), a(2453635748, 2937671579), a(2870763221, 3664609560), a(3624381080, 2734883394), a(310598401, 1164996542), a(607225278, 1323610764), a(1426881987, 3590304994), a(1925078388, 4068182383), a(2162078206, 991336113), a(2614888103, 633803317), a(3248222580, 3479774868), a(3835390401, 2666613458), a(4022224774, 944711139), a(264347078, 2341262773), a(604807628, 2007800933), a(770255983, 1495990901), a(1249150122, 1856431235), a(1555081692, 3175218132), a(1996064986, 2198950837), a(2554220882, 3999719339), a(2821834349, 766784016), a(2952996808, 2566594879), a(3210313671, 3203337956), a(3336571891, 1034457026), a(3584528711, 2466948901), a(113926993, 3758326383), a(338241895, 168717936), a(666307205, 1188179964), a(773529912, 1546045734), a(1294757372, 1522805485), a(1396182291, 2643833823), a(1695183700, 2343527390), a(1986661051, 1014477480), a(2177026350, 1206759142), a(2456956037, 344077627), a(2730485921, 1290863460), a(2820302411, 3158454273), a(3259730800, 3505952657), a(3345764771, 106217008), a(3516065817, 3606008344), a(3600352804, 1432725776), a(4094571909, 1467031594), a(275423344, 851169720), a(430227734, 3100823752), a(506948616, 1363258195), a(659060556, 3750685593), a(883997877, 3785050280), a(958139571, 3318307427), a(1322822218, 3812723403), a(1537002063, 2003034995), a(1747873779, 3602036899), a(1955562222, 1575990012), a(2024104815, 1125592928), a(2227730452, 2716904306), a(2361852424, 442776044), a(2428436474, 593698344), a(2756734187, 3733110249), a(3204031479, 2999351573), a(3329325298, 3815920427), a(3391569614, 3928383900), a(3515267271, 566280711), a(3940187606, 3454069534), a(4118630271, 4000239992), a(116418474, 1914138554), a(174292421, 2731055270), a(289380356, 3203993006), a(460393269, 320620315), a(685471733, 587496836), a(852142971, 1086792851), a(1017036298, 365543100), a(1126000580, 2618297676), a(1288033470, 3409855158), a(1501505948, 4234509866), a(1607167915, 987167468), a(1816402316, 1246189591)],
				c = [];
			! function() {
				for (var e = 0; e < 80; e++) c[e] = a()
			}();
			var u = i.SHA512 = t.extend({
				_doReset: function() {
					this._hash = new r.init([new n.init(1779033703, 4089235720), new n.init(3144134277, 2227873595), new n.init(1013904242, 4271175723), new n.init(2773480762, 1595750129), new n.init(1359893119, 2917565137), new n.init(2600822924, 725511199), new n.init(528734635, 4215389547), new n.init(1541459225, 327033209)])
				},
				_doProcessBlock: function(e, t) {
					for (var o = this._hash.words, n = o[0], r = o[1], i = o[2], a = o[3], l = o[4], u = o[5], d = o[6], h = o[7], g = n.high, w = n.low, f = r.high, m = r.low, p = i.high, v = i.low, y = a.high, b = a.low, k = l.high, _ = l.low, S = u.high, O = u.low, C = d.high, L = d.low, B = h.high, R = h.low, U = g, x = w, N = f, D = m, A = p, I = v, E = y, T = b, H = k, F = _, P = S, M = O, q = C, W = L, z = B, j = R, V = 0; V < 80; V++) {
						var G, K, Y = c[V];
						if (V < 16) K = Y.high = 0 | e[t + 2 * V], G = Y.low = 0 | e[t + 2 * V + 1];
						else {
							var J = c[V - 15],
								Z = J.high,
								X = J.low,
								$ = (Z >>> 1 | X << 31) ^ (Z >>> 8 | X << 24) ^ Z >>> 7,
								Q = (X >>> 1 | Z << 31) ^ (X >>> 8 | Z << 24) ^ (X >>> 7 | Z << 25),
								ee = c[V - 2],
								te = ee.high,
								oe = ee.low,
								ne = (te >>> 19 | oe << 13) ^ (te << 3 | oe >>> 29) ^ te >>> 6,
								re = (oe >>> 19 | te << 13) ^ (oe << 3 | te >>> 29) ^ (oe >>> 6 | te << 26),
								ie = c[V - 7],
								ae = ie.high,
								se = ie.low,
								ce = c[V - 16],
								le = ce.high,
								ue = ce.low;
							K = (K = (K = $ + ae + ((G = Q + se) >>> 0 < Q >>> 0 ? 1 : 0)) + ne + ((G += re) >>> 0 < re >>> 0 ? 1 : 0)) + le + ((G += ue) >>> 0 < ue >>> 0 ? 1 : 0), Y.high = K, Y.low = G
						}
						var de, he = H & P ^ ~H & q,
							ge = F & M ^ ~F & W,
							we = U & N ^ U & A ^ N & A,
							fe = x & D ^ x & I ^ D & I,
							me = (U >>> 28 | x << 4) ^ (U << 30 | x >>> 2) ^ (U << 25 | x >>> 7),
							pe = (x >>> 28 | U << 4) ^ (x << 30 | U >>> 2) ^ (x << 25 | U >>> 7),
							ve = (H >>> 14 | F << 18) ^ (H >>> 18 | F << 14) ^ (H << 23 | F >>> 9),
							ye = (F >>> 14 | H << 18) ^ (F >>> 18 | H << 14) ^ (F << 23 | H >>> 9),
							be = s[V],
							ke = be.high,
							_e = be.low,
							Se = z + ve + ((de = j + ye) >>> 0 < j >>> 0 ? 1 : 0),
							Oe = pe + fe;
						z = q, j = W, q = P, W = M, P = H, M = F, H = E + (Se = (Se = (Se = Se + he + ((de = de + ge) >>> 0 < ge >>> 0 ? 1 : 0)) + ke + ((de = de + _e) >>> 0 < _e >>> 0 ? 1 : 0)) + K + ((de = de + G) >>> 0 < G >>> 0 ? 1 : 0)) + ((F = T + de | 0) >>> 0 < T >>> 0 ? 1 : 0) | 0, E = A, T = I, A = N, I = D, N = U, D = x, U = Se + (me + we + (Oe >>> 0 < pe >>> 0 ? 1 : 0)) + ((x = de + Oe | 0) >>> 0 < de >>> 0 ? 1 : 0) | 0
					}
					w = n.low = w + x, n.high = g + U + (w >>> 0 < x >>> 0 ? 1 : 0), m = r.low = m + D, r.high = f + N + (m >>> 0 < D >>> 0 ? 1 : 0), v = i.low = v + I, i.high = p + A + (v >>> 0 < I >>> 0 ? 1 : 0), b = a.low = b + T, a.high = y + E + (b >>> 0 < T >>> 0 ? 1 : 0), _ = l.low = _ + F, l.high = k + H + (_ >>> 0 < F >>> 0 ? 1 : 0), O = u.low = O + M, u.high = S + P + (O >>> 0 < M >>> 0 ? 1 : 0), L = d.low = L + W, d.high = C + q + (L >>> 0 < W >>> 0 ? 1 : 0), R = h.low = R + j, h.high = B + z + (R >>> 0 < j >>> 0 ? 1 : 0)
				},
				_doFinalize: function() {
					var e = this._data,
						t = e.words,
						o = 8 * this._nDataBytes,
						n = 8 * e.sigBytes;
					return t[n >>> 5] |= 128 << 24 - n % 32, t[30 + (n + 128 >>> 10 << 5)] = Math.floor(o / 4294967296), t[31 + (n + 128 >>> 10 << 5)] = o, e.sigBytes = 4 * t.length, this._process(), this._hash.toX32()
				},
				clone: function() {
					var e = t.clone.call(this);
					return e._hash = this._hash.clone(), e
				},
				blockSize: 32
			});
			e.SHA512 = t._createHelper(u), e.HmacSHA512 = t._createHmacHelper(u)
		}(),
		function() {
			var e = l,
				t = e.x64,
				o = t.Word,
				n = t.WordArray,
				r = e.algo,
				i = r.SHA512,
				a = r.SHA384 = i.extend({
					_doReset: function() {
						this._hash = new n.init([new o.init(3418070365, 3238371032), new o.init(1654270250, 914150663), new o.init(2438529370, 812702999), new o.init(355462360, 4144912697), new o.init(1731405415, 4290775857), new o.init(2394180231, 1750603025), new o.init(3675008525, 1694076839), new o.init(1203062813, 3204075428)])
					},
					_doFinalize: function() {
						var e = i._doFinalize.call(this);
						return e.sigBytes -= 16, e
					}
				});
			e.SHA384 = i._createHelper(a), e.HmacSHA384 = i._createHmacHelper(a)
		}(), l.lib.Cipher || function(e) {
			var t = l,
				o = t.lib,
				n = o.Base,
				r = o.WordArray,
				i = o.BufferedBlockAlgorithm,
				a = t.enc,
				s = (a.Utf8, a.Base64),
				c = t.algo.EvpKDF,
				u = o.Cipher = i.extend({
					cfg: n.extend(),
					createEncryptor: function(e, t) {
						return this.create(this._ENC_XFORM_MODE, e, t)
					},
					createDecryptor: function(e, t) {
						return this.create(this._DEC_XFORM_MODE, e, t)
					},
					init: function(e, t, o) {
						this.cfg = this.cfg.extend(o), this._xformMode = e, this._key = t, this.reset()
					},
					reset: function() {
						i.reset.call(this), this._doReset()
					},
					process: function(e) {
						return this._append(e), this._process()
					},
					finalize: function(e) {
						return e && this._append(e), this._doFinalize()
					},
					keySize: 4,
					ivSize: 4,
					_ENC_XFORM_MODE: 1,
					_DEC_XFORM_MODE: 2,
					_createHelper: function() {
						function e(e) {
							return "string" == typeof e ? y : p
						}
						return function(t) {
							return {
								encrypt: function(o, n, r) {
									return e(n).encrypt(t, o, n, r)
								},
								decrypt: function(o, n, r) {
									return e(n).decrypt(t, o, n, r)
								}
							}
						}
					}()
				}),
				d = (o.StreamCipher = u.extend({
					_doFinalize: function() {
						return this._process(!0)
					},
					blockSize: 1
				}), t.mode = {}),
				h = o.BlockCipherMode = n.extend({
					createEncryptor: function(e, t) {
						return this.Encryptor.create(e, t)
					},
					createDecryptor: function(e, t) {
						return this.Decryptor.create(e, t)
					},
					init: function(e, t) {
						this._cipher = e, this._iv = t
					}
				}),
				g = d.CBC = function() {
					var t = h.extend();

					function o(t, o, n) {
						var r, i = this._iv;
						i ? (r = i, this._iv = e) : r = this._prevBlock;
						for (var a = 0; a < n; a++) t[o + a] ^= r[a]
					}
					return t.Encryptor = t.extend({
						processBlock: function(e, t) {
							var n = this._cipher,
								r = n.blockSize;
							o.call(this, e, t, r), n.encryptBlock(e, t), this._prevBlock = e.slice(t, t + r)
						}
					}), t.Decryptor = t.extend({
						processBlock: function(e, t) {
							var n = this._cipher,
								r = n.blockSize,
								i = e.slice(t, t + r);
							n.decryptBlock(e, t), o.call(this, e, t, r), this._prevBlock = i
						}
					}), t
				}(),
				w = (t.pad = {}).Pkcs7 = {
					pad: function(e, t) {
						for (var o = 4 * t, n = o - e.sigBytes % o, i = n << 24 | n << 16 | n << 8 | n, a = [], s = 0; s < n; s += 4) a.push(i);
						var c = r.create(a, n);
						e.concat(c)
					},
					unpad: function(e) {
						var t = 255 & e.words[e.sigBytes - 1 >>> 2];
						e.sigBytes -= t
					}
				},
				f = (o.BlockCipher = u.extend({
					cfg: u.cfg.extend({
						mode: g,
						padding: w
					}),
					reset: function() {
						var e;
						u.reset.call(this);
						var t = this.cfg,
							o = t.iv,
							n = t.mode;
						this._xformMode == this._ENC_XFORM_MODE ? e = n.createEncryptor : (e = n.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == e ? this._mode.init(this, o && o.words) : (this._mode = e.call(n, this, o && o.words), this._mode.__creator = e)
					},
					_doProcessBlock: function(e, t) {
						this._mode.processBlock(e, t)
					},
					_doFinalize: function() {
						var e, t = this.cfg.padding;
						return this._xformMode == this._ENC_XFORM_MODE ? (t.pad(this._data, this.blockSize), e = this._process(!0)) : (e = this._process(!0), t.unpad(e)), e
					},
					blockSize: 4
				}), o.CipherParams = n.extend({
					init: function(e) {
						this.mixIn(e)
					},
					toString: function(e) {
						return (e || this.formatter).stringify(this)
					}
				})),
				m = (t.format = {}).OpenSSL = {
					stringify: function(e) {
						var t = e.ciphertext,
							o = e.salt;
						return (o ? r.create([1398893684, 1701076831]).concat(o).concat(t) : t).toString(s)
					},
					parse: function(e) {
						var t, o = s.parse(e),
							n = o.words;
						return 1398893684 == n[0] && 1701076831 == n[1] && (t = r.create(n.slice(2, 4)), n.splice(0, 4), o.sigBytes -= 16), f.create({
							ciphertext: o,
							salt: t
						})
					}
				},
				p = o.SerializableCipher = n.extend({
					cfg: n.extend({
						format: m
					}),
					encrypt: function(e, t, o, n) {
						n = this.cfg.extend(n);
						var r = e.createEncryptor(o, n),
							i = r.finalize(t),
							a = r.cfg;
						return f.create({
							ciphertext: i,
							key: o,
							iv: a.iv,
							algorithm: e,
							mode: a.mode,
							padding: a.padding,
							blockSize: e.blockSize,
							formatter: n.format
						})
					},
					decrypt: function(e, t, o, n) {
						return n = this.cfg.extend(n), t = this._parse(t, n.format), e.createDecryptor(o, n).finalize(t.ciphertext)
					},
					_parse: function(e, t) {
						return "string" == typeof e ? t.parse(e, this) : e
					}
				}),
				v = (t.kdf = {}).OpenSSL = {
					execute: function(e, t, o, n) {
						n || (n = r.random(8));
						var i = c.create({
								keySize: t + o
							}).compute(e, n),
							a = r.create(i.words.slice(t), 4 * o);
						return i.sigBytes = 4 * t, f.create({
							key: i,
							iv: a,
							salt: n
						})
					}
				},
				y = o.PasswordBasedCipher = p.extend({
					cfg: p.cfg.extend({
						kdf: v
					}),
					encrypt: function(e, t, o, n) {
						var r = (n = this.cfg.extend(n)).kdf.execute(o, e.keySize, e.ivSize);
						n.iv = r.iv;
						var i = p.encrypt.call(this, e, t, r.key, n);
						return i.mixIn(r), i
					},
					decrypt: function(e, t, o, n) {
						n = this.cfg.extend(n), t = this._parse(t, n.format);
						var r = n.kdf.execute(o, e.keySize, e.ivSize, t.salt);
						return n.iv = r.iv, p.decrypt.call(this, e, t, r.key, n)
					}
				})
		}(), l.mode.CFB = function() {
			var e = l.lib.BlockCipherMode.extend();

			function t(e, t, o, n) {
				var r, i = this._iv;
				i ? (r = i.slice(0), this._iv = void 0) : r = this._prevBlock, n.encryptBlock(r, 0);
				for (var a = 0; a < o; a++) e[t + a] ^= r[a]
			}
			return e.Encryptor = e.extend({
				processBlock: function(e, o) {
					var n = this._cipher,
						r = n.blockSize;
					t.call(this, e, o, r, n), this._prevBlock = e.slice(o, o + r)
				}
			}), e.Decryptor = e.extend({
				processBlock: function(e, o) {
					var n = this._cipher,
						r = n.blockSize,
						i = e.slice(o, o + r);
					t.call(this, e, o, r, n), this._prevBlock = i
				}
			}), e
		}(), l.mode.ECB = ((a = l.lib.BlockCipherMode.extend()).Encryptor = a.extend({
			processBlock: function(e, t) {
				this._cipher.encryptBlock(e, t)
			}
		}), a.Decryptor = a.extend({
			processBlock: function(e, t) {
				this._cipher.decryptBlock(e, t)
			}
		}), a), l.pad.AnsiX923 = {
			pad: function(e, t) {
				var o = e.sigBytes,
					n = 4 * t,
					r = n - o % n,
					i = o + r - 1;
				e.clamp(), e.words[i >>> 2] |= r << 24 - i % 4 * 8, e.sigBytes += r
			},
			unpad: function(e) {
				var t = 255 & e.words[e.sigBytes - 1 >>> 2];
				e.sigBytes -= t
			}
		}, l.pad.Iso10126 = {
			pad: function(e, t) {
				var o = 4 * t,
					n = o - e.sigBytes % o;
				e.concat(l.lib.WordArray.random(n - 1)).concat(l.lib.WordArray.create([n << 24], 1))
			},
			unpad: function(e) {
				var t = 255 & e.words[e.sigBytes - 1 >>> 2];
				e.sigBytes -= t
			}
		}, l.pad.Iso97971 = {
			pad: function(e, t) {
				e.concat(l.lib.WordArray.create([2147483648], 1)), l.pad.ZeroPadding.pad(e, t)
			},
			unpad: function(e) {
				l.pad.ZeroPadding.unpad(e), e.sigBytes--
			}
		}, l.mode.OFB = (s = l.lib.BlockCipherMode.extend(), c = s.Encryptor = s.extend({
			processBlock: function(e, t) {
				var o = this._cipher,
					n = o.blockSize,
					r = this._iv,
					i = this._keystream;
				r && (i = this._keystream = r.slice(0), this._iv = void 0), o.encryptBlock(i, 0);
				for (var a = 0; a < n; a++) e[t + a] ^= i[a]
			}
		}), s.Decryptor = c, s), l.pad.NoPadding = {
			pad: function() {},
			unpad: function() {}
		},
		function(e) {
			var t = l,
				o = t.lib.CipherParams,
				n = t.enc.Hex;
			t.format.Hex = {
				stringify: function(e) {
					return e.ciphertext.toString(n)
				},
				parse: function(e) {
					var t = n.parse(e);
					return o.create({
						ciphertext: t
					})
				}
			}
		}(),
		function() {
			var e = l,
				t = e.lib.BlockCipher,
				o = e.algo,
				n = [],
				r = [],
				i = [],
				a = [],
				s = [],
				c = [],
				u = [],
				d = [],
				h = [],
				g = [];
			! function() {
				for (var e = [], t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
				var o = 0,
					l = 0;
				for (t = 0; t < 256; t++) {
					var w = l ^ l << 1 ^ l << 2 ^ l << 3 ^ l << 4;
					w = w >>> 8 ^ 255 & w ^ 99, n[o] = w, r[w] = o;
					var f = e[o],
						m = e[f],
						p = e[m],
						v = 257 * e[w] ^ 16843008 * w;
					i[o] = v << 24 | v >>> 8, a[o] = v << 16 | v >>> 16, s[o] = v << 8 | v >>> 24, c[o] = v;
					v = 16843009 * p ^ 65537 * m ^ 257 * f ^ 16843008 * o;
					u[w] = v << 24 | v >>> 8, d[w] = v << 16 | v >>> 16, h[w] = v << 8 | v >>> 24, g[w] = v, o ? (o = f ^ e[e[e[p ^ f]]], l ^= e[e[l]]) : o = l = 1
				}
			}();
			var w = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
				f = o.AES = t.extend({
					_doReset: function() {
						if (!this._nRounds || this._keyPriorReset !== this._key) {
							for (var e = this._keyPriorReset = this._key, t = e.words, o = e.sigBytes / 4, r = 4 * ((this._nRounds = o + 6) + 1), i = this._keySchedule = [], a = 0; a < r; a++) a < o ? i[a] = t[a] : (l = i[a - 1], a % o ? o > 6 && a % o == 4 && (l = n[l >>> 24] << 24 | n[l >>> 16 & 255] << 16 | n[l >>> 8 & 255] << 8 | n[255 & l]) : (l = n[(l = l << 8 | l >>> 24) >>> 24] << 24 | n[l >>> 16 & 255] << 16 | n[l >>> 8 & 255] << 8 | n[255 & l], l ^= w[a / o | 0] << 24), i[a] = i[a - o] ^ l);
							for (var s = this._invKeySchedule = [], c = 0; c < r; c++) {
								a = r - c;
								if (c % 4) var l = i[a];
								else l = i[a - 4];
								s[c] = c < 4 || a <= 4 ? l : u[n[l >>> 24]] ^ d[n[l >>> 16 & 255]] ^ h[n[l >>> 8 & 255]] ^ g[n[255 & l]]
							}
						}
					},
					encryptBlock: function(e, t) {
						this._doCryptBlock(e, t, this._keySchedule, i, a, s, c, n)
					},
					decryptBlock: function(e, t) {
						var o = e[t + 1];
						e[t + 1] = e[t + 3], e[t + 3] = o, this._doCryptBlock(e, t, this._invKeySchedule, u, d, h, g, r);
						o = e[t + 1];
						e[t + 1] = e[t + 3], e[t + 3] = o
					},
					_doCryptBlock: function(e, t, o, n, r, i, a, s) {
						for (var c = this._nRounds, l = e[t] ^ o[0], u = e[t + 1] ^ o[1], d = e[t + 2] ^ o[2], h = e[t + 3] ^ o[3], g = 4, w = 1; w < c; w++) {
							var f = n[l >>> 24] ^ r[u >>> 16 & 255] ^ i[d >>> 8 & 255] ^ a[255 & h] ^ o[g++],
								m = n[u >>> 24] ^ r[d >>> 16 & 255] ^ i[h >>> 8 & 255] ^ a[255 & l] ^ o[g++],
								p = n[d >>> 24] ^ r[h >>> 16 & 255] ^ i[l >>> 8 & 255] ^ a[255 & u] ^ o[g++],
								v = n[h >>> 24] ^ r[l >>> 16 & 255] ^ i[u >>> 8 & 255] ^ a[255 & d] ^ o[g++];
							l = f, u = m, d = p, h = v
						}
						f = (s[l >>> 24] << 24 | s[u >>> 16 & 255] << 16 | s[d >>> 8 & 255] << 8 | s[255 & h]) ^ o[g++], m = (s[u >>> 24] << 24 | s[d >>> 16 & 255] << 16 | s[h >>> 8 & 255] << 8 | s[255 & l]) ^ o[g++], p = (s[d >>> 24] << 24 | s[h >>> 16 & 255] << 16 | s[l >>> 8 & 255] << 8 | s[255 & u]) ^ o[g++], v = (s[h >>> 24] << 24 | s[l >>> 16 & 255] << 16 | s[u >>> 8 & 255] << 8 | s[255 & d]) ^ o[g++];
						e[t] = f, e[t + 1] = m, e[t + 2] = p, e[t + 3] = v
					},
					keySize: 8
				});
			e.AES = t._createHelper(f)
		}(),
		function() {
			var e = l,
				t = e.lib,
				o = t.WordArray,
				n = t.BlockCipher,
				r = e.algo,
				i = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],
				a = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],
				s = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
				c = [{
					0: 8421888,
					268435456: 32768,
					536870912: 8421378,
					805306368: 2,
					1073741824: 512,
					1342177280: 8421890,
					1610612736: 8389122,
					1879048192: 8388608,
					2147483648: 514,
					2415919104: 8389120,
					2684354560: 33280,
					2952790016: 8421376,
					3221225472: 32770,
					3489660928: 8388610,
					3758096384: 0,
					4026531840: 33282,
					134217728: 0,
					402653184: 8421890,
					671088640: 33282,
					939524096: 32768,
					1207959552: 8421888,
					1476395008: 512,
					1744830464: 8421378,
					2013265920: 2,
					2281701376: 8389120,
					2550136832: 33280,
					2818572288: 8421376,
					3087007744: 8389122,
					3355443200: 8388610,
					3623878656: 32770,
					3892314112: 514,
					4160749568: 8388608,
					1: 32768,
					268435457: 2,
					536870913: 8421888,
					805306369: 8388608,
					1073741825: 8421378,
					1342177281: 33280,
					1610612737: 512,
					1879048193: 8389122,
					2147483649: 8421890,
					2415919105: 8421376,
					2684354561: 8388610,
					2952790017: 33282,
					3221225473: 514,
					3489660929: 8389120,
					3758096385: 32770,
					4026531841: 0,
					134217729: 8421890,
					402653185: 8421376,
					671088641: 8388608,
					939524097: 512,
					1207959553: 32768,
					1476395009: 8388610,
					1744830465: 2,
					2013265921: 33282,
					2281701377: 32770,
					2550136833: 8389122,
					2818572289: 514,
					3087007745: 8421888,
					3355443201: 8389120,
					3623878657: 0,
					3892314113: 33280,
					4160749569: 8421378
				}, {
					0: 1074282512,
					16777216: 16384,
					33554432: 524288,
					50331648: 1074266128,
					67108864: 1073741840,
					83886080: 1074282496,
					100663296: 1073758208,
					117440512: 16,
					134217728: 540672,
					150994944: 1073758224,
					167772160: 1073741824,
					184549376: 540688,
					201326592: 524304,
					218103808: 0,
					234881024: 16400,
					251658240: 1074266112,
					8388608: 1073758208,
					25165824: 540688,
					41943040: 16,
					58720256: 1073758224,
					75497472: 1074282512,
					92274688: 1073741824,
					109051904: 524288,
					125829120: 1074266128,
					142606336: 524304,
					159383552: 0,
					176160768: 16384,
					192937984: 1074266112,
					209715200: 1073741840,
					226492416: 540672,
					243269632: 1074282496,
					260046848: 16400,
					268435456: 0,
					285212672: 1074266128,
					301989888: 1073758224,
					318767104: 1074282496,
					335544320: 1074266112,
					352321536: 16,
					369098752: 540688,
					385875968: 16384,
					402653184: 16400,
					419430400: 524288,
					436207616: 524304,
					452984832: 1073741840,
					469762048: 540672,
					486539264: 1073758208,
					503316480: 1073741824,
					520093696: 1074282512,
					276824064: 540688,
					293601280: 524288,
					310378496: 1074266112,
					327155712: 16384,
					343932928: 1073758208,
					360710144: 1074282512,
					377487360: 16,
					394264576: 1073741824,
					411041792: 1074282496,
					427819008: 1073741840,
					444596224: 1073758224,
					461373440: 524304,
					478150656: 0,
					494927872: 16400,
					511705088: 1074266128,
					528482304: 540672
				}, {
					0: 260,
					1048576: 0,
					2097152: 67109120,
					3145728: 65796,
					4194304: 65540,
					5242880: 67108868,
					6291456: 67174660,
					7340032: 67174400,
					8388608: 67108864,
					9437184: 67174656,
					10485760: 65792,
					11534336: 67174404,
					12582912: 67109124,
					13631488: 65536,
					14680064: 4,
					15728640: 256,
					524288: 67174656,
					1572864: 67174404,
					2621440: 0,
					3670016: 67109120,
					4718592: 67108868,
					5767168: 65536,
					6815744: 65540,
					7864320: 260,
					8912896: 4,
					9961472: 256,
					11010048: 67174400,
					12058624: 65796,
					13107200: 65792,
					14155776: 67109124,
					15204352: 67174660,
					16252928: 67108864,
					16777216: 67174656,
					17825792: 65540,
					18874368: 65536,
					19922944: 67109120,
					20971520: 256,
					22020096: 67174660,
					23068672: 67108868,
					24117248: 0,
					25165824: 67109124,
					26214400: 67108864,
					27262976: 4,
					28311552: 65792,
					29360128: 67174400,
					30408704: 260,
					31457280: 65796,
					32505856: 67174404,
					17301504: 67108864,
					18350080: 260,
					19398656: 67174656,
					20447232: 0,
					21495808: 65540,
					22544384: 67109120,
					23592960: 256,
					24641536: 67174404,
					25690112: 65536,
					26738688: 67174660,
					27787264: 65796,
					28835840: 67108868,
					29884416: 67109124,
					30932992: 67174400,
					31981568: 4,
					33030144: 65792
				}, {
					0: 2151682048,
					65536: 2147487808,
					131072: 4198464,
					196608: 2151677952,
					262144: 0,
					327680: 4198400,
					393216: 2147483712,
					458752: 4194368,
					524288: 2147483648,
					589824: 4194304,
					655360: 64,
					720896: 2147487744,
					786432: 2151678016,
					851968: 4160,
					917504: 4096,
					983040: 2151682112,
					32768: 2147487808,
					98304: 64,
					163840: 2151678016,
					229376: 2147487744,
					294912: 4198400,
					360448: 2151682112,
					425984: 0,
					491520: 2151677952,
					557056: 4096,
					622592: 2151682048,
					688128: 4194304,
					753664: 4160,
					819200: 2147483648,
					884736: 4194368,
					950272: 4198464,
					1015808: 2147483712,
					1048576: 4194368,
					1114112: 4198400,
					1179648: 2147483712,
					1245184: 0,
					1310720: 4160,
					1376256: 2151678016,
					1441792: 2151682048,
					1507328: 2147487808,
					1572864: 2151682112,
					1638400: 2147483648,
					1703936: 2151677952,
					1769472: 4198464,
					1835008: 2147487744,
					1900544: 4194304,
					1966080: 64,
					2031616: 4096,
					1081344: 2151677952,
					1146880: 2151682112,
					1212416: 0,
					1277952: 4198400,
					1343488: 4194368,
					1409024: 2147483648,
					1474560: 2147487808,
					1540096: 64,
					1605632: 2147483712,
					1671168: 4096,
					1736704: 2147487744,
					1802240: 2151678016,
					1867776: 4160,
					1933312: 2151682048,
					1998848: 4194304,
					2064384: 4198464
				}, {
					0: 128,
					4096: 17039360,
					8192: 262144,
					12288: 536870912,
					16384: 537133184,
					20480: 16777344,
					24576: 553648256,
					28672: 262272,
					32768: 16777216,
					36864: 537133056,
					40960: 536871040,
					45056: 553910400,
					49152: 553910272,
					53248: 0,
					57344: 17039488,
					61440: 553648128,
					2048: 17039488,
					6144: 553648256,
					10240: 128,
					14336: 17039360,
					18432: 262144,
					22528: 537133184,
					26624: 553910272,
					30720: 536870912,
					34816: 537133056,
					38912: 0,
					43008: 553910400,
					47104: 16777344,
					51200: 536871040,
					55296: 553648128,
					59392: 16777216,
					63488: 262272,
					65536: 262144,
					69632: 128,
					73728: 536870912,
					77824: 553648256,
					81920: 16777344,
					86016: 553910272,
					90112: 537133184,
					94208: 16777216,
					98304: 553910400,
					102400: 553648128,
					106496: 17039360,
					110592: 537133056,
					114688: 262272,
					118784: 536871040,
					122880: 0,
					126976: 17039488,
					67584: 553648256,
					71680: 16777216,
					75776: 17039360,
					79872: 537133184,
					83968: 536870912,
					88064: 17039488,
					92160: 128,
					96256: 553910272,
					100352: 262272,
					104448: 553910400,
					108544: 0,
					112640: 553648128,
					116736: 16777344,
					120832: 262144,
					124928: 537133056,
					129024: 536871040
				}, {
					0: 268435464,
					256: 8192,
					512: 270532608,
					768: 270540808,
					1024: 268443648,
					1280: 2097152,
					1536: 2097160,
					1792: 268435456,
					2048: 0,
					2304: 268443656,
					2560: 2105344,
					2816: 8,
					3072: 270532616,
					3328: 2105352,
					3584: 8200,
					3840: 270540800,
					128: 270532608,
					384: 270540808,
					640: 8,
					896: 2097152,
					1152: 2105352,
					1408: 268435464,
					1664: 268443648,
					1920: 8200,
					2176: 2097160,
					2432: 8192,
					2688: 268443656,
					2944: 270532616,
					3200: 0,
					3456: 270540800,
					3712: 2105344,
					3968: 268435456,
					4096: 268443648,
					4352: 270532616,
					4608: 270540808,
					4864: 8200,
					5120: 2097152,
					5376: 268435456,
					5632: 268435464,
					5888: 2105344,
					6144: 2105352,
					6400: 0,
					6656: 8,
					6912: 270532608,
					7168: 8192,
					7424: 268443656,
					7680: 270540800,
					7936: 2097160,
					4224: 8,
					4480: 2105344,
					4736: 2097152,
					4992: 268435464,
					5248: 268443648,
					5504: 8200,
					5760: 270540808,
					6016: 270532608,
					6272: 270540800,
					6528: 270532616,
					6784: 8192,
					7040: 2105352,
					7296: 2097160,
					7552: 0,
					7808: 268435456,
					8064: 268443656
				}, {
					0: 1048576,
					16: 33555457,
					32: 1024,
					48: 1049601,
					64: 34604033,
					80: 0,
					96: 1,
					112: 34603009,
					128: 33555456,
					144: 1048577,
					160: 33554433,
					176: 34604032,
					192: 34603008,
					208: 1025,
					224: 1049600,
					240: 33554432,
					8: 34603009,
					24: 0,
					40: 33555457,
					56: 34604032,
					72: 1048576,
					88: 33554433,
					104: 33554432,
					120: 1025,
					136: 1049601,
					152: 33555456,
					168: 34603008,
					184: 1048577,
					200: 1024,
					216: 34604033,
					232: 1,
					248: 1049600,
					256: 33554432,
					272: 1048576,
					288: 33555457,
					304: 34603009,
					320: 1048577,
					336: 33555456,
					352: 34604032,
					368: 1049601,
					384: 1025,
					400: 34604033,
					416: 1049600,
					432: 1,
					448: 0,
					464: 34603008,
					480: 33554433,
					496: 1024,
					264: 1049600,
					280: 33555457,
					296: 34603009,
					312: 1,
					328: 33554432,
					344: 1048576,
					360: 1025,
					376: 34604032,
					392: 33554433,
					408: 34603008,
					424: 0,
					440: 34604033,
					456: 1049601,
					472: 1024,
					488: 33555456,
					504: 1048577
				}, {
					0: 134219808,
					1: 131072,
					2: 134217728,
					3: 32,
					4: 131104,
					5: 134350880,
					6: 134350848,
					7: 2048,
					8: 134348800,
					9: 134219776,
					10: 133120,
					11: 134348832,
					12: 2080,
					13: 0,
					14: 134217760,
					15: 133152,
					2147483648: 2048,
					2147483649: 134350880,
					2147483650: 134219808,
					2147483651: 134217728,
					2147483652: 134348800,
					2147483653: 133120,
					2147483654: 133152,
					2147483655: 32,
					2147483656: 134217760,
					2147483657: 2080,
					2147483658: 131104,
					2147483659: 134350848,
					2147483660: 0,
					2147483661: 134348832,
					2147483662: 134219776,
					2147483663: 131072,
					16: 133152,
					17: 134350848,
					18: 32,
					19: 2048,
					20: 134219776,
					21: 134217760,
					22: 134348832,
					23: 131072,
					24: 0,
					25: 131104,
					26: 134348800,
					27: 134219808,
					28: 134350880,
					29: 133120,
					30: 2080,
					31: 134217728,
					2147483664: 131072,
					2147483665: 2048,
					2147483666: 134348832,
					2147483667: 133152,
					2147483668: 32,
					2147483669: 134348800,
					2147483670: 134217728,
					2147483671: 134219808,
					2147483672: 134350880,
					2147483673: 134217760,
					2147483674: 134219776,
					2147483675: 0,
					2147483676: 133120,
					2147483677: 2080,
					2147483678: 131104,
					2147483679: 134350848
				}],
				u = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],
				d = r.DES = n.extend({
					_doReset: function() {
						for (var e = this._key.words, t = [], o = 0; o < 56; o++) {
							var n = i[o] - 1;
							t[o] = e[n >>> 5] >>> 31 - n % 32 & 1
						}
						for (var r = this._subKeys = [], c = 0; c < 16; c++) {
							var l = r[c] = [],
								u = s[c];
							for (o = 0; o < 24; o++) l[o / 6 | 0] |= t[(a[o] - 1 + u) % 28] << 31 - o % 6, l[4 + (o / 6 | 0)] |= t[28 + (a[o + 24] - 1 + u) % 28] << 31 - o % 6;
							l[0] = l[0] << 1 | l[0] >>> 31;
							for (o = 1; o < 7; o++) l[o] = l[o] >>> 4 * (o - 1) + 3;
							l[7] = l[7] << 5 | l[7] >>> 27
						}
						var d = this._invSubKeys = [];
						for (o = 0; o < 16; o++) d[o] = r[15 - o]
					},
					encryptBlock: function(e, t) {
						this._doCryptBlock(e, t, this._subKeys)
					},
					decryptBlock: function(e, t) {
						this._doCryptBlock(e, t, this._invSubKeys)
					},
					_doCryptBlock: function(e, t, o) {
						this._lBlock = e[t], this._rBlock = e[t + 1], h.call(this, 4, 252645135), h.call(this, 16, 65535), g.call(this, 2, 858993459), g.call(this, 8, 16711935), h.call(this, 1, 1431655765);
						for (var n = 0; n < 16; n++) {
							for (var r = o[n], i = this._lBlock, a = this._rBlock, s = 0, l = 0; l < 8; l++) s |= c[l][((a ^ r[l]) & u[l]) >>> 0];
							this._lBlock = a, this._rBlock = i ^ s
						}
						var d = this._lBlock;
						this._lBlock = this._rBlock, this._rBlock = d, h.call(this, 1, 1431655765), g.call(this, 8, 16711935), g.call(this, 2, 858993459), h.call(this, 16, 65535), h.call(this, 4, 252645135), e[t] = this._lBlock, e[t + 1] = this._rBlock
					},
					keySize: 2,
					ivSize: 2,
					blockSize: 2
				});

			function h(e, t) {
				var o = (this._lBlock >>> e ^ this._rBlock) & t;
				this._rBlock ^= o, this._lBlock ^= o << e
			}

			function g(e, t) {
				var o = (this._rBlock >>> e ^ this._lBlock) & t;
				this._lBlock ^= o, this._rBlock ^= o << e
			}
			e.DES = n._createHelper(d);
			var w = r.TripleDES = n.extend({
				_doReset: function() {
					var e = this._key.words;
					if (2 !== e.length && 4 !== e.length && e.length < 6) throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
					var t = e.slice(0, 2),
						n = e.length < 4 ? e.slice(0, 2) : e.slice(2, 4),
						r = e.length < 6 ? e.slice(0, 2) : e.slice(4, 6);
					this._des1 = d.createEncryptor(o.create(t)), this._des2 = d.createEncryptor(o.create(n)), this._des3 = d.createEncryptor(o.create(r))
				},
				encryptBlock: function(e, t) {
					this._des1.encryptBlock(e, t), this._des2.decryptBlock(e, t), this._des3.encryptBlock(e, t)
				},
				decryptBlock: function(e, t) {
					this._des3.decryptBlock(e, t), this._des2.encryptBlock(e, t), this._des1.decryptBlock(e, t)
				},
				keySize: 6,
				ivSize: 2,
				blockSize: 2
			});
			e.TripleDES = n._createHelper(w)
		}(),
		function() {
			var e = l,
				t = e.lib.StreamCipher,
				o = e.algo,
				n = o.RC4 = t.extend({
					_doReset: function() {
						for (var e = this._key, t = e.words, o = e.sigBytes, n = this._S = [], r = 0; r < 256; r++) n[r] = r;
						r = 0;
						for (var i = 0; r < 256; r++) {
							var a = r % o,
								s = t[a >>> 2] >>> 24 - a % 4 * 8 & 255;
							i = (i + n[r] + s) % 256;
							var c = n[r];
							n[r] = n[i], n[i] = c
						}
						this._i = this._j = 0
					},
					_doProcessBlock: function(e, t) {
						e[t] ^= r.call(this)
					},
					keySize: 8,
					ivSize: 0
				});

			function r() {
				for (var e = this._S, t = this._i, o = this._j, n = 0, r = 0; r < 4; r++) {
					o = (o + e[t = (t + 1) % 256]) % 256;
					var i = e[t];
					e[t] = e[o], e[o] = i, n |= e[(e[t] + e[o]) % 256] << 24 - 8 * r
				}
				return this._i = t, this._j = o, n
			}
			e.RC4 = t._createHelper(n);
			var i = o.RC4Drop = n.extend({
				cfg: n.cfg.extend({
					drop: 192
				}),
				_doReset: function() {
					n._doReset.call(this);
					for (var e = this.cfg.drop; e > 0; e--) r.call(this)
				}
			});
			e.RC4Drop = t._createHelper(i)
		}(), l.mode.CTRGladman = function() {
			var e = l.lib.BlockCipherMode.extend();

			function t(e) {
				if (255 == (e >> 24 & 255)) {
					var t = e >> 16 & 255,
						o = e >> 8 & 255,
						n = 255 & e;
					255 === t ? (t = 0, 255 === o ? (o = 0, 255 === n ? n = 0 : ++n) : ++o) : ++t, e = 0, e += t << 16, e += o << 8, e += n
				} else e += 1 << 24;
				return e
			}
			var o = e.Encryptor = e.extend({
				processBlock: function(e, o) {
					var n = this._cipher,
						r = n.blockSize,
						i = this._iv,
						a = this._counter;
					i && (a = this._counter = i.slice(0), this._iv = void 0),
						function(e) {
							0 === (e[0] = t(e[0])) && (e[1] = t(e[1]))
						}(a);
					var s = a.slice(0);
					n.encryptBlock(s, 0);
					for (var c = 0; c < r; c++) e[o + c] ^= s[c]
				}
			});
			return e.Decryptor = o, e
		}(),
		function() {
			var e = l,
				t = e.lib.StreamCipher,
				o = [],
				n = [],
				r = [],
				i = e.algo.Rabbit = t.extend({
					_doReset: function() {
						for (var e = this._key.words, t = this.cfg.iv, o = 0; o < 4; o++) e[o] = 16711935 & (e[o] << 8 | e[o] >>> 24) | 4278255360 & (e[o] << 24 | e[o] >>> 8);
						var n = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16],
							r = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]];
						this._b = 0;
						for (o = 0; o < 4; o++) a.call(this);
						for (o = 0; o < 8; o++) r[o] ^= n[o + 4 & 7];
						if (t) {
							var i = t.words,
								s = i[0],
								c = i[1],
								l = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
								u = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8),
								d = l >>> 16 | 4294901760 & u,
								h = u << 16 | 65535 & l;
							r[0] ^= l, r[1] ^= d, r[2] ^= u, r[3] ^= h, r[4] ^= l, r[5] ^= d, r[6] ^= u, r[7] ^= h;
							for (o = 0; o < 4; o++) a.call(this)
						}
					},
					_doProcessBlock: function(e, t) {
						var n = this._X;
						a.call(this), o[0] = n[0] ^ n[5] >>> 16 ^ n[3] << 16, o[1] = n[2] ^ n[7] >>> 16 ^ n[5] << 16, o[2] = n[4] ^ n[1] >>> 16 ^ n[7] << 16, o[3] = n[6] ^ n[3] >>> 16 ^ n[1] << 16;
						for (var r = 0; r < 4; r++) o[r] = 16711935 & (o[r] << 8 | o[r] >>> 24) | 4278255360 & (o[r] << 24 | o[r] >>> 8), e[t + r] ^= o[r]
					},
					blockSize: 4,
					ivSize: 2
				});

			function a() {
				for (var e = this._X, t = this._C, o = 0; o < 8; o++) n[o] = t[o];
				t[0] = t[0] + 1295307597 + this._b | 0, t[1] = t[1] + 3545052371 + (t[0] >>> 0 < n[0] >>> 0 ? 1 : 0) | 0, t[2] = t[2] + 886263092 + (t[1] >>> 0 < n[1] >>> 0 ? 1 : 0) | 0, t[3] = t[3] + 1295307597 + (t[2] >>> 0 < n[2] >>> 0 ? 1 : 0) | 0, t[4] = t[4] + 3545052371 + (t[3] >>> 0 < n[3] >>> 0 ? 1 : 0) | 0, t[5] = t[5] + 886263092 + (t[4] >>> 0 < n[4] >>> 0 ? 1 : 0) | 0, t[6] = t[6] + 1295307597 + (t[5] >>> 0 < n[5] >>> 0 ? 1 : 0) | 0, t[7] = t[7] + 3545052371 + (t[6] >>> 0 < n[6] >>> 0 ? 1 : 0) | 0, this._b = t[7] >>> 0 < n[7] >>> 0 ? 1 : 0;
				for (o = 0; o < 8; o++) {
					var i = e[o] + t[o],
						a = 65535 & i,
						s = i >>> 16,
						c = ((a * a >>> 17) + a * s >>> 15) + s * s,
						l = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
					r[o] = c ^ l
				}
				e[0] = r[0] + (r[7] << 16 | r[7] >>> 16) + (r[6] << 16 | r[6] >>> 16) | 0, e[1] = r[1] + (r[0] << 8 | r[0] >>> 24) + r[7] | 0, e[2] = r[2] + (r[1] << 16 | r[1] >>> 16) + (r[0] << 16 | r[0] >>> 16) | 0, e[3] = r[3] + (r[2] << 8 | r[2] >>> 24) + r[1] | 0, e[4] = r[4] + (r[3] << 16 | r[3] >>> 16) + (r[2] << 16 | r[2] >>> 16) | 0, e[5] = r[5] + (r[4] << 8 | r[4] >>> 24) + r[3] | 0, e[6] = r[6] + (r[5] << 16 | r[5] >>> 16) + (r[4] << 16 | r[4] >>> 16) | 0, e[7] = r[7] + (r[6] << 8 | r[6] >>> 24) + r[5] | 0
			}
			e.Rabbit = t._createHelper(i)
		}(), l.mode.CTR = function() {
			var e = l.lib.BlockCipherMode.extend(),
				t = e.Encryptor = e.extend({
					processBlock: function(e, t) {
						var o = this._cipher,
							n = o.blockSize,
							r = this._iv,
							i = this._counter;
						r && (i = this._counter = r.slice(0), this._iv = void 0);
						var a = i.slice(0);
						o.encryptBlock(a, 0), i[n - 1] = i[n - 1] + 1 | 0;
						for (var s = 0; s < n; s++) e[t + s] ^= a[s]
					}
				});
			return e.Decryptor = t, e
		}(),
		function() {
			var e = l,
				t = e.lib.StreamCipher,
				o = [],
				n = [],
				r = [],
				i = e.algo.RabbitLegacy = t.extend({
					_doReset: function() {
						var e = this._key.words,
							t = this.cfg.iv,
							o = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16],
							n = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]];
						this._b = 0;
						for (var r = 0; r < 4; r++) a.call(this);
						for (r = 0; r < 8; r++) n[r] ^= o[r + 4 & 7];
						if (t) {
							var i = t.words,
								s = i[0],
								c = i[1],
								l = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
								u = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8),
								d = l >>> 16 | 4294901760 & u,
								h = u << 16 | 65535 & l;
							n[0] ^= l, n[1] ^= d, n[2] ^= u, n[3] ^= h, n[4] ^= l, n[5] ^= d, n[6] ^= u, n[7] ^= h;
							for (r = 0; r < 4; r++) a.call(this)
						}
					},
					_doProcessBlock: function(e, t) {
						var n = this._X;
						a.call(this), o[0] = n[0] ^ n[5] >>> 16 ^ n[3] << 16, o[1] = n[2] ^ n[7] >>> 16 ^ n[5] << 16, o[2] = n[4] ^ n[1] >>> 16 ^ n[7] << 16, o[3] = n[6] ^ n[3] >>> 16 ^ n[1] << 16;
						for (var r = 0; r < 4; r++) o[r] = 16711935 & (o[r] << 8 | o[r] >>> 24) | 4278255360 & (o[r] << 24 | o[r] >>> 8), e[t + r] ^= o[r]
					},
					blockSize: 4,
					ivSize: 2
				});

			function a() {
				for (var e = this._X, t = this._C, o = 0; o < 8; o++) n[o] = t[o];
				t[0] = t[0] + 1295307597 + this._b | 0, t[1] = t[1] + 3545052371 + (t[0] >>> 0 < n[0] >>> 0 ? 1 : 0) | 0, t[2] = t[2] + 886263092 + (t[1] >>> 0 < n[1] >>> 0 ? 1 : 0) | 0, t[3] = t[3] + 1295307597 + (t[2] >>> 0 < n[2] >>> 0 ? 1 : 0) | 0, t[4] = t[4] + 3545052371 + (t[3] >>> 0 < n[3] >>> 0 ? 1 : 0) | 0, t[5] = t[5] + 886263092 + (t[4] >>> 0 < n[4] >>> 0 ? 1 : 0) | 0, t[6] = t[6] + 1295307597 + (t[5] >>> 0 < n[5] >>> 0 ? 1 : 0) | 0, t[7] = t[7] + 3545052371 + (t[6] >>> 0 < n[6] >>> 0 ? 1 : 0) | 0, this._b = t[7] >>> 0 < n[7] >>> 0 ? 1 : 0;
				for (o = 0; o < 8; o++) {
					var i = e[o] + t[o],
						a = 65535 & i,
						s = i >>> 16,
						c = ((a * a >>> 17) + a * s >>> 15) + s * s,
						l = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
					r[o] = c ^ l
				}
				e[0] = r[0] + (r[7] << 16 | r[7] >>> 16) + (r[6] << 16 | r[6] >>> 16) | 0, e[1] = r[1] + (r[0] << 8 | r[0] >>> 24) + r[7] | 0, e[2] = r[2] + (r[1] << 16 | r[1] >>> 16) + (r[0] << 16 | r[0] >>> 16) | 0, e[3] = r[3] + (r[2] << 8 | r[2] >>> 24) + r[1] | 0, e[4] = r[4] + (r[3] << 16 | r[3] >>> 16) + (r[2] << 16 | r[2] >>> 16) | 0, e[5] = r[5] + (r[4] << 8 | r[4] >>> 24) + r[3] | 0, e[6] = r[6] + (r[5] << 16 | r[5] >>> 16) + (r[4] << 16 | r[4] >>> 16) | 0, e[7] = r[7] + (r[6] << 8 | r[6] >>> 24) + r[5] | 0
			}
			e.RabbitLegacy = t._createHelper(i)
		}(), l.pad.ZeroPadding = {
			pad: function(e, t) {
				var o = 4 * t;
				e.clamp(), e.sigBytes += o - (e.sigBytes % o || o)
			},
			unpad: function(e) {
				var t = e.words,
					o = e.sigBytes - 1;
				for (o = e.sigBytes - 1; o >= 0; o--)
					if (t[o >>> 2] >>> 24 - o % 4 * 8 & 255) {
						e.sigBytes = o + 1;
						break
					}
			}
		}, l
}),
function e(t, o, n) {
	function r(a, s) {
		if (!o[a]) {
			if (!t[a]) {
				var c = "function" == typeof require && require;
				if (!s && c) return c(a, !0);
				if (i) return i(a, !0);
				var l = new Error("Cannot find module '" + a + "'");
				throw l.code = "MODULE_NOT_FOUND", l
			}
			var u = o[a] = {
				exports: {}
			};
			t[a][0].call(u.exports, function(e) {
				return r(t[a][1][e] || e)
			}, u, u.exports, e, t, o, n)
		}
		return o[a].exports
	}
	for (var i = "function" == typeof require && require, a = 0; a < n.length; a++) r(n[a]);
	return r
}({
	1: [function(e, t, o) {
		! function(n) {
			"use strict";
			var r = function(e, t, o) {
				this.low = 0 | e, this.high = 0 | t, this.unsigned = !!o
			};
			r.isLong = function(e) {
				return !0 === (e && e instanceof r)
			};
			var i = {},
				a = {};
			r.fromInt = function(e, t) {
				var o, n;
				return t ? 0 <= (e >>>= 0) && e < 256 && (n = a[e]) ? n : (o = new r(e, (0 | e) < 0 ? -1 : 0, !0), 0 <= e && e < 256 && (a[e] = o), o) : -128 <= (e |= 0) && e < 128 && (n = i[e]) ? n : (o = new r(e, e < 0 ? -1 : 0, !1), -128 <= e && e < 128 && (i[e] = o), o)
			}, r.fromNumber = function(e, t) {
				return t = !!t, isNaN(e) || !isFinite(e) ? r.ZERO : !t && e <= -l ? r.MIN_VALUE : !t && l <= e + 1 ? r.MAX_VALUE : t && c <= e ? r.MAX_UNSIGNED_VALUE : e < 0 ? r.fromNumber(-e, t).negate() : new r(e % s | 0, e / s | 0, t)
			}, r.fromBits = function(e, t, o) {
				return new r(e, t, o)
			}, r.fromString = function(e, t, o) {
				if (0 === e.length) throw Error("number format error: empty string");
				if ("NaN" === e || "Infinity" === e || "+Infinity" === e || "-Infinity" === e) return r.ZERO;
				if ("number" == typeof t && (o = t, t = !1), (o = o || 10) < 2 || 36 < o) throw Error("radix out of range: " + o);
				var n;
				if (0 < (n = e.indexOf("-"))) throw Error('number format error: interior "-" character: ' + e);
				if (0 === n) return r.fromString(e.substring(1), t, o).negate();
				for (var i = r.fromNumber(Math.pow(o, 8)), a = r.ZERO, s = 0; s < e.length; s += 8) {
					var c = Math.min(8, e.length - s),
						l = parseInt(e.substring(s, s + c), o);
					if (c < 8) {
						var u = r.fromNumber(Math.pow(o, c));
						a = a.multiply(u).add(r.fromNumber(l))
					} else a = (a = a.multiply(i)).add(r.fromNumber(l))
				}
				return a.unsigned = t, a
			}, r.fromValue = function(e) {
				return "number" == typeof e ? r.fromNumber(e) : "string" == typeof e ? r.fromString(e) : r.isLong(e) ? e : new r(e.low, e.high, e.unsigned)
			};
			var s = 4294967296,
				c = s * s,
				l = c / 2,
				u = r.fromInt(1 << 24);
			r.ZERO = r.fromInt(0), r.UZERO = r.fromInt(0, !0), r.ONE = r.fromInt(1), r.UONE = r.fromInt(1, !0), r.NEG_ONE = r.fromInt(-1), r.MAX_VALUE = r.fromBits(-1, 2147483647, !1), r.MAX_UNSIGNED_VALUE = r.fromBits(-1, -1, !0), r.MIN_VALUE = r.fromBits(0, -2147483648, !1), r.prototype.toInt = function() {
				return this.unsigned ? this.low >>> 0 : this.low
			}, r.prototype.toNumber = function() {
				return this.unsigned ? (this.high >>> 0) * s + (this.low >>> 0) : this.high * s + (this.low >>> 0)
			}, r.prototype.toString = function(e) {
				if ((e = e || 10) < 2 || 36 < e) throw RangeError("radix out of range: " + e);
				if (this.isZero()) return "0";
				var t;
				if (this.isNegative()) {
					if (this.equals(r.MIN_VALUE)) {
						var o = r.fromNumber(e),
							n = this.div(o);
						return t = n.multiply(o).subtract(this), n.toString(e) + t.toInt().toString(e)
					}
					return "-" + this.negate().toString(e)
				}
				var i = r.fromNumber(Math.pow(e, 6), this.unsigned);
				t = this;
				for (var a = "";;) {
					var s = t.div(i),
						c = (t.subtract(s.multiply(i)).toInt() >>> 0).toString(e);
					if ((t = s).isZero()) return c + a;
					for (; c.length < 6;) c = "0" + c;
					a = "" + c + a
				}
			}, r.prototype.getHighBits = function() {
				return this.high
			}, r.prototype.getHighBitsUnsigned = function() {
				return this.high >>> 0
			}, r.prototype.getLowBits = function() {
				return this.low
			}, r.prototype.getLowBitsUnsigned = function() {
				return this.low >>> 0
			}, r.prototype.getNumBitsAbs = function() {
				if (this.isNegative()) return this.equals(r.MIN_VALUE) ? 64 : this.negate().getNumBitsAbs();
				for (var e = 0 != this.high ? this.high : this.low, t = 31; 0 < t && 0 == (e & 1 << t); t--);
				return 0 != this.high ? t + 33 : t + 1
			}, r.prototype.isZero = function() {
				return 0 === this.high && 0 === this.low
			}, r.prototype.isNegative = function() {
				return !this.unsigned && this.high < 0
			}, r.prototype.isPositive = function() {
				return this.unsigned || 0 <= this.high
			}, r.prototype.isOdd = function() {
				return 1 == (1 & this.low)
			}, r.prototype.isEven = function() {
				return 0 == (1 & this.low)
			}, r.prototype.equals = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), (this.unsigned === e.unsigned || this.high >>> 31 != 1 || e.high >>> 31 != 1) && this.high === e.high && this.low === e.low
			}, r.prototype.notEquals = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), !this.equals(e)
			}, r.prototype.lessThan = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), this.compare(e) < 0
			}, r.prototype.lessThanOrEqual = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), this.compare(e) <= 0
			}, r.prototype.greaterThan = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), 0 < this.compare(e)
			}, r.prototype.greaterThanOrEqual = function(e) {
				return 0 <= this.compare(e)
			}, r.prototype.compare = function(e) {
				if (this.equals(e)) return 0;
				var t = this.isNegative(),
					o = e.isNegative();
				return t && !o ? -1 : !t && o ? 1 : this.unsigned ? e.high >>> 0 > this.high >>> 0 || e.high === this.high && e.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.subtract(e).isNegative() ? -1 : 1
			}, r.prototype.negate = function() {
				return !this.unsigned && this.equals(r.MIN_VALUE) ? r.MIN_VALUE : this.not().add(r.ONE)
			}, r.prototype.add = function(e) {
				r.isLong(e) || (e = r.fromValue(e));
				var t = this.high >>> 16,
					o = 65535 & this.high,
					n = this.low >>> 16,
					i = 65535 & this.low,
					a = e.high >>> 16,
					s = 65535 & e.high,
					c = e.low >>> 16,
					l = 0,
					u = 0,
					d = 0,
					h = 0;
				return d += (h += i + (65535 & e.low)) >>> 16, u += (d += n + c) >>> 16, l += (u += o + s) >>> 16, l += t + a, r.fromBits((d &= 65535) << 16 | (h &= 65535), (l &= 65535) << 16 | (u &= 65535), this.unsigned)
			}, r.prototype.subtract = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), this.add(e.negate())
			}, r.prototype.multiply = function(e) {
				if (this.isZero()) return r.ZERO;
				if (r.isLong(e) || (e = r.fromValue(e)), e.isZero()) return r.ZERO;
				if (this.equals(r.MIN_VALUE)) return e.isOdd() ? r.MIN_VALUE : r.ZERO;
				if (e.equals(r.MIN_VALUE)) return this.isOdd() ? r.MIN_VALUE : r.ZERO;
				if (this.isNegative()) return e.isNegative() ? this.negate().multiply(e.negate()) : this.negate().multiply(e).negate();
				if (e.isNegative()) return this.multiply(e.negate()).negate();
				if (this.lessThan(u) && e.lessThan(u)) return r.fromNumber(this.toNumber() * e.toNumber(), this.unsigned);
				var t = this.high >>> 16,
					o = 65535 & this.high,
					n = this.low >>> 16,
					i = 65535 & this.low,
					a = e.high >>> 16,
					s = 65535 & e.high,
					c = e.low >>> 16,
					l = 65535 & e.low,
					d = 0,
					h = 0,
					g = 0,
					w = 0;
				return g += (w += i * l) >>> 16, h += (g += n * l) >>> 16, g &= 65535, h += (g += i * c) >>> 16, d += (h += o * l) >>> 16, h &= 65535, d += (h += n * c) >>> 16, h &= 65535, d += (h += i * s) >>> 16, d += t * l + o * c + n * s + i * a, r.fromBits((g &= 65535) << 16 | (w &= 65535), (d &= 65535) << 16 | (h &= 65535), this.unsigned)
			}, r.prototype.div = function(e) {
				if (r.isLong(e) || (e = r.fromValue(e)), e.isZero()) throw new Error("division by zero");
				if (this.isZero()) return this.unsigned ? r.UZERO : r.ZERO;
				var t, o, n;
				if (this.equals(r.MIN_VALUE)) return e.equals(r.ONE) || e.equals(r.NEG_ONE) ? r.MIN_VALUE : e.equals(r.MIN_VALUE) ? r.ONE : (t = this.shiftRight(1).div(e).shiftLeft(1)).equals(r.ZERO) ? e.isNegative() ? r.ONE : r.NEG_ONE : (o = this.subtract(e.multiply(t)), n = t.add(o.div(e)));
				if (e.equals(r.MIN_VALUE)) return this.unsigned ? r.UZERO : r.ZERO;
				if (this.isNegative()) return e.isNegative() ? this.negate().div(e.negate()) : this.negate().div(e).negate();
				if (e.isNegative()) return this.div(e.negate()).negate();
				for (n = r.ZERO, o = this; o.greaterThanOrEqual(e);) {
					t = Math.max(1, Math.floor(o.toNumber() / e.toNumber()));
					for (var i = Math.ceil(Math.log(t) / Math.LN2), a = i <= 48 ? 1 : Math.pow(2, i - 48), s = r.fromNumber(t), c = s.multiply(e); c.isNegative() || c.greaterThan(o);) c = (s = r.fromNumber(t -= a, this.unsigned)).multiply(e);
					s.isZero() && (s = r.ONE), n = n.add(s), o = o.subtract(c)
				}
				return n
			}, r.prototype.modulo = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), this.subtract(this.div(e).multiply(e))
			}, r.prototype.not = function() {
				return r.fromBits(~this.low, ~this.high, this.unsigned)
			}, r.prototype.and = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), r.fromBits(this.low & e.low, this.high & e.high, this.unsigned)
			}, r.prototype.or = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), r.fromBits(this.low | e.low, this.high | e.high, this.unsigned)
			}, r.prototype.xor = function(e) {
				return r.isLong(e) || (e = r.fromValue(e)), r.fromBits(this.low ^ e.low, this.high ^ e.high, this.unsigned)
			}, r.prototype.shiftLeft = function(e) {
				return r.isLong(e) && (e = e.toInt()), 0 == (e &= 63) ? this : e < 32 ? r.fromBits(this.low << e, this.high << e | this.low >>> 32 - e, this.unsigned) : r.fromBits(0, this.low << e - 32, this.unsigned)
			}, r.prototype.shiftRight = function(e) {
				return r.isLong(e) && (e = e.toInt()), 0 == (e &= 63) ? this : e < 32 ? r.fromBits(this.low >>> e | this.high << 32 - e, this.high >> e, this.unsigned) : r.fromBits(this.high >> e - 32, 0 <= this.high ? 0 : -1, this.unsigned)
			}, r.prototype.shiftRightUnsigned = function(e) {
				if (r.isLong(e) && (e = e.toInt()), 0 == (e &= 63)) return this;
				var t = this.high;
				if (e < 32) {
					var o = this.low;
					return r.fromBits(o >>> e | t << 32 - e, t >>> e, this.unsigned)
				}
				return r.fromBits(32 === e ? t : t >>> e - 32, 0, this.unsigned)
			}, r.prototype.toSigned = function() {
				return this.unsigned ? new r(this.low, this.high, !1) : this
			}, r.prototype.toUnsigned = function() {
				return this.unsigned ? this : new r(this.low, this.high, !0)
			}, "function" == typeof e && "object" == typeof t && t && "object" == typeof o && o ? t.exports = r : "function" == typeof define && define.amd ? define(function() {
				return r
			}) : (n.dcodeIO = n.dcodeIO || {}).Long = r
		}(this)
	}, {}],
	2: [function(e, t, o) {
		t.exports = e("./dist/Long.js")
	}, {
		"./dist/Long.js": 1
	}],
	3: [function(e, t, o) {
		window.Long = e("long")
	}, {
		long: 2
	}]
}, {}, [3]);
const identifiedWebsites = [];

function notifyProxyIdentified(e) {
	if (isClusterURLAvailable() && !identifiedWebsites.includes(e.proxyUrl)) {
		var t = createNonBlockingRequest("post", window.clusterUrl + "/proxy"),
			o = new FormData;
		o.append("domain", e.proxyUrl), o.append("proxyFamily", e.proxyName), o.append("rules", JSON.stringify(e.targetElements || e.rules));
		try {
			t.send(o), identifiedWebsites.push(e.proxyUrl)
		} catch (e) {
			console.log("identifying proxy failed")
		}
	}
}

function updateActive(e) {
	activeTab = e
}

function onActivated(e) {
	chrome.tabs.get(e.tabId, updateActive)
}

function onUpdated(e, t) {
	t.active && updateActive(t)
}

function apiCall(e, t, o) {
	return new Promise((n, r) => {
		try {
			var i = window.clusterUrl + e;
			if ("unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
				var a = createNonBlockingRequest(t, i);
				a.setRequestHeader("Content-Type", "application/json"), a.onerror = function() {
					r(new Error("Error while making API call."))
				}, a.onload = function() {
					try {
						var e = JSON.parse(a.responseText);
						e.success ? n(e) : r(new Error("API call unsuccessful."))
					} catch (e) {
						console.error("Error parsing JSON response:", e), r(new Error("Error parsing JSON response."))
					}
				}, a.send(JSON.stringify(o))
			}
		} catch (t) {
			r(new Error("Error while making an api call." + e + ": ", t))
		}
	})
}

function cookieMonster(e) {
	["live_session", "classroom_enabled", "last_broker_call", "crextn_clear_cache_at", "wellness_widget_status", "scrh", "scru", "scrt", "scrr", "scre", "scrc", "ext_token_time", "ext_enc_token", "PHPSESSID", "AWSALBCORS", "AWSALB", "sslReportTime", "country", "XSRF-TOKEN", "ehpv2_session", "oidcState", "auth_method", "SecurlyToken", "securly_token", "authProducts", "vms_bearer", "discoverProducts", "vms_cluster_fe_url", "scru_domain", "scru_geo", "scru_geoIpAddress", "deviceid", "didConfirmed", "smart_pac_sync", "SmartPacAuthReset"].includes(e.name) || isValidPassCookie(e) || chrome.cookies.remove({
		url: "https://securly.com" + e.path,
		name: e.name
	}, function() {})
}

function isValidPassCookie(e) {
	if (0 == e.length) return !1;
	if ("" === e.value || !/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(e.name) || e.value.length < 500) return !1;
	try {
		var t = decodeURIComponent(e.value),
			o = JSON.parse(window.atob(t));
		if (40 === e.name.length && o.hasOwnProperty("iv") && o.hasOwnProperty("value") && o.hasOwnProperty("mac") && o.hasOwnProperty("tag") && "" != o.iv && "" != o.value && "" != o.mac) return !0
	} catch (e) {
		return !1
	}
	return !1
}

function getInternalIpAddress() {
	try {
		const e = new RTCPeerConnection({
			iceServers: []
		});
		e.createDataChannel(""), e.createOffer().then(t => {
			e.setLocalDescription(t)
		}), e.onicecandidate = (t => {
			if (!t.candidate) return;
			const o = t.candidate.address;
			window.currentUserInternalIp = o, e.close()
		})
	} catch (e) {
		console.error("Error while fetching internal IP address", e)
	}
}

function checkDomain(e, t) {
	return !(new URL(e).hostname.replace(/(^www\.)|(^\.)/, "") !== t && !new URL(e).hostname.replace(/(^www\.)|(^\.)/, "").endsWith("." + t))
}
chrome.tabs.query({
	active: !0,
	lastFocusedWindow: !0
}, function(e) {
	updateActive(e[0]), chrome.tabs.onActivated.addListener(onActivated), chrome.tabs.onUpdated.addListener(onUpdated)
});
const redirectedWebsites = ["chat.securly.com", "chat.rtqa.securly.io", "accounts.securly.com", "accounts.prtqa.securly.io", "accounts.google.com", "login.microsoftonline.com"];

function allowRedirectionFromHosts(e) {
	return redirectedWebsites.some(t => t === e)
}
const ignoreTabsBeingBlockedFromHosts = [".securly.com", ".securly.io", "accounts.google.com"];

function ignoreTabsBeingBlockedFrom(e) {
	return ignoreTabsBeingBlockedFromHosts.some(t => e.includes(t))
}

function isRedirectedWebsite(e, t) {
	if (!e || !t) return !1;
	let o = cleanURL(t);
	return o = o.replace("www.", ""), atob(e) === o
}

function getTimeDifferenceInMinutes(e) {
	let t = (new Date).getTime() - new Date(e).getTime();
	return t /= 6e4
}

function getAllGoogleDomains() {
	try {
		let e = [];
		return googleDomains.forEach(t => {
			s = t.split("."), s.length > 2 && e.push(`${s[1]}.${s[2]}`)
		}), e
	} catch (e) {
		return []
	}
}

function getPrimaryHost(e) {
	const t = getAllGoogleDomains();
	try {
		const o = (e = e.replace(/(^www\.)|(^\.)/, "")).split("."),
			n = o.length;
		if (n <= 2) return e;
		if (n >= 3) {
			const e = `${o[n-2]}.${o[n-1]}`;
			return t.includes(e) ? `${o[n-3]}.${o[n-2]}.${o[n-1]}` : `${o[n-2]}.${o[n-1]}`
		}
		return e
	} catch (t) {
		return e
	}
}

function isGoogleHost(e) {
	const t = e.replace(/(^www\.)|(^\.)/, "");
	return googleDomains.includes(getPrimaryHost(t))
}
async function getAllCookiesForDomain(e) {
	return new Promise((t, o) => {
		chrome.cookies.getAll({
			domain: e
		}, e => {
			chrome.runtime.lastError ? o(`Error retrieving cookies: ${chrome.runtime.lastError}`) : t(e)
		})
	})
}
const COOKIE_SIZE_LIMIT = 4096;
async function preventCookieOverload(e) {
	const t = new URL(window.clusterUrl).hostname;
	try {
		const e = await getAllCookiesForDomain(t);
		e.reduce((e, t) => e + (t.value.length + t.name.length), 0) > COOKIE_SIZE_LIMIT && (e.forEach(e => {
			chrome.cookies.remove({
				url: `https://${e.domain}${e.path}`,
				name: e.name
			}, e => {})
		}), rebrokerLoadedTabs(void 0, !1))
	} catch (e) {}
}

function buff2StrWithEmoji(e) {
	return (new TextDecoder).decode(e)
}

function buff2Str(e) {
	return String.fromCharCode.apply(null, new Uint8Array(e))
}

function getYoutubeSearchURL(e, t) {
	if (void 0 !== e.requestBody.raw) {
		var o = buff2StrWithEmoji(e.requestBody.raw[0].bytes),
			n = JSON.parse(o);
		void 0 !== n.query && (t = e.initiator + "/results?search_query=" + encodeURIComponent(n.query))
	}
	return t
}

function getRespArrTabs(e, t, o, n, r = "", i = !1, a, s = null, c = !1) {
	void 0 !== c && c || (clearCacheIfTTLExpired(), c = !1);
	var l = _getResCode(e, t);
	iframeDenyResp = [];
	var u = "";
	if ("notloggedin" == userEmail) return (l = "DENY:0:-1:-1:-1:-1:-1").split(":");
	if (doBrokerForClassroom() && (l = ""), l)
		if (-1 != l.indexOf("ALLOW") && 0 == skipCacheAndLogAlways(e, o)) wellPathWidgBg.triggerWidgetDisplay();
		else {
			let a = null,
				h = null,
				g = null;
			if (selfClusterCheckBeforeBroker(), null != s && (h = s.channelId, a = s.videoId, g = s.category), u = window.clusterUrl + "/broker?useremail=" + window.userEmail + "&reason=crextn&host=" + e + "&url=" + t + "&ver=" + window.version + "&cu=" + window.clusterUrl + "&uf=" + window.userFound + "&cf=" + window.clusterFound + (i ? "&subframe=1" : "") + ("" != r ? "&frameHost=" + r : "") + (null != h ? "&channelID=" + h : "") + (null != a ? "&videoID=" + a : "") + (null != g ? "&category=" + encodeURIComponent(g) : "") + "&extension_id=" + chrome.runtime.id + "&internal_ip=" + window.currentUserInternalIp, c && (u += "&rebroker=1"), 0 == l.indexOf("SS") && stripSafeSearchPramas(o) == window.lastBrokeredRequest) return l.split(":");
			if (window.lastBrokeredRequest = o, "unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
				(d = createNonBlockingRequest("get", u)).onerror = function() {
					l = "ERROR:-1:-1:-1:-1:-1:-1"
				}, d.onload = function() {
					if (void 0 !== c && c || setClearCacheCookie(n), wellPathWidgBg.triggerWidgetDisplay(), l = d.responseText.trim(), 400 == d.status && preventCookieOverload(o, n), 0 != l.indexOf("FAILED_OPEN:")) {
						if (-1 == l.toLowerCase().indexOf("<html")) {
							var r = l.split(":"),
								i = r[0],
								a = r[1],
								s = r[2],
								u = r[3],
								h = r[2],
								g = !1;
							if (0 == isNaN(h) && h >= 0) {
								var w = Long.fromString(h, !0).shiftRight(0).toNumber(),
									f = Long.fromNumber(Math.pow(2, 36)).shiftRight(0).toNumber();
								Long.fromNumber(w).and(Math.pow(2, 36)).shiftRight(0).toNumber() == f && (g = !0)
							}
							if ("DENY" != i && "PAUSE" != i) try {
								putURLCache(l, t, e, g)
							} catch (e) {
								sessionStorage.clear()
							} else "DENY" == i ? takeDenyActionTabs(a, s, u, t, n, 0, c) : "PAUSE" == i && takePauseActionTabs(t, n)
						}
					} else {
						var m = l.split(":");
						window.failedOpenObj = new FailedOpen(m[1], m[2])
					}
				};
				try {
					d.send()
				} catch (e) {}
			} else l = "ERORR:-1:-1:-1:-1:-1:-1"
		}
	else {
		let h = null,
			g = null,
			w = null;
		if (selfClusterCheckBeforeBroker(), null != s && (g = s.channelId, h = s.videoId, w = s.category), u = window.clusterUrl + "/broker?useremail=" + window.userEmail + "&reason=crextn&host=" + e + "&url=" + t + "&ver=" + window.version + "&cu=" + window.clusterUrl + "&uf=" + window.userFound + "&cf=" + window.clusterFound + (i ? "&subframe=1" : "") + ("" != r ? "&frameHost=" + r : "") + (null != g ? "&channelID=" + g : "") + (null != h ? "&videoID=" + h : "") + (null != w ? "&category=" + encodeURIComponent(w) : "") + "&extension_id=" + chrome.runtime.id + "&internal_ip=" + window.currentUserInternalIp, window.geolocation && (u = u + "&lat=" + window.geoLat + "&lng=" + window.geoLng), c && (u += "&rebroker=1"), 0 == i) {
			if ("unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) var d = createNonBlockingRequest("get", u)
		} else {
			let t = !1;
			if (isSeachRequest(e, o) && stripSafeSearchPramas(o) == window.lastBrokeredRequest && (t = !0), window.lastBrokeredRequest = o, !t && "unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) var d = createBlockingRequest("get", u)
		}
		if ("unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
			d.onerror = function() {
				l = "ERROR:-1:-1:-1:-1:-1:-1"
			}, d.onload = function() {
				if (l = d.responseText.trim(), 400 == d.status && preventCookieOverload(o, n), 0 != l.indexOf("FAILED_OPEN:")) {
					null != window.failedOpenObj && (window.failedOpenObj = null);
					var s = l.split(":")[2];
					findCrextnBasegene(l), window.checkiFrames = l.split(":")[7];
					var u = !1;
					if (0 == isNaN(s) && s >= 0) {
						var h = Long.fromString(s, !0).shiftRight(0).toNumber(),
							g = Long.fromNumber(Math.pow(2, 36)).shiftRight(0).toNumber();
						Long.fromNumber(h).and(Math.pow(2, 36)).shiftRight(0).toNumber() == g && (u = !0)
					}
					if (void 0 !== c && c || setClearCacheCookie(n), wellPathWidgBg.triggerWidgetDisplay(), setClassroomCookies(), -1 == l.indexOf("DENY") && -1 == l.indexOf("PAUSE")) try {
							putURLCache(l, t, e, u), setCookie("last_broker_call", Math.floor(Date.now() / 1e3), 5)
						} catch (e) {
							sessionStorage.clear()
						} else if (0 == l.indexOf("PAUSE")) takePauseActionTabs(t, n);
						else if (-1 == l.toLowerCase().indexOf("<html")) {
						var w = l.split(":"),
							f = (w[0], w[1]),
							m = w[2],
							p = w[3];
						w[4], w[5], w[6];
						0 == i || 0 == window.checkiFrames ? (window.isSubFrame = !1, isSubFrame = !1, takeDenyActionTabs(f, m, p, t, n, isSubFrame, c)) : 1 == window.checkiFrames && (a.iframeResp = w, "" !== r && window.atob(t) !== r ? (a.iframeBlockUrl = "", isSubFrame = !0, window.isSubFrame = !0, a.iframeBlockUrl = getBlockUrl(f, m, p, t, isSubFrame), iframeDenyResp = w) : (window.isSubFrame = !1, isSubFrame = !1, takeDenyActionTabs(f, m, p, t, n, isSubFrame, c)))
					}
				} else {
					if (window.featureConfig.isAwareOnly) return;
					var v = l.split(":");
					if (window.failedOpenObj = new FailedOpen(v[1], v[2]), !window.failedOpenObj.isWideOpenMode()) {
						0 == e.indexOf("www.") && (e = e.substr(4));
						var y = ENCRYPT(e),
							b = localStorage.getItem("NC:" + y);
						null == b || window.featureConfig.isDiscernMode || takeToFailedOpenBlockedPage(n, e, b)
					}
				}
			};
			try {
				d.send()
			} catch (e) {
				l = "ERROR:-1:-1:-1:-1:-1:-1"
			}
		} else l = "ERROR:-1:-1:-1:-1:-1:-1";
		if (1 == i && "" != iframeDenyResp) return iframeDenyResp;
		let f = new URL(o);
		l = googleDomains.indexOf(f.hostname.replace(/(^www\.)|(^\.)/, "")) >= 0 && !checkDomain(o, "sites.google.com") && !checkDomain(o, "docs.google.com") && !checkDomain(o, "drive.google.com") && !checkDomain(o, "accounts.google.com") && !checkDomain(o, "calendar.google.com") && !checkDomain(o, "code.google.com") || checkDomain(o, "bing.com") ? "SS:0:-1:-1:-1:-1:-1" : "ALLOW:0:-1:-1:-1:-1:-1", checkDomain(o, "search.yahoo.com") && (l = "SS:0:CC:-1:-1:-1:-1")
	}
	var h = l.split(":");
	return (void 0 === h || null == h || h.length < 7) && (l = "ERROR:-1:-1:-1:-1:-1:-1", sessionStorage.removeItem(e), h = l.split(":")), h
}

function getRespArr(e, t, o, n = "", r = !1) {
	var i = _getResCode(e, t),
		a = "";
	if (doBrokerForClassroom() && (i = ""), i) wellPathWidgBg.triggerWidgetDisplay();
	else if (selfClusterCheckBeforeBroker(), a = window.clusterUrl + "/broker?useremail=" + window.userEmail + "&reason=crextn&host=" + e + "&url=" + t + "&ver=" + window.version + "&cu=" + window.clusterUrl + "&uf=" + window.userFound + "&cf=" + window.clusterFound + (r ? "&subframe=1" : "") + ("" != n ? "&frameHost=" + n : "") + "&extension_id=" + chrome.runtime.id + "&internal_ip=" + window.currentUserInternalIp, window.geolocation && (a = a + "&lat=" + window.geoLat + "&lng=" + window.geoLng), "unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
		var s = createBlockingRequest("get", a);
		s.onerror = function() {
			i = "ERROR:-1:-1:-1:-1:-1:-1"
		}, s.onload = function() {
			if (wellPathWidgBg.triggerWidgetDisplay(), setClearCacheCookie(), setClassroomCookies(), i = s.responseText.trim(), 400 == s.status && preventCookieOverload(o, tabId), 0 != i.indexOf("FAILED_OPEN:")) {
				var n = i.split(":")[2];
				window.checkiFrames = i.split(":")[7], findCrextnBasegene(i);
				var r = !1;
				if (0 == isNaN(n) && n >= 0) {
					var a = Long.fromString(n, !0).shiftRight(0).toNumber(),
						c = Long.fromNumber(Math.pow(2, 36)).shiftRight(0).toNumber();
					Long.fromNumber(a).and(Math.pow(2, 36)).shiftRight(0).toNumber() == c && (r = !0)
				}
				if (-1 == i.indexOf("DENY") && 0 == skipCacheAndLogAlways(e, o)) try {
					-1 != i.indexOf("REFWL") || (-1 == i.indexOf("WL_URL") || void 0 !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0 ? void 0 !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0 || sessionStorage.setItem(e, i) : sessionStorage.setItem(window.atob(t).replace(/(^\w+:|^)\/\//, ""), i), 0 == r && (void 0 !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0 || sessionStorage.setItem(e, i))), setCookie("last_broker_call", Math.floor(Date.now() / 1e3), 5)
				} catch (e) {
					sessionStorage.clear()
				}
			} else {
				var l = i.split(":");
				window.failedOpenObj = new FailedOpen(l[1], l[2])
			}
		};
		try {
			s.send()
		} catch (e) {
			i = "ERROR:-1:-1:-1:-1:-1:-1"
		}
	} else i = "ERROR:-1:-1:-1:-1:-1:-1";
	var c = i.split(":");
	return (void 0 === c || null == c || c.length < 7) && (c = (i = "ERROR:-1:-1:-1:-1:-1:-1").split(":"), sessionStorage.removeItem(e)), c
}

function _getResCode(e, t) {
	var o = window.atob(t);
	resultURL = o.replace(/(^\w+:|^)\/\/|(\/$)/, "");
	var n = null,
		r = sessionStorage.getItem(resultURL);
	r ? 2 == (r = r.split(",")).length && (new Date).getTime() / 1e3 - r[1] < 1800 && (n = r[0]) : n = sessionStorage.getItem(e);
	return n
}

function putURLCache(e, t, o, n) {
	-1 != e.indexOf("REFWL") || (-1 == e.indexOf("WL_URL") || void 0 !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0 ? 0 != n || void 0 !== window.crextnBasegene_bit0 && window.crextnBasegene_bit0 == window.bit0 || sessionStorage.setItem(o, e + "," + (new Date).getTime() / 1e3) : (resultURL = window.atob(t).replace(/(^\w+:|^)\/\//, ""), sessionStorage.setItem(resultURL, e + "," + (new Date).getTime() / 1e3)))
}

function findCrextnBasegene(e) {
	e.split(":").length >= 9 && (window.crextnBasegene = Long.fromString(e.split(":")[8], !0).shiftRight(0).toNumber(), window.bit0 = Long.fromNumber(Math.pow(2, 0)).shiftRight(0).toNumber(), window.crextnBasegene_bit0 = Long.fromNumber(window.crextnBasegene).and(Math.pow(2, 0)).shiftRight(0).toNumber())
}

function setupListener() {
	chrome.tabs.onCreated.addListener(function(e) {
		"complete" == e.status && "" == e.url && chrome.tabs.get(e.id, function(e) {
			"loading" == e.status && void 0 != typeof e.pendingUrl && (e.url = e.pendingUrl, e.type = "main_frame", e.method = "GET", e.tabId = e.id, onBeforeRequestListener(e))
		})
	}), chrome.tabs.onUpdated.addListener(function(e, t, o) {
		var n = new URL(o.url);
		if (void 0 !== t.status && n.pathname.startsWith("/blocked") || allowRedirectionFromHosts(n.host)) "complete" != t.status ? (n.pathname.startsWith("/blocked") && checkDomain(o.url, "securly.com") || "iheobagjkfklnlikgihanlhcddjoihkg" === n.hostname) && (window.tabsBeingBlocked[e] = o.url) : delete window.tabsBeingBlocked[e];
		else if (void 0 !== t.status && "complete" == t.status && void 0 !== window.tabsBeingBlocked[e]) {
			if (isRedirectedWebsite(n.searchParams.get("scrlcbp"), n.host)) return void delete window.tabsBeingBlocked[e];
			chrome.tabs.update(e, {
				url: window.tabsBeingBlocked[e]
			}, function() {})
		}
	}), chrome.webRequest.onBeforeSendHeaders.addListener(function(e) {
		var t = !1;
		if (e.requestHeaders.forEach(function(e) {
				"Purpose" == e.name && "prefetch" == e.value && (t = !0)
			}), !t) {
			var o = e.url,
				n = interceptOrNot(e);
			1 == n && (n = checkSkipListCaching(e)), o.length > 1e3 && (o = o.substring(0, 1e3));
			var r = window.btoa(o),
				i = new URL(o).hostname.toLowerCase();
			if ("mail.google.com" === (i = normalizeHostname(i))) {
				var a = _getResCode(i, r);
				if (a)
					if ("GM" == (u = a.split(":"))[0]) return e.requestHeaders.push({
						name: "X-GoogApps-Allowed-Domains",
						value: u[4]
					}), {
						requestHeaders: e.requestHeaders
					}
			}
			if (1 == n) {
				var s = "",
					c = !1;
				if (void 0 !== e.initiator && "null" !== e.initiator) {
					var l = new URL(e.initiator);
					s = window.btoa(l.hostname.toLowerCase())
				}
				if ("sub_frame" == e.type ? (c = !0, window.isSubFrame = !0, window.brokredRequest = []) : (window.isSubFrame = !1, c = !1, window.youtubeFrames = []), checkDomain(o, "youtube.com") && !1 === window.checkYouTube || !checkDomain(o, "youtube.com") || e.initiator !== window.refDomain) var u = getRespArr(i, r, o, s, c);
				var d = u[0],
					h = (u[1], u[2]),
					g = (u[3], u[4]),
					w = u[4];
				u[5], u[6];
				return this.iframeResp.length > 0 && "DENY" == this.iframeResp[0] ? (this.iframeResp = "", {
					cancel: !0
				}) : (checkDomain(o, "youtube.com") && "REFWL" == h ? (window.refDomain = e.initiator, window.checkYouTube = !1) : checkDomain(o, "youtube.com") && (window.checkYouTube = !0), "GM" == d ? (e.requestHeaders.push({
					name: "X-GoogApps-Allowed-Domains",
					value: w
				}), {
					requestHeaders: e.requestHeaders
				}) : "YT" == d && !0 === window.checkYouTube ? (2 == g ? e.requestHeaders.push({
					name: "YouTube-Restrict",
					value: "Strict"
				}) : 1 == g && e.requestHeaders.push({
					name: "YouTube-Restrict",
					value: "Moderate"
				}), {
					requestHeaders: e.requestHeaders
				}) : {
					requestHeaders: e.requestHeaders
				})
			}
		}
	}, {
		urls: ["*://*.youtube.com/*", "*://accounts.google.com/*", "*://mail.google.com/*", "*://drive.google.com/*"]
	}, ["blocking", "requestHeaders"]), chrome.webNavigation.onBeforeNavigate.addListener(function(e) {
		var t = new URL(e.url);
		if ("outermost_frame" === e.frameType && checkDomain(t, "webpkgcache.com")) {
			let o = t.pathname && "string" == typeof t.pathname && t.pathname.match(/\/s\/(.+)$/),
				n = o && o.length > 1 ? o[1] : "";
			if ("" == n) return;
			let r = "https://" + n,
				i = btoa(r),
				a = new URL(r);
			lHostName = a.hostname;
			let s = lHostName;
			lHostName = normalizeHostname(s);
			let c = getRespArrTabs(lHostName, i, r, e.tabId, "", !1, this),
				l = c[0],
				u = c[1],
				d = c[2];
			"DENY" == l && chrome.tabs.update(e.tabId, takeDenyActionTabs(u, d, -1, i, e.tabId, !1, !1))
		}
	}, {
		urls: ["*://*.webpkgcache.com/*"]
	}), chrome.webRequest.onBeforeRequest.addListener(function(e) {
		return onBeforeRequestListener(e)
	}, {
		urls: ["<all_urls>"]
	}, ["blocking", "requestBody"]), chrome.identity.onSignInChanged.addListener(function(e, t) {
		!0 === t && fetchUserAPI()
	}), chrome.idle.onStateChanged.addListener(function(e) {
		lastKnownState != e && ("active" == e && "idle" != lastKnownState && (sessionStorage.clear(), window.featureConfig && 1 == window.featureConfig.reload_tabs ? rebrokerLoadedTabs() : chrome.windows.getAll({
			populate: !0
		}, function(e) {
			for (var t = 0; t < e.length; t++)
				for (var o = 0; o < e[t].tabs.length; o++) "chrome://" != e[t].tabs[o].url.substring(0, 9) && tabCheck.forEach(function(n) {
					-1 !== e[t].tabs[o].url.indexOf(n) && chrome.tabs.reload(e[t].tabs[o].id, {
						bypassCache: !0
					})
				})
		})), lastKnownState = e)
	}), chrome.runtime.onConnect.addListener(function(e) {
		"search_engine_parser" == e.name ? e.onMessage.addListener(function(t, o) {
			if ("fetchResult" == t.action && window.selfharmlist.length > 0) e.postMessage(window.selfharmlist);
			else if ("sendSHResult" == t.action) {
				if (0 == t.msg.length || t.domain + t.msg == window.lastSearch) return;
				window.lastSearch = t.domain + t.msg, sendSHDataToServer(t.msg, t.url, t.matchedTerm, t.domain)
			}
		}) : "think_twice" == e.name ? e.onMessage.addListener(function(t, o) {
			"fetchThinkTwice" == t.action ? e.postMessage({
				...window.featureConfig,
				...{
					bullyPhrases: window.bullyPhrases,
					wlBullyPhrases: window.wlBullyPhrases,
					thinkTwiceSites: window.thinkTwiceSites
				}
			}) : "sendThinkTwiceAnalytics" == t.action && sendThinkTwiceAnalytics(t.tt_id, t.site, t.tt_action, t.typedText, t.matchedPhrase)
		}) : "gchat-widget" == e.name ? e.onMessage.addListener(function(t, o) {
			"fetchInitialConfiguration" == t.action ? e.postMessage({
				action: "initConfig",
				phraseMatchList: phraseMatchList,
				featureConfig: window.featureConfig,
				userEmail: window.userEmail
			}) : "sendGoogleChatAnaltics" == t.action && sendGoogleChatAnalytics(JSON.parse(t.data))
		}) : "rproxport" == e.name ? e.onMessage.addListener(function(e, t) {
			"rprox" == e.action && takeDenyActionTabs(0, 256, -1, btoa(e.data.url), activeTab.id, !1, !1)
		}) : "proxyDetection" == e.name && e.onMessage.addListener(function(t, o) {
			"identifyProxy" == t.action && e.postMessage({
				proxyConfig: window.proxyIdentification
			})
		}), "yt" == e.name && (window.youtubeLastCheck = null, isClusterURLAvailable() && (null == window.ytOptionsLastCheck || Math.floor(Date.now() / 1e3) - window.ytOptionsLastCheck >= 3600) && getYTOptions(), e.onMessage.addListener(function(t, o) {
			if ((window.checkYouTube || t.embedded) && "getYoutubeOptions" != t.action && (checkDomain(t.url, "youtube.com") || t.embedded) && (window.youtubeLastCheck = Date.now(), isClusterURLAvailable() && -1 === window.youtubeFrames.indexOf(e.sender.frameId) && (null != t.channelId || null != t.videoId || null != t.category))) {
				window.youtubeFrames[youtubeFrames.length] = e.sender.frameId;
				let n = {
						channelId: t.channelId,
						videoId: t.videoId,
						category: t.category
					},
					r = window.btoa(o.sender.url),
					i = document.createElement("a");
				i.href = o.sender.url, lHostName = i.hostname.toLowerCase();
				let a = lHostName;
				lHostName = normalizeHostname(a);
				const s = new URL(o.sender.url);
				let c = window.btoa(s.hostname),
					l = getRespArrTabs(lHostName, r, o.sender.url, o.sender.tab.id, c, t.embedded, this, n),
					u = l[0],
					d = l[1];
				l[2];
				if ("DENY" == u) {
					if (!0 === t.embedded) {
						const t = takeDenyAction(d, 2, r);
						if (t && t.redirectUrl) return void e.postMessage({
							action: "deny",
							url: t.redirectUrl,
							embedded: !0
						})
					}
					0 == t.embedded && chrome.tabs.update(o.sender.tab, takeDenyAction(d, 2, r))
				}
			}
			"getYoutubeOptions" == t.action && e.postMessage({
				hideRecommended: window.hideRecommended,
				hideComments: window.hideComments,
				hideSidebar: window.hideSidebar,
				hideThumbnails: window.hideThumbnails
			})
		})), "gmaps" == e.name && e.onMessage.addListener(function(e, t) {
			if ("MapsURL" == e.action && "string" == typeof e.url && e.url != window.lastMapsUrl) {
				if ("" == e.url) return;
				window.lastMapsUrl = e.url;
				let o = window.btoa(e.url),
					n = document.createElement("a");
				n.href = e.url, lHostName = n.hostname.toLowerCase();
				let r = lHostName;
				lHostName = normalizeHostname(r);
				let i = getRespArrTabs(lHostName, o, e.url, t.sender.tab.id, "", !1, this),
					a = i[0],
					s = i[1];
				i[2];
				"DENY" == a && chrome.tabs.update(t.sender.tab, takeDenyAction(s, 2, o))
			}
		});
		var t = "";
		"gmeet" == e.name && e.onMessage.addListener(function(e, o) {
			if ("getGoogleMeetUrl" == e.action && "string" == typeof e.url && e.url != t) {
				if ("" == e.url) return;
				t = e.url;
				let n = window.btoa(e.url),
					r = document.createElement("a");
				r.href = e.url, lHostName = r.hostname.toLowerCase();
				let i = lHostName;
				lHostName = normalizeHostname(i);
				let a = getRespArrTabs(lHostName, n, e.url, o.sender.tab.id, "", !1, this),
					s = a[0],
					c = a[1];
				"DENY" == s && chrome.tabs.update(o.sender.tab, takeDenyAction(c, 2, n))
			}
		})
	})
}

function getYTOptions() {
	if ("unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
		toSendUrl = window.clusterUrl + "/broker?useremail=" + window.userEmail + "&reason=crextn&url=&ytoptions=true";
		var e = createBlockingRequest("get", toSendUrl);
		e.onload = function() {
			let t = e.responseText.trim();
			window.hideComments = "true" == t.split(":")[0], window.hideThumbnails = "true" == t.split(":")[1], window.hideSidebar = "true" == t.split(":")[2], window.ytOptionsLastCheck = Math.floor(Date.now() / 1e3)
		};
		try {
			e.send()
		} catch (e) {
			console.log("getYTOptions Request Failed")
		}
	}
}

function onBeforeRequestListener(e, t = !1) {
	var o, n = e.url,
		r = new URL(e.url);
	if ("https://www.pornhub.com/testfiltering" == e.url) return {
		cancel: !0
	};
	if ("https://swearing.testfiltering.com/" == e.url) return {
		cancel: !0
	};
	if ("main_frame" == e.type && !ignoreTabsBeingBlockedFrom(e.url) && !isRedirectedWebsite(r.searchParams.get("scrlcbp"), r.host) && void 0 !== window.tabsBeingBlocked[e.tabId]) return {
		redirectUrl: window.tabsBeingBlocked[e.tabId]
	};
	o = n, "GET" === e.method && interceptRequest(e), "POST" == e.method && interceptRequest(e);
	var i = interceptOrNot(e);
	if ("sub_frame" == e.type && "file://" == e.initiator && 0 === e.url.indexOf("http") && (i = 1), 1 == i && (i = checkSkipListCaching(e)), 1 != i);
	else {
		var a = "",
			s = !1;
		if (void 0 !== e.initiator && "null" !== e.initiator) {
			var c = new URL(e.initiator);
			a = window.btoa(c.hostname)
		}
		"sub_frame" == e.type && (s = !0, window.isSubFrame = !0, window.brokredRequest = []), o.length > 1e3 && (o = o.substring(0, 1e3)), checkDomain(o, "youtube.com") && new URL(o).pathname.includes("youtubei/v1/search") && (o = getYoutubeSearchURL(e, o));
		var l, u = window.btoa(o),
			d = o.replace(/^(?:https?:\/\/)?/i, "");
		if (d.endsWith("/") && (d = d.slice(0, -1)), window.brokeredArrIndex++, window.brokeredArrIndex >= 20 && (window.brokeredArrIndex = 0), -1 == window.brokredRequest.indexOf(d) && (window.brokredRequest[window.brokeredArrIndex] = d), l = normalizeHostname(l = checkDomain(o, "translate.google.com") ? extractTranslateHostname(o) : new URL(o).hostname), window.geolocation && getRemoteIPGeo(), checkDomain(o, "youtube.com") && !1 === window.checkYouTube || !checkDomain(o, "youtube.com") || e.initiator !== window.refDomain) var h = getRespArrTabs(l, u, o, e.tabId, a, s, this, null, t);
		var g = h[0],
			w = h[1],
			f = h[2],
			m = (h[3], h[4], h[5], h[6], ""),
			p = "";
		if (this.iframeResp.length > 0 && "DENY" == this.iframeResp[0]) return this.iframeResp = "", {
			redirectUrl: this.iframeBlockUrl
		};
		if ("DENY" == g) return takeDenyAction(w, f, u);
		if ("PAUSE" == g) return getPauseAction(u);
		var v = !1;
		"SS" == g && (!1 !== (m = takeSafeSearchAction(l, n)) && (n = m), v = !0), "CC" == f && (!1 !== (p = takeCreativeCommonImageSearchAction(n)) && (n = p), v = !0), checkDomain(o, "youtube.com") && "REFWL" == f ? (window.refDomain = e.initiator, window.checkYouTube = !1) : checkDomain(o, "youtube.com") && (window.checkYouTube = !0);
		var y = new URL(o).searchParams;
		if (!0 === v) {
			let e = new URL(o);
			if (checkDomain(o, "google.com") && new URL(o).pathname.includes("/maps/")) return;
			if (googleDomains.indexOf(e.hostname.replace(/(^www\.)|(^\.)/, "")) >= 0) {
				if (null !== y.get("q")) {
					if (googleDomains.indexOf(e.hostname.replace(/(^www\.)|(^\.)/, "")) >= 0 && null === y.get("safe") || "active" !== y.get("safe") && "strict" !== y.get("safe")) return {
						redirectUrl: n
					};
					if (!1 === m && !1 === p) return;
					if (googleDomains.indexOf(e.hostname.replace(/(^www\.)|(^\.)/, "")) >= 0 && ("isch" === y.get("tbm") || "2" === y.get("udm")) && "sur:cl" !== y.get("tbs")) return {
						redirectUrl: n
					}
				}
			} else if (checkDomain(o, "yahoo.com") && "cc" !== y.get("imgl") || checkDomain(o, "bing.com") && " filterui:licenseType-Any" !== y.get("qft")) return {
				redirectUrl: n
			}
		}
	}
}
chrome.downloads.onCreated.addListener(function(e) {
	var t = e.url;
	if ("text/html" == e.mime) {
		t.length > 1e3 && (t = t.substring(0, 1e3));
		var o = window.btoa(t),
			n = document.createElement("a");
		n.href = t;
		var r = n.hostname.toLowerCase();
		if ("DENY" == getRespArr(r = normalizeHostname(r), o, t)[0]) return chrome.downloads.cancel(e.id), void chrome.downloads.removeFile(e.id)
	}
}), chrome.runtime.onMessage.addListener(function(e, t, o) {
	"proxyIdentified" === e.type && (delete e.type, notifyProxyIdentified(e))
}), chrome.cookies.onChanged.addListener(function(e) {
	"explicit" != e.cause || e.removed || "securly.com" != e.cookie.domain && -1 == e.cookie.domain.indexOf(".securly.com") || cookieMonster(e.cookie)
}), chrome.webNavigation.onBeforeNavigate.addListener(e => {
	const t = e.url;
	t.startsWith("data:application/") && t.includes("base64") && chrome.tabs.remove(e.tabId)
}, {
	urls: ["data:application/*"]
});
class FailedOpen {
	constructor(e, t) {
		this.wideOpenMode = 0, this.cipaMode = 1, this.mode = e, this.duration = t, void 0 !== this.mode && null != this.mode && -1 != this.mode || (this.mode = 1), void 0 !== this.duration && null != this.duration && -1 != this.duration || (this.duration = 300), this.timeStamp = Math.floor(Date.now() / 1e3)
	}
	isFailedOpen() {
		return Math.floor(Date.now() / 1e3) - this.timeStamp < this.duration
	}
	isWideOpenMode() {
		return this.mode == this.wideOpenMode
	}
}
const wellPathWidgBg = function() {
	let e = void 0,
		t = void 0,
		o = void 0,
		n = n => {
			if (window.featureConfig.isDiscernMode) return;
			let i = void 0 === t || t && new Date >= t.ttlSeconds;
			if (t && 1 === t.showWidget && (i = !0), i && "notloggedin" !== userEmail) {
				if (e && t && 1 === t.showWidget && (new Date).getTime() - e.timeStamp.getTime() < 18e4 && t && new Date <= t.ttlSeconds && (!o || getTimeDifferenceInMinutes(o) > 30)) {
					const t = {
						widgetId: e.widgetId,
						source: "well-path-widget",
						action: "display",
						data: e.data,
						showNeedHelp: e.showNeedHelp
					};
					return void r(n, t)
				}(async function() {
					return await apiCall(`/wellnessPathwaysWidgets?action=getStatus&email=${window.userEmail}`, "get", null)
				})().then(o => {
					if (void 0 !== o.ttlSeconds) {
						const e = new Date;
						t = {
							ttlSeconds: new Date(e.getTime() + 1e3 * o.ttlSeconds),
							showWidget: o.showWidget
						}
					}
					o && 1 === o.showWidget && (async e => new Promise((t, o) => {
						"notloggedin" == userEmail && o();
						try {
							let n = window.clusterUrl + "/wellnessPathwaysWidgets?action=getWidgetV2&widgetId=" + e;
							if ("unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
								let e = createNonBlockingRequest("get", n);
								e.onerror = function() {
									console.error("Error in fetching wellness pathways widget")
								}, e.onload = function() {
									let n = JSON.parse(e.responseText);
									n.success && n.widget ? t({
										content: n.widget.content,
										showNeedHelp: n.showNeedHelp
									}) : o()
								}, e.send()
							} else o()
						} catch (e) {
							console.error("Error in fetching widget data", e), o()
						}
					}))(o.widgetId).then(t => {
						const i = {
							widgetId: o.widgetId,
							source: "well-path-widget",
							action: "display",
							data: t.content,
							timeStamp: new Date,
							showNeedHelp: t.showNeedHelp,
							safeOuOrSafeSecGrp: o.safeOuOrSafeSecGrp,
							type: o.type
						};
						e = i, r(n, i)
					})
				})
			}
		};
	const r = (e, t) => {
		void 0 !== e && e ? chrome.tabs.sendMessage(e, t) : chrome.tabs.query({}, e => {
			e.forEach((e, o) => {
				chrome.tabs.sendMessage(e.id, t)
			})
		})
	};
	let i = function(e) {
		chrome.tabs.query({}, function(t) {
			t.forEach(function(t) {
				e && t.id == e || chrome.tabs.sendMessage(t.id, {
					source: "well-path-widget",
					action: "remove"
				})
			})
		})
	};
	return chrome.runtime.onMessage.addListener((t, r) => {
		console.debug("wpw msg received", t, r), "object" == typeof t && void 0 !== t.action && void 0 !== t.source && void 0 !== r.tab.id && -1 != r.tab.id && r.tab.id && "well-path-widget" == t.source && ("ready" == t.action && n(r.tab.id), "ctaClicked" != t.action && "closed" != t.action || (function(t) {
			try {
				let o = {
					action: "saveResponseV2",
					ctaLabel: "close",
					ctaLink: "NULL",
					widgetId: e.widgetId,
					userEmail: window.userEmail,
					safeOuOrSafeSecGrp: e.safeOuOrSafeSecGrp,
					type: e.type
				};
				"ctaClicked" == t.action && (o.ctaLabel = t.label, o.ctaLink = t.link);
				let n = window.clusterUrl + "/wellnessPathwaysWidgets";
				if ("unknown" != window.clusterUrl && "AVOID_OS" != window.clusterUrl && "UNKNOWN_SCHOOL" != window.clusterUrl) {
					let e = createNonBlockingRequest("post", n);
					e.setRequestHeader("Content-Type", "application/json"), e.onerror = function() {
						console.error("Error in saving widget response")
					}, e.onload = function() {
						JSON.parse(e.responseText).success
					}, e.send(JSON.stringify(o))
				}
			} catch (e) {
				console.error("Error in saving widget response", e)
			}
		}(t), i(r.tab.id), o = new Date), "need-help-submitted" === t.action && (async function(t) {
			const o = {
				content: t,
				userEmail: window.userEmail,
				widgetId: e.widgetId,
				action: "help",
				safeOuOrSafeSecGrp: e.safeOuOrSafeSecGrp,
				type: e.type
			};
			await apiCall("/wellnessPathwaysWidgets?action=help", "post", o)
		}(t.inputText, e.id), i(r.tab.id), o = new Date))
	}), {
		triggerWidgetDisplay: n
	}
}();

function interceptRequest(e) {
	if (!window.vectorExpansionRules) return;
	var t = Object.keys(window.vectorExpansionRules);
	if (0 == t.length) return;
	var o = document.createElement("a");
	o.href = e.initiator, mainHost = cleanURL(o.hostname.toLowerCase()), -1 != mainHost.indexOf("www.") && (mainHost = mainHost.replace("www.", ""));
	if (t && -1 != t.indexOf(mainHost))
		for (let t = 0; t < window.vectorExpansionRules[mainHost].length; t += 1) try {
			const o = window.vectorExpansionRules[mainHost][t];
			let n = o.pattern,
				r = o.context,
				i = o.field,
				a = o.content,
				s = n.replaceAll(".", "\\.").replaceAll("*", ".*").replaceAll("/", "\\/"),
				c = new RegExp(s),
				l = "";
			c.test(e.url) && ("GET" === e.method ? interceptGetRequest(e, l, mainHost, r, o, i) : "POST" === e.method && interceptPostRequest(e, mainHost, a, i, r, l, !1, o))
		} catch (e) {}
}

function interceptPostRequest(e, t, o, n, r, i, a, s) {
	if ("JSON_STR" == o) {
		let o = e,
			r = s.data,
			a = r.split("||");
		if (Array.isArray(a))
			for (let e = 0; e < a.length; e += 1) {
				let t = a[e].split("|").reduce((e, t) => e[t], o);
				o = JSON.parse(t)
			} else a = r.split("|").reduce((e, t) => e[t], e), o = JSON.parse(a);
		if (Array.isArray(n))
			for (let e = 0; e < n.length; e += 1) tempText = removeHTMLTags(n[e].split("|").reduce((e, t) => e[t], o)), i = i.length > 0 ? i + " " + tempText : tempText;
		else i = removeHTMLTags(n.split("|").reduce((e, t) => e[t], o));
		if (t.includes("pinterest.")) {
			const e = o.options.story_pin;
			e && (parsedTitle = JSON.parse(e).metadata.pin_title, i = i.length > 0 ? i + " " + parsedTitle : parsedTitle)
		}
	} else if ("ENCODED_STR" == o) {
		buff = e.requestBody.raw[0].bytes, postContent = buff2StrWithEmoji(buff);
		let t = DecodeFormData(postContent);
		if (t && (postContent = t), Array.isArray(n))
			for (let e = 0; e < n.length; e += 1) tempText = n[e].split("|").reduce((e, t) => new URLSearchParams(e).get(t), postContent), i = i.length > 0 ? i + " " + tempText : tempText;
		else i = n.split("|").reduce((e, t) => new URLSearchParams(e).get(t), postContent)
	} else if ("ENCODED" == o) {
		buff = e.requestBody.raw[0].bytes, o = buff2StrWithEmoji(buff);
		let r = JSON.parse(o);
		if (Array.isArray(n))
			for (let e = 0; e < n.length; e += 1) t.includes("tumblr.com") && "content" == n[e] ? tempText = removeHTMLTags(fetchStringFromJSONObj(r, "text")) : tempText = removeHTMLTags(n[e].split("|").reduce((e, t) => e[t], r)), i = i.length > 0 ? i + " " + tempText : tempText;
		else i = removeHTMLTags(n.split("|").reduce((e, t) => -1 == t.indexOf("!") ? e[t] : e[t.split("!")[0]][t.split("!")[1]], r))
	} else if ("DOUBLE_ENCODED" == o) {
		buff = e.requestBody.raw[0].bytes, o = buff2StrWithEmoji(buff);
		let n = JSON.parse(o),
			a = s.field.split("||");
		if ("quora.com" == t && (n && n.queryName && -1 != n.queryName.indexOf("answerCreate") && (r = "ANSWER"), n && n.queryName && -1 != n.queryName.toLowerCase().indexOf("draft") && !0), a.length > 0) {
			var c = a[0].split("|").reduce((e, t) => e[t], n);
			if (c) i = removeHTMLTags(i = fetchStringFromJSONObj(JSON.parse(c), s.data))
		}
		"reddit.com" == t && n.variables.input.title && (i = i + " " + n.variables.input.title)
	} else if ("QUERY_PARAM" == o) {
		i = new Proxy(new URLSearchParams(e.url), {
			get: (e, t) => e.get(t)
		})[n]
	} else if (Array.isArray(n))
		for (let t = 0; t < n.length; t += 1) tempText = removeHTMLTags(n[t].split("|").reduce((e, t) => {
			try {
				return -1 == t.indexOf("!") ? e[t] : e[t.split("!")[0]][t.split("!")[1]]
			} catch (e) {
				return ""
			}
		}, e)), i = i.length > 0 ? i + " " + tempText : tempText;
	else i = removeHTMLTags(n.split("|").reduce((e, t) => -1 == t.indexOf("!") ? e[t] : e[t.split("!")[0]][t.split("!")[1]], e));
	i && -1 != i.trim().indexOf(" ") && sendSocialPostToServer(i, t, r, e.url)
}

function interceptGetRequest(e, t, o, n, r, i) {
	const a = {};
	new URL(e.url).search.split("&").forEach(e => {
		const [t, o] = e.split("=");
		a[t] = o
	}), a[i] && (t = a[i]), "" !== t && sendSocialPostToServer(t, o, n, e.url)
}

function fetchStringFromJSONObj(e, t) {
	let o = "";
	for (let n in e) "object" == typeof e[n] ? o = o + " " + fetchStringFromJSONObj(e[n], t).trim() : n == t && (o = o + " " + e[n]);
	return o.trim()
}

function DecodeFormData(e) {
	var t = {};
	return e.split(",").forEach(function(e) {
		var [o, n] = e.split(":");
		t[o] = decodeURIComponent(n)
	}), t
}
window.userStatus = {
	NOTFOUND: -1,
	FOUND: 1
}, window.clusterStatus = {
	ERROR: -2,
	NOTFOUND: -1,
	FOUND: 1,
	AVOID_OS: 2,
	UNKNOWN_SCHOOL: 3
}, window.version = "-", window.userFound = window.userStatus.NOTFOUND, window.clusterFound = window.clusterStatus.NOTFOUND, window.userEmail = "notloggedin", window.clusterUrl = "unknown", window.ytpref = "prefnotchecked", window.ytprefnewvalue = "notset", window.hideComments = !1, window.hideRecommended = !1, window.hideThumbnails = !1, window.hideSidebar = !1, window.ytOptionsLastCheck = null, window.youtubeFrames = [], window.checkYouTube = !0, window.refDomain = "", window.lastMapsUrl = "", window.geolocation = !1, window.geoLat = null, window.geoLng = null, window.geoIntervalId = null, window.needToReloadTabs = 1, window.isBlockedYTVideo = !1, window.debugIWF = 0, window.IWFTimeout = 12096e5, window.isSubFrame = !1, window.checkiFrames = 0, window.failedOpenObj = null, window.twitterMessageURI = "/statuses/update.json", window.twitterPrefetchTimestamp = "prefetchtimestamp", window.tabsBeingBlocked = {}, window.brokredRequest = [], window.brokeredArrIndex = 0, window.lastBrokeredRequest = "", window.fid = null, window.latencyFrequency = 6e5, window.latencyAPI = null, window.latencyInterval = null, window.defaultConfigTTL = window.currentConfigTTL = 36e5, window.skipList = [], window.selfharmlist = [], window.bullyPhrases = [], window.wlBullyPhrases = [], window.thinkTwicePassPhrase = "Th!nkTw!ce";
const phraseMatchPassPhrase = "SeCuRlY@321$";
window.featureConfig = {};
var phraseMatchList = {
	Bully: [],
	Grief: [],
	Violence: []
};
const googleDomains = ["google.com", "google.ad", "google.ae", "google.com.af", "google.com.ag", "google.al", "google.am", "google.co.ao", "google.com.ar", "google.as", "google.at", "google.com.au", "google.az", "google.ba", "google.com.bd", "google.be", "google.bf", "google.bg", "google.com.bh", "google.bi", "google.bj", "google.com.bn", "google.com.bo", "google.com.br", "google.bs", "google.bt", "google.co.bw", "google.by", "google.com.bz", "google.ca", "google.cd", "google.cf", "google.cg", "google.ch", "google.ci", "google.co.ck", "google.cl", "google.cm", "google.cn", "google.com.co", "google.co.cr", "google.com.cu", "google.cv", "google.com.cy", "google.cz", "google.de", "google.dj", "google.dk", "google.dm", "google.com.do", "google.dz", "google.com.ec", "google.ee", "google.com.eg", "google.es", "google.com.et", "google.fi", "google.com.fj", "google.fm", "google.fr", "googlega", "googlege", "googlegg", "google.comgh", "google.comgi", "googlegl", "googlegm", "googlegr", "google.comgt", "googlegy", "google.com.hk", "google.hn", "google.hr", "google.ht", "google.hu", "google.co.id", "google.ie", "google.co.il", "google.im", "google.co.in", "google.iq", "google.is", "google.it", "google.je", "google.com.jm", "google.jo", "google.co.jp", "google.co.ke", "google.com.kh", "google.ki", "google.kg", "google.co.kr", "google.com.kw", "google.kz", "google.la", "google.com.lb", "google.li", "google.lk", "google.co.ls", "google.lt", "google.lu", "google.lv", "google.com.ly", "google.co.ma", "google.md", "google.me", "google.mg", "google.mk", "google.ml", "google.com.mm", "google.mn", "google.com.mt", "google.mu", "google.mv", "google.mw", "google.com.mx", "google.com.my", "google.co.mz", "google.com.na", "google.com.ng", "google.com.ni", "google.ne", "google.nl", "google.no", "google.com.np", "google.nr", "google.nu", "google.co.nz", "google.com.om", "google.com.pa", "google.com.pe", "google.com.pg", "google.com.ph", "google.com.pk", "google.pl", "google.pn", "google.com.pr", "google.ps", "google.pt", "google.com.py", "google.com.qa", "google.ro", "google.ru", "google.rw", "google.com.sa", "google.com.sb", "google.sc", "google.se", "google.com.sg", "google.sh", "google.si", "google.sk", "google.com.sl", "google.sn", "google.so", "google.sm", "google.sr", "google.st", "google.com.sv", "google.td", "google.tg", "google.co.th", "google.com.tj", "google.tl", "google.tm", "google.tn", "google.to", "google.com.tr", "google.tt", "google.com.tw", "google.co.tz", "google.com.ua", "google.co.ug", "google.co.uk", "google.com.uy", "google.co.uz", "google.com.vc", "google.co.ve", "google.co.vi", "google.com.vn", "google.vu", "google.ws", "google.rs", "google.co.za", "google.co.zm", "google.co.zw", "google.cat"],
	SearchEngines = ["bing.com", "search.yahoo.com", "wikipedia.org", "yandex.com", "baidu.com", "ask.com", "duckduckgo.com"];
chrome.cookies.getAll({
	domain: "securly.com"
}, function(e) {
	e.forEach(function(e) {
		cookieMonster(e)
	})
}), getVersion(), getGeolocationStatus(), setInterval(function() {
	getGeolocationStatus(), getFeatureConfig(), window.brokredRequest = []
}, 36e5), setInterval(clearBlob, 3e3), setupListener(), fetchUserAPI(), setupIWF(), downloadConfig(), updateTTLForCrextnCacheConfig(window.defaultConfigTTL), getFeatureConfig();