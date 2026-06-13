import mysql from 'mysql2/promise';

interface SQLColumn {
  name: string;
  type: string;
}

// Map Database Schema into MySQL
export async function getMysqlConnection() {
  if (process.env.DB_TYPE !== 'mysql') return null;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'creator_links'
    });
    return connection;
  } catch (err) {
    console.error('FAILED TO CONNECT TO MYSQL:', err);
    return null;
  }
}

// Auto-generate MySQL tables if they do not exist
export async function setupMysqlTables() {
  const connection = await getMysqlConnection();
  if (!connection) {
    console.log('Using local JSON Database (db.json)');
    return false;
  }

  console.log('Connected to MySQL. Initializing tables...');
  try {
    // 1. Create Profile Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`profile\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`name\` VARCHAR(150) NOT NULL,
        \`bio\` TEXT,
        \`instagram\` VARCHAR(150),
        \`tiktok\` VARCHAR(150),
        \`youtube\` VARCHAR(150),
        \`email\` VARCHAR(150),
        \`avatar_url\` TEXT,
        \`whatsapp\` VARCHAR(50),
        \`hero_tagline\` TEXT,
        \`hero_title_1\` TEXT,
        \`hero_title_highlight\` TEXT,
        \`hero_description\` TEXT,
        \`domicile\` VARCHAR(150),
        \`contact_phone\` VARCHAR(50),
        \`stats\` TEXT,
        \`stats_badge\` VARCHAR(100),
        \`stats_title\` VARCHAR(150),
        \`stats_description\` TEXT,
        \`projects_badge\` VARCHAR(100),
        \`projects_title\` VARCHAR(150),
        \`projects_description\` TEXT,
        \`pricing_badge\` VARCHAR(100),
        \`pricing_title\` VARCHAR(150),
        \`pricing_description\` TEXT,
        \`brands_badge\` VARCHAR(100),
        \`brands_title\` VARCHAR(150),
        \`terms_badge\` VARCHAR(100),
        \`terms_title\` VARCHAR(150),
        \`terms_description\` TEXT,
        \`contact_badge\` VARCHAR(100),
        \`contact_title\` VARCHAR(150),
        \`contact_title_highlight\` VARCHAR(150),
        \`contact_description\` TEXT,
        \`terms_of_service\` TEXT,
        \`studio_director_title\` VARCHAR(150),
        \`studio_estd_year\` VARCHAR(20),
        \`linktree_title\` VARCHAR(250),
        \`ratecard_title\` VARCHAR(250),
        \`favicon_url\` TEXT,
        \`design_settings\` TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Create Links Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`links\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`title\` VARCHAR(250) NOT NULL,
        \`url\` TEXT NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`clicks\` INT DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`priority\` INT DEFAULT 0,
        \`description\` TEXT,
        \`button_label\` VARCHAR(100),
        \`image_url\` TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Create Services Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`services\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`title\` VARCHAR(250) NOT NULL,
        \`price\` VARCHAR(100) NOT NULL,
        \`description\` TEXT,
        \`icon\` VARCHAR(100) NOT NULL,
        \`category\` VARCHAR(100),
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`priority\` INT DEFAULT 0,
        \`additional_fees\` TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Create Projects Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`projects\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`title\` VARCHAR(250) NOT NULL,
        \`highlight\` VARCHAR(250),
        \`views\` VARCHAR(50),
        \`image_url\` TEXT,
        \`category\` VARCHAR(100) NOT NULL,
        \`url\` TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Create Brands Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`brands\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`name\` VARCHAR(150) NOT NULL,
        \`logo_url\` TEXT,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`priority\` INT DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Create Click Logs Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`click_logs\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`link_id\` VARCHAR(50) NOT NULL,
        \`timestamp\` VARCHAR(100) NOT NULL,
        \`referrer\` TEXT,
        \`utm_source\` VARCHAR(100),
        \`utm_medium\` VARCHAR(100),
        \`utm_campaign\` VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Create Visit Logs Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`visit_logs\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`timestamp\` VARCHAR(100) NOT NULL,
        \`referrer\` TEXT,
        \`utm_source\` VARCHAR(100),
        \`utm_medium\` VARCHAR(100),
        \`utm_campaign\` VARCHAR(100),
        \`view_type\` VARCHAR(50) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. Create GitHub Settings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`github_settings\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`enabled\` TINYINT(1) DEFAULT 0,
        \`token\` TEXT,
        \`owner\` VARCHAR(150),
        \`repo\` VARCHAR(150),
        \`branch\` VARCHAR(100),
        \`path\` VARCHAR(250)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('MySQL schema tables verified successfully!');
    await connection.end();
    return true;
  } catch (err) {
    console.error('ERROR SETTING UP MYSQL SCHEMA:', err);
    try { await connection.end(); } catch (e) {}
    return false;
  }
}

// Read database schema from MySQL and construct the memory data.
// If tables are empty, it will auto-populate (seed) them using the provided fallback db data!
export async function loadDbFromMysql(fallbackJsonDb: any) {
  const connection = await getMysqlConnection();
  if (!connection) return fallbackJsonDb;

  try {
    // 1. Load Profile
    const [profiles] = await connection.query('SELECT * FROM \`profile\` LIMIT 1') as any[];
    let profileData: any;
    if (profiles.length === 0) {
      // Seed profile to MySQL from local JSON fallback
      profileData = fallbackJsonDb.profile;
      await connection.query(`
        INSERT INTO \`profile\` (
          id, name, bio, instagram, tiktok, youtube, email, avatar_url, whatsapp,
          hero_tagline, hero_title_1, hero_title_highlight, hero_description, domicile, contact_phone,
          stats, stats_badge, stats_title, stats_description,
          projects_badge, projects_title, projects_description,
          pricing_badge, pricing_title, pricing_description,
          brands_badge, brands_title,
          terms_badge, terms_title, terms_description,
          contact_badge, contact_title, contact_title_highlight, contact_description,
          terms_of_service, studio_director_title, studio_estd_year,
          linktree_title, ratecard_title, favicon_url, design_settings
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'main_profile', profileData.name || '', profileData.bio || '', profileData.instagram || '', profileData.tiktok || '', profileData.youtube || '', profileData.email || '', profileData.avatarUrl || '', profileData.whatsapp || '',
        profileData.heroTagline || '', profileData.heroTitle1 || '', profileData.heroTitleHighlight || '', profileData.heroDescription || '', profileData.domicile || '', profileData.contactPhone || '',
        JSON.stringify(profileData.stats || []), profileData.statsBadge || '', profileData.statsTitle || '', profileData.statsDescription || '',
        profileData.projectsBadge || '', profileData.projectsTitle || '', profileData.projectsDescription || '',
        profileData.pricingBadge || '', profileData.pricingTitle || '', profileData.pricingDescription || '',
        profileData.brandsBadge || '', profileData.brandsTitle || '',
        profileData.termsBadge || '', profileData.termsTitle || '', profileData.termsDescription || '',
        profileData.contactBadge || '', profileData.contactTitle || '', profileData.contactTitleHighlight || '', profileData.contactDescription || '',
        JSON.stringify(profileData.termsOfService || []), profileData.studioDirectorTitle || '', profileData.studioEstdYear || '',
        profileData.linktreeTitle || '', profileData.ratecardTitle || '', profileData.faviconUrl || '', JSON.stringify(profileData.designSettings || {})
      ]);
    } else {
      const p = profiles[0];
      profileData = {
        name: p.name,
        bio: p.bio,
        instagram: p.instagram,
        tiktok: p.tiktok,
        youtube: p.youtube,
        email: p.email,
        avatarUrl: p.avatar_url,
        whatsapp: p.whatsapp,
        heroTagline: p.hero_tagline,
        heroTitle1: p.hero_title_1,
        heroTitleHighlight: p.hero_title_highlight,
        heroDescription: p.hero_description,
        domicile: p.domicile,
        contactPhone: p.contact_phone,
        statsBadge: p.stats_badge,
        statsTitle: p.stats_title,
        statsDescription: p.stats_description,
        projectsBadge: p.projects_badge,
        projectsTitle: p.projects_title,
        projectsDescription: p.projects_description,
        pricingBadge: p.pricing_badge,
        pricingTitle: p.pricing_title,
        pricingDescription: p.pricing_description,
        brandsBadge: p.brands_badge,
        brandsTitle: p.brands_title,
        termsBadge: p.terms_badge,
        termsTitle: p.terms_title,
        termsDescription: p.terms_description,
        contactBadge: p.contact_badge,
        contactTitle: p.contact_title,
        contactTitleHighlight: p.contact_title_highlight,
        contactDescription: p.contact_description,
        studioDirectorTitle: p.studio_director_title,
        studioEstdYear: p.studio_estd_year,
        linktreeTitle: p.linktree_title,
        ratecardTitle: p.ratecard_title,
        faviconUrl: p.favicon_url,
        stats: p.stats ? JSON.parse(p.stats) : [],
        termsOfService: p.terms_of_service ? JSON.parse(p.terms_of_service) : [],
        designSettings: p.design_settings ? JSON.parse(p.design_settings) : {}
      };
    }

    // 2. Load Links
    const [linksList] = await connection.query('SELECT * FROM \`links\` ORDER BY \`priority\` ASC, \`id\` ASC') as any[];
    let linksData = linksList.map((l: any) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      category: l.category,
      clicks: l.clicks || 0,
      isActive: Boolean(l.is_active),
      priority: l.priority || 0,
      description: l.description,
      buttonLabel: l.button_label,
      imageUrl: l.image_url
    }));

    if (linksData.length === 0 && fallbackJsonDb.links?.length > 0) {
      linksData = fallbackJsonDb.links;
      for (const link of linksData) {
        await connection.query(`
          INSERT INTO \`links\` (id, title, url, category, clicks, is_active, priority, description, button_label, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [link.id, link.title, link.url, link.category, link.clicks || 0, link.isActive ? 1 : 0, link.priority || 0, link.description || '', link.buttonLabel || '', link.imageUrl || '']);
      }
    }

    // 3. Load Services
    const [servicesList] = await connection.query('SELECT * FROM \`services\` ORDER BY \`priority\` ASC, \`id\` ASC') as any[];
    let servicesData = servicesList.map((s: any) => ({
      id: s.id,
      title: s.title,
      price: s.price,
      description: s.description || '',
      icon: s.icon || 'Briefcase',
      category: s.category || 'OFFICIAL PLACEMENT',
      isActive: Boolean(s.is_active),
      priority: s.priority || 0,
      additionalFees: s.additional_fees ? JSON.parse(s.additional_fees) : []
    }));

    if (servicesData.length === 0 && fallbackJsonDb.services?.length > 0) {
      servicesData = fallbackJsonDb.services;
      for (const s of servicesData) {
        await connection.query(`
          INSERT INTO \`services\` (id, title, price, description, icon, category, is_active, priority, additional_fees)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [s.id, s.title, s.price, s.description || '', s.icon || 'Briefcase', s.category || 'OFFICIAL PLACEMENT', s.isActive ? 1 : 0, s.priority || 0, JSON.stringify(s.additionalFees || [])]);
      }
    }

    // 4. Load Projects
    const [projectsList] = await connection.query('SELECT * FROM \`projects\` ORDER BY \`id\` ASC') as any[];
    let projectsData = projectsList.map((p: any) => ({
      id: p.id,
      title: p.title,
      highlight: p.highlight || '',
      views: p.views || '',
      imageUrl: p.image_url || '',
      category: p.category,
      url: p.url
    }));

    if (projectsData.length === 0 && fallbackJsonDb.projects?.length > 0) {
      projectsData = fallbackJsonDb.projects;
      for (const p of projectsData) {
        await connection.query(`
          INSERT INTO \`projects\` (id, title, highlight, views, image_url, category, url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [p.id, p.title, p.highlight || '', p.views || '', p.imageUrl || '', p.category, p.url]);
      }
    }

    // 5. Load Brands
    const [brandsList] = await connection.query('SELECT * FROM \`brands\` ORDER BY \`priority\` ASC, \`id\` ASC') as any[];
    let brandsData = brandsList.map((b: any) => ({
      id: b.id,
      name: b.name,
      logoUrl: b.logo_url || '',
      isActive: Boolean(b.is_active),
      priority: b.priority || 0
    }));

    if (brandsData.length === 0 && fallbackJsonDb.brands?.length > 0) {
      brandsData = fallbackJsonDb.brands;
      for (const b of brandsData) {
        await connection.query(`
          INSERT INTO \`brands\` (id, name, logo_url, is_active, priority)
          VALUES (?, ?, ?, ?, ?)
        `, [b.id, b.name, b.logoUrl || '', b.isActive ? 1 : 0, b.priority || 0]);
      }
    }

    // 6. Load Click Logs
    const [clicksList] = await connection.query('SELECT * FROM \`click_logs\` ORDER BY \`timestamp\` DESC LIMIT 5000') as any[];
    let clickLogsData = clicksList.map((c: any) => ({
      id: c.id,
      linkId: c.link_id,
      timestamp: c.timestamp,
      referrer: c.referrer,
      utmSource: c.utm_source,
      utmMedium: c.utm_medium,
      utmCampaign: c.utm_campaign
    }));

    if (clickLogsData.length === 0 && fallbackJsonDb.clickLogs?.length > 0) {
      clickLogsData = fallbackJsonDb.clickLogs;
      for (const c of clickLogsData) {
        await connection.query(`
          INSERT INTO \`click_logs\` (id, link_id, timestamp, referrer, utm_source, utm_medium, utm_campaign)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [c.id, c.linkId, c.timestamp, c.referrer || '', c.utmSource || '', c.utmMedium || '', c.utmCampaign || '']);
      }
    }

    // 7. Load Visit Logs
    const [visitsList] = await connection.query('SELECT * FROM \`visit_logs\` ORDER BY \`timestamp\` DESC LIMIT 5000') as any[];
    let visitLogsData = visitsList.map((v: any) => ({
      id: v.id,
      timestamp: v.timestamp,
      referrer: v.referrer,
      utmSource: v.utm_source,
      utmMedium: v.utm_medium,
      utmCampaign: v.utm_campaign,
      viewType: v.view_type
    }));

    if (visitLogsData.length === 0 && fallbackJsonDb.visitLogs?.length > 0) {
      visitLogsData = fallbackJsonDb.visitLogs;
      for (const v of visitLogsData) {
        await connection.query(`
          INSERT INTO \`visit_logs\` (id, timestamp, referrer, utm_source, utm_medium, utm_campaign, view_type)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [v.id, v.timestamp, v.referrer || '', v.utmSource || '', v.utmMedium || '', v.utmCampaign || '', v.viewType]);
      }
    }

    // 8. Load GitHub Settings
    const [gSettings] = await connection.query('SELECT * FROM \`github_settings\` LIMIT 1') as any[];
    let githubSettingsData = fallbackJsonDb.githubSettings;
    if (gSettings.length === 0 && fallbackJsonDb.githubSettings) {
      const gs = fallbackJsonDb.githubSettings;
      await connection.query(`
        INSERT INTO \`github_settings\` (id, enabled, token, owner, repo, branch, path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['main_github', gs.enabled ? 1 : 0, gs.token || '', gs.owner || '', gs.repo || '', gs.branch || '', gs.path || '']);
    } else if (gSettings.length > 0) {
      const gs = gSettings[0];
      githubSettingsData = {
        enabled: Boolean(gs.enabled),
        token: gs.token || '',
        owner: gs.owner || '',
        repo: gs.repo || '',
        branch: gs.branch || '',
        path: gs.path || ''
      };
    }

    await connection.end();

    return {
      profile: profileData,
      links: linksData,
      services: servicesData,
      projects: projectsData,
      brands: brandsData,
      clickLogs: clickLogsData,
      visitLogs: visitLogsData,
      githubSettings: githubSettingsData
    };
  } catch (err) {
    console.error('ERROR LOADING DATABASE FROM MYSQL:', err);
    try { await connection.end(); } catch (e) {}
    return fallbackJsonDb;
  }
}

// Write through local state directly into MySQL tables
export async function writeDbToMysql(data: any) {
  const connection = await getMysqlConnection();
  if (!connection) return false;

  try {
    // 1. Save Profile
    if (data.profile) {
      const p = data.profile;
      await connection.query('DELETE FROM \`profile\`');
      await connection.query(`
        INSERT INTO \`profile\` (
          id, name, bio, instagram, tiktok, youtube, email, avatar_url, whatsapp,
          hero_tagline, hero_title_1, hero_title_highlight, hero_description, domicile, contact_phone,
          stats, stats_badge, stats_title, stats_description,
          projects_badge, projects_title, projects_description,
          pricing_badge, pricing_title, pricing_description,
          brands_badge, brands_title,
          terms_badge, terms_title, terms_description,
          contact_badge, contact_title, contact_title_highlight, contact_description,
          terms_of_service, studio_director_title, studio_estd_year,
          linktree_title, ratecard_title, favicon_url, design_settings
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'main_profile', p.name || '', p.bio || '', p.instagram || '', p.tiktok || '', p.youtube || '', p.email || '', p.avatarUrl || '', p.whatsapp || '',
        p.heroTagline || '', p.heroTitle1 || '', p.heroTitleHighlight || '', p.heroDescription || '', p.domicile || '', p.contactPhone || '',
        JSON.stringify(p.stats || []), p.statsBadge || '', p.statsTitle || '', p.statsDescription || '',
        p.projectsBadge || '', p.projectsTitle || '', p.projectsDescription || '',
        p.pricingBadge || '', p.pricingTitle || '', p.pricingDescription || '',
        p.brandsBadge || '', p.brandsTitle || '',
        p.termsBadge || '', p.termsTitle || '', p.termsDescription || '',
        p.contactBadge || '', p.contactTitle || '', p.contactTitleHighlight || '', p.contactDescription || '',
        JSON.stringify(p.termsOfService || []), p.studioDirectorTitle || '', p.studioEstdYear || '',
        p.linktreeTitle || '', p.ratecardTitle || '', p.faviconUrl || '', JSON.stringify(p.designSettings || {})
      ]);
    }

    // 2. Save Links
    if (data.links && Array.isArray(data.links)) {
      await connection.query('DELETE FROM \`links\`');
      for (const link of data.links) {
        await connection.query(`
          INSERT INTO \`links\` (id, title, url, category, clicks, is_active, priority, description, button_label, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [link.id, link.title, link.url, link.category, link.clicks || 0, link.isActive ? 1 : 0, link.priority || 0, link.description || '', link.buttonLabel || '', link.imageUrl || '']);
      }
    }

    // 3. Save Services
    if (data.services && Array.isArray(data.services)) {
      await connection.query('DELETE FROM \`services\`');
      for (const s of data.services) {
        await connection.query(`
          INSERT INTO \`services\` (id, title, price, description, icon, category, is_active, priority, additional_fees)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [s.id, s.title, s.price, s.description || '', s.icon || 'Briefcase', s.category || 'OFFICIAL PLACEMENT', s.isActive ? 1 : 0, s.priority || 0, JSON.stringify(s.additionalFees || [])]);
      }
    }

    // 4. Save Projects
    if (data.projects && Array.isArray(data.projects)) {
      await connection.query('DELETE FROM \`projects\`');
      for (const p of data.projects) {
        await connection.query(`
          INSERT INTO \`projects\` (id, title, highlight, views, image_url, category, url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [p.id, p.title, p.highlight || '', p.views || '', p.imageUrl || '', p.category, p.url]);
      }
    }

    // 5. Save Brands
    if (data.brands && Array.isArray(data.brands)) {
      await connection.query('DELETE FROM \`brands\`');
      for (const b of data.brands) {
        await connection.query(`
          INSERT INTO \`brands\` (id, name, logo_url, is_active, priority)
          VALUES (?, ?, ?, ?, ?)
        `, [b.id, b.name, b.logoUrl || '', b.isActive ? 1 : 0, b.priority || 0]);
      }
    }

    // 6. Save Click Logs
    if (data.clickLogs && Array.isArray(data.clickLogs)) {
      await connection.query('DELETE FROM \`click_logs\`');
      const batchSize = 100;
      for (let i = 0; i < data.clickLogs.length; i += batchSize) {
        const batch = data.clickLogs.slice(i, i + batchSize);
        for (const c of batch) {
          await connection.query(`
            INSERT INTO \`click_logs\` (id, link_id, timestamp, referrer, utm_source, utm_medium, utm_campaign)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [c.id, c.linkId, c.timestamp, c.referrer || '', c.utmSource || '', c.utmMedium || '', c.utmCampaign || '']);
        }
      }
    }

    // 7. Save Visit Logs
    if (data.visitLogs && Array.isArray(data.visitLogs)) {
      await connection.query('DELETE FROM \`visit_logs\`');
      const batchSize = 100;
      for (let i = 0; i < data.visitLogs.length; i += batchSize) {
        const batch = data.visitLogs.slice(i, i + batchSize);
        for (const v of batch) {
          await connection.query(`
            INSERT INTO \`visit_logs\` (id, timestamp, referrer, utm_source, utm_medium, utm_campaign, view_type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [v.id, v.timestamp, v.referrer || '', v.utmSource || '', v.utmMedium || '', v.utmCampaign || '', v.viewType]);
        }
      }
    }

    // 8. Save GitHub Settings
    if (data.githubSettings) {
      await connection.query('DELETE FROM \`github_settings\`');
      const gs = data.githubSettings;
      await connection.query(`
        INSERT INTO \`github_settings\` (id, enabled, token, owner, repo, branch, path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['main_github', gs.enabled ? 1 : 0, gs.token || '', gs.owner || '', gs.repo || '', gs.branch || '', gs.path || '']);
    }

    await connection.end();
    return true;
  } catch (err) {
    console.error('ERROR WRITING DB THROUGH TO MYSQL:', err);
    try { await connection.end(); } catch (e) {}
    return false;
  }
}

// Generate an ultra-clean, importable MySQL database dump file.
// Perfect for uploading to phpMyAdmin in cPanel under Strategi B!
export function generateSqlDump(data: any): string {
  const timestamp = new Date().toISOString();
  let sql = `-- ========================================================
-- PHPMyAdmin & MySQL Database Schema & Seed Migration Script
-- Generated Automatically: ${timestamp}
-- Optimized for cPanel phpMyAdmin Import
-- Target Databases: MySQL 5.7+ / MariaDB 10+
-- ========================================================\n\n`;

  sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  // Helper to escape single queries
  const escapeStr = (val: any): string => {
    if (val === undefined || val === null) return 'NULL';
    const escaped = String(val)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    return `'${escaped}'`;
  };

  const escapeNum = (val: any): string => {
    if (val === undefined || val === null) return '0';
    return String(Number(val) || 0);
  };

  // --- PROFILE TABLE ---
  sql += `-- --------------------------------------------------------
-- Table structure for table \`profile\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`profile\`;
CREATE TABLE \`profile\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`bio\` TEXT,
  \`instagram\` VARCHAR(150),
  \`tiktok\` VARCHAR(150),
  \`youtube\` VARCHAR(150),
  \`email\` VARCHAR(150),
  \`avatar_url\` TEXT,
  \`whatsapp\` VARCHAR(50),
  \`hero_tagline\` TEXT,
  \`hero_title_1\` TEXT,
  \`hero_title_highlight\` TEXT,
  \`hero_description\` TEXT,
  \`domicile\` VARCHAR(150),
  \`contact_phone\` VARCHAR(50),
  \`stats\` TEXT,
  \`stats_badge\` VARCHAR(100),
  \`stats_title\` VARCHAR(150),
  \`stats_description\` TEXT,
  \`projects_badge\` VARCHAR(100),
  \`projects_title\` VARCHAR(150),
  \`projects_description\` TEXT,
  \`pricing_badge\` VARCHAR(100),
  \`pricing_title\` VARCHAR(150),
  \`pricing_description\` TEXT,
  \`brands_badge\` VARCHAR(100),
  \`brands_title\` VARCHAR(150),
  \`terms_badge\` VARCHAR(100),
  \`terms_title\` VARCHAR(150),
  \`terms_description\` TEXT,
  \`contact_badge\` VARCHAR(100),
  \`contact_title\` VARCHAR(150),
  \`contact_title_highlight\` VARCHAR(150),
  \`contact_description\` TEXT,
  \`terms_of_service\` TEXT,
  \`studio_director_title\` VARCHAR(150),
  \`studio_estd_year\` VARCHAR(20),
  \`linktree_title\` VARCHAR(250),
  \`ratecard_title\` VARCHAR(250),
  \`favicon_url\` TEXT,
  \`design_settings\` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.profile) {
    const p = data.profile;
    sql += `INSERT INTO \`profile\` VALUES (
      'main_profile',
      ${escapeStr(p.name)},
      ${escapeStr(p.bio)},
      ${escapeStr(p.instagram)},
      ${escapeStr(p.tiktok)},
      ${escapeStr(p.youtube)},
      ${escapeStr(p.email)},
      ${escapeStr(p.avatarUrl)},
      ${escapeStr(p.whatsapp)},
      ${escapeStr(p.heroTagline)},
      ${escapeStr(p.heroTitle1)},
      ${escapeStr(p.heroTitleHighlight)},
      ${escapeStr(p.heroDescription)},
      ${escapeStr(p.domicile)},
      ${escapeStr(p.contactPhone)},
      ${escapeStr(JSON.stringify(p.stats || []))},
      ${escapeStr(p.statsBadge)},
      ${escapeStr(p.statsTitle)},
      ${escapeStr(p.statsDescription)},
      ${escapeStr(p.projectsBadge)},
      ${escapeStr(p.projectsTitle)},
      ${escapeStr(p.projectsDescription)},
      ${escapeStr(p.pricingBadge)},
      ${escapeStr(p.pricingTitle)},
      ${escapeStr(p.pricingDescription)},
      ${escapeStr(p.brandsBadge)},
      ${escapeStr(p.brandsTitle)},
      ${escapeStr(p.termsBadge)},
      ${escapeStr(p.termsTitle)},
      ${escapeStr(p.termsDescription)},
      ${escapeStr(p.contactBadge)},
      ${escapeStr(p.contactTitle)},
      ${escapeStr(p.contactTitleHighlight)},
      ${escapeStr(p.contactDescription)},
      ${escapeStr(JSON.stringify(p.termsOfService || []))},
      ${escapeStr(p.studioDirectorTitle)},
      ${escapeStr(p.studioEstdYear)},
      ${escapeStr(p.linktreeTitle)},
      ${escapeStr(p.ratecardTitle)},
      ${escapeStr(p.faviconUrl)},
      ${escapeStr(JSON.stringify(p.designSettings || {}))}
    );\n\n`;
  }

  // --- LINKS TABLE ---
  sql += `-- --------------------------------------------------------
-- Table structure for table \`links\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`links\`;
CREATE TABLE \`links\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(250) NOT NULL,
  \`url\` TEXT NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`clicks\` INT DEFAULT 0,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`priority\` INT DEFAULT 0,
  \`description\` TEXT,
  \`button_label\` VARCHAR(100),
  \`image_url\` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.links && data.links.length > 0) {
    sql += `INSERT INTO \`links\` VALUES \n`;
    const linksMapped = data.links.map((l: any) => `  (${escapeStr(l.id)}, ${escapeStr(l.title)}, ${escapeStr(l.url)}, ${escapeStr(l.category)}, ${escapeNum(l.clicks)}, ${l.isActive ? 1 : 0}, ${escapeNum(l.priority)}, ${escapeStr(l.description)}, ${escapeStr(l.buttonLabel)}, ${escapeStr(l.imageUrl)})`);
    sql += linksMapped.join(',\n') + ';\n\n';
  }

  // --- SERVICES TABLE ---
  sql += `-- --------------------------------------------------------
-- Table structure for table \`services\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`services\`;
CREATE TABLE \`services\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(250) NOT NULL,
  \`price\` VARCHAR(100) NOT NULL,
  \`description\` TEXT,
  \`icon\` VARCHAR(100) NOT NULL,
  \`category\` VARCHAR(100),
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`priority\` INT DEFAULT 0,
  \`additional_fees\` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.services && data.services.length > 0) {
    sql += `INSERT INTO \`services\` VALUES \n`;
    const sMapped = data.services.map((s: any) => `  (${escapeStr(s.id)}, ${escapeStr(s.title)}, ${escapeStr(s.price)}, ${escapeStr(s.description)}, ${escapeStr(s.icon)}, ${escapeStr(s.category || 'OFFICIAL PLACEMENT')}, ${s.isActive ? 1 : 0}, ${escapeNum(s.priority)}, ${escapeStr(JSON.stringify(s.additionalFees || []))})`);
    sql += sMapped.join(',\n') + ';\n\n';
  }

  // --- PROJECTS TABLE ---
  sql += `-- --------------------------------------------------------
-- Table structure for table \`projects\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`projects\`;
CREATE TABLE \`projects\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(250) NOT NULL,
  \`highlight\` VARCHAR(250),
  \`views\` VARCHAR(50),
  \`image_url\` TEXT,
  \`category\` VARCHAR(100) NOT NULL,
  \`url\` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.projects && data.projects.length > 0) {
    sql += `INSERT INTO \`projects\` VALUES \n`;
    const pMapped = data.projects.map((p: any) => `  (${escapeStr(p.id)}, ${escapeStr(p.title)}, ${escapeStr(p.highlight)}, ${escapeStr(p.views)}, ${escapeStr(p.imageUrl)}, ${escapeStr(p.category)}, ${escapeStr(p.url)})`);
    sql += pMapped.join(',\n') + ';\n\n';
  }

  // --- BRANDS TABLE ---
  sql += `-- --------------------------------------------------------
-- Table structure for table \`brands\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`brands\`;
CREATE TABLE \`brands\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`logo_url\` TEXT,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`priority\` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.brands && data.brands.length > 0) {
    sql += `INSERT INTO \`brands\` VALUES \n`;
    const bMapped = data.brands.map((b: any) => `  (${escapeStr(b.id)}, ${escapeStr(b.name)}, ${escapeStr(b.logoUrl)}, ${b.isActive ? 1 : 0}, ${escapeNum(b.priority)})`);
    sql += bMapped.join(',\n') + ';\n\n';
  }

  // --- CLICK LOGS ---
  sql += `-- --------------------------------------------------------
-- Table structure for table \`click_logs\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`click_logs\`;
CREATE TABLE \`click_logs\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`link_id\` VARCHAR(50) NOT NULL,
  \`timestamp\` VARCHAR(100) NOT NULL,
  \`referrer\` TEXT,
  \`utm_source\` VARCHAR(100),
  \`utm_medium\` VARCHAR(100),
  \`utm_campaign\` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.clickLogs && data.clickLogs.length > 0) {
    sql += `INSERT INTO \`click_logs\` VALUES \n`;
    const clMapped = data.clickLogs.slice(0, 1000).map((c: any) => `  (${escapeStr(c.id)}, ${escapeStr(c.linkId)}, ${escapeStr(c.timestamp)}, ${escapeStr(c.referrer)}, ${escapeStr(c.utmSource)}, ${escapeStr(c.utmMedium)}, ${escapeStr(c.utmCampaign)})`);
    sql += clMapped.join(',\n') + ';\n\n';
  }

  // --- VISIT LOGS ---
  sql += `-- --------------------------------------------------------
-- Table structure for table \`visit_logs\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`visit_logs\`;
CREATE TABLE \`visit_logs\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`timestamp\` VARCHAR(100) NOT NULL,
  \`referrer\` TEXT,
  \`utm_source\` VARCHAR(100),
  \`utm_medium\` VARCHAR(100),
  \`utm_campaign\` VARCHAR(100),
  \`view_type\` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.visitLogs && data.visitLogs.length > 0) {
    sql += `INSERT INTO \`visit_logs\` VALUES \n`;
    const vlMapped = data.visitLogs.slice(0, 1000).map((v: any) => `  (${escapeStr(v.id)}, ${escapeStr(v.timestamp)}, ${escapeStr(v.referrer)}, ${escapeStr(v.utmSource)}, ${escapeStr(v.utmMedium)}, ${escapeStr(v.utmCampaign)}, ${escapeStr(v.viewType)})`);
    sql += vlMapped.join(',\n') + ';\n\n';
  }

  // --- GITHUB SETTINGS ---
  sql += `-- --------------------------------------------------------
-- Table structure for table \`github_settings\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`github_settings\`;
CREATE TABLE \`github_settings\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`enabled\` TINYINT(1) DEFAULT 0,
  \`token\` TEXT,
  \`owner\` VARCHAR(150),
  \`repo\` VARCHAR(150),
  \`branch\` VARCHAR(100),
  \`path\` VARCHAR(250)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.githubSettings) {
    const gs = data.githubSettings;
    sql += `INSERT INTO \`github_settings\` VALUES ('main_github', ${gs.enabled ? 1 : 0}, ${escapeStr(gs.token)}, ${escapeStr(gs.owner)}, ${escapeStr(gs.repo)}, ${escapeStr(gs.branch)}, ${escapeStr(gs.path)});\n\n`;
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  return sql;
}
