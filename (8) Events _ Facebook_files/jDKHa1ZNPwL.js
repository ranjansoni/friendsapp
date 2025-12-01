;/*FB_PKG_DELIM*/

__d("FBPayECPEnv.entrypointutils",[],(function(t,n,r,o,a,i){"use strict";function e(e,t){switch(e==null?void 0:e.trim().toUpperCase()){case"LIVE":return"LIVE";case"TEST":return"TEST";default:return t}}i.getPaymentContainerMode=e}),66);
__d("FBPayUPLSessionIDGenerator",["uuidv4"],(function(t,n,r,o,a,i,l){"use strict";var e="upl";function s(){var t=[e,Date.now(),r("uuidv4")()];return t.join("_")}l.sessionIDGenerator=s}),98);
__d("FDSAppFacebookCircleFilled24Icon",["cr:13817"],(function(t,n,r,o,a,i,l){"use strict";l.default=n("cr:13817")}),98);
__d("FDSAppFacebookCircleFilled24PNGIcon.react",["ix","fbicon"],(function(t,n,r,o,a,i,l,s){"use strict";var e=o("fbicon")._(s("869052"),24),u=e;l.default=u}),98);
__d("FDSPencilFilled16Icon",["cr:15378"],(function(t,n,r,o,a,i,l){"use strict";l.default=n("cr:15378")}),98);
__d("FDSPencilFilled16PNGIcon.react",["ix","fbicon"],(function(t,n,r,o,a,i,l,s){"use strict";var e=o("fbicon")._(s("477825"),16),u=e;l.default=u}),98);
__d("FDSProgressButtonIndeterminate.react",["FDSButton.react","FDSProgressRingIndeterminate.react","react","react-compiler-runtime"],(function(t,n,r,o,a,i,l){"use strict";var e,s=e||(e=o("react"));function u(e){var t=o("react-compiler-runtime").c(3),n;t[0]===Symbol.for("react.memo_cache_sentinel")?(n=s.jsx(r("FDSProgressRingIndeterminate.react"),{color:"disabled_DEPRECATED",size:16}),t[0]=n):n=t[0];var a;return t[1]!==e?(a=s.jsx(r("FDSButton.react"),babelHelpers.extends({},e,{addOnPrimary:n,disabled:!0})),t[1]=e,t[2]=a):a=t[2],a}l.default=u}),98);
__d("RelayFBResponseCache",["RelayRuntime"],(function(t,n,r,o,a,i){"use strict";var e=n("RelayRuntime").QueryResponseCache,l=10,s=300*1e3;a.exports=new e({size:l,ttl:s})}),null);