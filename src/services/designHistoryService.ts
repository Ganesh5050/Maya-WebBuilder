// Design History Service - Prevents repetitive designs
// Tracks generated designs to ensure uniqueness

export interface DesignRecord {
  id: string;
  timestamp: Date;
  industry: string;
  primaryColor: string;
  fontPairing: string;
  layoutType: string;
  prompt: string;
  userId?: string;
}

export interface SimilarityScore {
  similarity: number;
  colorSimilarity: number;
  fontSimilarity: number;
  layoutSimilarity: number;
  tooSimilar: boolean;
}

export class DesignHistoryService {
  private designs: DesignRecord[] = [];
  private readonly SIMILARITY_THRESHOLD = 0.75; // 75% similarity = too similar
  
  /**
   * Save a new design to history
   */
  saveDesign(design: Omit<DesignRecord, 'id' | 'timestamp'>): void {
    const record: DesignRecord = {
      ...design,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.designs.push(record);
    
    // Keep only last 100 designs to prevent memory issues
    if (this.designs.length > 100) {
      this.designs = this.designs.slice(-100);
    }
    
    console.log('💾 Design saved to history:', {
      industry: record.industry,
      color: record.primaryColor,
      font: record.fontPairing,
      layout: record.layoutType
    });
  }
  
  /**
   * Check if a new design is too similar to recent ones
   */
  checkSimilarity(newDesign: {
    industry: string;
    primaryColor: string;
    fontPairing: string;
    layoutType: string;
  }): SimilarityScore {
    
    // Get recent designs from same industry (last 10)
    const recentDesigns = this.designs
      .filter(d => d.industry === newDesign.industry)
      .slice(-10);
    
    if (recentDesigns.length === 0) {
      return {
        similarity: 0,
        colorSimilarity: 0,
        fontSimilarity: 0,
        layoutSimilarity: 0,
        tooSimilar: false
      };
    }
    
    // Calculate similarity scores
    let totalColorSimilarity = 0;
    let totalFontSimilarity = 0;
    let totalLayoutSimilarity = 0;
    
    recentDesigns.forEach(existing => {
      totalColorSimilarity += this.calculateColorSimilarity(newDesign.primaryColor, existing.primaryColor);
      totalFontSimilarity += this.calculateFontSimilarity(newDesign.fontPairing, existing.fontPairing);
      totalLayoutSimilarity += this.calculateLayoutSimilarity(newDesign.layoutType, existing.layoutType);
    });
    
    const avgColorSimilarity = totalColorSimilarity / recentDesigns.length;
    const avgFontSimilarity = totalFontSimilarity / recentDesigns.length;
    const avgLayoutSimilarity = totalLayoutSimilarity / recentDesigns.length;
    
    const overallSimilarity = (avgColorSimilarity + avgFontSimilarity + avgLayoutSimilarity) / 3;
    
    const result: SimilarityScore = {
      similarity: overallSimilarity,
      colorSimilarity: avgColorSimilarity,
      fontSimilarity: avgFontSimilarity,
      layoutSimilarity: avgLayoutSimilarity,
      tooSimilar: overallSimilarity > this.SIMILARITY_THRESHOLD
    };
    
    console.log('🔍 Similarity check:', result);
    
    if (result.tooSimilar) {
      console.warn('⚠️ Design too similar to recent generations!', {
        similarity: Math.round(overallSimilarity * 100) + '%',
        threshold: Math.round(this.SIMILARITY_THRESHOLD * 100) + '%'
      });
    }
    
    return result;
  }
  
  /**
   * Get design suggestions to avoid similarity
   */
  getSuggestions(industry: string): {
    avoidColors: string[];
    avoidFonts: string[];
    avoidLayouts: string[];
    recommendedColors: string[];
    recommendedFonts: string[];
    recommendedLayouts: string[];
  } {
    
    const recentDesigns = this.designs
      .filter(d => d.industry === industry)
      .slice(-5); // Last 5 designs
    
    const usedColors = recentDesigns.map(d => d.primaryColor);
    const usedFonts = recentDesigns.map(d => d.fontPairing);
    const usedLayouts = recentDesigns.map(d => d.layoutType);
    
    // Color recommendations
    const allColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
    const recommendedColors = allColors.filter(color => 
      !usedColors.some(used => this.calculateColorSimilarity(color, used) > 0.6)
    );
    
    // Font recommendations
    const allFonts = [
      'Inter+Open Sans', 'Playfair Display+Source Sans Pro', 'Montserrat+Lato',
      'Poppins+Inter', 'Cormorant Garamond+Work Sans', 'Space Grotesk+Manrope'
    ];
    const recommendedFonts = allFonts.filter(font => !usedFonts.includes(font));
    
    // Layout recommendations
    const allLayouts = ['split-screen', 'centered-minimal', 'asymmetric', 'stacked-visual', 'diagonal-split'];
    const recommendedLayouts = allLayouts.filter(layout => !usedLayouts.includes(layout));
    
    return {
      avoidColors: usedColors,
      avoidFonts: usedFonts,
      avoidLayouts: usedLayouts,
      recommendedColors,
      recommendedFonts,
      recommendedLayouts
    };
  }
  
  /**
   * Get statistics about design diversity
   */
  getStats(): {
    totalDesigns: number;
    uniqueColors: number;
    uniqueFonts: number;
    uniqueLayouts: number;
    diversityScore: number;
  } {
    const uniqueColors = new Set(this.designs.map(d => d.primaryColor)).size;
    const uniqueFonts = new Set(this.designs.map(d => d.fontPairing)).size;
    const uniqueLayouts = new Set(this.designs.map(d => d.layoutType)).size;
    
    // Calculate diversity score (0-100)
    const totalDesigns = this.designs.length;
    const maxPossibleUnique = Math.min(totalDesigns, 20); // Assume 20 possible variations
    const actualUnique = (uniqueColors + uniqueFonts + uniqueLayouts) / 3;
    const diversityScore = totalDesigns > 0 ? Math.round((actualUnique / maxPossibleUnique) * 100) : 0;
    
    return {
      totalDesigns,
      uniqueColors,
      uniqueFonts,
      uniqueLayouts,
      diversityScore: Math.min(diversityScore, 100)
    };
  }
  
  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  private calculateColorSimilarity(color1: string, color2: string): number {
    // Simple color similarity based on hex values
    if (color1 === color2) return 1.0;
    
    // Convert hex to RGB
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    // Calculate Euclidean distance in RGB space
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
    
    // Normalize to 0-1 scale (max distance is ~441 for RGB)
    const similarity = 1 - (distance / 441);
    return Math.max(0, similarity);
  }
  
  private calculateFontSimilarity(font1: string, font2: string): number {
    if (font1 === font2) return 1.0;
    
    // Check if fonts share the same family
    const family1 = font1.split('+')[0];
    const family2 = font2.split('+')[0];
    
    if (family1 === family2) return 0.7; // Same heading font = 70% similar
    
    // Check font categories
    const serif1 = this.isSerif(family1);
    const serif2 = this.isSerif(family2);
    
    if (serif1 === serif2) return 0.3; // Same category = 30% similar
    
    return 0; // Different categories = not similar
  }
  
  private calculateLayoutSimilarity(layout1: string, layout2: string): number {
    if (layout1 === layout2) return 1.0;
    
    // Group similar layouts
    const gridLayouts = ['split-screen', 'asymmetric', 'bento-grid'];
    const centeredLayouts = ['centered-minimal', 'stacked-visual'];
    const creativeLayouts = ['diagonal-split', 'fullscreen-video', 'carousel-hero'];
    
    const getGroup = (layout: string) => {
      if (gridLayouts.includes(layout)) return 'grid';
      if (centeredLayouts.includes(layout)) return 'centered';
      if (creativeLayouts.includes(layout)) return 'creative';
      return 'other';
    };
    
    const group1 = getGroup(layout1);
    const group2 = getGroup(layout2);
    
    return group1 === group2 ? 0.5 : 0; // Same group = 50% similar
  }
  
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  private isSerif(fontName: string): boolean {
    const serifFonts = [
      'Playfair Display', 'Cormorant Garamond', 'Crimson Text', 
      'Libre Baskerville', 'Lora', 'Merriweather'
    ];
    return serifFonts.includes(fontName);
  }
}

// Export singleton
export const designHistoryService = new DesignHistoryService();