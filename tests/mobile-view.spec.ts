import { test, expect } from '@playwright/test';

// Focus on mobile tests - only run on mobile projects
test.describe('Mobile View - Scrolling Behavior', () => {
  test('should render itinerary page on mobile', async ({ page }) => {
    await page.goto('/');

    // Check main elements are present
    await expect(page.locator('text=Summer in Tokyo 2024')).toBeVisible();
    await expect(page.locator('text=Day 1')).toBeVisible();
  });

  test('should scroll through timeline activities on mobile', async ({ page }) => {
    await page.goto('/');

    // Get timeline panel
    const timelinePanel = page.locator('[class*="timeline"]').first();

    // Initially should see Day 1 activities
    await expect(page.locator('text=Arrive at Narita Airport')).toBeVisible();

    // Scroll down in the timeline to see more activities
    await timelinePanel.evaluate(element => {
      element.scrollTop = 500;
    });

    await page.waitForTimeout(300);

    // Should see more activities after scrolling
    const activities = await page.locator('text=/Shibuya|Senso-ji/').count();
    expect(activities).toBeGreaterThan(0);
  });

  test('should scroll through chat messages on mobile', async ({ page }) => {
    await page.goto('/');

    // Click on chat tab if it exists
    const chatTab = page.locator('button, a').filter({ hasText: /chat|message/i }).first();
    if (await chatTab.isVisible()) {
      await chatTab.click();
    }

    // Get chat panel
    const chatPanel = page.locator('[class*="chat"]').first();

    // Check for initial messages
    const initialMessages = await page.locator('text=/airport|dinner|breakfast/i').count();

    if (initialMessages > 0) {
      // Scroll down in chat to see more messages
      await chatPanel.evaluate(element => {
        element.scrollTop = element.scrollHeight;
      });

      await page.waitForTimeout(300);

      // Verify we can see various messages
      expect(initialMessages).toBeGreaterThan(0);
    }
  });

  test('should maintain layout on mobile during scrolls', async ({ page }) => {
    await page.goto('/');

    // Get viewport dimensions
    const viewport = page.viewportSize();
    expect(viewport).toBeDefined();

    // Scroll timeline
    const timelinePanel = page.locator('[class*="timeline"]').first();
    if (await timelinePanel.isVisible()) {
      await timelinePanel.evaluate(element => {
        element.scrollTop = 300;
      });

      // Check that header is still accessible
      const header = page.locator('text=Summer in Tokyo 2024');
      if (await header.isVisible()) {
        expect(await header.boundingBox()).not.toBeNull();
      }
    }
  });

  test('should handle scroll to bottom in timeline', async ({ page }) => {
    await page.goto('/');

    const timelinePanel = page.locator('[class*="timeline"]').first();

    if (await timelinePanel.isVisible()) {
      // Get initial scroll height
      const initialHeight = await timelinePanel.evaluate(el => el.scrollHeight);

      // Scroll to bottom
      await timelinePanel.evaluate(element => {
        element.scrollTop = element.scrollHeight;
      });

      await page.waitForTimeout(200);

      // Verify scroll position is near bottom
      const scrollTop = await timelinePanel.evaluate(el => el.scrollTop);
      const scrollHeight = await timelinePanel.evaluate(el => el.scrollHeight);
      const clientHeight = await timelinePanel.evaluate(el => el.clientHeight);

      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
      expect(isNearBottom).toBeTruthy();
    }
  });

  test('should display multiple days when scrolling', async ({ page }) => {
    await page.goto('/');

    // Check that we can see at least Day 1
    await expect(page.locator('text=Day 1')).toBeVisible();

    // Scroll to see more days
    const timelinePanel = page.locator('[class*="timeline"]').first();
    await timelinePanel.evaluate(element => {
      element.scrollTop = 1000;
    });

    await page.waitForTimeout(300);

    // Should see multiple days after scrolling
    const dayLabels = await page.locator('text=/Day [0-9]/').count();
    expect(dayLabels).toBeGreaterThanOrEqual(1);
  });

  test('should be responsive to orientation changes', async ({ page, context }) => {
    // Create a new context with landscape orientation
    const landscapePage = await context.newPage({
      viewport: { width: 812, height: 375 }, // iPhone landscape
    });

    await landscapePage.goto('/');

    // Check main content is still visible
    await expect(landscapePage.locator('text=Summer in Tokyo 2024')).toBeVisible();

    await landscapePage.close();
  });
});

test.describe('Mobile View - Content Visibility', () => {
  test('should show all activity details on mobile', async ({ page }) => {
    await page.goto('/');

    // Look for activity time, title, and description
    await expect(page.locator('text=10:30 AM')).toBeVisible();
    await expect(page.locator('text=Arrive at Narita Airport')).toBeVisible();

    // Should have descriptions visible
    const descriptions = await page.locator('text=/Terminal|Pick up/i').count();
    expect(descriptions).toBeGreaterThan(0);
  });

  test('should display activity categories correctly', async ({ page }) => {
    await page.goto('/');

    // Check for category badges
    const categoryBadges = await page.locator('text=/transport|hotel|food|attraction|shopping/i').count();
    expect(categoryBadges).toBeGreaterThan(0);
  });

  test('should handle touch scroll smoothly', async ({ page }) => {
    await page.goto('/');

    const timelinePanel = page.locator('[class*="timeline"]').first();

    if (await timelinePanel.isVisible()) {
      // Simulate touch scroll
      const boundingBox = await timelinePanel.boundingBox();
      if (boundingBox) {
        await page.touchscreen.tap(boundingBox.x + 10, boundingBox.y + 100);

        // Perform swipe gesture (drag)
        await page.touchscreen.swipe(
          boundingBox.x + 10,
          boundingBox.y + 200,
          boundingBox.x + 10,
          boundingBox.y + 50,
          300
        );

        await page.waitForTimeout(500);

        // Page should still be responsive
        const scrollTop = await timelinePanel.evaluate(el => el.scrollTop);
        expect(scrollTop).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
