const express = require('express')
const router = express.Router();
const multiparty = require('multiparty');
const path = require('path');
const fse = require('fs-extra');


const TEMP_DIE = path.resolve(__dirname, '../bigfile');
const UPLOAD_DIR = path.resolve(__dirname, '../file');

router.post('/', (req, res, next) => {
  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, fields, files) => {
    if (err) return console.log('上传大文件出错', err);
    console.log('files*****', files);
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [filename] = fields.filename;
    const chunkDir = `${TEMP_DIE}/${filename}`;

    // 判断切片目录是否存在
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir);
    }

    await fse.move(chunk.path, `${chunkDir}/${hash}`);
    res.end('receive file chunk');
  })
});

const resolvePost = req => new Promise(resolve => {
  let chunk = '';
  req.on('data', (data) => {
    chunk += data;
  });
  req.on('end', () => {
    resolve(JSON.parse(chunk));
  })
});

// 合并切片
const mergeFileChunk = async (filePath, filename) => {
  const chunkDir = `${TEMP_DIE}/${filename}`;

  try {
    const chunkPaths = await fse.readdir(chunkDir);
    await fse.writeFile(filePath, "");
    console.log(chunkPaths);
    chunkPaths.forEach(chunkPath => {
      const data = fse.readFileSync(`${chunkDir}/${chunkPath}`);
      // console.log(data);
      fse.appendFileSync(filePath, data);
      fse.unlinkSync(`${chunkDir}/${chunkPath}`);
    });
    fse.rmdirSync(chunkDir);  // 合并后删除目录
  } catch (e) {
    console.log('捕捉错误', e)
  }

};

router.post('/merge', async (req, res, next) => {
  const data = req.body;
  const { filename } = data;
  const filePath = `${UPLOAD_DIR}/${filename}`;
  await mergeFileChunk(filePath, filename);
  res.end(JSON.stringify({
    error_code: 0,
    message: "file merged success"
  }))
})


module.exports = router;
