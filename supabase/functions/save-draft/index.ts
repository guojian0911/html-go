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

    console.log('Saving draft with format:', format);
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

    // 插入数据到 render_pages 表，明确设置为草稿状态
    const { data, error } = await supabase
      .from('render_pages')
      .insert({
        user_id: userId,
        title: `${format.toUpperCase()} 草稿`,
        description: `通过 HTML-Go 创建的 ${format} 草稿`,
        html_content: code,
        code_type: format,
        status: 'draft', // 明确设置为草稿
        is_protected: !!password,
        password: password || null
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to save draft: ${error.message}`);
    }

    console.log('Successfully created draft:', data);

    // 验证保存的状态
    if (data.status !== 'draft') {
      console.error('Warning: Draft was not saved with draft status:', data.status);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        draftId: data.id,
        message: 'Draft saved successfully',
        data: {
          id: data.id,
          status: data.status,
          title: data.title
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error saving draft:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to save draft'
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
