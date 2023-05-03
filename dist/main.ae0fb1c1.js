// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var x = localStorage.getItem('x'); //读取当前网站下的x

var xObject = JSON.parse(x); //JSON.parse(x)会尝试把字符串x变成对象

var hashMap = xObject || [//当xObject存在，则hashMap = xObject。否则就初始化为一个“数组”。（是应对初始情况下，还没有xObject这个情况）
{
  logo: 'A',
  url: 'https://www.acfun.cn'
}, {
  logo: 'B',
  url: 'http://www.bilibili.com'
}]; //上述代码可以使得我们在点击新增网站成功后使添加的网站保存下来（不然返回后新增的网站就没了）。方法是用一种数据结构将需要保存的记下来，这种数据结构是一个由哈希表组成的数组（hashMap）

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); //此处使用了正则表达式。意思是把 / 开头的内容删掉。目的是防止用户复制过来的url过长（域名后面跟了路径、锚点等一大串）。
}; //声明一个simplifyUrl ,删除获取的URL所含有的 https:// 和 http:// 和 www.


var render = function render() {
  $siteList.find('li:not(.last)').remove(); //获取siteList中所有的li并删除，除了last。这样可以防止再次遍历后把之前的网站再次保留导致重复。

  hashMap.forEach(function (node, index) {
    //forEach会给到两个参数，一个当前元素，一个下标。
    var $li = $("<li>\n            <div class=\"site\">\n                <div class=\"logo\">".concat(node.logo, "</div>\n                <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n                <div class=\"close\">\n                    <svg class=\"icon\">\n                        <use xlink:href=\"#icon-close\"></use>\n                    </svg>\n                </div>\n            </div>\n        </li>")).insertBefore($lastLi);
    $li.on('click', function () {
      window.open(node.url);
    }); //这里在div.site外应该有个a标签（<a href="${node.url}"></a>）包裹，用作跳转页面。但是a标签影响了下面的冒泡事件。在这里用js代替了a标签的作用。window.open()可实现页面跳转

    $li.on('click', '.close', function (e) {
      e.stopPropagation(); //阻止冒泡，不然点击 x 会跳转页面，不是关闭作用了。

      hashMap.splice(index, 1); //从index（下标）删除掉一个

      render(); //渲染到页面
    });
  });
};

render();
$('.addButton').on('click', function () {
  //获取 addButton 并对其监听
  var url = window.prompt('请输入您想要添加的网址'); //显示一个对话框，对话框中包含一条文字信息，用来提示用户输入文字。

  if (url.indexOf('https') !== 0) {
    url = 'https://' + url;
  } //判断用户操作,若没有 https ，则添加 https://
  //indexOf() 方法返回在数组中可以找到给定元素的第一个索引，如果不存在，则返回 -1。


  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    //上面声明了一个函数simplifyUrl。这里直接用它，并将其变成大写。这样新增的网站logo就会变成大写首字母。
    url: url
  });
  render();
}); //上述代码针对用户点击“新增网站”的监听与执行过程，先 render() ，再 push ，再 render()

window.onbeforeunload = function () {
  var string = JSON.stringify(hashMap); //JSON.stringify(xxx)可以将xxx变成字符串。

  localStorage.setItem('x', string); //在本地设置一个x,x的值是string。即存储的数据将保存在浏览器会话中，并且是长期保存
}; //onbeforeunload 事件在即将离开当前页面（刷新或关闭）时触发。该事件可用于弹出对话框，提示用户是继续浏览页面还是离开当前页面。
//在这里指当用户顾关闭或者刷新页面时，会将当前 hashMap 存到 x 里
//$(header).off('keypress')


$(document).on('keypress', function (e) {
  if ($(e.target).closest('header').length > 0) {
    return;
  } // 当触发事件的元素在 header 元素内时，不执行处理函数并且阻止事件冒泡


  var key = e.key; //是 const key = e.key 的简写。当发现变量名和属性名一样时，可这样简写。

  for (var i = 0; i <= hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    } //如果hashMap里面logo的小写字母对应了键盘按下的按键，直接跳转相应的页面

  }
}); //监听用户键盘按下，可以对document元素来操作。
//这段代码实现了用户可以直接点击对应logo字母的键盘按键来完成页面跳转。但是如果出现新增网站中有多个首字母一样的，只能跳转到第一个。
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.ae0fb1c1.js.map