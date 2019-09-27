// Packages
const torrentStream = require("torrent-stream");
const torrentToMagnet = require("torrent-to-magnet");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath("/Users/bboucher/.brew/Cellar/ffmpeg/4.1.4_2/bin/ffmpeg");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const yifysubtitles = require("yifysubtitles");

const mainExtensions = [".mp4", "webm"];
const otherExtensions = [
  ".avi",
  ".divx",
  ".flv",
  ".mkv",
  ".mpg",
  ".mp2",
  ".mpeg",
  ".mpe",
  ".mpv",
  ".mov",
  ".ogg",
  ".swf",
  ".qt",
  ".wmv"
];

const langs = [
  "sq",
  "ar",
  "bn",
  "pb",
  "bg",
  "zh",
  "hr",
  "cs",
  "da",
  "nl",
  "en",
  "et",
  "fa",
  "fi",
  "fr",
  "de",
  "el",
  "he",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "mk",
  "ms",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sr",
  "sl",
  "es",
  "sv",
  "th",
  "tr",
  "ur",
  "uk",
  "vi"
];

const convertStreamTorrent = async (file, res, path) => {
  const stream = file.createReadStream();
  ffmpeg(stream)
    .format("webm")
    .save(
      `${path}/${file.path.substr(0, file.path.lastIndexOf(".")) + ".webm"}`
    )
    .on("end", () => {
      console.log("Finished processing");
      fs.unlinkSync(`${path}/${file.path}`);
    });
  const head = {
    "Content-Length": file.length,
    "Content-Type": "video/webm"
  };
  res.writeHead(200, head);
  stream.pipe(res);
};

const streamTorrent = async (path, size, res, range) => {
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
    const stream =
      typeof path === "object"
        ? path.createReadStream({ start, end })
        : fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4"
    };
    res.writeHead(206, head);
    stream.pipe(res);
  }
};

const downloadTorrent = async (movieFile, magnet, options, req, res) => {
  const engine = torrentStream(magnet, options);
  engine.on("ready", () => {
    engine.files.forEach(async file => {
      const extension = path.extname(file.name);
      if (
        mainExtensions.includes(extension) ||
        otherExtensions.includes(extension)
      ) {
        file.select();
        movieFile.file = file;
        if (mainExtensions.includes(extension))
          streamTorrent(file, file.length, res, req.headers.range);
        else convertStreamTorrent(file, res, options.path);
      } else {
        file.deselect();
      }
    });
  });
  engine.on("download", () => {
    console.log("[ DL TRACKER ]");
    console.log(`Filename : ${movieFile.file.name}`);
    console.log(
      `Progress : ${(
        (100 * engine.swarm.downloaded) /
        movieFile.file.length
      ).toPrecision(4)}%`
    );
  });
};

const handleTorrent = async (req, res) => {
  const { provider, id, magnet } = req.query;
  const movieFile = { file: {}, path: "" };
  const options = {
    connections: 100,
    uploads: 10,
    verify: true,
    dht: true,
    tracker: true,
    tmp: "/tmp",
    path: `/tmp/movies/${id}`
  };
  if (provider === "YTS") {
    torrentToMagnet(magnet, (err, uri) => {
      if (err) return res.status(400).json({ message: "Torrent not found" });
      downloadTorrent(movieFile, uri, options, req, res);
    });
  } else {
    downloadTorrent(movieFile, magnet, options, req, res);
  }
};

const handleSubs = async (req, res) => {
  const arr = [];
  const idIMDB = req.query.id;
  const dir = `/tmp/subs/${idIMDB}`;
  if (!fs.existsSync(dir))
    fs.mkdirSync(`/tmp/subs/${idIMDB}`, { recursive: true })
  yifysubtitles(idIMDB, {
    path: dir,
    langs: langs
  })
    .then(async data => {
      await Promise.all(
        data.map(async e => {
          return await (async () => {
            let newPath =  `${dir}/${e.langShort}.vtt`;
            if (fs.existsSync(e.path)) {
              fs.rename(e.path, newPath, () => {});
              arr.push({
                lang: e.langShort,
                path: newPath
              });
              return Promise.resolve();
            }
          })();
        })
      );
      res.status(200).send(arr);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send({ message: "Subtitles not found" });
    });
};

module.exports = { handleTorrent, handleSubs };
