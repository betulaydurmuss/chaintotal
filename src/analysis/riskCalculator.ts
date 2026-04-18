import { AssetType, RiskScore, RiskLevel, RiskFactor, CommunitySignal, TechnicalData, TechnicalAnalysis, CommunityAnalysis } from '../types';

/**
 * Risk Calculator
 * 
 * Risk Score Hesaplaması:
 * - Teknik Risk: %60 ağırlık
 * - Topluluk Risk: %40 ağırlık
 * - Final Score = (Teknik × 0.6) + (Topluluk × 0.4)
 */
export class RiskCalculator {
  
  private readonly TECHNICAL_WEIGHT = 0.6; // 60%
  private readonly COMMUNITY_WEIGHT = 0.4; // 40%

  calculateRiskScore(
    assetType: AssetType,
    communitySignals: CommunitySignal[],
    technicalData: TechnicalData
  ): RiskScore {
    // Teknik analiz
    const technicalAnalysis = this.analyzeTechnicalData(assetType, technicalData);
    
    // Topluluk analizi
    const communityAnalysis = this.analyzeCommunitySignals(communitySignals);

    // Final score hesaplama
    const finalScore = Math.round(
      (technicalAnalysis.score * this.TECHNICAL_WEIGHT) +
      (communityAnalysis.score * this.COMMUNITY_WEIGHT)
    );

    // Risk faktörlerini birleştir
    const factors: RiskFactor[] = [
      {
        category: 'Teknik Analiz',
        score: technicalAnalysis.score,
        description: `${technicalAnalysis.findings.length} teknik bulgu`,
        weight: this.TECHNICAL_WEIGHT,
        details: {
          findings: technicalAnalysis.findings,
          data: technicalAnalysis.data
        }
      },
      {
        category: 'Topluluk Sinyalleri',
        score: communityAnalysis.score,
        description: `${communityAnalysis.signals.length} topluluk sinyali`,
        weight: this.COMMUNITY_WEIGHT,
        details: {
          findings: communityAnalysis.findings,
          signals: communityAnalysis.signals
        }
      }
    ];

    return {
      score: finalScore,
      level: this.getRiskLevel(finalScore),
      factors
    };
  }

  /**
   * Teknik Veri Analizi
   * 
   * Varlık tipine göre farklı parametreler analiz edilir:
   * - Smart Contract Analysis (token/dApp)
   * - On-chain Behavior (wallet)
   * - Blockchain Data (NFT/collection)
   */
  private analyzeTechnicalData(assetType: AssetType, data: TechnicalData): TechnicalAnalysis {
    let score = 50; // Başlangıç skoru
    const findings: string[] = [];

    // Kritik riskler (yüksek ağırlık)
    if (data.knownScam) {
      score += 40;
      findings.push('⚠️ Bilinen dolandırıcılık olarak işaretlenmiş');
    }

    if (data.blacklisted) {
      score += 30;
      findings.push('⚠️ Kara listede');
    }

    if (data.interactionWithScams) {
      score += 25;
      findings.push('⚠️ Bilinen dolandırıcılıklarla etkileşim tespit edildi');
    }

    // Varlık tipine özel analizler
    switch (assetType) {
      case AssetType.TOKEN:
      case AssetType.DAPP:
        score = this.analyzeSmartContract(data, score, findings);
        break;
      
      case AssetType.WALLET:
        score = this.analyzeWalletBehavior(data, score, findings);
        break;
      
      case AssetType.NFT:
        score = this.analyzeNFTCollection(data, score, findings);
        break;
      
      case AssetType.WEBSITE:
        score = this.analyzeWebsite(data, score, findings);
        break;
    }

    // Skor sınırları
    score = Math.max(0, Math.min(100, score));

    return {
      score: Math.round(score),
      weight: this.TECHNICAL_WEIGHT,
      data,
      findings
    };
  }

