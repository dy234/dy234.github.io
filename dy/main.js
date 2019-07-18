document.write('<script src="videoUility.js"><\/script>')

var uiMgr = new UIMgr();
var play = new Player();
var dataMgr = new DataMgr();
var okParser = new OKParser();
var zxParser = new ZXParser();
var videoX = new VideoX();

var id = 0;
function searchVideo(){
    if (uiMgr.currentView == 'play'){
        play.pause();
    }

    var title = document.getElementById('search_text').value;
    if (title != null && title != ''){
        uiMgr.showSearchView();
        uiMgr.showLoading();
        uiMgr.clearSearchResult();

        videoX.okSearch(id, title);
        videoX.zxSearch(id, title);
        id++;
    }
}

function VideoX(title){
    this.currentID = -1;
}

VideoX.prototype.okSearch = function(id, title){
    this.currentID = id;
    var url = `https://www.okzy.co/index.php?m=vod-search&wd=${title}&submit=search`;
    dataMgr.requestData(url, (data)=>{
        if (this.currentID == id){
            okParser.parserSearchResult(data, (searchResultList)=>{
                uiMgr.addCatalogView('ok', 'ok资源网', searchResultList, okParser);
                if (!uiMgr.hasSearchResult){
                    uiMgr.hasSearchResult = true;
                    uiMgr.showSearchResultView('ok', searchResultList, okParser);
                }
            });
        }
    })
}

VideoX.prototype.zxSearch = function(id, title){
    this.currentID = id;
    var url = `https://www.zuixinzy.cc/index.php?m=vod-search&wd=${title}&submit=search`;
    dataMgr.requestData(url, (data)=>{
        if (this.currentID == id){
            zxParser.parserSearchResult(data, (searchResultList)=>{
                uiMgr.addCatalogView('zx', 'zx资源网', searchResultList, zxParser);
                if (!uiMgr.hasSearchResult){
                    uiMgr.hasSearchResult = true;
                    uiMgr.showSearchResultView('zx', searchResultList, zxParser);
                }
            });
        }
    })
}

Function.prototype.getMultiLine = function() {  
    var lines = new String(this);  
    lines = lines.substring(lines.indexOf("/*") + 2, lines.lastIndexOf("*/"));  
    return lines;  
}  

    /*<li class="item_li">
        </li>*/
var searchReaultNode = function() {  
    /*<div class="vertical">
    <div class="link_wrap">
      <div class ="link">
        <div class ="div_img" style="height: inherit; background-size: 100%;"></div>
        <div class ="div_img_bg" style="height: inherit; background-size: 100%; background-image: url('https://u.vmpic.cn/2019/07/15/NKPa.jpg');"></div>
      </div>
    </div>
    <div class="title">
      <a class ="title_link" href="" target="_blank">阿丽塔战斗天使</a>
    </div>
  </div>*/
} 

var selectNode = function() {  
    /*<p class="select_btn">第01集</p>*/
} 

// var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
var cors_api_url = 'https://bird.ioliu.cn/v2/?url=';
function doCORSRequest(options, callback, updateProgress=null) {
    var x = new XMLHttpRequest();

    if (updateProgress != null){
        x.addEventListener("progress", updateProgress, false);
    }

    x.open(options.method, cors_api_url + options.url);
  //   x.onload = x.onerror = function() {
  //     printResult(
  //       options.method + ' ' + options.url + '\n' +
  //       x.status + ' ' + x.statusText + '\n\n' +
  //       (x.responseText || '')
  //     );
  //   };
  
  x.onreadystatechange = function() {
      if (x.readyState == 4) {
          if (x.status === 200) {
              callback(x.responseText);
          }
      } 
  };
  
  x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  
  //   if (/^POST/i.test(options.method)) {
  //     x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //   }
    // x.send(options.data);
  x.send(null);
}

function Menu(){
    this.isOpen = false;
}

Menu.prototype.open = function(){
    this.isOpen = true;
    document.getElementById('home_btn').style.bottom = '100px';
    document.getElementById('back_btn').style.left = '76px';
    document.getElementById('back_btn').style.bottom = '76px';
    document.getElementById('front_btn').style.left = '100px';
}

