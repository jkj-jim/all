



var src = yuquejson.data.body;
var content = {
    "nav": [],
    "header": {},
    "banner": {},
    "menus": [],
    "footer": {}
};
var nav, header, banner, menus, footer;

//屏幕的滚动事件，让左侧目录固定
window.addEventListener("scroll", function (e) {
    //变量t就是滚动条滚动时，到顶部的距离
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    // console.log(t);
    if (t >= 400) {
        $(".fix").css({ "position": "fixed", "top": "50px" });
    } else {
        $(".fix").css({ "position": "static" })
    }
});


$(document).ready(function () {

    init();//将语雀数据转化成json
    refreshHeader();//用json填充头部
    refreshNav();//用json填充nav
    refreshMenus();//用json填充导航目录+产品卡片
    refreshLogo();//为无logo的卡片制作默认logo
    refreshDetail();//为无详情的卡片制作默认详情
    refreshFooter();//用json填充footer
    sideTool();//侧边栏的交互
    
})

//初始化，将语雀的数据转化到全局变量的json中
function init() {

    // console.log(src.match(/<a.*a>/g));//查找a标签
    // console.log(src.match(/# .*\n/g));//查找一级标题
    // console.log(src.match(/>.*\n/g));//查找注释内容
    src = src.replace(/<a.*a>|>.*\n/g, "").trim();//去除a标签和注释内容
    // console.log(src);//打印除杂后的原始数据

    src = trans(src);//将原始数据解析成数组，表格在后续进行解析
    // console.log(src);
    nav = src[0][1];
    header = src[1][1];
    banner = src[2][1];
    menus = src[3][1];
    footer = src[4][1];

    // console.log("nav:\n");
    // console.log(nav);//string   
    // console.log("header:\n");
    // console.log(header);//string 
    // console.log("banner:\n");
    // console.log(banner);// 
    // console.log("menus:\n");
    // console.log(menus);//array 
    // console.log("footer:\n");
    // console.log(footer);//array 

    transHeader();
    transNav();
    transMenus();
    transFooter();
    // console.log(JSON.stringify(content));

}

//将语雀原始数据解析成数组
function trans(arr) {
    // let arr="";
    // arr=String(src);
    if (String(arr).match(/^# .*\n/g) != null) {
        arr = arr.split(/^# |\n# /);
        if (arr[0] == "") {
            arr.shift();//用于去除分割后数组第一个为空的情况
        }
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i] = [arr[i].slice(0, arr[i].indexOf("\n")), arr[i].slice(arr[i].indexOf("\n") + 1).trim()];//将一个区间的标题拆分出来
        }
        // console.log("#");
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i][1] = trans(arr[i][1]);
        }

    } else if (String(arr).match(/^## .*\n/) != null) {
        arr = arr.split(/^## |\n## /);
        if (arr[0] == "") {
            arr.shift();//用于去除分割后数组第一个为空的情况
        }
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i] = [arr[i].slice(0, arr[i].indexOf("\n")), arr[i].slice(arr[i].indexOf("\n") + 1).trim()];//将一个区间的标题拆分出来
        }
        // console.log("##");
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i][1] = trans(arr[i][1]);
        }

    } else if (String(arr).match(/^### .*\n/) != null) {
        arr = arr.split(/^### |\n### /);
        if (arr[0] == "") {
            arr.shift();//用于去除分割后数组第一个为空的情况
        }
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i] = [arr[i].slice(0, arr[i].indexOf("\n")), arr[i].slice(arr[i].indexOf("\n") + 1).trim()];//将一个区间的标题拆分出来
        }
        // console.log("###");
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i][1] = trans(arr[i][1]);
        }

    } else if (String(arr).match(/^#### .*\n/) != null) {
        arr = arr.split(/^#### |\n#### /);
        if (arr[0] == "") {
            arr.shift();//用于去除分割后数组第一个为空的情况
        }
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i] = [arr[i].slice(0, arr[i].indexOf("\n")), arr[i].slice(arr[i].indexOf("\n") + 1).trim()];//将一个区间的标题拆分出来
        }
        // console.log("####");
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i][1] = trans(arr[i][1]);
        }

    } else {
        // console.log("done");
    }
    return arr;
}

//将每个区域拆开成单个的数组，循环解析到对应的属性下
function transTable(str) {
    //用来解析表格的函数，只针对单个表格，如果表格连续的话，这个函数不适用，输出单元格字符串数组（包括url），如果不是表格，输出“”
    let arr, result;
    if (str.match(/\n\| \-.*\- \|\n/) != null) {
        //判断是不是表格，且表格除表头外有内容
        arr = String(str).split(/\n\| \-.*\- \|\n/);//分割表头和内容,用正则的方式分割，可兼容多列表格
        result = String(arr[1]).split("\n");
        for (let i = 0, l = result.length; i < l; i++) {
            result[i] = result[i].replace(/^\| /, "").replace(/ \|$/, "");
            result[i] = result[i].split(" | ");

            let tableCellTest = "";
            for (let j = 0, ll = result[i].length; j < ll; j++) {
                tableCellTest = tableCellTest + result[i][j];
            }
            if (tableCellTest == "") {
                result.splice(i, 1);
                i--;
                l--;
            }
        }
        // for (let ii = 0,j=result[i].length; ii < j; ii++) {
        //     //繁琐的方法，对每一个单元格进行匹配后，对有图像的单元格进行去标签
        //     if(result[i][ii].match(/!\[image.png\]/)){
        //         result[i][ii]=result[i][ii].replace(/!\[image.png\]\(/,"").replace(/\)$/,"");                    
        //     }  
        // }
    } else {
        result = "";
    }
    return result;
}