  /**
   * Smart Contract Analysis (token/dApp için)
   */
  private analyzeSmartContract(data: TechnicalData, baseScore: number, findings: string[]): number {
    let score = baseScore;

    // Contract deployment tarihi
    if (data.contractAge !== undefined) {
      if (data.contractAge < 7) {
        score += 20;
        findings.push(`🆕 Çok yeni kontrat (${data.contractAge} gün)`);
      } else if (data.contractAge < 30) {
        score += 10;
        findings.push(`🆕 Yeni kontrat (${data.contractAge} gün)`);
      } else if (data.contractAge > 365) {
        score -= 5;
        findings.push(`✅ Olgun kontrat (${data.contractAge} gün)`);
      }
    }

    // Owner centralization risk
    if (data.ownerCentralizationRisk !== undefined) {
      if (data.ownerCentralizationRisk > 70) {
        score += 15;
        findings.push(`⚠️ Yüksek merkezileşme riski (${data.ownerCentralizationRisk}%)`);
      } else if (data.ownerCentralizationRisk < 30) {
        score -= 5;
        findings.push(`✅ Düşük merkezileşme riski (${data.ownerCentralizationRisk}%)`);
      }
    }

    // Known vulnerability patterns
    if (data.knownVulnerabilities && data.knownVulnerabilities.length > 0) {
      score += 20 + (data.knownVulnerabilities.length * 5);
      findings.push(`🔴 ${data.knownVulnerabilities.length} bilinen güvenlik açığı`);
      data.knownVulnerabilities.forEach(vuln => {
        findings.push(`  - ${vuln}`);
      });
    }

    // Contract verification
    if (data.contractVerified === false) {
      score += 15;
      findings.push('⚠️ Kontrat doğrulanmamış');
    } else if (data.contractVerified === true) {
      score -= 5;
      findings.push('✅ Kontrat doğrulanmış');
    }

    return score;
  }

  /**
   * On-chain Behavior (cüzdan için)
   */
  private analyzeWalletBehavior(data: TechnicalData, baseScore: number, findings: string[]): number {
    let score = baseScore;

    // Transaction history
    if (data.transactionCount !== undefined) {
      if (data.transactionCount < 5) {
        score += 15;
        findings.push(`⚠️ Çok az işlem (${data.transactionCount})`);
      } else if (data.transactionCount > 1000) {
        score -= 5;
        findings.push(`✅ Aktif cüzdan (${data.transactionCount} işlem)`);
      }
    }

    if (data.transactionHistory) {
      const { firstTransaction, lastTransaction } = data.transactionHistory;
      if (firstTransaction && lastTransaction) {
        const daysSinceFirst = this.calculateDaysDifference(firstTransaction);
        const daysSinceLast = this.calculateDaysDifference(lastTransaction);
        
        if (daysSinceFirst < 7) {
          score += 10;
          findings.push('🆕 Çok yeni cüzdan');
        }
        
        if (daysSinceLast > 180) {
          score += 5;
          findings.push('⚠️ Uzun süredir aktif değil');
        }
      }
    }

    // Token holding patterns
    if (data.tokenHoldingPatterns) {
      const { diversification, suspiciousTokens } = data.tokenHoldingPatterns;
      
      if (diversification !== undefined && diversification < 20) {
        score += 10;
        findings.push('⚠️ Düşük token çeşitliliği');
      }
      
      if (suspiciousTokens !== undefined && suspiciousTokens > 0) {
        score += 15 + (suspiciousTokens * 5);
        findings.push(`🔴 ${suspiciousTokens} şüpheli token tespit edildi`);
      }
    }

    return score;
  }

  /**
   * Blockchain Data (NFT/koleksiyon için)
   */
  private analyzeNFTCollection(data: TechnicalData, baseScore: number, findings: string[]): number {
    let score = baseScore;

    // Floor price stability
    if (data.floorPriceStability !== undefined) {
      if (data.floorPriceStability < 30) {
        score += 15;
        findings.push(`⚠️ Düşük fiyat istikrarı (${data.floorPriceStability}%)`);
      } else if (data.floorPriceStability > 70) {
        score -= 5;
        findings.push(`✅ Yüksek fiyat istikrarı (${data.floorPriceStability}%)`);
      }
    }

    // Trading volume trends
    if (data.tradingVolumeTrend) {
      switch (data.tradingVolumeTrend) {
        case 'decreasing':
          score += 10;
          findings.push('📉 Azalan işlem hacmi');
          break;
        case 'increasing':
          score -= 5;
          findings.push('📈 Artan işlem hacmi');
          break;
        case 'stable':
          findings.push('➡️ Stabil işlem hacmi');
          break;
      }
    }

    // Rarity patterns
    if (data.rarityPatterns) {
      const { uniqueTraits, rarityScore } = data.rarityPatterns;
      
      if (uniqueTraits !== undefined && uniqueTraits < 5) {
        score += 10;
        findings.push('⚠️ Düşük özellik çeşitliliği');
      }
      
      if (rarityScore !== undefined) {
        findings.push(`ℹ️ Nadir buluşma skoru: ${rarityScore}`);
      }
    }

    return score;
  }

