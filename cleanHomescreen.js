if (document.documentElement) { initialize(); } else {
  window.addEventListener('DOMContentLoaded', initialize);
}

function initialize() {
  updateVisibility();
  updateIcons();
  observeDomChange();
  console.log('rudism addon initialized');
}

function injectStyling(icon) {
  var css = "img {filter: drop-shadow(0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.5))}";
  setStyle(css, icon, 'rudismStyle', false);
}

function updateIcons() {
  var icons = document.getElementsByTagName('gaia-app-icon');
  for(var i = 0; i < icons.length; i++) {
    var icon = icons[i].shadowRoot;
    injectStyling(icon);
  }
}

function updateVisibility() {
  isHidden = ($('pages-panel').className == 'empty');
  var css = '#pages-panel.empty {display:none} \n';
  if (isHidden) {
    css += '#page-indicator-header {display:none}\n';	
    css += '#shadow {top:0!important}\n';	
    css += '#panels {height: 100%!important}';
  }
  setStyle(css, document, 'rudismVisibility');
}

function setStyle(css, dom, id, update = true) {
  var style = dom.getElementById(id);
  if (style) {
    if(update) {
      style.parentNode.removeChild(style);
    }
  }

  if (!style || update) {
    style = document.createElement('style');

    style.type = 'text/css';
    style.id = id;
    style.appendChild(document.createTextNode(css));

    var head = dom.head || dom.getElementsByTagName('head')[0] || dom;
    head.appendChild(style);
  }
}

function observeDomChange() {
  var pageObserver = new window.MutationObserver(function(mutations, observer) {
    updateVisibility();
  });

  pageObserver.observe($('pages-panel'), {
    attributes: true
  });

  var appObserver = new window.MutationObserver(function(mutations, observer) {
    for(var i = 0; i < mutations.length; i++) {
      if(mutations[i].type == 'childList') {
        for(var j = 0; j < mutations[i].addedNodes.length; j++) {
          var node = mutations[i].addedNodes.item(j);
          if(node.className == 'gaia-container-child') {
            var icon = node.children[0].children[0].shadowRoot;
            injectStyling(icon);
          }
        }
      }
    }
  });

  appObserver.observe($('apps'), {
    childList: true
  });
}

function $(id) {
  return document.getElementById(id);
}
