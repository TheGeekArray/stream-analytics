module.exports = {
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
		},
	},
	chainWebpack: config => {
        config
        .plugin('html')
        .tap(args => {
			args[0].title = 'Stream Analytics';
			return args;
        })
      }
};