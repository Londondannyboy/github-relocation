import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Cache directory
const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Initialize cache directory
async function initCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

// Generate cache key from input
function getCacheKey(type, identifier) {
  const hash = crypto.createHash('md5').update(`${type}:${identifier}`).digest('hex');
  return `${type}_${hash}.json`;
}

// Get cached data
export async function getCache(type, identifier) {
  await initCacheDir();
  
  const cacheKey = getCacheKey(type, identifier);
  const cachePath = path.join(CACHE_DIR, cacheKey);
  
  try {
    const cacheFile = await fs.readFile(cachePath, 'utf-8');
    const cacheData = JSON.parse(cacheFile);
    
    // Check if cache is expired
    const now = Date.now();
    if (now - cacheData.timestamp > CACHE_EXPIRY) {
      console.log(`Cache expired for ${type}:${identifier}`);
      return null;
    }
    
    console.log(`Cache hit for ${type}:${identifier}`);
    return cacheData.data;
  } catch (error) {
    console.log(`Cache miss for ${type}:${identifier}`);
    return null;
  }
}

// Set cache data
export async function setCache(type, identifier, data) {
  await initCacheDir();
  
  const cacheKey = getCacheKey(type, identifier);
  const cachePath = path.join(CACHE_DIR, cacheKey);
  
  const cacheData = {
    timestamp: Date.now(),
    type,
    identifier,
    data
  };
  
  await fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2));
  console.log(`Cache set for ${type}:${identifier}`);
}

// Cache wrapper for API calls
export async function withCache(type, identifier, fetchFunction) {
  // Try to get from cache first
  const cached = await getCache(type, identifier);
  if (cached) {
    return cached;
  }
  
  // Fetch fresh data
  const data = await fetchFunction();
  
  // Store in cache
  await setCache(type, identifier, data);
  
  return data;
}

// Specific cache functions for different data types

// Cache competitor content
export async function cacheCompetitorContent(url, content) {
  return setCache('competitor', url, {
    url,
    content,
    scrapedAt: new Date().toISOString()
  });
}

// Get cached competitor content
export async function getCachedCompetitor(url) {
  return getCache('competitor', url);
}

// Cache SERP results
export async function cacheSERPResults(keyword, results) {
  return setCache('serp', keyword, {
    keyword,
    results,
    searchedAt: new Date().toISOString()
  });
}

// Get cached SERP results
export async function getCachedSERP(keyword) {
  return getCache('serp', keyword);
}

// Cache keyword metrics
export async function cacheKeywordMetrics(keyword, metrics) {
  return setCache('metrics', keyword, {
    keyword,
    searchVolume: metrics.searchVolume,
    cpc: metrics.cpc,
    difficulty: metrics.difficulty,
    fetchedAt: new Date().toISOString()
  });
}

// Get cached keyword metrics
export async function getCachedMetrics(keyword) {
  return getCache('metrics', keyword);
}

// Cache statistics
export async function getCacheStats() {
  await initCacheDir();
  
  const files = await fs.readdir(CACHE_DIR);
  const stats = {
    totalFiles: files.length,
    competitors: 0,
    serp: 0,
    metrics: 0,
    totalSize: 0
  };
  
  for (const file of files) {
    const filePath = path.join(CACHE_DIR, file);
    const stat = await fs.stat(filePath);
    stats.totalSize += stat.size;
    
    if (file.startsWith('competitor_')) stats.competitors++;
    else if (file.startsWith('serp_')) stats.serp++;
    else if (file.startsWith('metrics_')) stats.metrics++;
  }
  
  stats.totalSizeMB = (stats.totalSize / 1024 / 1024).toFixed(2);
  
  return stats;
}

// Clear expired cache
export async function clearExpiredCache() {
  await initCacheDir();
  
  const files = await fs.readdir(CACHE_DIR);
  const now = Date.now();
  let cleared = 0;
  
  for (const file of files) {
    const filePath = path.join(CACHE_DIR, file);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      if (now - data.timestamp > CACHE_EXPIRY) {
        await fs.unlink(filePath);
        cleared++;
      }
    } catch (error) {
      console.error(`Error processing cache file ${file}:`, error);
    }
  }
  
  console.log(`Cleared ${cleared} expired cache files`);
  return cleared;
}

// Export cache utilities
export default {
  withCache,
  cacheCompetitorContent,
  getCachedCompetitor,
  cacheSERPResults,
  getCachedSERP,
  cacheKeywordMetrics,
  getCachedMetrics,
  getCacheStats,
  clearExpiredCache
};