/**
 * Migration Script: Google Sheets to MySQL
 * 
 * This script migrates data from Google Sheets to the MySQL database.
 * 
 * Usage: npm run migrate
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Google Sheets API configuration
const GOOGLE_SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID;
const GOOGLE_API_KEY = process.env.VITE_GOOGLE_API_KEY;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'edizo_db',
  port: process.env.DB_PORT || 3306
};

// Helper to fetch Google Sheets data
async function fetchSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${sheetName}?key=${GOOGLE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.values || data.values.length <= 1) {
      console.warn(`No data found in sheet: ${sheetName}`);
      return [];
    }
    
    return data.values.slice(1); // Skip header row
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error.message);
    return [];
  }
}

// Parse internship data from sheets
function parseInternshipRow(row) {
  const parseFloatSafe = (value) => {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  const parseArray = (value) => {
    if (!value || value.trim() === '') return [];
    return value.split(',').map(s => s.trim()).filter(Boolean);
  };
  
  return {
    internship_id: row[0] || `INT-${Date.now()}`,
    title: row[1] || 'Untitled',
    category: row[2] || 'General',
    mode: row[3] === 'Offline' ? 'Offline' : 'Online',
    company: row[4] || 'EDIZO',
    image_url: row[5] || null,
    rating: parseFloatSafe(row[6]),
    description: row[7] || '',
    why_choose_edizo: JSON.stringify([row[8], row[9], row[10], row[11], row[12], row[13], row[14]].filter(Boolean)),
    benefits: JSON.stringify([row[15], row[16], row[17], row[18], row[19], row[20], row[21]].filter(Boolean)),
    syllabus: JSON.stringify({
      '15-days': parseArray(row[22]),
      '1-month': parseArray(row[23]),
      '2-months': parseArray(row[24]),
      '3-months': parseArray(row[25])
    }),
    pricing: JSON.stringify({
      '15-days': parseFloatSafe(row[26]),
      '1-month': parseFloatSafe(row[27]),
      '2-months': parseFloatSafe(row[28]),
      '3-months': parseFloatSafe(row[29])
    }),
    discount: JSON.stringify({
      '15-days': parseFloatSafe(row[30]),
      '1-month': parseFloatSafe(row[31]),
      '2-months': parseFloatSafe(row[32]),
      '3-months': parseFloatSafe(row[33])
    }),
    available_coupons: JSON.stringify([]), // Simplified for migration
    coupon_discounts: JSON.stringify({
      '15-days': parseFloatSafe(row[35]),
      '1-month': parseFloatSafe(row[36]),
      '2-months': parseFloatSafe(row[37]),
      '3-months': parseFloatSafe(row[38])
    }),
    is_active: true,
    is_featured: false,
    display_order: 0
  };
}

// Parse team member data
function parseTeamMemberRow(row, index) {
  return {
    name: row[0] || 'Unknown',
    role: row[1] || 'Team Member',
    photo_url: row[2] || null,
    email: row[3] || null,
    is_active: true,
    display_order: index
  };
}

// Parse stats data
function parseStatRow(row, index) {
  return {
    key: row[0] || `stat_${index}`,
    value: row[1] || '',
    label: row[2] || '',
    category: 'general',
    display_order: index,
    is_active: true
  };
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting migration from Google Sheets to MySQL...\n');
  
  let connection;
  
  try {
    // Connect to database
    console.log('📡 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');
    
    // Check Google Sheets configuration
    if (!GOOGLE_SHEET_ID || !GOOGLE_API_KEY) {
      console.error('❌ Missing Google Sheets configuration in .env file');
      return;
    }
    
    // Migrate Internships
    console.log('📋 Migrating Internships...');
    const internshipRows = await fetchSheetData('Internships');
    
    for (const row of internshipRows) {
      const data = parseInternshipRow(row);
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      await connection.execute(`
        INSERT INTO internships (
          id, internship_id, title, slug, category, mode, company, image_url,
          rating, description, why_choose_edizo, benefits, syllabus, pricing,
          discount, available_coupons, coupon_discounts, is_active, is_featured, display_order
        ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title = VALUES(title)
      `, [
        data.internship_id, data.title, slug, data.category, data.mode, data.company,
        data.image_url, data.rating, data.description, data.why_choose_edizo, data.benefits,
        data.syllabus, data.pricing, data.discount, data.available_coupons,
        data.coupon_discounts, data.is_active, data.is_featured, data.display_order
      ]);
    }
    console.log(`✅ Migrated ${internshipRows.length} internships\n`);
    
    // Migrate Team Members
    console.log('👥 Migrating Team Members...');
    const teamRows = await fetchSheetData('Our Team');
    
    for (let i = 0; i < teamRows.length; i++) {
      const data = parseTeamMemberRow(teamRows[i], i);
      
      await connection.execute(`
        INSERT INTO team_members (id, name, role, photo_url, email, is_active, display_order)
        VALUES (UUID(), ?, ?, ?, ?, ?, ?)
      `, [data.name, data.role, data.photo_url, data.email, data.is_active, data.display_order]);
    }
    console.log(`✅ Migrated ${teamRows.length} team members\n`);
    
    // Migrate Stats
    console.log('📊 Migrating Stats...');
    const statsRows = await fetchSheetData('Stats');
    
    for (let i = 0; i < statsRows.length; i++) {
      const data = parseStatRow(statsRows[i], i);
      
      await connection.execute(`
        INSERT INTO stats (id, \`key\`, value, label, category, display_order, is_active)
        VALUES (UUID(), ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE value = VALUES(value), label = VALUES(label)
      `, [data.key, data.value, data.label, data.category, data.display_order, data.is_active]);
    }
    console.log(`✅ Migrated ${statsRows.length} stats\n`);
    
    // Migrate Services
    console.log('🛠️ Migrating Services...');
    const serviceRows = await fetchSheetData('Services');
    
    for (const row of serviceRows) {
      const data = {
        title: row[0] || 'Service',
        slug: row[1] || row[0]?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        short_description: row[2] || '',
        description: row[3] || '',
        category: row[4] || 'Development',
        is_active: true
      };
      
      await connection.execute(`
        INSERT INTO services (id, title, slug, short_description, description, category, is_active)
        VALUES (UUID(), ?, ?, ?, ?, ?, ?)
      `, [data.title, data.slug, data.short_description, data.description, data.category, data.is_active]);
    }
    console.log(`✅ Migrated ${serviceRows.length} services\n`);
    
    // Migrate Events
    console.log('📅 Migrating Events...');
    const eventRows = await fetchSheetData('Events');
    
    for (const row of eventRows) {
      const data = {
        title: row[0] || 'Event',
        slug: row[1] || row[0]?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        event_type: row[2] || 'Event',
        description: row[3] || '',
        start_date: row[4] ? new Date(row[4]) : new Date(),
        mode: row[5] || 'Online',
        is_active: true
      };
      
      await connection.execute(`
        INSERT INTO events (id, title, slug, event_type, description, start_date, mode, is_active)
        VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)
      `, [data.title, data.slug, data.event_type, data.description, data.start_date, data.mode, data.is_active]);
    }
    console.log(`✅ Migrated ${eventRows.length} events\n`);
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Database connection closed');
    }
  }
}

// Run migration
migrate().catch(console.error);