Menu.prototype.close = function(){
    this.isOpen = false;
    document.getElementById('home_btn').style.bottom = '20px';
    document.getElementById('back_btn').style.left = '20px';
    document.getElementById('back_btn').style.bottom = '20px';
    document.getElementById('front_btn').style.left = '20px';
}

Menu.prototype.changeUI = function(){
    document.getElementById('home_btn').className = uiMgr.currentView != 'home' && uiMgr.hasShowSearchView ? 'menu' : 'menu-disabled';
    document.getElementById('back_btn').className = uiMgr.currentView != 'home' ? 'menu' : 'menu-disabled';
    if ((uiMgr.currentView == 'home' && uiMgr.hasShowSearchView) 
    || (uiMgr.currentView == 'search' && uiMgr.hasShowPlayView)){
        document.getElementById('front_btn').className = 'menu';
    } else {
        document.getElementById('front_btn').className = 'menu-disabled';
    }
}

var menu = new Menu();

var webAppInit = function(){
    menu.changeUI();
    uiMgr.showHomeView();

    document.getElementById('home_btn').onclick = function(){
        if (uiMgr.currentView != 'home'){
            if (uiMgr.currentView == 'play'){
                play.pause();
            }

            uiMgr.showHomeView();
        }
    }

    document.getElementById('back_btn').onclick = function(){
        if(uiMgr.currentView == 'search'){
            uiMgr.showHomeView();
        } else if (uiMgr.currentView == 'play'){
            play.pause();
            uiMgr.showSearchView();
        } else if (uiMgr.currentView == 'home'){
            // do nothing
        }
    }
    
    document.getElementById('front_btn').onclick = function(){
        if(uiMgr.currentView == 'search' && uiMgr.hasShowPlayView){
            uiMgr.showPlayView();
            if (document.getElementById('player') != null){
                var player = videojs('player');
                player.play();
            }
        } else if (uiMgr.currentView == 'play'){
            // do nothing
        } else if(uiMgr.currentView == 'home' && uiMgr.hasShowSearchView){
            uiMgr.showSearchView();
        }
    }
}

function clickMenu(){
    if (menu.isOpen){
        menu.close();
    } else {
        menu.open();
    }
}

function UIMgr(){
    this.hasShowSearchView = false;
    this.hasShowPlayView = false;
    this.currentView = 'home';
    this.hasSearchResult = false;
}

UIMgr.prototype.showHomeView = function(){
    this.currentView = 'home';
    document.getElementById('content_tip').style.display = 'block';
    document.getElementById('play_page_bg').style.display = 'none';
    document.getElementById('content').style.display = 'none';
    document.getElementById('catalog').style.display = 'none';

    menu.changeUI();
}

UIMgr.prototype.showSearchView = function(){
    this.hasShowSearchView = true;
    this.currentView = 'search';
    document.getElementById('content').style.display = 'block';
    document.getElementById('play_page_bg').style.display = 'none';
    document.getElementById('content_tip').style.display = 'none';
    document.getElementById('catalog').style.display = 'inline-block';

    menu.changeUI();
}

UIMgr.prototype.showLoading = function(){
    document.getElementById('spinner').style.display = 'block';
}

UIMgr.prototype.hideLoading = function(){
    document.getElementById('spinner').style.display = 'none';
}

UIMgr.prototype.clearSearchResult = function(){
    document.getElementById("search_results_ul").innerHTML = "";
    document.getElementById("catalog_ul").innerHTML = "";
    this.hasSearchResult = false;
}

UIMgr.prototype.showPlayView = function(){
    this.hasShowPlayView = true;
    this.currentView = 'play';
    document.getElementById('content').style.display = 'none';
    document.getElementById('play_page_bg').style.display = 'block';
    document.getElementById('catalog').style.display = 'none';

    menu.changeUI();
}

UIMgr.prototype.clearSelectList = function(){
    document.getElementById('select_ul').innerHTML = '';
}

UIMgr.prototype.selected = function(selectedNode){
    var node = document.getElementsByClassName('select_li_selected')[0];
    if (node != null){
        node.className = 'select_li';
    }

    selectedNode.className = 'select_li_selected';
}

