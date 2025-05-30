
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const shareId = url.searchParams.get('id');
    const password = url.searchParams.get('password');

    if (!shareId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Share ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Getting share with ID:', shareId);

    // 创建 MySQL 连接
    const mysql = await import('https://deno.land/x/mysql@v2.12.1/mod.ts');
    const client = await new mysql.Client().connect(MYSQL_CONFIG);

    try {
      // 查询分享内容
      const results = await client.execute(`
        SELECT id, html_content, created_at, password, is_protected, code_type
        FROM pages 
        WHERE id = ?
      `, [shareId]);

      if (!results.rows || results.rows.length === 0) {
        await client.close();
        return new Response(
          JSON.stringify({ success: false, error: 'Share not found' }),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const page = results.rows[0];
      console.log('Found share:', { id: page.id, type: page.code_type, protected: page.is_protected });

      // 检查密码保护
      if (page.is_protected && page.password !== password) {
        await client.close();
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Password required',
            requiresPassword: true 
          }),
          { 
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      await client.close();

      return new Response(
        JSON.stringify({ 
          success: true,
          data: {
            id: page.id,
            content: page.html_content,
            createdAt: page.created_at,
            codeType: page.code_type,
            isProtected: Boolean(page.is_protected)
          }
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
    console.error('Error getting share:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to get share' 
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