  /**
   * Website Analysis
   */
  private analyzeWebsite(data: TechnicalData, baseScore: number, findings: string[]): number {
    let score = baseScore;

    if (data.age !== undefined) {
      if (data.age < 30) {
        score += 20;
        findings.push(`🆕 Çok yeni domain (${data.age} gün)`);
      } else if (data.age < 180) {
        score += 10;
        findings.push(`🆕 Yeni domain (${data.age} gün)`);
      } else if (data.age > 730) {
        score -= 5;
        findings.push(`✅ Eski domain (${Math.floor(data.age / 365)} yıl)`);
      }
    }

    return score;
  }

  /**
   * Topluluk Sinyalleri Analizi
   * 
   * - Social Media Signals
   * - External Threat Intelligence
   */
  private analyzeCommunitySignals(signals: CommunitySignal[]): CommunityAnalysis {
    if (signals.length === 0) {
      return {
        score: 50,
        weight: this.COMMUNITY_WEIGHT,
        signals: [],
        findings: ['ℹ️ Topluluk verisi bulunamadı']
      };
    }

    let score = 50;
    const findings: string[] = [];

    // Sinyal tiplerini say
    const positiveCount = signals.filter(s => s.type === 'positive').length;
    const negativeCount = signals.filter(s => s.type === 'negative').length;
    const neutralCount = signals.filter(s => s.type === 'neutral').length;

    // Temel sinyal analizi
    if (negativeCount > positiveCount) {
      const diff = negativeCount - positiveCount;
      score += 15 + (diff * 5);
      findings.push(`⚠️ ${negativeCount} negatif sinyal (${positiveCount} pozitif)`);
    } else if (positiveCount > negativeCount) {
      const diff = positiveCount - negativeCount;
      score -= 10 + (diff * 3);
      findings.push(`✅ ${positiveCount} pozitif sinyal (${negativeCount} negatif)`);
    }

    // Social Media Signals
    signals.forEach(signal => {
      // Mention frequency
      if (signal.mentionFrequency !== undefined) {
        if (signal.mentionFrequency > 100) {
          findings.push(`📢 Yüksek bahsedilme sıklığı (${signal.mentionFrequency})`);
        }
      }

      // Sentiment analysis
      if (signal.sentiment !== undefined) {
        if (signal.sentiment < -0.5) {
          score += 10;
          findings.push(`😞 Negatif sentiment (${signal.sentiment.toFixed(2)})`);
        } else if (signal.sentiment > 0.5) {
          score -= 5;
          findings.push(`😊 Pozitif sentiment (${signal.sentiment.toFixed(2)})`);
        }
      }

      // Community growth rate
      if (signal.communityGrowthRate !== undefined) {
        if (signal.communityGrowthRate < -10) {
          score += 10;
          findings.push(`📉 Topluluk küçülüyor (${signal.communityGrowthRate}%)`);
        } else if (signal.communityGrowthRate > 20) {
          score -= 5;
          findings.push(`📈 Topluluk büyüyor (${signal.communityGrowthRate}%)`);
        }
      }

      // Reporter count
      if (signal.reporterCount !== undefined && signal.reporterCount > 0) {
        score += 15 + (signal.reporterCount * 3);
        findings.push(`🚨 ${signal.reporterCount} kullanıcı rapor etti`);
      }

      // External Threat Intelligence
      if (signal.blacklistStatus) {
        score += 25;
        findings.push('🔴 Kara listede');
      }

      if (signal.scamReports !== undefined && signal.scamReports > 0) {
        score += 20 + (signal.scamReports * 5);
        findings.push(`🚨 ${signal.scamReports} dolandırıcılık raporu`);
      }

      // Security audit history
      if (signal.securityAuditHistory) {
        const audit = signal.securityAuditHistory;
        if (audit.audited) {
          score -= 10;
          findings.push(`✅ Güvenlik denetimi yapılmış (${audit.auditFirm || 'Bilinmeyen'})`);
          
          if (audit.findings && audit.findings.length > 0) {
            score += audit.findings.length * 3;
            findings.push(`⚠️ ${audit.findings.length} denetim bulgusu`);
          }
        } else {
          score += 5;
          findings.push('⚠️ Güvenlik denetimi yapılmamış');
        }
      }
    });

    // Ortalama güven skoru
    const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
    score = score * avgConfidence;

    // Skor sınırları
    score = Math.max(0, Math.min(100, score));

    return {
      score: Math.round(score),
      weight: this.COMMUNITY_WEIGHT,
      signals,
      findings
    };
  }

  /**
   * Risk seviyesi belirleme
   */
  private getRiskLevel(score: number): RiskLevel {
    if (score <= 30) return RiskLevel.LOW;
    if (score <= 60) return RiskLevel.MEDIUM;
    return RiskLevel.HIGH;
  }

  /**
   * Tarih farkı hesaplama (gün)
   */
  private calculateDaysDifference(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
