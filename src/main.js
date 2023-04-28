const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x') //读取当前网站下的x
const xObject = JSON.parse(x) //JSON.parse(x)会尝试把字符串x变成对象
const hashMap = xObject || [
    //当xObject存在，则hashMap = xObject。否则就初始化为一个“数组”。（是应对初始情况下，还没有xObject这个情况）
    {
        logo: 'A',
        url: 'https://www.acfun.cn',
    },
    {
        logo: 'B',
        url: 'http://www.bilibili.com',
    },
]
//上述代码可以使得我们在点击新增网站成功后使添加的网站保存下来（不然返回后新增的网站就没了）。方法是用一种数据结构将需要保存的记下来，这种数据结构是一个由哈希表组成的数组（hashMap）

const simplifyUrl = (url) => {
    return url
        .replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '') //此处使用了正则表达式。意思是把 / 开头的内容删掉。目的是防止用户复制过来的url过长（域名后面跟了路径、锚点等一大串）。
}
//声明一个simplifyUrl ,删除获取的URL所含有的 https:// 和 http:// 和 www.

const render = () => {
    $siteList.find('li:not(.last)').remove() //获取siteList中所有的li并删除，除了last。这样可以防止再次遍历后把之前的网站再次保留导致重复。
    hashMap.forEach((node, index) => {
        //forEach会给到两个参数，一个当前元素，一个下标。
        const $li = $(`<li>
            <div class="site">
                <div class="logo">${node.logo}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class="close">
                    <svg class="icon">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
            </div>
        </li>`).insertBefore($lastLi)
        $li.on('click', () => {
            window.open(node.url)
        })
        //这里在div.site外应该有个a标签（<a href="${node.url}"></a>）包裹，用作跳转页面。但是a标签影响了下面的冒泡事件。在这里用js代替了a标签的作用。window.open()可实现页面跳转
        $li.on('click', '.close', (e) => {
            e.stopPropagation() //阻止冒泡，不然点击 x 会跳转页面，不是关闭作用了。
            hashMap.splice(index, 1) //从index（下标）删除掉一个
            render() //渲染到页面
        })
    })
}

render()

$('.addButton').on('click', () => {
    //获取 addButton 并对其监听
    let url = window.prompt('请输入您想要添加的网址') //显示一个对话框，对话框中包含一条文字信息，用来提示用户输入文字。
    if (url.indexOf('https') !== 0) {
        url = 'https://' + url
    } //判断用户操作,若没有 https ，则添加 https://
    //indexOf() 方法返回在数组中可以找到给定元素的第一个索引，如果不存在，则返回 -1。
    console.log(url)
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(), //上面声明了一个函数simplifyUrl。这里直接用它，并将其变成大写。这样新增的网站logo就会变成大写首字母。
        url: url,
    })
    render()
})
//上述代码针对用户点击“新增网站”的监听与执行过程，先 render() ，再 push ，再 render()

window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap) //JSON.stringify(xxx)可以将xxx变成字符串。
    localStorage.setItem('x', string) //在本地设置一个x,x的值是string。即存储的数据将保存在浏览器会话中，并且是长期保存
}
//onbeforeunload 事件在即将离开当前页面（刷新或关闭）时触发。该事件可用于弹出对话框，提示用户是继续浏览页面还是离开当前页面。
//在这里指当用户顾关闭或者刷新页面时，会将当前 hashMap 存到 x 里

$(document).on('keypress', (e) => {
    const { key } = e //是 const key = e.key 的简写。当发现变量名和属性名一样时，可这样简写。
    for (let i = 0; i <= hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key) {
            window.open(hashMap[i].url)
        } //如果hashMap里面logo的小写字母对应了键盘按下的按键，直接跳转相应的页面
    }
})
//监听用户键盘按下，可以对document元素来操作。
//这段代码实现了用户可以直接点击对应logo字母的键盘按键来完成页面跳转。但是如果出现新增网站中有多个首字母一样的，只能跳转到第一个。
