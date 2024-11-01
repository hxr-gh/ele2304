module.exports = {
  //配置插件
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7'] //限制手机版本号
    },
    'postcss-pxtorem': {
      rootValue: 16, //根节点的font-size值
      propList: ['*'], //修改css的全部属性
      selectorBlackList: [':root'] //忽略vant-ui库中使用:root变量名定义的变量
    }
  }
}
