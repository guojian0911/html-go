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
    const { pageId } = await req.json();

    console.log('Publishing draft with pageId:', pageId);

    // 验证输入
    if (!pageId) {
      throw new Error('Missing required field: pageId');
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

    // 首先验证页面是否存在且属于当前用户
    const { data: existingPage, error: fetchError } = await supabase
      .from('render_pages')
      .select('*')
      .eq('id', pageId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingPage) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Page not found or access denied' 
        }),
        { 
          status: 404,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // 检查页面是否已经是发布状态
    if (existingPage.status === 'published') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Page is already published' 
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // 更新页面状态为已发布
    const { data, error } = await supabase
      .from('render_pages')
      .update({
        status: 'published',
        title: existingPage.title.replace('草稿', '作品'), // 更新标题
        updated_at: new Date().toISOString()
      })
      .eq('id', pageId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to publish page: ${error.message}`);
    }

    console.log('Successfully published page:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Page published successfully',
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
    console.error('Error publishing page:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to publish page'
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
