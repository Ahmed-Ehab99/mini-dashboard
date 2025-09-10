import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Skeleton } from "../skeleton";

// DataTable props interface
interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  title: string;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[]; // Fields to search in
  getSearchValue?: (item: T, field: keyof T) => string; // Custom search value extraction
  loading?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: React.ReactNode;
  actions?: React.ReactNode;
  onRowClick?: (item: T) => void;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  title,
  searchPlaceholder = "Search...",
  searchFields = [],
  getSearchValue,
  loading = false,
  emptyStateTitle = "No data available",
  emptyStateDescription = "There are currently no items to display.",
  emptyStateIcon,
  actions,
  onRowClick,
  defaultPageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultPageSize);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter((item) => {
      return searchFields.some((field) => {
        let value: string;

        if (getSearchValue) {
          value = getSearchValue(item, field);
        } else {
          const fieldValue = item[field];
          value = String(fieldValue || "");
        }

        return value.toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, searchFields, getSearchValue]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card className={`shadow-card ${className || ""}`}>
        <CardHeader className="grid-cols-1 gap-5 px-8 md:grid-cols-3">
          <Skeleton className="h-9 w-26" />
          <Skeleton className="h-9 w-52.5 lg:w-90" />
          <div className="flex items-center md:justify-end">
            <Skeleton className="h-9 w-37.5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead key={index} className={column.className}>
                      <Skeleton className="h-8 w-full" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-card ${className || ""}`}>
      {/* Header */}
      <CardHeader className="grid-cols-1 items-center gap-5 px-8 md:grid-cols-3">
        <CardTitle>
          {title} ({filteredData.length})
        </CardTitle>

        {/* Search */}
        {searchFields.length > 0 && (
          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {actions && (
          <div className="flex items-center space-x-2 md:justify-end">
            {actions}
          </div>
        )}
      </CardHeader>

      {/* Table Content */}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.className}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`hover:bg-muted/50 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render
                      ? column.render(item, index)
                      : String(item[column.key as keyof T] || "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="py-12 text-center">
            {emptyStateIcon && (
              <div className="mb-4 flex justify-center">{emptyStateIcon}</div>
            )}
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              {searchQuery ? "No results found" : emptyStateTitle}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "No items match your search criteria. Try adjusting your search terms."
                : emptyStateDescription}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredData.length > 0 && totalPages > 1 && (
          <div className="flex flex-col justify-between gap-5 space-x-2 py-4 md:flex-row md:items-center">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem
                      key={size}
                      value={size.toString()}
                      className="cursor-pointer"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
