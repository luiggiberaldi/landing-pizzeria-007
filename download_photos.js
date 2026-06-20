const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper function to download an image from a URL
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed with status: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// Function to extract unique filename identifier from a Facebook CDN URL
function getUniqueId(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');
    return parts[parts.length - 1];
  } catch (e) {
    return url;
  }
}

// Clean up the Facebook CDN URL to get the high-resolution version
function cleanCdnUrl(url) {
  try {
    const urlObj = new URL(url);
    // Remove the ctp parameter which specifies thumbnail size
    urlObj.searchParams.delete('ctp');
    return urlObj.toString();
  } catch (e) {
    return url;
  }
}

async function run() {
  const destDir = path.join(__dirname, 'assets', 'instagram');
  console.log(`Target directory: ${destDir}`);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log('Created directory assets/instagram');
  }

  console.log('Launching Playwright browser (Chromium)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'es-ES',
    viewport: { width: 1280, height: 1000 }
  });

  const page = await context.newPage();
  console.log('Navigating to Pizzería 007 page...');
  
  try {
    await page.goto('https://www.facebook.com/p/pizzeria007-100083463875552/', { waitUntil: 'networkidle', timeout: 35000 });
    console.log('Page loaded successfully.');
    await page.waitForTimeout(4000);

    // 1. Extract Profile Photo URL (looking for SVG <image> elements with width/height near 168)
    console.log('Locating profile picture...');
    const svgImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('image')).map(img => {
        const rect = img.getBoundingClientRect();
        return {
          href: img.getAttribute('href') || img.getAttribute('xlink:href') || '',
          width: rect.width,
          height: rect.height
        };
      });
    });

    const profilePic = svgImages.find(img => img.width > 100 && img.width < 200 && img.href.includes('fbcdn.net'));
    if (profilePic) {
      const cleanedProfileUrl = cleanCdnUrl(profilePic.href);
      const profilePath = path.join(destDir, 'profile.jpg');
      console.log(`Found profile picture! Downloading high-res version to profile.jpg...`);
      try {
        await downloadImage(cleanedProfileUrl, profilePath);
        console.log(`Successfully downloaded profile.jpg (${fs.statSync(profilePath).size} bytes)`);
      } catch (err) {
        console.error('Failed to download profile picture, using fallback...', err.message);
      }
    } else {
      console.log('Profile picture not found in SVG tags.');
    }

    // 2. Scroll multiple times to load plenty of post photos
    console.log('Scrolling down to load more posts (getting at least 12 photos)...');
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await page.waitForTimeout(2500);
    }

    // 3. Extract all image elements
    const imagesData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => {
        const rect = img.getBoundingClientRect();
        return {
          src: img.src || '',
          width: rect.width,
          height: rect.height
        };
      });
    });

    console.log(`Extracted a total of ${imagesData.length} img tags.`);

    // 4. Filter and clean URLs
    const postUrlsMap = new Map();
    for (const img of imagesData) {
      const src = img.src;
      if (!src || !src.includes('fbcdn.net')) continue;
      // Filter out small icons and Facebook UI assets
      if (src.includes('/rsrc.php/') || src.includes('FBLogo') || src.includes('facebook.com/images')) continue;
      if (img.width < 40 || img.height < 40) continue;

      const uniqueId = getUniqueId(src);
      const cleanedUrl = cleanCdnUrl(src);
      
      // We only insert if not already present to guarantee uniqueness
      if (!postUrlsMap.has(uniqueId)) {
        postUrlsMap.set(uniqueId, cleanedUrl);
      }
    }

    const uniquePostUrls = Array.from(postUrlsMap.values());
    console.log(`Found ${uniquePostUrls.length} unique post images.`);

    // 5. Download the first 12 images
    const imagesToDownload = uniquePostUrls.slice(0, 12);
    console.log(`Downloading ${imagesToDownload.length} post images in high-resolution...`);
    
    for (let i = 0; i < imagesToDownload.length; i++) {
      const url = imagesToDownload[i];
      const filename = `foto-${String(i + 1).padStart(2, '0')}.jpg`;
      const destPath = path.join(destDir, filename);
      
      console.log(`Downloading ${filename}...`);
      try {
        await downloadImage(url, destPath);
        console.log(`Downloaded ${filename} successfully. Size: ${fs.statSync(destPath).size} bytes`);
      } catch (err) {
        console.error(`Failed to download ${filename}:`, err.message);
      }
    }

    console.log('\n--- PHOTO DOWNLOAD COMPLETED ---');
    console.log(`All photos downloaded to: ${destDir}`);
    const files = fs.readdirSync(destDir);
    console.log('Files in directory:', files);

  } catch (error) {
    console.error('An error occurred during execution:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
