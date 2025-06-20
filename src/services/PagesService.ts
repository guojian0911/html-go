
/**
 * 页面服务主入口 - 统一导出所有页面相关服务
 * 负责处理 render_pages 表的所有 CRUD 操作
 */

import { BasePagesService } from './core/BasePagesService';
import { PageUpdateService } from './core/PageUpdateService';
import { PageMetricsService } from './core/PageMetricsService';

export class PagesService {
  // 基础 CRUD 操作
  static getUserPages = BasePagesService.getUserPages;
  static getPageById = BasePagesService.getPageById;
  static createPage = BasePagesService.createPage;
  static deletePage = BasePagesService.deletePage;

  // 页面更新操作
  static updatePage = PageUpdateService.updatePage;
  static updatePageContent = PageUpdateService.updatePageContent;
  static publishPage = PageUpdateService.publishPage;

  // 指标统计操作
  static incrementViewCount = PageMetricsService.incrementViewCount;
  static incrementShareCount = PageMetricsService.incrementShareCount;
}
