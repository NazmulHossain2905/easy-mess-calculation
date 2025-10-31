"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IMarket } from "@/interfaces/IMarket";
import { useAppDispatch, useAppSelector } from "@/store";
import { addOtherCost, deleteOtherCost } from "@/store/slices/otherCostSlice";
import { toast } from "sonner";
import AddSmallCostModal from "./models/AddSmallCostModal";
import AddOtherCostModal from "./models/AddOtherCostModal";

// Columns definition
const getColumns = (
  onEdit: (user: IMarket) => void,
  onDelete: (id: string) => void,
): ColumnDef<IMarket>[] => [
  {
    accessorKey: "serial-no",
    header: () => <div className="font-bold text-orange-500">নং.</div>,
    cell: ({ row }) => (
      <div className="font-bold">{(row.index + 1).toLocaleString("bn-BD")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: () => <div className="font-bold text-green-500">তারিখ</div>,
    cell: ({ row }) => (
      <div className="font-bold capitalize">
        {new Intl.DateTimeFormat("bn-BD", { dateStyle: "long" }).format(
          new Date(row.original.date),
        )}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({}) => <div className="font-bold text-lime-500">বিবরণ</div>,
    cell: ({ row }) => (
      <div className="font-bold text-emerald-600">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="font-bold text-indigo-500">খরচ</div>,
    cell: ({ row }) => (
      <div className="font-bold">
        {new Intl.NumberFormat("bn-BD", {
          style: "decimal",
        })
          .format(row.original.amount)
          .concat(" ৳")}
      </div>
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.amount, 0);
      return (
        <div className="font-bold">
          মোট: {total.toLocaleString("bn-BD")} টাকা
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="font-bold text-indigo-500">অ্যাকশন</div>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-gray-500">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem
            className="font-bold"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="font-bold text-red-500"
            onClick={() => onDelete(row.original.id!)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// Main Component
export default function SmallCostList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data = useAppSelector((state) => state.otherCosts.otherCosts);
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingMarketer, setEditingMarketer] = React.useState<IMarket | null>(
    null,
  );

  const handleEdit = (marketer: IMarket) => {
    setEditingMarketer(marketer);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteOtherCost(id));
    setEditingMarketer(null);

    const findCost = data.find((marketer) => marketer.id === id);

    toast("বিবিধ খরচ ডিলিট করা হয়েছে", {
      description: `বিবরণ: ${findCost?.title}`,

      action: {
        label: "Undo",
        onClick: () => dispatch(addOtherCost(findCost!)),
      },
    });
  };

  const columns = getColumns(handleEdit, handleDelete);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
        বিবিধ খরচের তালিকা
      </h1>

      <div className="flex items-center py-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="বিবরণের মাধ্যমে খুঁজুন..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="w-sm"
          />
          <Button variant="default" onClick={() => setIsOpen(true)}>
            যোগ করুন <Plus />
          </Button>
        </div>

        <AddOtherCostModal
          open={isOpen}
          onOpenChange={setIsOpen}
          initialData={editingMarketer}
          setInitialData={setEditingMarketer}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  className="capitalize"
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <TableCell key={footer.id}>
                    {flexRender(
                      footer.column.columnDef.footer,
                      footer.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