//头部的数据解析到json
function transHeader() {
    let headtitles = transTable(header);
    content.header.bigD = headtitles[0][0];
    content.header.smallD = headtitles[0][1];
}

//Nav的数据解析到json
function transNav() {

    let navitems = transTable(nav);
    for (let i = 0, l = navitems.length; i < l; i++) {
        content.nav[i] = {};
        content.nav[i].id = i;
        content.nav[i].name = navitems[i][0];
        content.nav[i].url = urlUpgrade(navitems[i][1]);
    }
}

//将menus数据解析到json
function transMenus() {
    for (let i = 0, l = menus.length; i < l; i++) {
        //解析分类导航的内容到content.json中
        content.menus[i] = {};
        content.menus[i].id = i;
        content.menus[i].name = menus[i][0];
        content.menus[i].submenus = [];

        let tempSubmenus = menus[i][1];
        let tempContentSubmenus = content.menus[i].submenus;//浅复制

        for (let i = 0, l = tempSubmenus.length; i < l; i++) {
            tempContentSubmenus[i] = {};
            tempContentSubmenus[i].id = i;
            tempContentSubmenus[i].name = tempSubmenus[i][0];
            tempContentSubmenus[i].products = [];


            let tempSubmenusProducts = transTable(tempSubmenus[i][1]);
            let tempContentSubmenusProducts = tempContentSubmenus[i].products;//浅复制

            for (let i = 0, l = tempSubmenusProducts.length; i < l; i++) {
                tempContentSubmenusProducts[i] = {};
                tempContentSubmenusProducts[i].id = i;
                tempContentSubmenusProducts[i].name = tempSubmenusProducts[i][0].trim();
                tempContentSubmenusProducts[i].url = urlUpgrade(tempSubmenusProducts[i][1]);
                tempContentSubmenusProducts[i].detail = tempSubmenusProducts[i][2];
                tempContentSubmenusProducts[i].img = urlUpgrade(tempSubmenusProducts[i][3]);
            }
            // tempContentSubmenus[i].products=tempContentSubmenusProducts;//将处理完的产品详情传回实际的products的数组中,如果用浅复制的方法，这一句就可以注释掉
        }
        // content.menus[i].submenus=tempContentSubmenus;

    }
}

//将footer数据解析到json
function transFooter() {
    let broLink = transTable(footer[0][1]);
    let remark = transTable(footer[1][1]);
    let record = transTable(footer[2][1]);
    if (broLink != "") {
        content.footer.broLink = [];
        for (let i = 0, l = broLink.length; i < l; i++) {
            content.footer.broLink[i] = {};
            content.footer.broLink[i].id = i;
            content.footer.broLink[i].name = broLink[i][0];
            content.footer.broLink[i].url = urlUpgrade(broLink[i][1]);
        }
    } 
    if (remark != "") {
        content.footer.remark = [];
        for (let i = 0, l = remark.length; i < l; i++) {
            content.footer.remark[i] = {};
            content.footer.remark[i].id = i;
            content.footer.remark[i].name = remark[i][0];
            content.footer.remark[i].url = urlUpgrade(remark[i][1]);
        }
    }
    if (record != "") {
        content.footer.record = record[0][0];
    } 
}

//刷新大标语和小标语
function refreshHeader() {
    $("#headerTitle > .bD").text(content.header.bigD);
    $("#headerTitle > .sD").text(content.header.smallD);

}

//刷新顶部导航
function refreshNav() {

    $("#navItem").html("");
    for (let i = 0, l = content.nav.length; i < l; i++) {
        $("#navItem").prepend("<div class='navLink'><a href=" + content.nav[i].url + " target='_blank'> " + content.nav[i].name + "</a></div>")
    }
}

