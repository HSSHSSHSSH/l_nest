const express = require('express')
const multer = require('multer')
const cors = require('cors')

const app = express()
app.use(cors())

const upload = multer({ dest: 'uploads/' })

app.post('/aaa', upload.single('aaa'), function (req, res, next) {
  console.log('req.file', req.file)
  console.log('req.body', req.body)
  res.status(200).send('一个文件');  // 返回带有成功信息的响应
})

app.post('/bbb', upload.array('bbb', 2), function (req, res, next) {
  console.log('req.file', req.files)
  console.log('req.body', req.body)
  res.status(200).send('2个文件');  // 返回带有成功信息的响应
})

app.listen(3333, () => {
  console.log('服务运行在 3333 端口')
})
