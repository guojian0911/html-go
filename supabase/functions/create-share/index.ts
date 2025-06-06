
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 更彻底的 UTF-8MB4 字符清理函数
function sanitizeForMySQL(text: string): string {
  if (!text) return '';
  
  // 移除所有 4 字节 UTF-8 字符（包括 emoji 和其他特殊字符）
  return text
    // 移除 emoji 表情符号
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // 表情符号
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // 杂项符号和象形文字
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // 交通和地图符号
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // 旗帜
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // 杂项符号
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // 装饰符号
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // 变体选择器
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // 补充符号和象形文字
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // 扩展的象形文字-A
    // 移除其他可能的 4 字节字符
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') // 代理对
    // 只保留基本的 UTF-8 字符（1-3 字节）
    .replace(/[^\u0000-\uFFFF]/g, '');
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
    const sanitizedCode = sanitizeForMySQL(code);
    console.log('Sanitized code length:', sanitizedCode.length);
    
    // 检查清理后的代码是否为空
    if (!sanitizedCode.trim()) {
      throw new Error('Content becomes empty after sanitization');
    }
    
    // 生成唯一 ID
    const shareId = generateId();
    
    // 准备数据
    const isProtected = password ? 1 : 0;
    const createdAt = Date.now();
    
    console.log('Generated share ID:', shareId);

    // 获取 MySQL 配置
    const MYSQL_CONFIG = {
      hostname: Deno.env.get('MYSQL_HOST') || "rm-2zeci3z6ogyl025l59o.mysql.rds.aliyuncs.com",
      username: Deno.env.get('MYSQL_USER') || "chip", 
      password: Deno.env.get('MYSQL_PASSWORD') || "chip@2024",
      db: Deno.env.get('MYSQL_DATABASE') || "html-go",
      port: parseInt(Deno.env.get('MYSQL_PORT') || "3306"),
    };

    console.log('Connecting to MySQL...');

    // 创建 MySQL 连接
    let client;
    try {
      const mysql = await import('https://deno.land/x/mysql@v2.12.1/mod.ts');
      client = await new mysql.Client().connect(MYSQL_CONFIG);
      console.log('MySQL connection established');
    } catch (connectionError) {
      console.error('MySQL connection failed:', connectionError);
      throw new Error(`Database connection failed: ${connectionError.message}`);
    }

    try {
      // 使用参数化查询插入数据到 pages 表
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
        errorMessage = 'Content contains unsupported characters';
      } else if (dbError.message?.includes('Connection')) {
        errorMessage = 'Database connection error';
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
