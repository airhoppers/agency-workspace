import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Our Blog
          </div>
          <h1 class="hero-title">Insights &amp; Updates</h1>
          <p class="hero-description">
            Stay ahead of the curve with the latest news, expert tips, and industry insights to help your travel agency thrive.
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Post Section -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Featured</p>
          <h2 class="section-title">Editor's Pick</h2>
          <p class="section-description">Our top story this week, handpicked by the editorial team.</p>
        </div>
        <div class="featured-card">
          <div class="featured-image">
            <div class="featured-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          </div>
          <div class="featured-content">
            <span class="category-badge">Industry Insights</span>
            <h3 class="featured-title">The Future of Travel Agency Technology: Trends Shaping 2025 and Beyond</h3>
            <p class="featured-excerpt">
              From AI-powered itinerary builders to blockchain-based booking verification, the travel technology landscape is evolving rapidly. Discover how forward-thinking agencies are leveraging these innovations to deliver exceptional customer experiences and streamline their operations for the digital age.
            </p>
            <div class="featured-meta">
              <div class="author-info">
                <div class="author-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span class="author-name">Sarah Mitchell</span>
              </div>
              <div class="meta-details">
                <span class="meta-date">Jan 28, 2025</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-read">8 min read</span>
              </div>
            </div>
            <a href="javascript:void(0)" class="btn btn-primary btn-lg featured-btn">
              Read Full Article
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Posts Section -->
    <section class="recent-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Latest Articles</p>
          <h2 class="section-title">Recent Posts</h2>
          <p class="section-description">Explore our latest articles on travel industry trends, tips, and platform updates.</p>
        </div>
        <div class="posts-grid">
          <!-- Post 1 -->
          <div class="post-card">
            <div class="post-image">
              <div class="post-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="post-content">
              <span class="category-badge">Tips &amp; Tricks</span>
              <h3 class="post-title">5 Ways to Boost Your Package Bookings This Season</h3>
              <p class="post-excerpt">Learn proven strategies to increase your travel package conversion rates and attract more customers during peak booking periods.</p>
              <div class="post-meta">
                <span class="meta-author">James Cooper</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-date">Jan 25, 2025</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-read">5 min read</span>
              </div>
            </div>
          </div>

          <!-- Post 2 -->
          <div class="post-card">
            <div class="post-image">
              <div class="post-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="post-content">
              <span class="category-badge">Product Updates</span>
              <h3 class="post-title">Introducing Advanced Analytics: Track Your Agency Performance</h3>
              <p class="post-excerpt">Our new analytics dashboard gives you deeper insights into booking trends, revenue metrics, and customer behavior patterns.</p>
              <div class="post-meta">
                <span class="meta-author">Emily Chen</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-date">Jan 22, 2025</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-read">4 min read</span>
              </div>
            </div>
          </div>

          <!-- Post 3 -->
          <div class="post-card">
            <div class="post-image">
              <div class="post-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="post-content">
              <span class="category-badge">Industry News</span>
              <h3 class="post-title">How Verified Agencies Build Customer Trust and Loyalty</h3>
              <p class="post-excerpt">Discover why agency verification is becoming essential and how it directly impacts your booking rates and customer retention.</p>
              <div class="post-meta">
                <span class="meta-author">Sarah Mitchell</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-date">Jan 18, 2025</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-read">6 min read</span>
              </div>
            </div>
          </div>

          <!-- Post 4 -->
          <div class="post-card">
            <div class="post-image">
              <div class="post-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="post-content">
              <span class="category-badge">Tips &amp; Tricks</span>
              <h3 class="post-title">Crafting Irresistible Travel Package Descriptions That Convert</h3>
              <p class="post-excerpt">Master the art of writing compelling package descriptions that capture attention and drive more bookings for your agency.</p>
              <div class="post-meta">
                <span class="meta-author">David Park</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-date">Jan 14, 2025</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-read">7 min read</span>
              </div>
            </div>
          </div>

          <!-- Post 5 -->
          <div class="post-card">
            <div class="post-image">
              <div class="post-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="post-content">
              <span class="category-badge">Product Updates</span>
              <h3 class="post-title">New Booking Management Tools: Streamline Your Workflow</h3>
              <p class="post-excerpt">Explore the latest updates to our booking management system, including automated confirmations and real-time availability sync.</p>
              <div class="post-meta">
                <span class="meta-author">Emily Chen</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-date">Jan 10, 2025</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-read">3 min read</span>
              </div>
            </div>
          </div>

          <!-- Post 6 -->
          <div class="post-card">
            <div class="post-image">
              <div class="post-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="post-content">
              <span class="category-badge">Industry News</span>
              <h3 class="post-title">Sustainable Travel: How Agencies Can Lead the Green Revolution</h3>
              <p class="post-excerpt">The demand for eco-friendly travel is surging. Learn how to position your agency as a leader in sustainable tourism offerings.</p>
              <div class="post-meta">
                <span class="meta-author">James Cooper</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-date">Jan 6, 2025</span>
                <span class="meta-separator">&middot;</span>
                <span class="meta-read">6 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter and never miss the latest insights, tips, and product updates for your travel agency.</p>
          <div class="cta-buttons">
            <a routerLink="/support" class="btn btn-cta-white btn-lg">
              Subscribe Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/support" class="btn btn-cta-outline btn-lg">Contact Us</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-lg);
    }

    /* =============================
       BUTTONS
       ============================= */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: 10px 20px;
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all var(--transition-normal);
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--coral-700);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-primary);
    }

    .btn-outline:hover {
      background: var(--bg-secondary);
    }

    .btn-lg {
      padding: 14px 28px;
      font-size: var(--font-size-lg);
    }

    /* =============================
       SECTION HEADER
       ============================= */
    .section-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .section-tag {
      display: inline-block;
      background: var(--coral-100);
      color: var(--primary);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs, 12px);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-md);
    }

    .section-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-md);
    }

    .section-description {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    /* =============================
       HERO SECTION
       ============================= */
    .hero {
      padding: 120px 0 60px;
      background: linear-gradient(135deg, var(--coral-50) 0%, #fef2f2 30%, #fdf4ff 60%, white 100%);
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 80%;
      height: 150%;
      background: radial-gradient(circle, rgba(255, 78, 120, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-content {
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: var(--bg-primary);
      border: 1px solid var(--border);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: var(--spacing-lg);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--primary);
    }

    .hero-title {
      font-size: 42px;
      font-weight: 700;
      line-height: 1.1;
      color: var(--text-primary);
      margin: 0 0 20px;
    }

    .hero-description {
      font-size: var(--font-size-xl);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
    }

    /* =============================
       FEATURED POST SECTION
       ============================= */
    .featured-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .featured-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: all var(--transition-normal);
    }

    .featured-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .featured-image {
      position: relative;
      min-height: 400px;
    }

    .featured-image-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 50%, #fdf4ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.5);
    }

    .featured-content {
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .category-badge {
      display: inline-block;
      background: var(--coral-100);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs, 12px);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-md);
      width: fit-content;
    }

    .featured-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
      margin: 0 0 var(--spacing-md);
    }

    .featured-excerpt {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0 0 var(--spacing-lg);
    }

    .featured-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-lg);
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .author-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--bg-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }

    .author-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .meta-details {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm, 14px);
      color: var(--text-secondary);
    }

    .featured-btn {
      width: fit-content;
    }

    /* =============================
       RECENT POSTS SECTION
       ============================= */
    .recent-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .post-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: all var(--transition-normal);
    }

    .post-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .post-image {
      position: relative;
      height: 200px;
    }

    .post-image-placeholder {
      width: 100%;
      height: 100%;
      background: #f0f4f8;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c1ccd6;
    }

    .post-content {
      padding: 24px;
    }

    .post-title {
      font-size: var(--font-size-lg, 18px);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      line-height: 1.4;
      margin: 0 0 var(--spacing-sm);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-excerpt {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 var(--spacing-md);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-meta {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm, 13px);
      color: var(--text-secondary);
      flex-wrap: wrap;
    }

    .meta-author {
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .meta-separator {
      color: var(--border);
    }

    .meta-date,
    .meta-read {
      color: var(--text-secondary);
    }

    /* =============================
       CTA SECTION
       ============================= */
    .cta-section {
      padding: 80px 0;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      position: relative;
      overflow: hidden;
    }

    .cta-section::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -20%;
      width: 80%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .cta-content h2 {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0 0 var(--spacing-md);
    }

    .cta-content p {
      font-size: var(--font-size-lg);
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
      margin: 0 0 var(--spacing-xl);
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
    }

    .btn-cta-white {
      background: white;
      color: #FF4E78;
      padding: 14px 28px;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-md);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    }

    .btn-cta-white:hover {
      background: #fff1f2;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-cta-outline {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: white;
      padding: 14px 28px;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-md);
    }

    .btn-cta-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    /* =============================
       RESPONSIVE - TABLET (1024px)
       ============================= */
    @media (max-width: 1024px) {
      .hero-title {
        font-size: 36px;
      }

      .section-title {
        font-size: 28px;
      }

      .featured-card {
        grid-template-columns: 1fr;
      }

      .featured-image {
        min-height: 280px;
      }

      .posts-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* =============================
       RESPONSIVE - MOBILE (768px)
       ============================= */
    @media (max-width: 768px) {
      .hero {
        padding: 100px 0 48px;
      }

      .hero-title {
        font-size: 28px;
      }

      .hero-description {
        font-size: var(--font-size-lg);
      }

      .featured-section,
      .recent-section,
      .cta-section {
        padding: 60px 0;
      }

      .section-title {
        font-size: 24px;
      }

      .featured-card {
        grid-template-columns: 1fr;
      }

      .featured-image {
        min-height: 220px;
      }

      .featured-content {
        padding: 24px;
      }

      .featured-title {
        font-size: 20px;
      }

      .featured-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-sm);
      }

      .posts-grid {
        grid-template-columns: 1fr;
        max-width: 480px;
        margin: 0 auto;
      }

      .cta-content h2 {
        font-size: 24px;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn-cta-white,
      .btn-cta-outline {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class PublicBlogComponent {}
