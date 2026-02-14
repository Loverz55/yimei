"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGenerations } from "@/hooks/admin/useGenerations";
import { useImagePreview } from "@/hooks/admin/useImagePreview";
import { PreviewDialog } from "./GenerationsTable/PreviewDialog";
import { GenerationsToolbar } from "./GenerationsTable/GenerationsToolbar";
import { GenerationRow } from "./GenerationsTable/GenerationRow";
import { TablePagination } from "./GenerationsTable/TablePagination";

export function GenerationsTable() {
  const {
    data,
    pagination,
    loading,
    page,
    pageSize,
    loadData,
    handlePageChange,
    handlePageSizeChange,
  } = useGenerations();

  const { previewImage, loadingPreview, handleImageClick, closePreview } =
    useImagePreview();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground">加载生成记录中...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">暂无生成记录</p>
        <Button className="mt-4" onClick={() => loadData()}>
          重新加载
        </Button>
      </Card>
    );
  }

  if (!pagination) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">分页信息加载失败</p>
        <Button className="mt-4" onClick={() => loadData()}>
          重新加载
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PreviewDialog
        previewImage={previewImage}
        loadingPreview={loadingPreview}
        onClose={closePreview}
      />

      <GenerationsToolbar
        total={pagination.total}
        onRefresh={() => loadData()}
        loading={loading}
      />

      {/* 表格 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>预览</TableHead>
              <TableHead>用户</TableHead>
              <TableHead>Prompt</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>成本</TableHead>
              <TableHead>时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record) => (
              <GenerationRow
                key={record.id}
                record={record}
                onImageClick={handleImageClick}
              />
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* 分页 */}
      <TablePagination
        page={page}
        pageSize={pageSize}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
