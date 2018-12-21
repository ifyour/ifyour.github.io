(function(w, d) {
  var $ = d.querySelector.bind(d);
  var noop = function() {};
  var offset = function(el) {
    var x = el.offsetLeft;
    var y = el.offsetTop;
    if (el.offsetParent) {
      var pOfs = arguments.callee(el.offsetParent);
      x += pOfs.x;
      y += pOfs.y;
    }
    return { x: x, y: y };
  };
  var rootScrollTop = function() {
    return d.documentElement.scrollTop || d.body.scrollTop;
  };
  var isMobile = function() {
    var ua = window.navigator.userAgent;
    var EXP_ISMOBILE = /(micromessenger|phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
    return EXP_ISMOBILE.test(ua);
  };

  var Blog = {
    toc: (function() {
      var toc = $('.sidebar-toc');
      if (!toc || !toc.children.length) {
        return {
          active: noop
        };
      }
      var titles = $('.post-content').querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      );
      toc
        .querySelector('a[href="#' + titles[0].id + '"]')
        .parentNode.classList.add('active');
      var handleTocActive = function(prevEle, currentEle) {
        prevEle.classList.remove('active');
        currentEle.classList.add('active');
      };
      return {
        active: function(top) {
          if (!isMobile()) {
            top >= 200
              ? toc.classList.add('fixed')
              : toc.classList.remove('fixed');
          }
          for (var i = 0, len = titles.length; i < len; i++) {
            if (top > offset(titles[i]).y - 15) {
              var prevListEle = toc.querySelector('li.active');
              var currListEle = toc.querySelector(
                'a[href="#' + titles[i].id + '"]'
              ).parentNode;
              handleTocActive(prevListEle, currListEle);
            }
            if (top < offset(titles[0]).y) {
              handleTocActive(
                toc.querySelector('li.active'),
                toc.querySelector('a[href="#' + titles[0].id + '"]').parentNode
              );
            }
          }
        }
      };
    })(),
    search: (function() {
      var search = $('#search');
      var searchModal = $('.search');
      var closeModal = searchModal.querySelector('.close');
      var searchInput = $('#search-input');
      var algoliaConfig = document.querySelector(
        'meta[property="algolia:search"]'
      ).dataset;
      var client = algoliasearch(
        algoliaConfig.applicationId,
        algoliaConfig.apiKey
      );
      client.initIndex(algoliaConfig.indexName);

      return {
        active: function() {
          search.addEventListener('click', function() {
            searchModal.classList.add('active');
            setTimeout(function () {
              searchInput.focus();
            }, 300);
          });

          d.onkeydown = function (e) {
            var keyNum = window.event ? e.keyCode : e.which;
            if (keyNum === 27) { // Esc
              searchModal.classList.remove('active');
            }
          }

          closeModal.addEventListener('click', function() {
            searchModal.classList.remove('active');
          });
        }
      };
    })()
  };

  w.addEventListener('DOMContentLoaded', function() {
    var top = rootScrollTop();
    Blog.toc.active(top);
    Blog.search.active();
  });

  d.addEventListener(
    'scroll',
    function() {
      var top = rootScrollTop();
      Blog.toc.active(top);
    },
    false
  );

})(window, document);
