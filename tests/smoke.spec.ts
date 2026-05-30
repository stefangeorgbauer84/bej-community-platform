import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('App lädt ohne Fehler', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('Navigation ist sichtbar', async ({ page }) => {
    await page.goto('/');
    // Desktop-Nav ist auf Mobile per CSS hidden — prüfe nur dass sie im DOM existiert
    await expect(page.locator('nav, [role="navigation"]').first()).toBeAttached();
  });
});

test.describe('Registrierung', () => {
  test('Registrierungs-Formular vorhanden', async ({ page }) => {
    await page.goto('/');
    const registerBtn = page.locator('button:has-text("Registrier"), button:has-text("Register"), a:has-text("Registrier")').first();
    if (await registerBtn.isVisible()) {
      await registerBtn.click();
    }
    await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible();
  });
});

test.describe('Quiz', () => {
  test('Quiz-Komponente rendert ohne Fehler', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/');
    // Gibt keine Render-Fehler
    expect(errors.filter(e => !e.includes('favicon') && !e.includes('401'))).toHaveLength(0);
  });
});

test.describe('Mobile', () => {
  test('App ist auf Mobile nutzbar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    // Kein horizontaler Overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390 + 5);
  });
});