UIMgr.prototype.showSearchResultView = function(key, resultList, resParser){
    var nodes = document.getElementsByClassName('item_li');
    for(var i=0; i<nodes.length; i++){
        nodes[i].style.display = 'none';
    }

    if (document.getElementsByClassName(key).length <= 0){
        for(var i=0; i<resultList.length; i++){
            var title = resultList[i].title;
            var href =  resultList[i].href;
    
            document.getElementById("search_results_ul").
            appendChild(this.createSearchResultNode(key, title, href, resParser));
        }
    } else {
        var nodes = document.getElementsByClassName(key);
        for(var i=0; i<nodes.length; i++){
            nodes[i].style.display = 'inline-block';
        }
    }

    uiMgr.hideLoading();
}

UIMgr.prototype.addCatalogView= function(key, title, resultList, resParser){
    var node = this.createCatalogNode(title);
    document.getElementById('catalog_ul').appendChild(node);

    node.onclick = ()=>{
        this.showSearchResultView(key, resultList, resParser);

        if (document.getElementsByClassName('catalog-button-selected').length > 0){
            document.getElementsByClassName('catalog-button-selected')[0].className = 'catalog-button-default';
        }
        node.getElementsByTagName('input')[0].className = 'catalog-button-selected';
    };
}

UIMgr.prototype.createSearchResultNode = function(key, title, href, resParser){
    var li = document.createElement('li');
    li.setAttribute("class", `item_li ${key}`);
    li.innerHTML = searchReaultNode.getMultiLine();
    li.getElementsByClassName("title_link")[0].innerHTML = title;

    dataMgr.requestData(href, (responseText)=>{
        resParser.parserImageUrl(responseText, (url)=>{
            li.getElementsByClassName("div_img")[0].style.backgroundImage = "url(" + url + ")";
        });
    });

    li.getElementsByClassName("div_img")[0].onclick = ()=>{

        uiMgr.showPlayView();
        uiMgr.clearSelectList();
        play.reset();

        dataMgr.requestData(href, (responseText)=>{
            console.log(href);
            resParser.parserVideoPlaylist(responseText, (playlist)=>{

                for(var i=0; i<playlist.length; i++){
                    var title = playlist[i].title;
                    var m3u8Url = playlist[i].m3u8Url;
                    document.getElementById('select_ul').appendChild(this.createSelectNode(title, m3u8Url));
                }

                if (playlist.length > 0){
                    uiMgr.selected(document.getElementsByClassName('select_li')[0]);
                    play.play(playlist[0].m3u8Url);
                }
            });
        });
    };

    return li;
}

UIMgr.prototype.createCatalogNode = function createCatalogNode(title){
    var li = document.createElement('li');
    li.innerHTML = ' <input type="button" class="catalog-button-default">';
    li.getElementsByTagName('input')[0].setAttribute('value', title);

    return li;
}

UIMgr.prototype.createSelectNode =  function(title, m3u8Url){
    var li = document.createElement('li');
    li.setAttribute("class", "select_li");
    li.innerHTML = selectNode.getMultiLine();
    li.getElementsByClassName("select_btn")[0].innerText = title;

    li.onclick = ()=>{
        uiMgr.selected(li);
        playVideo(m3u8Url);
    };

    return li;
}

function DataMgr(){

}

DataMgr.prototype.requestData = function(url, callback){
    doCORSRequest(
        {
            method:"get",
            url: url,
            // data: 'wd='+title+'&submit=search'
        }, (responseText)=>{
            callback(responseText);
        });
}

// test
// dataMgr.requestData("https://www.okzy.co/index.php?m=vod-search&wd=强风吹拂&submit=search", (txt)=>{
//     okParser.parserSearchResult(txt, (list)=>{
//         for(var i=0; i<list.length; i++){
//             console.log(list[i].title + list[i].href);

//             dataMgr.requestData(list[i].href, (response)=>{
//                 okParser.parserVideoPlaylist(response, (playlist)=>{
//                     console.log('sfsdge');
//                     for(var j=0; j<playlist.length; j++){
//                         console.log(playlist[j].title + playlist[j].m3u8Url);
//                     }
//                 });
//             })
          
//         }
//     })
// });

// dataMgr.requestData('https://cn2.zuixinbo.com/20180415/1899_0b5ab9fa/index.m3u8', (res)=>{
//     console.log(res);
// });

