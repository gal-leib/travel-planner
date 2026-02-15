import { test, expect } from '@playwright/test';

// The Radix ScrollArea viewport is the actual scrollable element
const SCROLL_VIEWPORT = '[data-slot="scroll-area-viewport"]';

test.describe('Mobile navigation', () => {
  test('should show timeline by default and hide chat', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('timeline-panel')).toBeVisible();
    await expect(page.getByTestId('chat-panel')).not.toBeVisible();
  });

  test('should switch to chat panel via nav', async ({ page }) => {
    await page.goto('/');

    // The mobile nav is a <nav> element at the bottom
    await page.locator('nav').getByRole('button', { name: /chat/i }).click();

    await expect(page.getByTestId('chat-panel')).toBeVisible();
    await expect(page.getByTestId('timeline-panel')).not.toBeVisible();
  });

  test('should switch back to timeline from chat', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav');
    await nav.getByRole('button', { name: /chat/i }).click();
    await expect(page.getByTestId('chat-panel')).toBeVisible();

    await nav.getByRole('button', { name: /timeline/i }).click();
    await expect(page.getByTestId('timeline-panel')).toBeVisible();
    await expect(page.getByTestId('chat-panel')).not.toBeVisible();
  });
});

test.describe('Daily view navigation', () => {
  test('should show Day 1 activities on load', async ({ page }) => {
    await page.goto('/');

    const timeline = page.getByTestId('timeline-panel');
    await expect(timeline.getByText('Arrive at Narita Airport')).toBeVisible();
    // Day 2 content should NOT be in viewport (it's on a different page)
    await expect(timeline.getByText('Sunrise at Tsukiji Outer Market')).not.toBeInViewport();
  });

  test('should show day pill bar with correct labels', async ({ page }) => {
    await page.goto('/');

    const timeline = page.getByTestId('timeline-panel');
    await expect(timeline.getByRole('button', { name: 'Mon 12' })).toBeVisible();
    await expect(timeline.getByRole('button', { name: 'Tue 13' })).toBeVisible();
  });

  test('should switch to Day 2 when tapping its pill', async ({ page }) => {
    await page.goto('/');

    const timeline = page.getByTestId('timeline-panel');
    await timeline.getByRole('button', { name: 'Tue 13' }).click();

    // Day 2 content appears
    await expect(timeline.getByText('Sunrise at Tsukiji Outer Market')).toBeInViewport();
    // Day 1 content is gone
    await expect(timeline.getByText('Arrive at Narita Airport')).not.toBeInViewport();
  });

  test('should switch to last day via pill', async ({ page }) => {
    await page.goto('/');

    const timeline = page.getByTestId('timeline-panel');
    await timeline.getByRole('button', { name: 'Sun 18' }).click();

    await expect(timeline.getByText('Depart from Narita Airport')).toBeVisible();
  });
});

test.describe('Chat scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('nav').getByRole('button', { name: /chat/i }).click();
  });

  test('should display chat messages', async ({ page }) => {
    await expect(page.getByText('AI Trip Assistant')).toBeVisible();
    await expect(page.getByText(/best way to get from Narita/)).toBeVisible();
  });

  test('chat content should overflow the viewport', async ({ page }) => {
    const viewport = page.getByTestId('chat-panel').locator(SCROLL_VIEWPORT);
    const { scrollHeight, clientHeight } = await viewport.evaluate(el => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));

    expect(scrollHeight).toBeGreaterThan(clientHeight);
  });

  test('should scroll to reveal later messages', async ({ page }) => {
    const lastMessage = page.getByText(/teamLab Borderless is amazing/);
    await expect(lastMessage).not.toBeInViewport();

    const viewport = page.getByTestId('chat-panel').locator(SCROLL_VIEWPORT);
    await viewport.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });

    await expect(lastMessage).toBeInViewport();
  });

  test('should show new message after sending', async ({ page }) => {
    const input = page.getByPlaceholder('Ask about your trip...');
    await input.fill('What about Kyoto?');
    // The send button is an icon-only button next to the input
    await input.press('Enter');

    await expect(page.getByText('What about Kyoto?')).toBeVisible();
  });
});

test.describe('Activity details', () => {
  test('should display activity time, title, and description', async ({ page }) => {
    await page.goto('/');

    const timeline = page.getByTestId('timeline-panel');
    await expect(timeline.getByText('Arrive at Narita Airport')).toBeVisible();
    await expect(timeline.getByText(/Pick up JR Pass/)).toBeVisible();
  });

  test('should show JUST ADDED badge', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('JUST ADDED')).toBeVisible();
  });
});
