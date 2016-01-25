if (document.documentElement) {
	initialize();
} else {
	window.addEventListener('DOMContentLoaded', initialize);
}

function initialize() {
	updateVisibility();
	observeDomChange();
}

function updateVisibility() {
	isHidden = ($('pages-panel').className == 'empty');
	var css = '#pages-panel.empty {display:none} \n';
	if (isHidden) {
		css += '#page-indicator-header {display:none}\n';	
		css += '#shadow {top:0!important}\n';	
		css += '#panels {height: 100%!important}';
	}
	setStyle(css);
}

function setStyle(css) {
	var style = document.getElementById('injectedStyleFromCleanHomescreenAddOn');
	if (style) {
		style.parentNode.removeChild(style);
	}
	style = document.createElement('style');
	
	style.type = 'text/css';
	style.id = 'injectedStyleFromCleanHomescreenAddOn';
	style.appendChild(document.createTextNode(css));
	
	var head = document.head || document.getElementsByTagName('head')[0];
	head.appendChild(style);
}

function observeDomChange() {
	var observer = new window.MutationObserver(function(mutations, observer) {
		updateVisibility();
	});
	
	observer.observe($('pages-panel'), {
		attributes: true
	});
}

function $(id) {
	return document.getElementById(id);
}
