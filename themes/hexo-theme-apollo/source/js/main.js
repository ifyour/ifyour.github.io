(function (w, d) {
  var $ = d.querySelector.bind(d);
  var noop = function(){};
  var offset = function (el) {
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

  var Blog = {
    toc: (function () {
      var toc = $('.sidebar-toc');
      if (!toc || !toc.children.length) {
        return {
          active: noop,
        };
      }
      var titles = $('.post-content').querySelectorAll('h1, h2, h3, h4, h5, h6');
      toc.querySelector('a[href="#' + titles[0].id + '"]').parentNode.classList.add('active');
      var handleTocActive = function (prevEle, currentEle) {
        prevEle.classList.remove('active');
        currentEle.classList.add('active');
      }
      return {
        active: function (top) {
            for(var i = 0, len = titles.length; i < len; i++) {
              if (top > offset(titles[i]).y - 15) {
                var prevListEle = toc.querySelector('li.active');
                var currListEle = toc.querySelector('a[href="#' + titles[i].id + '"]').parentNode;
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
      }
    })(),
  };

  w.addEventListener('DOMContentLoaded', function() {
    var top = rootScrollTop();
    Blog.toc.active(top);
  })
  d.addEventListener('scroll', function () {
    var top = rootScrollTop();
    Blog.toc.active(top);
  }, false);

})(window, document)
