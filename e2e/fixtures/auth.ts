import { test as base, Page } from '@playwright/test';

/**
 * Authenticated Test Fixture
 * Automatically logs in before each test using email/password
 */

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to auth service login page
    await page.goto('http://localhost:6800/login');
    
    // Wait for login form to load
    await page.waitForLoadState('networkidle');
    
        // Fill in email and password using ID selectors
    await page.fill('input#email', 'tony@fusionduotech.com');
    await page.fill('input#password', 'Test123!');
    
    // Wait for navigation to HMS after form submission
    await Promise.all([
      page.waitForURL('http://localhost:6900/**', { timeout: 10000 }),
      page.click('button[type="submit"]'),
    ]);
    
    // Wait for HMS to fully load
    await page.waitForLoadState('networkidle');
    
    // Verify we're on HMS by checking for header or sidebar
    await page.waitForSelector('header, aside, nav', { timeout: 5000 });
    
    await use(page);
  },
});

export { expect } from '@playwright/test';
