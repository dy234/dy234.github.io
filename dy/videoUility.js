function handleTitle(title){
    title = title.replace("HD", "").replace("完结", "").replace("BD", "").replace("TS", "");

    var pos = title.indexOf("更新");
    if (pos >= 0){
        title = title.substring(0, pos - 1);
    }

    if (title.length > 8){
        title = title.substring(0, 8) + "...";
    }

    return title;
}