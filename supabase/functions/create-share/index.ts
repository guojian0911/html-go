
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 更彻底的字符清理函数
function sanitizeText(text: string): string {
  if (!text) return '';
  
  // 移除所有可能有问题的字符，只保留基本的 ASCII 和基本 UTF-8 字符
  return text
    // 移除所有 emoji 和特殊符号
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '') // 所有补充符号区域
    .replace(/[\u{E000}-\u{F8FF}]/gu, '')   // 私用区域
    .replace(/[\u{20000}-\u{2FFFF}]/gu, '') // CJK 扩展区域
    .replace(/[\u{30000}-\u{3FFFF}]/gu, '') // 更多扩展区域
    // 移除代理对
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    // 移除其他高位字符
    .replace(/[^\u0000-\uD7FF\uE000-\uFFFF]/g, '')
    // 确保字符串是有效的
    .normalize('NFC');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, format, password } = await req.json();

    console.log('Creating share with format:', format);
    console.log('Original code length:', code?.length || 0);

    // 验证输入
    if (!code || !format) {
      throw new Error('Missing required fields: code and format');
    }

    // 清理代码中的问题字符
    const sanitizedCode = sanitizeText(code);
    console.log('Sanitized code length:', sanitizedCode.length);
    
    if (!sanitizedCode.trim()) {
      throw new Error('Content becomes empty after sanitization');
    }
    
    // 生成唯一 ID
    const shareId = generateId();
    
    // 准备数据
    const isProtected = password ? 1 : 0;
    const createdAt = Date.now();
    
    console.log('Generated share ID:', shareId);

    // 获取 MySQL 配置 - 确保使用正确的数据库
    const MYSQL_CONFIG = {
      hostname: Deno.env.get('MYSQL_HOST') || "rm-2zeci3z6ogyl025l59o.mysql.rds.aliyuncs.com",
      username: Deno.env.get('MYSQL_USER') || "chip", 
      password: Deno.env.get('MYSQL_PASSWORD') || "chip@2024",
      db: Deno.env.get('MYSQL_DATABASE') || "html-go", // 确保使用正确的数据库名
      port: parseInt(Deno.env.get('MYSQL_PORT') || "3306"),
    };

    console.log('MySQL config:', { 
      hostname: MYSQL_CONFIG.hostname,
      username: MYSQL_CONFIG.username,
      db: MYSQL_CONFIG.db,
      port: MYSQL_CONFIG.port
    });

    // 创建 MySQL 连接
    let client;
    try {
      const mysql = await import('https://deno.land/x/mysql@v2.12.1/mod.ts');
      client = await new mysql.Client().connect(MYSQL_CONFIG);
      console.log('MySQL connection established to database:', MYSQL_CONFIG.db);
    } catch (connectionError) {
      console.error('MySQL connection failed:', connectionError);
      throw new Error(`Database connection failed: ${connectionError.message}`);
    }

    try {
      // 首先检查表是否存在
      console.log('Checking if pages table exists...');
      const checkTableResult = await client.execute("SHOW TABLES LIKE 'pages'");
      console.log('Table check result:', checkTableResult);

      if (!checkTableResult || checkTableResult.length === 0) {
        console.log('Pages table does not exist, creating it...');
        
        // 创建表，使用 utf8mb3 字符集避免 4 字节字符问题
        await client.execute(`
          CREATE TABLE IF NOT EXISTS pages (
            id VARCHAR(12) PRIMARY KEY,
            html_content LONGTEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
            created_at BIGINT,
            password VARCHAR(255),
            is_protected TINYINT(1) DEFAULT 0,
            code_type VARCHAR(50) DEFAULT 'html'
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
        `);
        
        console.log('Pages table created successfully');
      }

      // 插入数据
      console.log('Inserting data into pages table...');
      const insertResult = await client.execute(`
        INSERT INTO pages (id, html_content, created_at, password, is_protected, code_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        shareId, 
        sanitizedCode, 
        createdAt, 
        password || null, 
        isProtected, 
        format
      ]);

      console.log('Successfully inserted share into database');

      // 关闭连接
      await client.close();

      const shareUrl = `${req.headers.get('origin') || new URL(req.url).origin}/share/${shareId}`;

      return new Response(
        JSON.stringify({ 
          success: true, 
          shareId,
          shareUrl
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );

    } catch (dbError) {
      console.error('Database operation error:', dbError);
      if (client) {
        try {
          await client.close();
        } catch (closeError) {
          console.error('Error closing connection:', closeError);
        }
      }
      
      // 提供更详细的错误信息
      let errorMessage = 'Database operation failed';
      if (dbError.message?.includes('Incorrect string value')) {
        errorMessage = 'Content contains unsupported characters after sanitization';
      } else if (dbError.message?.includes('Connection')) {
        errorMessage = 'Database connection error';
      } else if (dbError.message?.includes("doesn't exist")) {
        errorMessage = 'Database table does not exist';
      } else {
        errorMessage = dbError.message || 'Unknown database error';
      }
      
      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error('Error creating share:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to create share',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
