import { test, expect } from './fixtures/auth';

/**
 * HMS Navigation Tests
 * Verifies that all navigation links work correctly in the iframe architecture
 * Uses authenticated session via fixture
 */

test.describe('HMS Navigation', () => {
  test('should load HMS homepage', async ({ authenticatedPage: page }) => {
    await expect(page).toHaveTitle(/FURFIELD HMS/);
  });

  test('should navigate to Outpatient Appointments', async ({ authenticatedPage: page }) => {
    // Click on Outpatient menu item (which navigates to first child - Appointments)
    await page.click('a:has-text("Outpatient")');
    
    // Wait for navigation
    await page.waitForURL('**/outpatient/**', { timeout: 10000 });
    
    // Check if iframe is loaded
    const iframe = page.frameLocator('iframe[title="Outpatient Service"]');
    await expect(iframe.locator('h1')).toContainText('Appointments', { timeout: 10000 });
  });

  test('should navigate to Finance module', async ({ authenticatedPage: page }) => {
    // Click on Finance menu item
    await page.click('a:has-text("Finance")');
    
    // Wait for navigation
    await page.waitForURL('**/finance**', { timeout: 10000 });
    
    // Check if iframe is loaded - Finance has a dashboard page
    const iframe = page.frameLocator('iframe[title="Finance Service"]');
    await expect(iframe.locator('h1, h2')).toBeVisible({ timeout: 10000 });
  });

  test('should show Coming Soon for HRMS', async ({ authenticatedPage: page }) => {
    // Click on HR menu item (navigation shows "HR" not "HRMS")
    await page.click('a:has-text("HR")');
    
    // Wait for navigation
    await page.waitForURL('**/hr**', { timeout: 10000 });
    
    // Check for Coming Soon message
    const iframe = page.frameLocator('iframe[title="HR Service"]');
    await expect(iframe.locator('text=Coming Soon')).toBeVisible({ timeout: 10000 });
  });

  test('should display header with user info', async ({ authenticatedPage: page }) => {
    // Check if header is visible
    await expect(page.locator('header')).toBeVisible();
    
    // Check for FURFIELD HMS logo/title
    await expect(page.locator('text=FURFIELD')).toBeVisible();
  });

  test('should display sidebar navigation', async ({ authenticatedPage: page }) => {
    // Check if sidebar (aside element) is visible - use .first() to avoid strict mode
    await expect(page.locator('aside').first()).toBeVisible();
    
    // Check for main navigation items using more specific selectors
    await expect(page.locator('aside a:has-text("Dashboard")').first()).toBeVisible();
    await expect(page.locator('aside a:has-text("Outpatient")').first()).toBeVisible();
    await expect(page.locator('aside a:has-text("Finance")').first()).toBeVisible();
  });
});
