import { test, expect } from './fixtures/auth';

/**
 * Clinical Workflow Tests
 * Tests end-to-end clinical workflows across microservices
 * Uses authenticated session via fixture
 */

test.describe('Outpatient Workflow', () => {
  test('should display appointments page', async ({ authenticatedPage: page }) => {
    await page.goto('/outpatient/appointments');
    
    const iframe = page.frameLocator('iframe[title="Outpatient Service"]');
    
    // Check for main heading
    await expect(iframe.locator('h1')).toContainText('Appointments', { timeout: 10000 });
    
    // Check for search filters
    await expect(iframe.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Check for status filter
    await expect(iframe.locator('select')).toBeVisible();
  });

  test('should have "New Appointment" button', async ({ authenticatedPage: page }) => {
    await page.goto('/outpatient/appointments');
    
    const iframe = page.frameLocator('iframe[title="Outpatient Service"]');
    
    // Check for New Appointment button
    await expect(iframe.locator('button:has-text("New Appointment")')).toBeVisible({ timeout: 10000 });
  });

  test('should display appointments table or loading state', async ({ authenticatedPage: page }) => {
    await page.goto('/outpatient/appointments');
    
    const iframe = page.frameLocator('iframe[title="Outpatient Service"]');
    
    // Either loading spinner or table should be visible
    const loadingVisible = await iframe.locator('.animate-spin').isVisible({ timeout: 5000 }).catch(() => false);
    const tableVisible = await iframe.locator('table').isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(loadingVisible || tableVisible).toBeTruthy();
  });
});

test.describe('Finance Workflow', () => {
  test('should display Finance dashboard', async ({ authenticatedPage: page }) => {
    await page.goto('/finance/dashboard');
    
    const iframe = page.frameLocator('iframe[title="Finance Service"]');
    
    // Check for dashboard elements
    await expect(iframe.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to Books section', async ({ authenticatedPage: page }) => {
    await page.goto('/finance/books');
    
    const iframe = page.frameLocator('iframe[title="Finance Service"]');
    
    // Check for Books content
    await expect(iframe.locator('h1, h2')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Coming Soon Services', () => {
  const comingSoonServices = [
    { name: 'HR', path: '/hr' },
    { name: 'Rostering', path: '/rostering' },
    { name: 'Purchasing', path: '/purchasing' },
  ];

  for (const service of comingSoonServices) {
    test(`${service.name} should show Coming Soon page`, async ({ authenticatedPage: page }) => {
      await page.goto(service.path);
      
      const iframe = page.frameLocator(`iframe[title="${service.name} Service"]`);
      
      // Check for Coming Soon message
      await expect(iframe.locator('text=Coming Soon')).toBeVisible({ timeout: 10000 });
      await expect(iframe.locator('text=🚧')).toBeVisible();
    });
  }
});
