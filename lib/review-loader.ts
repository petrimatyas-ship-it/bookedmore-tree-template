/**
 * Inline script that turns on review mode: ?review=<key> on any demo page
 * loads public/review.js (the key is remembered on that device). Without
 * the key it does nothing, so prospects never see it.
 */
export const REVIEW_LOADER = `/* review mode: ?review=<key> (see public/review.js) */(function(){try{var k=new URLSearchParams(location.search).get("review");if(k)localStorage.setItem("mbn-review",k);if(k||localStorage.getItem("mbn-review")){var s=document.createElement("script");s.src="/review.js";s.defer=true;document.head.appendChild(s)}}catch(e){}})()`;
