document.write('<script src="videoUility.js"><\/script>')

function searchVideo(){
    var title = document.getElementById('search_text').value;
    if (title != null && title != ''){
        ShowSearchView();

        doCORSRequest(
        {
            method:"get",
            // url:"https://www.okzy.co/index.php?m=vod-search",
            // data: "wd=强风吹拂&submit=search"
            url:"https://www.okzy.co/index.php?m=vod-search&wd="+title+"&submit=search",
            data: 'wd='+title+'&submit=search'
        }, (responseText)=>{
            var div = document.createElement('div');
            div.innerHTML = responseText;
            var nodes = div.getElementsByClassName("xing_vb4");
            document.getElementById("search_results_ul").innerHTML = "";
            for(var i=0; i<nodes.length; i++){
                var node = nodes[i].getElementsByTagName("a")[0];
                var title = handleTitle(node.innerHTML);
                var href = "https://www.okzy.co" + node.getAttribute("href");

                document.getElementById("search_results_ul").
                appendChild(createSearchResultNode(title, href));
            }

            document.getElementById('spinner').style.display = 'none';
        });
    }
}

function ShowSearchView(){
    document.getElementById('content').style.display = 'block';
    document.getElementById("search_results_ul").innerHTML = "";
    document.getElementById('play_page_bg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('content_tip').style.display = 'none';
    
    if (document.getElementById('player') != null){
        var player = videojs('player');
        player.dispose();
    }
}

function ShowPlayView(){
    document.getElementById('content').style.display = 'none';
    // document.getElementById('play_page_bg').style.display = 'block';
    document.getElementById('select_ul').innerHTML = '';
    document.getElementById('spinner').style.display = 'block';

    if (document.getElementById('player') != null){
        var player = videojs('player');
        player.dispose();
    }
}

function createSearchResultNode(title, href){
    var li = document.createElement('li');
    li.setAttribute("class", "item_li");
    li.innerHTML = searchReaultNode.getMultiLine();
    li.getElementsByClassName("title_link")[0].innerHTML = title;

    SetImageUrl(li, href);

    li.getElementsByClassName("div_img")[0].onclick = ()=>{

        ShowPlayView();

        doCORSRequest({
            method:"get",
            url: href,
        }, (responseText)=>{
            var div = document.createElement('div');
            div.innerHTML = responseText;

            // parse
            var playList = [];
            var nodes = div.getElementsByTagName('li');
            var index = 0;
            for(var i=0; i<nodes.length; i++){
                var node = nodes[i];
                var text = node.innerText;
                if (text.indexOf('.m3u8') >= 0){
                    var arr = text.replace('"', '') .split('$');
                    var title = arr[0];
                    var m3u8Url = arr[1];
                    playList[index++] = {'title': title, 'm3u8Url': m3u8Url};

                    document.getElementById('select_ul').appendChild(createSelectNode(title, m3u8Url));
                }
            }

            playVideo(playList[0].m3u8Url);

            document.getElementById('play_page_bg').style.display = 'block';
            document.getElementById('spinner').style.display = 'none';
        });
    };

    return li;
}

function createSelectNode(title, m3u8Url){
    var li = document.createElement('li');
    li.setAttribute("class", "select_li");
    li.innerHTML = selectNode.getMultiLine();
    li.getElementsByClassName("select_btn")[0].innerText = title;

    li.onclick = ()=>{
        playVideo(m3u8Url);
    };

    return li;
}

function SetImageUrl(element, href){
    doCORSRequest({
        method:"get",
        url: href,
    }, (responseText)=>{
        var div = document.createElement('div');
        div.innerHTML = responseText;
        var url = div.getElementsByClassName("lazy")[0].getAttribute("src");
        // element.getElementsByClassName("div_img")[0].setAttribute("style",
        // "height: inherit; background-size: 100%; background-image: url(" + url + ");");
        // "height: inherit; width: inherit; background-size: 100%; animation-duration: 0.4s; animation-delay: 0.128358s; background-image: url(" + url + ");");
        element.getElementsByClassName("div_img")[0].style.backgroundImage = "url(" + url + ")";
    });
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
        <div class ="div_img_bg" style="height: inherit; background-size: 100%; background-image: url('img/thumbnail.png');"></div>
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

function requestData(callback){
    // var url = "https://www.okzy.co/index.php?m=vod-search";
    // var request = new XMLHttpRequest();
    // request.open("post", url);
    // data = new FormData();
    // data.append("wd", "越狱");
    // data.append("submit", "search");
    // request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // request.onreadystatechange = function() {
    //     if (request.readyState == 4) {
    //         if (request.status === 200) {
    //             alert("ok");
    //             callback(request.responseText);
    //         } else{
    //             alert("fail");
    //         }
    //     } else{
    //         alert("no ready");

    //     }
    // };
    // request.send(data);
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

function playVideo(url){
    if (document.getElementById('player') != null){
        var player = videojs('player');
        player.dispose();
    }
   
    var str = `<video id="player" 
    class="video-js vjs-default-skin vjs-big-play-centered" 
    controls 
    autoplay
    preload="auto">
    <source id="source" src="${url}" type="application/x-mpegURL">
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