function OKParser(){

}

OKParser.prototype.parserSearchResult = function(text, callback){
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(text,"text/html");

    var nodes = xmlDoc.getElementsByClassName("xing_vb4");
    var list = [];
    for(var i=0; i<nodes.length; i++){
        var node = nodes[i].getElementsByTagName("a")[0];
        var title = handleTitle(node.innerHTML);
        var href = "https://www.okzy.co" + node.getAttribute("href");
        list[i] = {'title': title, 'href': href};
    }

    callback(list);
}

OKParser.prototype.parserImageUrl = function(text, callback){
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(text,"text/html");
    var url = xmlDoc.getElementsByClassName("lazy")[0].src;
    callback(url);
}

OKParser.prototype.parserVideoPlaylist = function(text, callback){
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(text,"text/html");

    var nodes = xmlDoc.getElementsByTagName('li');
    var index = 0;
    var playlist = [];
    for(var i=0; i<nodes.length; i++){
        var node = nodes[i];
        var text = node.innerText;
        if (text.indexOf('.m3u8') >= 0){
            var arr = text.replace('"', '') .split('$');
            var title = arr[0];
            var m3u8Url = arr[1];
            playlist[index++] = {'title': title, 'm3u8Url': m3u8Url};
        }
    }

    callback(playlist);
}

function YJParser(){

}

YJParser.prototype.parserSearchResult = function(text, callback){
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(text,"text/html");

    var nodes = xmlDoc.getElementsByClassName("xing_vb4");
    var list = [];
    for(var i=0; i<nodes.length; i++){
        var node = nodes[i].getElementsByTagName("a")[0];
        var title = handleTitle(node.innerHTML);
        var href = "https://www.zuixinzy.cc" + node.getAttribute("href");
        list[i] = {'title': title, 'href': href};
    }

    callback(list);
}

YJParser.prototype.parserImageUrl = function(text, callback){
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(text,"text/html");
    var url = xmlDoc.getElementsByClassName("lazy")[0].src;
    callback(url);
}

YJParser.prototype.parserVideoPlaylist = function(text, callback){
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(text,"text/html");

    var nodes = xmlDoc.getElementsByTagName('li');
    var index = 0;
    var playlist = [];
    for(var i=0; i<nodes.length; i++){
        var node = nodes[i];
        var text = node.innerText;
        if (text.indexOf('.m3u8') >= 0){
            var arr = text.replace('"', '') .split('$');
            var title = arr[0];
            var m3u8Url = arr[1];
            playlist[index++] = {'title': title, 'm3u8Url': m3u8Url};
        }
    }

    callback(playlist);
}

function Player(){

}

Player.prototype.reset = function(){
    if (document.getElementById('player') != null){
        var player = videojs('player');
        player.dispose();
    }

    var str = `<video id="player" 
    class="video-js vjs-default-skin vjs-big-play-centered" 
    controls
    autoplay
    preload="auto">
    </video>`;
    document.getElementById('video_wrap').innerHTML = str;

    videojs('player', {
        // fluid: true,
        bigPlayButton: true,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false,
        controlBar:{
            'currentTimeDisplay':true,
            'timeDivider':true,
            'durationDisplay':true,
            'remainingTimeDisplay':false,
            'volumeMenuButton':{
                inline: false, // 不使用水平方式
                vertical: true
              },
            children: [
                {name: 'playToggle'}, // 播放按钮
                {name: 'progressControl'}, // 播放进度条
                {name: 'currentTimeDisplay'}, // 播放按钮
                {name: 'timeDivider'}, // 当前已播放时间
                {name: 'durationDisplay'}, // 总时间
                {name: 'volumeMenuButton'}, // 播放按钮
                { // 倍数播放
                  name: 'playbackRateMenuButton',
                  'playbackRates': [0.5, 1, 1.5, 2, 2.5]
                },
                {name: 'FullscreenToggle'} // 全屏
              ]
        }
    },function(){
        // this.play();
    })
}

Player.prototype.play = function(url){
    videojs('player').src({type: 'application/x-mpegURL', src: `${url}`});
}

Player.prototype.pause = function(url){
    if (document.getElementById('player') != null){
        var player = videojs('player');
        player.pause();
    }
}

