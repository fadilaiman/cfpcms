import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5179';
const ADMIN_EMAIL = 'acidfb01@gmail.com';
const ADMIN_PASSWORD = 'j4g4d4t4SUPABASE';

// ─── helpers ────────────────────────────────────────────────────────────────

async function collectErrors(page: Page) {
	const errors: string[] = [];
	page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
	page.on('pageerror', (err) => errors.push(err.message));
	return () => errors;
}

async function login(page: Page) {
	await page.goto(`${BASE}/login`);
	await page.fill('input[name="email"]', ADMIN_EMAIL);
	await page.fill('input[name="password"]', ADMIN_PASSWORD);
	await page.click('button[type="submit"]');
	await page.waitForURL(`${BASE}/admin`, { timeout: 10000 });
}

// ─── Shop pages ──────────────────────────────────────────────────────────────

test('homepage loads', async ({ page }) => {
	const errs = await collectErrors(page);
	await page.goto(BASE);
	await expect(page).toHaveTitle(/My Shop/);
	await expect(page.getByRole('banner')).toBeVisible(); // header
	await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
	expect(errs()).toHaveLength(0);
});

test('products page loads', async ({ page }) => {
	await page.goto(`${BASE}/products`);
	await expect(page).toHaveTitle(/Products/);
	await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
});

test('cart page loads empty', async ({ page }) => {
	await page.goto(`${BASE}/cart`);
	await expect(page).toHaveTitle(/Cart/);
	await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
	await expect(page.getByText('Your cart is empty')).toBeVisible();
});

test('checkout page shows empty cart state', async ({ page }) => {
	await page.goto(`${BASE}/checkout`);
	const body = await page.locator('body').innerText();
	expect(body).not.toContain('500');
	expect(body).not.toContain('Internal Error');
});

test('checkout success — paid (status 1)', async ({ page }) => {
	await page.goto(`${BASE}/checkout/success?status_id=1&billcode=testbill`);
	await expect(page).toHaveTitle(/Order Confirmation/);
	await expect(page.getByRole('heading', { name: 'Payment Successful!' })).toBeVisible();
});

test('checkout success — pending (status 2)', async ({ page }) => {
	await page.goto(`${BASE}/checkout/success?status_id=2&billcode=testbill`);
	await expect(page.getByRole('heading', { name: 'Payment Pending' })).toBeVisible();
});

test('checkout success — failed (status 3)', async ({ page }) => {
	await page.goto(`${BASE}/checkout/success?status_id=3&billcode=testbill`);
	await expect(page.getByRole('heading', { name: 'Payment Failed' })).toBeVisible();
});

// ─── Auth ────────────────────────────────────────────────────────────────────

test('login page loads', async ({ page }) => {
	await page.goto(`${BASE}/login`);
	await expect(page).toHaveTitle(/Admin Login/);
	await expect(page.locator('input[name="email"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
});

test('login with wrong password shows error', async ({ page }) => {
	await page.goto(`${BASE}/login`);
	await page.fill('input[name="email"]', 'wrong@email.com');
	await page.fill('input[name="password"]', 'wrongpass');
	await page.click('button[type="submit"]');
	await expect(page.getByText('Invalid email or password')).toBeVisible({ timeout: 8000 });
});

test('admin redirects to login when not authenticated', async ({ page }) => {
	await page.goto(`${BASE}/admin`);
	await expect(page).toHaveURL(/\/login/);
});

// ─── Admin pages ─────────────────────────────────────────────────────────────

test('admin login and dashboard load', async ({ page }) => {
	const errs = await collectErrors(page);
	await login(page);
	await expect(page).toHaveURL(`${BASE}/admin`);
	await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
	await expect(page.getByText('Total Orders')).toBeVisible();
	await expect(page.getByText('Total Revenue')).toBeVisible();
	expect(errs()).toHaveLength(0);
});

test('admin products page loads', async ({ page }) => {
	await login(page);
	await page.goto(`${BASE}/admin/products`);
	await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
	await expect(page.getByRole('link', { name: '+ Add Product' })).toBeVisible();
});

test('admin new product form loads', async ({ page }) => {
	await login(page);
	await page.goto(`${BASE}/admin/products/new`);
	await expect(page.getByRole('heading', { name: 'New Product' })).toBeVisible();
	await expect(page.locator('input[name="name"]')).toBeVisible();
	await expect(page.locator('input[name="price"]')).toBeVisible();
	await expect(page.locator('select[name="type"]')).toBeVisible();
});

test('admin can create a product', async ({ page }) => {
	await login(page);

	// Clean up test product from any prior run so the test is idempotent
	await page.goto(`${BASE}/admin/products`);
	page.on('dialog', (d) => d.accept());
	const existingRow = page.getByRole('row').filter({ hasText: 'Test Product Playwright' });
	if (await existingRow.count() > 0) {
		await existingRow.getByRole('button', { name: 'Delete' }).click();
		await expect(existingRow).not.toBeVisible({ timeout: 5000 });
	}

	await page.goto(`${BASE}/admin/products/new`);
	await page.fill('input[name="name"]', 'Test Product Playwright');
	await page.fill('input[name="price"]', '9.90');
	await page.fill('textarea[name="description"]', 'A test product created by Playwright');
	await page.selectOption('select[name="type"]', 'physical');
	await page.fill('input[name="stock"]', '10');
	await page.getByRole('button', { name: 'Create Product' }).click();
	await expect(page).toHaveURL(`${BASE}/admin/products`, { timeout: 10000 });
	await expect(page.getByText('Test Product Playwright')).toBeVisible();
});

test('admin orders page loads', async ({ page }) => {
	await login(page);
	await page.goto(`${BASE}/admin/orders`);
	await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
});

test('admin promos page loads', async ({ page }) => {
	await login(page);
	await page.goto(`${BASE}/admin/promos`);
	await expect(page.getByRole('heading', { name: 'Promo Codes' })).toBeVisible();
	await expect(page.locator('input[name="code"]')).toBeVisible();
});

test('admin can create a promo code', async ({ page }) => {
	await login(page);
	await page.goto(`${BASE}/admin/promos`);
	await page.fill('input[name="code"]', 'PWTEST20');
	await page.selectOption('select[name="type"]', 'percentage');
	await page.fill('input[name="value"]', '20');
	await page.getByRole('button', { name: 'Create Promo' }).click();
	await expect(page.getByText('PWTEST20')).toBeVisible({ timeout: 8000 });
});

// ─── Cart flow ───────────────────────────────────────────────────────────────

test('product appears in shop after admin creation', async ({ page }) => {
	await page.goto(`${BASE}/products`);
	const productLinks = page.getByRole('link', { name: /test product playwright/i });
	await expect(productLinks.first()).toBeVisible({ timeout: 5000 });
});

test('can add product to cart', async ({ page }) => {
	await page.goto(`${BASE}/products/test-product-playwright`);
	await page.waitForLoadState('networkidle');
	await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible();
	await page.getByRole('button', { name: 'Add to Cart' }).click();
	await expect(page.getByRole('button', { name: 'Added!' })).toBeVisible({ timeout: 3000 });
});

test('404 page for unknown product slug', async ({ page }) => {
	const response = await page.goto(`${BASE}/products/nonexistent-product-xyz`);
	expect(response?.status()).toBe(404);
});
