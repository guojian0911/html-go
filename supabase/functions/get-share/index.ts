
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
    const { id, password } = await req.json();

    console.log('Getting share with ID:', id);

    if (!id) {
      throw new Error('Share ID is required');
    }

    // 创建 Supabase 客户端
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 查询分享数据 - 支持草稿和已发布的预览
    const { data, error } = await supabase
      .from('render_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Share not found');
    }

    if (!data) {
      throw new Error('Share not found');
    }

    // 检查是否需要密码
    if (data.is_protected) {
      if (!password) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            requiresPassword: true,
            error: 'Password required'
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // 验证密码
      if (data.password !== password) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Incorrect password'
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
    }

    // 更新查看次数
    await supabase
      .from('render_pages')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    // 返回数据
    const shareData = {
      id: data.id,
      content: data.html_content,
      createdAt: new Date(data.created_at).getTime(),
      codeType: data.code_type,
      isProtected: data.is_protected,
      title: data.title,
      description: data.description
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: shareData
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

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
