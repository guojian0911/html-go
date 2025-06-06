
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// MySQL 连接配置
const MYSQL_CONFIG = {
  hostname: "rm-2zeci3z6ogyl025l59o.mysql.rds.aliyuncs.com",
  username: "chip",
  password: "chip@2024",
  db: "html-go",
  port: 3306,
}

// 清理 UTF-8MB4 字符的函数
function sanitizeForMySQL(text: string): string {
  // 移除或替换 4 字节 UTF-8 字符（如 emoji）
  return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, format, password } = await req.json();

    console.log('Creating share with format:', format);

    // 清理代码中的问题字符
    const sanitizedCode = sanitizeForMySQL(code);
    
    // 生成唯一 ID
    const shareId = generateId();
    
    // 准备数据
    const isProtected = password ? 1 : 0;
    const createdAt = Date.now();
    
    console.log('Generated share ID:', shareId);
    console.log('Original code length:', code.length);
    console.log('Sanitized code length:', sanitizedCode.length);

    // 创建 MySQL 连接
    const mysql = await import('https://deno.land/x/mysql@v2.12.1/mod.ts');
    const client = await new mysql.Client().connect(MYSQL_CONFIG);

    try {
      // 插入数据到 pages 表
      await client.execute(`
        INSERT INTO pages (id, html_content, created_at, password, is_protected, code_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [shareId, sanitizedCode, createdAt, password || null, isProtected, format]);

      console.log('Successfully inserted share into database');

      // 关闭连接
      await client.close();

      return new Response(
        JSON.stringify({ 
          success: true, 
          shareId,
          shareUrl: `${req.headers.get('origin') || 'http://localhost:8080'}/share/${shareId}`
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );

    } catch (dbError) {
      console.error('Database error:', dbError);
      await client.close();
      throw dbError;
    }

  } catch (error) {
    console.error('Error creating share:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to create share' 
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
