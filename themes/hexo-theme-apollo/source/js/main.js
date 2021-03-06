(function(w, d) {
  var $ = d.querySelector.bind(d);
  var template = w.template;
  var algoliasearch = w.algoliasearch;
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
  var debounce = function(f, ms) {
    var isCoolDown = false;
    return function() {
      if (isCoolDown) return;
      f.apply(this, arguments);
      isCoolDown = true;
      setTimeout(function() {
        isCoolDown = false;
      }, ms);
    };
  };
  var delay = function(f, ms) {
    var timer = null;
    return function() {
      var context = this;
      var args = arguments;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(function() {
        f.apply(context, args);
      }, ms);
    };
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
          var isMobile = !!window.matchMedia('(max-width: 768px)').matches;
          if (isMobile) {
            toc.classList.remove('fixed');
          } else {
            top >= 200
              ? toc.classList.add('fixed')
              : toc.classList.remove('fixed');
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
                  toc.querySelector('a[href="#' + titles[0].id + '"]')
                    .parentNode
                );
              }
            }
          }
        }
      };
    })(),
    search: (function() {
      var navSearchText = $('#search');
      var searchModal = $('.search');
      var closeButton = searchModal.querySelector('.close');
      var searchInput = $('#search-input');
      var searchResult = $('#search-articles');
      var searchConfig = document.querySelector(
        'meta[property="algolia:search"]'
      ).dataset;
      var client = algoliasearch(
        searchConfig.applicationId,
        searchConfig.apiKey
      );
      var searchIndex = client.initIndex(searchConfig.indexName);
      var query = function(q) {
        return searchIndex.search(q, { hitsPerPage: 10 }).then(function(res) {
          return res.hits;
        });
      };
      var render = function(data, keywords) {
        searchResult.innerHTML = template('search-tmp', {
          list: data,
          keywords: keywords
        });
      };
      var searching = function() {
        var value = searchInput.value.trim();
        if (value) {
          query(value).then(function(result) {
            var tmpData = result.map(function(item) {
              return {
                title: item._highlightResult.title.value,
                permalink: item.permalink.replace(
                  'http://' + w.location.host,
                  ''
                ),
                summary: item._highlightResult.excerptStrip.value
              };
            });
            render(tmpData, value);
          });
        } else {
          searchResult.innerHTML = '';
        }
      };
      return {
        active: function() {
          searchInput.addEventListener('input', delay(searching, 300));

          navSearchText.addEventListener('click', function() {
            searchModal.classList.add('active');
            searchInput.focus();
          });

          d.onkeydown = function(e) {
            var keyNum = w.event ? e.keyCode : e.which;
            if (keyNum === 27) {
              searchModal.classList.remove('active');
              searchResult.innerHTML = '';
              searchInput.value = '';
            }
          };

          closeButton.addEventListener('click', function() {
            searchModal.classList.remove('active');
            searchResult.innerHTML = '';
            searchInput.value = '';
          });
        }
      };
    })()
  };

  w.addEventListener('DOMContentLoaded', function() {
    Blog.toc.active(rootScrollTop());
    Blog.search.active();
  });

  d.addEventListener(
    'scroll',
    function() {
      Blog.toc.active(rootScrollTop());
    },
    false
  );

  w.addEventListener(
    'resize',
    debounce(function() {
      Blog.toc.active(rootScrollTop());
    }, 300)
  );
})(window, document);
