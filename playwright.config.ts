import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	timeout: 20000,
	retries: 0,
	use: {
		baseURL: 'http://localhost:5179',
		headless: true,
		screenshot: 'only-on-failure',
		video: 'off',
	},
	projects: [
		{ name: 'chromium', use: { browserName: 'chromium' } }
	],
	webServer: {
		command: 'npm run dev -- --port 5179',
		url: 'http://localhost:5179',
		reuseExistingServer: false,
		timeout: 30000,
	},
	reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
});
