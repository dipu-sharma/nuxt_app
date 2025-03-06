const scanner = require('sonarqube-scanner').default // Use .default to access the function

scanner(
	{
		serverUrl: 'http://localhost:9000',
		token: 'sqa_45716e73e5e9a7d142b29d263a2828ed04d1df63',
		options: {
			'sonar.projectKey': 'nuxt_project',
			'sonar.projectName': 'Nuxt Frontend',
			'sonar.projectVersion': '1.0.0',
			'sonar.sources': 'src',
			'sonar.exclusions': 'node_modules/**, .nuxt/**, dist/**',
			'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
		},
	},
	() => process.exit(),
)
