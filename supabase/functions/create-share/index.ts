
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, format, password } = await req.json();

    console.log('Creating share with format:', format);
    console.log('Code length:', code?.length || 0);

    // 验证输入
    if (!code || !format) {
      throw new Error('Missing required fields: code and format');
    }

    // 获取认证用户信息
    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // 创建 Supabase 客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 验证用户身份
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required' 
        }),
        { 
          status: 401,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // 生成唯一 ID
    const shareId = generateId();
    
    console.log('Generated share ID:', shareId);

    // 插入数据到 render_pages 表
    const { data, error } = await supabase
      .from('render_pages')
      .insert({
        id: shareId,
        user_id: userId,
        title: `${format.toUpperCase()} 分享`,
        description: `通过 HTML-Go 分享的 ${format} 内容`,
        html_content: code,
        code_type: format,
        status: 'published',
        is_protected: !!password,
        password: password || null
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to save share: ${error.message}`);
    }

    console.log('Successfully created share:', data);

    const shareUrl = `${req.headers.get('origin') || new URL(req.url).origin}/share/${shareId}`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        shareId,
        shareUrl,
        data
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

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
