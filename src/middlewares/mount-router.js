import fs from 'fs'
import path from 'path'

export default {
  configure: (routePath, options) => {
    const files = fs.readdirSync(routePath)
    files.forEach(f => {
      // console.log(msg)
      // 通过 require 函数加载模块中通过 export default 暴露的接口对象，必须通过 default 属性去获取
      const modulePath = path.join(routePath, f)
      require(modulePath).default && options.express.use(require(modulePath).default)
    })
  }
}