//刷新类目导航和卡片
function refreshMenus() {
    $("#menuList").html("");
    $("#menuListRight").html("");
    for (let i = 0, l = content.menus.length; i < l; i++) {
        let anchor1 = Date.now().toString(36).substr(-5, 5);

        $("#menuList").append("<h3 class='menusTitle'><a href='#" + anchor1 + "'>" + content.menus[i].name + "</a></h3>");

        $("#menuListRight").append("<div class='menuTitle'><h3> <img src='res/menu.svg'><a name='" + anchor1 + "'></a>" + content.menus[i].name + "</h3></div > ");

        for (let j = 0, ll = content.menus[i].submenus.length; j < ll; j++) {
            let anchor2 = Date.now().toString(36).substr(-5, 5);
            $("#menuList").append("<li class='submenusTitle'><a href='#" + anchor2 + "'>" + content.menus[i].submenus[j].name + "</a></li>");

            $("#menuListRight").append("<div class='submenuTitle'><h4> <img src='res/submenu.svg'><a name='" + anchor2 + "'></a>" + content.menus[i].submenus[j].name + "</h4></div ><div class='products'></div > ");

            for (let k = 0, lll = content.menus[i].submenus[j].products.length; k < lll; k++) {
                if (content.menus[i].submenus[j].products[k].name != "") {

                    if (content.menus[i].submenus[j].products[k].img == "") {
                        $("#menuListRight>.products:last").append("<div class='card'><div class='logo'></div ><div class='detail'><h5>" + content.menus[i].submenus[j].products[k].name + "</h5><p>" + content.menus[i].submenus[j].products[k].detail + "</p></div></div>");
                    } else {
                        $("#menuListRight>.products:last").append("<div class='card'><div class='logo' style ='background-image:url(" + content.menus[i].submenus[j].products[k].img + ")'></div ><div class='detail'><h5>" + content.menus[i].submenus[j].products[k].name + "</h5><p>" + content.menus[i].submenus[j].products[k].detail + "</p></div></div>");
                    }
                    if (content.menus[i].submenus[j].products[k].url != "") {
                        $(".card:last").click(function () { window.open(content.menus[i].submenus[j].products[k].url, '_blank') });
                    }
                }



            }
        }
    }



}

//刷新底部内容
function refreshFooter() {

    //填充友链
    if (content.footer.broLink != undefined) {
        $("#broLink").html("");
        for (let i = 0, l = content.footer.broLink.length; i < l; i++) {
            if (content.footer.broLink[i].url == "") {
                $("#broLink").append(content.footer.broLink[i].name);
            } else {
                $("#broLink").append("<a href=" + content.footer.broLink[i].url + " target='_blank'>" + content.footer.broLink[i].name + "</a>");
            }
            if (i != (l - 1)) {
                $("#broLink").append("<span>&nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp</span>");
            }
        }

    } else {
        $("#broLink").remove();//如果没有表格则删除这个div
    }

    //填充备注
    if (content.footer.remark != undefined) {
        $("#remark").html("");
        for (let i = 0, l = content.footer.remark.length; i < l; i++) {
            if (content.footer.remark[i].url == "") {
                $("#remark").append(content.footer.remark[i].name);
            } else {
                $("#remark").append("<a href=" + content.footer.remark[i].url + " target='_blank'>" + content.footer.remark[i].name + "</a>");
            }
            if (i != (l - 1)) {
                $("#remark").append("<span>&nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp</span>");
            }
        }
    } else {
        $("#remark").remove();
    }

    //填充备案说明
    if (content.footer.record != undefined) {
        $("#record").html("");
        $("#record").append(content.footer.record);
    } else {
        $("#record").remove();
    }
}

// 获取无logo应用的默认logo；输入：标题字段；返回：logo对应的背景色值
function cardLogo(title) {
    let color = ["#FF4D4F", "#FF7A45", "#FFA940", "#FFC53D", "#FFEC3D"
        , "#BAE637", "#73D13D", "#36CFC9", "#40A9FF", "#597EF7", "#9254DE", "#F759AB"];
    let result = [];
    let cnum;
    result[0] = title.charAt(0);
    cnum = title.charCodeAt(0) * 1 % 12;
    result[1] = color[cnum];
    return result;
}

// 为所有应用刷新logo，如果没有logo的使用默认logo
function refreshLogo() {

    let text;
    let result;
    $(".card").each(function () {
        if ($(this).find(".logo").css("background-image") == "none") {
            text = $(this).find("h5").text();
            result = cardLogo(text);
            $(this).find(".logo").text(result[0]);
            $(this).find(".logo").css("background", result[1]);
        }
    })
}

// 刷新所有应用的描述，没有描述的使用标题的字段
function refreshDetail() {
    let text;
    $(".card").each(function () {
        if ($(this).find("p").text() == "") {
            text = $(this).find("h5").text();
            $(this).find("p").text(text);
        }
    })

}

//简单的处理URL的函数
function urlUpgrade(str) {

    if (str.indexOf("](") >= 0) {
        str = str.slice(str.indexOf("](") + 2, str.indexOf(")"));
    }

    if (str.toLowerCase().indexOf("http") >= 0 || str.toLowerCase().indexOf("https") >= 0 || str == "") {
    } else {
        str = "https://" + str;
    }

    return str;
}
//侧边栏的事件
function sideTool() {

    $("#totop").click(function () {
        console.log(document.documentElement.scrollTop);
        
        let time=setInterval(function () {
            window.scrollBy(0, -50);
            if (document.documentElement.scrollTop < 1) {
                console.log(document.documentElement.scrollTop);
                clearTimeout(time);
            }

     },20);
        
        


    });



}
function cancle() {
    console.log(document.getElementById("wjbgc"));
    
    document.getElementById("wjbgc").style.display='none';
}
