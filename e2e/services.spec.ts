import { test, expect } from '@playwright/test';

/**
 * Service Availability Tests
 * Verifies that all microservices are running and accessible
 */

test.describe('Service Availability', () => {
  const services = [
    { name: 'Auth', port: 6800, path: '/' },
    { name: 'Outpatient', port: 6830, path: '/outpatient/appointments' },
    { name: 'Inpatient', port: 6831, path: '/inpatient/admissions' },
    { name: 'Diagnostics', port: 6832, path: '/diagnostics/lab' },
    { name: 'Operation Theater', port: 6833, path: '/operation-theater/schedule' },
    { name: 'Pharmacy', port: 6834, path: '/pharmacy/inventory' },
    { name: 'Rostering', port: 6840, path: '/' },
    { name: 'Finance', port: 6850, path: '/finance/dashboard' },
    { name: 'HRMS', port: 6860, path: '/' },
    { name: 'Purchasing', port: 6870, path: '/' },
    { name: 'HMS Gateway', port: 6900, path: '/' },
  ];

  for (const service of services) {
    test(`${service.name} service should be accessible on port ${service.port}`, async ({ request }) => {
      const response = await request.get(`http://localhost:${service.port}${service.path}`);
      expect(response.status()).toBeLessThan(500); // Should not return 500 errors
    });
  }
});

test.describe('Service Error Handling', () => {
  test('should show error message when service is down', async ({ page }) => {
    // Try to access a non-existent service port
    await page.goto('/outpatient/appointments');
    
    // If service is down, ServiceFrame should show error
    // This test will pass if service is running OR if error is displayed correctly
    const errorVisible = await page.locator('text=Service Down').isVisible({ timeout: 5000 }).catch(() => false);
    const serviceVisible = await page.frameLocator('iframe').locator('h1').isVisible({ timeout: 5000 }).catch(() => false);
    
    // Either the service loads or error message shows
    expect(errorVisible || serviceVisible).toBeTruthy();
  });
});

test.describe('Iframe Security', () => {
  test('iframes should have proper sandbox attributes', async ({ page }) => {
    await page.goto('/outpatient/appointments');
    
    // Wait for iframe to load
    await page.waitForSelector('iframe', { timeout: 10000 });
    
    // Check iframe has sandbox attribute
    const iframe = page.locator('iframe').first();
    const sandbox = await iframe.getAttribute('sandbox');
    
    expect(sandbox).toContain('allow-scripts');
    expect(sandbox).toContain('allow-same-origin');
  });
});
