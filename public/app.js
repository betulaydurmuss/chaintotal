/**
 * ChainTotal Web UI - Frontend JavaScript
 * Connects to REST API and provides interactive interface
 */

// Configuration
const API_BASE_URL = window.location.origin;
const USER_WALLET = 'GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ'; // Demo wallet

// State
let isAnalyzing = false;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeBtnText = document.getElementById('analyzeBtnText');
const analyzeBtnSpinner = document.getElementById('analyzeBtnSpinner');
const resultsSection = document.getElementById('resultsSection');
const resultsContent = document.getElementById('resultsContent');

// Stats elements
const queriesToday = document.getElementById('queriesToday');
const successRate = document.getElementById('successRate');
const cacheHitRate = document.getElementById('cacheHitRate');
const analyticsContent = document.getElementById('analyticsContent');
const revenueContent = document.getElementById('revenueContent');

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Analyze an asset
 */
async function analyzeAsset(query) {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      userWallet: USER_WALLET
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get platform analytics
 */
async function getAnalytics() {
  const response = await fetch(`${API_BASE_URL}/api/analytics`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Get revenue statistics
 */
async function getRevenue() {
  const response = await fetch(`${API_BASE_URL}/api/revenue`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Get fraud detection status
 */
async function getFraudStatus() {
  const response = await fetch(`${API_BASE_URL}/api/fraud`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Check health status
 */
async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// ============================================
// UI FUNCTIONS
// ============================================

/**
 * Show loading state
 */
function showLoading() {
  isAnalyzing = true;
  analyzeBtn.disabled = true;
  analyzeBtnText.classList.add('hidden');
  analyzeBtnSpinner.classList.remove('hidden');
}

/**
 * Hide loading state
 */
function hideLoading() {
  isAnalyzing = false;
  analyzeBtn.disabled = false;
  analyzeBtnText.classList.remove('hidden');
  analyzeBtnSpinner.classList.add('hidden');
}

/**
 * Display analysis results
 */
function displayResults(result) {
  resultsSection.classList.remove('hidden');
  resultsSection.classList.add('fade-in-up');
  
  const formattedResult = {
    success: result.success,
    response: result.response,
    executionTime: `${result.executionTime}ms`,
    toolCalls: result.toolCalls,
    timestamp: new Date().toLocaleString('tr-TR')
  };
  
  resultsContent.textContent = JSON.stringify(formattedResult, null, 2);
  
  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Display error message
 */
function displayError(error) {
  resultsSection.classList.remove('hidden');
  resultsSection.classList.add('fade-in-up');
  
  resultsContent.textContent = `❌ Hata: ${error.message}\n\nLütfen tekrar deneyin veya farklı bir sorgu girin.`;
  resultsContent.style.color = '#FF0055';
  
  setTimeout(() => {
    resultsContent.style.color = '';
  }, 3000);
}

/**
 * Update analytics display
 */
function updateAnalytics(data) {
  queriesToday.textContent = data.totalQueries || 0;
  successRate.textContent = `${Math.round(data.paymentSuccessRate || 0)}%`;
  cacheHitRate.textContent = `${Math.round(data.cacheHitRate || 0)}%`;
  
  // Update analytics card
  analyticsContent.innerHTML = `
    <div class="space-y-2">
      <div class="flex justify-between">
        <span class="text-gray-400">Toplam Sorgu:</span>
        <span class="font-semibold text-cyan-400">${data.totalQueries || 0}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Ödeme Başarı Oranı:</span>
        <span class="font-semibold text-green-400">${Math.round(data.paymentSuccessRate || 0)}%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Cache Hit Oranı:</span>
        <span class="font-semibold text-purple-400">${Math.round(data.cacheHitRate || 0)}%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Ortalama İşlem Süresi:</span>
        <span class="font-semibold text-yellow-400">${Math.round(data.averageProcessingTime || 0)}ms</span>
      </div>
    </div>
  `;
}

/**
 * Update revenue display
 */
function updateRevenue(data) {
  revenueContent.innerHTML = `
    <div class="space-y-2">
      <div class="flex justify-between">
        <span class="text-gray-400">Toplam Gelir:</span>
        <span class="font-semibold text-cyan-400">${data.totalRevenue || 0} x402</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Kullanıcı Başına Ortalama:</span>
        <span class="font-semibold text-green-400">${(data.averageQueriesPerUser || 0).toFixed(2)} sorgu</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Ödeme Başarı Oranı:</span>
        <span class="font-semibold text-purple-400">${Math.round(data.paymentSuccessRate || 0)}%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">En Çok Harcayan:</span>
        <span class="font-semibold text-yellow-400">${data.topSpenders?.[0]?.total_spent || 0} x402</span>
      </div>
    </div>
  `;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-lg shadow-lg fade-in-up`;
  
  if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #00FF00 0%, #00D9FF 100%)';
  } else if (type === 'error') {
    notification.style.background = 'linear-gradient(135deg, #FF0055 0%, #FFB800 100%)';
  } else {
    notification.style.background = 'linear-gradient(135deg, #00D9FF 0%, #B100FF 100%)';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle analyze button click
 */
async function handleAnalyze() {
  const query = searchInput.value.trim();
  
  if (!query) {
    showNotification('⚠️ Lütfen analiz edilecek bir varlık girin', 'error');
    return;
  }
  
  if (isAnalyzing) {
    return;
  }
  
  try {
    showLoading();
    showNotification('🔍 Analiz başlatılıyor...', 'info');
    
    const result = await analyzeAsset(query);
    
    displayResults(result);
    
    if (result.success) {
      showNotification('✅ Analiz tamamlandı!', 'success');
    } else {
      showNotification('⚠️ Analiz tamamlandı ancak bazı hatalar oluştu', 'error');
    }
    
    // Refresh stats
    await refreshStats();
    
  } catch (error) {
    console.error('Analysis error:', error);
    displayError(error);
    showNotification('❌ Analiz sırasında hata oluştu', 'error');
  } finally {
    hideLoading();
  }
}

/**
 * Refresh statistics
 */
async function refreshStats() {
  try {
    const [analytics, revenue] = await Promise.all([
      getAnalytics(),
      getRevenue()
    ]);
    
    updateAnalytics(analytics);
    updateRevenue(revenue);
  } catch (error) {
    console.error('Error refreshing stats:', error);
  }
}

/**
 * Initialize the application
 */
async function init() {
  console.log('🚀 ChainTotal Web UI Initializing...');
  
  // Check API health
  const isHealthy = await checkHealth();
  if (!isHealthy) {
    showNotification('⚠️ API sunucusuna bağlanılamıyor', 'error');
    console.error('API server is not responding');
  } else {
    console.log('✅ API server is healthy');
    showNotification('✅ Bağlantı başarılı', 'success');
  }
  
  // Load initial stats
  await refreshStats();
  
  // Set up event listeners
  analyzeBtn.addEventListener('click', handleAnalyze);
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  });
  
  // Auto-refresh stats every 30 seconds
  setInterval(refreshStats, 30000);
  
  console.log('✅ ChainTotal Web UI Ready');
}

// ============================================
// START APPLICATION
// ============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
