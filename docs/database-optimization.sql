-- 数据库性能优化建议
-- 针对 render_pages 和 render_profiles 表的索引优化

-- ============================================================================
-- 1. 核心索引优化
-- ============================================================================

-- Gallery页面查询优化：status + created_at 复合索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_render_pages_status_created 
ON render_pages(status, created_at DESC) 
WHERE status = 'published';

-- 用户页面查询优化：user_id + status 复合索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_render_pages_user_status 
ON render_pages(user_id, status, updated_at DESC);

-- 代码类型过滤优化
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_render_pages_code_type 
ON render_pages(code_type) 
WHERE status = 'published';

-- 热门作品查询优化：view_count 索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_render_pages_view_count 
ON render_pages(view_count DESC) 
WHERE status = 'published';

-- ============================================================================
-- 2. 全文搜索优化
-- ============================================================================

-- 创建全文搜索索引（PostgreSQL）
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_render_pages_search 
ON render_pages USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- 用户资料搜索索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_render_profiles_search 
ON render_profiles USING GIN(to_tsvector('english', COALESCE(display_name, '') || ' ' || COALESCE(bio, '')));

-- ============================================================================
-- 3. 性能优化函数
-- ============================================================================

-- 原子性增加浏览次数的函数
CREATE OR REPLACE FUNCTION increment_view_count(page_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE render_pages 
  SET view_count = view_count + 1 
  WHERE id = page_id;
END;
$$ LANGUAGE plpgsql;

-- 原子性增加分享次数的函数
CREATE OR REPLACE FUNCTION increment_share_count(page_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE render_pages 
  SET share_count = share_count + 1 
  WHERE id = page_id;
END;
$$ LANGUAGE plpgsql;

-- 批量获取用户统计信息的函数
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE(
  total_pages INTEGER,
  published_pages INTEGER,
  draft_pages INTEGER,
  total_views INTEGER,
  total_shares INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_pages,
    COUNT(CASE WHEN status = 'published' THEN 1 END)::INTEGER as published_pages,
    COUNT(CASE WHEN status = 'draft' THEN 1 END)::INTEGER as draft_pages,
    COALESCE(SUM(view_count), 0)::INTEGER as total_views,
    COALESCE(SUM(share_count), 0)::INTEGER as total_shares
  FROM render_pages 
  WHERE render_pages.user_id = get_user_stats.user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. 物化视图优化（可选）
-- ============================================================================

-- 创建Gallery页面的物化视图
CREATE MATERIALIZED VIEW IF NOT EXISTS gallery_view AS
SELECT 
  rp.id,
  rp.title,
  rp.description,
  rp.code_type,
  rp.view_count,
  rp.share_count,
  rp.created_at,
  COALESCE(prof.display_name, '匿名用户') as author_name
FROM render_pages rp
LEFT JOIN render_profiles prof ON rp.user_id = prof.id
WHERE rp.status = 'published'
ORDER BY rp.created_at DESC;

-- 为物化视图创建索引
CREATE INDEX IF NOT EXISTS idx_gallery_view_created 
ON gallery_view(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_view_code_type 
ON gallery_view(code_type);

CREATE INDEX IF NOT EXISTS idx_gallery_view_view_count 
ON gallery_view(view_count DESC);

-- 自动刷新物化视图的触发器函数
CREATE OR REPLACE FUNCTION refresh_gallery_view()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY gallery_view;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器（仅在需要时启用）
-- CREATE TRIGGER refresh_gallery_trigger
-- AFTER INSERT OR UPDATE OR DELETE ON render_pages
-- FOR EACH STATEMENT
-- EXECUTE FUNCTION refresh_gallery_view();

-- ============================================================================
-- 5. 查询优化示例
-- ============================================================================

-- 优化后的Gallery查询（使用物化视图）
-- SELECT * FROM gallery_view 
-- WHERE code_type = $1 OR $1 = 'all'
-- ORDER BY created_at DESC 
-- LIMIT $2 OFFSET $3;

-- 优化后的用户页面查询
-- SELECT * FROM render_pages 
-- WHERE user_id = $1 AND status = $2
-- ORDER BY updated_at DESC 
-- LIMIT $3 OFFSET $4;

-- 优化后的搜索查询
-- SELECT * FROM render_pages 
-- WHERE status = 'published' 
--   AND to_tsvector('english', title || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', $1)
-- ORDER BY ts_rank(to_tsvector('english', title || ' ' || COALESCE(description, '')), plainto_tsquery('english', $1)) DESC
-- LIMIT $2 OFFSET $3;

-- ============================================================================
-- 6. 性能监控查询
-- ============================================================================

-- 检查索引使用情况
-- SELECT 
--   schemaname,
--   tablename,
--   indexname,
--   idx_scan,
--   idx_tup_read,
--   idx_tup_fetch
-- FROM pg_stat_user_indexes 
-- WHERE tablename IN ('render_pages', 'render_profiles')
-- ORDER BY idx_scan DESC;

-- 检查表统计信息
-- SELECT 
--   schemaname,
--   tablename,
--   n_tup_ins,
--   n_tup_upd,
--   n_tup_del,
--   n_live_tup,
--   n_dead_tup,
--   last_vacuum,
--   last_autovacuum,
--   last_analyze,
--   last_autoanalyze
-- FROM pg_stat_user_tables 
-- WHERE tablename IN ('render_pages', 'render_profiles');

-- ============================================================================
-- 7. 清理和维护
-- ============================================================================

-- 删除未使用的索引（示例）
-- DROP INDEX IF EXISTS old_unused_index;

-- 重建索引（如果需要）
-- REINDEX INDEX CONCURRENTLY idx_render_pages_status_created;

-- 更新表统计信息
-- ANALYZE render_pages;
-- ANALYZE render_profiles;

-- ============================================================================
-- 8. 注意事项
-- ============================================================================

/*
1. 使用 CONCURRENTLY 选项创建索引，避免锁表
2. 在生产环境中逐步应用这些优化
3. 监控索引的使用情况，删除未使用的索引
4. 定期运行 ANALYZE 更新统计信息
5. 物化视图需要定期刷新，考虑性能影响
6. 根据实际查询模式调整索引策略
*/
