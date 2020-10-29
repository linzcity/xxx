(function () {
    var rem = 10;
    rem = 10 / 1440 * document.documentElement.clientWidth;
    document.documentElement.style.fontSize = rem + 'px';
})()

var myLine, myPie, myBar;

// 适应屏幕比例变化
window.onresize = function () {
    myLine.resize();
    myPie.resize();
    myBar.resize();
}

// 滑块效果
function slipping () {
    var text = Array.from(document.getElementsByClassName("text"))
    for (var i = 0; i < text.length; i++) {
        text[i].className = 'text border';
        this.className = 'text active';
    }
}

window.onload = function () {
    // 初始化echarts实例
    myLine = echarts.init(document.getElementById('line'));
    myPie = echarts.init(document.getElementById('pie'));
    myBar = echarts.init(document.getElementById('bar'));

    drawLine();
    drawPie();
    drawBar();

    // 绑定导航栏点击事件
    var text = Array.from(document.getElementsByClassName("text"))
    for (var i = 0; i < text.length; i++) {
        text[i].onclick = function () {
            for (var j = 0; j < text.length; j++) {
                text[j].className = 'text border';
            }
            this.className = 'text active';
        }
        text[i].onmouseover = slipping; // 绑定鼠标滑动事件
    }

    // 轮播图功能
    var img = document.getElementsByTagName("img")[0];
    var leftRight = document.getElementsByClassName("leftRight")[0]
    var left = document.getElementsByClassName("left")[0];
    var right = document.getElementsByClassName("right")[0];
    var li = document.getElementsByTagName("li");
    var num = 0;

    var myTimer = null;

    var imgArr = ["../image/1.jpg", "../image/2.jpg", "../image/3.jpg", "../image/4.jpg", "../image/5.jpg"];

    right.onclick = function () {
        num++;
        if (num == imgArr.length) {
            num = 0;
        }
        changeSrc();
        clearInterval(myTimer);
        // setTimeout(auto(), 2500);
    };
    left.onclick = function () {
        num--;
        if (num == -1) {
            num = imgArr.length - 1;
        }
        changeSrc();
        clearInterval(myTimer);
        // setTimeout(auto(), 2500);
    };
    // 浮标事件
    for (var i = 0; i < imgArr.length; i++) {
        li[i].index = i;
        li[i].onclick = function () {
            num = this.index;
            changeSrc();
        }
    }
    leftRight.onmouseover = function () {
        clearInterval(myTimer);
    }
    leftRight.onmouseout = auto

    setTimeout(auto(), 1000); //延迟1000ms执行自动切换    
    img.onmouseover = function () {
        clearInterval(myTimer);
    };
    img.onmouseout = auto;

    // 自动轮播
    function auto() {
        myTimer = setInterval(function () {
            num++;
            num %= imgArr.length;
            changeSrc();
        }, 2500);
    }

    function changeSrc() {
        img.src = imgArr[num];
        for (var i = 0; i < li.length; i++) {
            li[i].className = "";
        }
        li[num].className = "activeDot";
    }
}

// 曲线图
function drawLine(data) {
    if (!data) {
        var url = 'https://edu.telking.com/api/?type=month';
        myAjax(url, drawLine);
        return;
    }

    // 配置参数
    var option = {
        legend: {
            data: ['']
        },
        tooltip: {},
        xAxis: {
            data: data['data']['xAxis'],
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        grid: {
            x: '8%',
            y: '8%',
            x2: '8%',
            y2: '8%'
        },
        series: [{
            name: '人数',
            type: 'line',
            smooth: true,
            areaStyle: {
                normal: {
                    color: '#F3F6FD'
                }
            },
            itemStyle: {
                normal: {
                    color: '#98BDF7',
                    lineStyle: {
                        color: '#4E8DF0'
                    },
                    label: {
                        show: true
                    }
                }
            },
            data: data['data']['series']
        }]
    };

    // 画图
    myLine.setOption(option);
    myBar.resize();
}

// 饼图
function drawPie(data) {
    if (!data) {
        var url = 'https://edu.telking.com/api/?type=week';
        myAjax(url, drawPie);
        return;
    }

    var option = {
        legend: {
            data: ['']
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
            name: '人数',
            type: 'pie',
            labelLine: {
                normal: {
                    length: 5
                }
            },
            label: {
                normal: {
                    formatter: '{b}',
                }
            },
            radius: '90%',
            data: arrayTool(data['data']['xAxis'], data['data']['series'])
        }]
    };

    myPie.setOption(option);
    myBar.resize();
}

// 柱状图
function drawBar(data) {
    if (!data) {
        var url = 'https://edu.telking.com/api/?type=week';
        myAjax(url, drawBar);
        return;
    }

    var option = {
        legend: {
            data: ['']
        },
        tooltip: {},
        xAxis: {
            data: data['data']['xAxis'],
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: [{
            type: 'value',
            scale: true,
            name: '商品数',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        }],
        grid: {
            x: 50,
            y: 30,
            x2: 50,
            y2: 20
        },
        series: [{
            name: '人数',
            type: 'bar',
            barWidth: 15,
            itemStyle: {
                color: 'rgba(64, 126, 223,1)'
            },
            data: data['data']['series']
        }]
    };

    myBar.setOption(option);
    myBar.resize();
}

// 封装ajax
function myAjax(url, fn) {

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var data = JSON.parse(xmlHttp.responseText);
            fn.call(this, data);
        }
    }

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function arrayTool(name, value) {
    var arr = []
    for (var i = 0; i < name.length; i++) {
        var obj = {};
        obj.name = name[i];
        obj.value = value[i];
        arr.push(obj);
    }
    return arr;
}

function myClick() {
    console.log('hello')
    alert('why')
}
