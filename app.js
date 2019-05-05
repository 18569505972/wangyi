const express = require("express");
const apicache = require("apicache");
const path = require("path");

const app = express();
let cache = apicache.middleware;

// 跨域设置
app.all("*", function(req, res, next) {
  if (req.path !== "/" && !req.path.includes(".")) {
    res.header("Access-Control-Allow-Credentials", true);
    // 这里获取 origin 请求头 而不是用 *
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
  }
  next();
});

const onlyStatus200 = (req, res) => res.statusCode === 200;

app.use(cache("2 minutes", onlyStatus200));

app.use(express.static(path.resolve(__dirname, "public")));

app.use(function(req, res, next) {
  const proxy = req.query.proxy;
  if (proxy) {
    req.headers.cookie = req.headers.cookie + `__proxy__${proxy}`;
  }
  next();
});

// 获取歌手单曲
app.use("/api/artists", require("./router/artists"));

// 获取歌词
app.use("/api/lyric", require("./router/lyric"));

// 获取音乐 url
app.use("/api/music/url", require("./router/musicUrl"));

//推荐歌单
app.use("/api/personalized", require("./router/personalized"));

// 获取歌单内列表
app.use("/api/playlist/detail", require("./router/playlist_detail"));

app.use("/api/top/list", require("./router/top_list"));

app.use("/api/toplist/artist", require("./router/toplist_artist"));


const port = 3000;

app.listen(port, () => {
  console.log(`server running @ http://localhost:${port}`);
});

module.exports = app;
