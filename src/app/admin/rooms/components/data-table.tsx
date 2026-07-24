"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row as ReactTableRow,
} from "@tanstack/react-table"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, GripVertical } from "lucide-react"
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDeleteSelected?: (ids: string[]) => void
  onReorder?: (items: TData[]) => void
}

const DraggableRow = ({ row, children, className }: { row: ReactTableRow<any>, children: React.ReactNode, className?: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: (row.original as any).id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      id={`row-${(row.original as any).id}`}
      data-state={row.getIsSelected() && "selected"}
      className={cn(className, isDragging && "opacity-50 relative z-50 bg-slate-800")}
    >
      <TableCell className="w-8 p-0 pl-2">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-teal-400 p-1 flex items-center justify-center">
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>
      {children}
    </TableRow>
  )
}

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
  onDeleteSelected,
  onReorder,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>(initialData)
  
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)

  const selectColumn = React.useMemo<ColumnDef<TData, any>>(() => ({
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center pr-3 w-8">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-white/20 text-white data-[state=checked]:bg-teal-500 data-[state=checked]:text-slate-950"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center pr-3 w-8">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-white/20 text-white data-[state=checked]:bg-teal-500 data-[state=checked]:text-slate-950"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }), [])

  const finalColumns = React.useMemo(() => {
    if (onDeleteSelected) {
      return [selectColumn, ...columns]
    }
    return columns
  }, [columns, onDeleteSelected, selectColumn])

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const handleDeleteConfirm = () => {
    if (onDeleteSelected) {
      const selectedIds = selectedRows.map((row) => (row.original as any).id)
      onDeleteSelected(selectedIds)
    }
    table.resetRowSelection()
    setDeleteConfirmOpen(false)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = data.findIndex((item: any) => item.id === active.id)
      const newIndex = data.findIndex((item: any) => item.id === over?.id)
      const newArray = arrayMove(data, oldIndex, newIndex)
      
      setData(newArray)
      
      if (onReorder) {
        onReorder(newArray)
      }
    }
  }

  return (
    <div className="glass-card-dark border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden w-full text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-white/5 bg-slate-950/20 gap-4">
        <Input
          placeholder="Фильтр по названию номера..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-slate-950/40 border-white/10 text-white focus:border-teal-400/50 shadow-sm rounded-xl h-11"
        />

        {selectedCount > 0 && onDeleteSelected && (
          <Button
            onClick={() => setDeleteConfirmOpen(true)}
            className="bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-400 hover:to-red-500 text-white font-bold border-0 shadow-lg shadow-rose-500/20 rounded-xl px-5 h-11 self-start sm:self-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Удалить выбранные ({selectedCount})
          </Button>
        )}
      </div>
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader className="bg-slate-950/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-white/5 hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0;
                  const isSecond = index === 1 && onDeleteSelected;
                  return (
                    <React.Fragment key={header.id}>
                      {index === 0 && <TableHead className="w-8"></TableHead>}
                      <TableHead
                        className={cn(
                        "whitespace-nowrap font-bold text-teal-300 py-2 px-2 sm:py-4 sm:px-6 text-xs sm:text-sm",
                        isFirst && "sticky left-0 bg-[#070b13] z-20 border-r border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.3)]",
                        isSecond && "sticky left-8 sm:left-[60px] bg-[#070b13] z-20 border-r border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.3)]"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    </React.Fragment>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={data.map((item: any) => item.id)} strategy={verticalListSortingStrategy}>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <DraggableRow
                      key={row.id}
                      row={row}
                      className="group border-b border-white/5 hover:bg-white/5 data-[state=selected]:bg-teal-500/10 hover:data-[state=selected]:bg-teal-500/20 transition-colors"
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        const isFirst = index === 0;
                    const isSecond = index === 1 && onDeleteSelected;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "whitespace-nowrap py-1.5 px-2 sm:py-4 sm:px-6 text-slate-300 text-xs sm:text-sm font-light",
                          isFirst && "sticky left-0 bg-[#0f172a] group-hover:bg-[#1e293b] group-data-[state=selected]:bg-[#0d2e30] group-data-[state=selected]:group-hover:bg-[#114b4e] z-10 border-r border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.3)] transition-colors",
                          isSecond && "sticky left-8 sm:left-[60px] bg-[#0f172a] group-hover:bg-[#1e293b] group-data-[state=selected]:bg-[#0d2e30] group-data-[state=selected]:group-hover:bg-[#114b4e] z-10 border-r border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.3)] transition-colors"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </DraggableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className="h-24 text-center text-slate-400 font-light">
                  Нет результатов.
                </TableCell>
              </TableRow>
            )}
              </SortableContext>
            </DndContext>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 px-6 border-t border-white/5 bg-slate-950/20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
        >
          Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
        >
          Вперед
        </Button>
      </div>
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Удалить выбранные элементы?"
        description={`Вы действительно хотите удалить выбранные элементы (${selectedCount} шт.)? Это действие необратимо.`}
      />
    </div>
  )
}

