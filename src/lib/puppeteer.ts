import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

export async function captureScreenshot(url: string, id: number): Promise<string | null> {
  let browser = null;
  try {
    const previewDir = path.join(process.cwd(), 'public', 'previews');
    
    // Ensure directory exists
    try {
      await fs.access(previewDir);
    } catch {
      await fs.mkdir(previewDir, { recursive: true });
    }

    const fileName = `${id}.jpg`;
    const filePath = path.join(previewDir, fileName);

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Set a reasonable timeout and wait for network to be mostly idle
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    
    // Take a screenshot
    await page.screenshot({ path: filePath, type: 'jpeg', quality: 80 });
    
    return `/previews/${fileName}`;
  } catch (error) {
    console.error('Puppeteer screenshot failed:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
