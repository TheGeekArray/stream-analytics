module.exports = {
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			builderOptions: {
				directories: {
					"buildResources": "public"
				},
				win: {
					"icon": "public/img/icon.png"
				}
			}
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