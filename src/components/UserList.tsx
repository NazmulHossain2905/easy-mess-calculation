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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IUser } from "@/interfaces/IUser";
import AddUserModal from "./models/AddUserModal";
import { useAppDispatch, useAppSelector } from "@/store";
import { getInitials } from "@/utils/getInitials";
import { addMember, deleteMember } from "@/store/slices/memberSlice";
import { toast } from "sonner";

// Columns definition
const getColumns = (
  onEdit: (user: IUser) => void,
  onDelete: (id: string) => void,
): ColumnDef<IUser>[] => [
  {
    accessorKey: "roll",
    header: () => <div className="font-bold text-orange-500">নং.</div>,
    cell: ({ row }) => (
      <div className="font-bold">
        {row.original.roll!.toLocaleString("bn-BD")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="font-bold text-green-500">সদস্য</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={row.original.photoUrl!}
            className="object-cover"
            alt={row.original.name}
          />
          <AvatarFallback className="font-bold uppercase">
            {getInitials(row.original.name)}
          </AvatarFallback>
        </Avatar>
        <div className="text-[16px] font-bold capitalize">
          {row.original.name}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "money",
    header: ({ column }) => (
      <Button
        className="font-bold text-emerald-600"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        টাকা জমা <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="pl-2 font-bold text-emerald-600">
        {new Intl.NumberFormat("bn-BD", {
          style: "decimal",
        }).format(row.original.money!) + " ৳"}
      </div>
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.money!, 0);
      return (
        <div className="font-bold">
          মোট: {total.toLocaleString("bn-BD")} টাকা
        </div>
      );
    },
  },
  {
    accessorKey: "rice",
    header: () => <div className="font-bold text-indigo-500">চাউল জমা</div>,
    cell: ({ row }) => (
      <div className="font-bold">
        {new Intl.NumberFormat("bn-BD", {
          style: "decimal",
          currency: "BDT",
        }).format(row.original.rice!)}
        {" পট"}
      </div>
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.rice!, 0);
      return (
        <div className="font-bold">মোট: {total.toLocaleString("bn-BD")} পট</div>
      );
    },
  },
  {
    accessorKey: "extraRice",
    header: () => <div className="font-bold text-blue-500">অতিরিক্ত চাউল</div>,
    cell: ({ row }) => (
      <div className="font-bold">
        {new Intl.NumberFormat("bn-BD", {
          style: "decimal",
          currency: "BDT",
        }).format(row.original.extraRice!)}
        {" পট"}
      </div>
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.extraRice!, 0);
      return (
        <div className="font-bold">মোট: {total.toLocaleString("bn-BD")} পট</div>
      );
    },
  },
  {
    accessorKey: "totalMeal",
    header: () => <div className="font-bold text-pink-600">মোট মিল</div>,
    cell: ({ row }) => (
      <div className="font-bold">
        {/* {new Intl.NumberFormat("bn-BD", {
          style: "decimal",
          currency: "BDT",
        }).format(row.original.totalMeal)} */}
        {row.original.totalMeal?.toLocaleString("bn-BD")}
      </div>
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.totalMeal!, 0);
      return (
        <div className="font-bold">মোট: {total.toLocaleString("bn-BD")}</div>
      );
    },
  },
  {
    accessorKey: "guestMealAmount",
    header: () => <div className="font-bold text-amber-600">অতিথি মিল খরচ</div>,
    cell: ({ row }) => (
      <p className="font-bold">
        {row.original.guestMealAmount?.toLocaleString("bn-BD").concat(" ৳")}
      </p>
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.guestMealAmount!, 0);
      return (
        <div className="font-bold">
          মোট: {total.toLocaleString("bn-BD")} টাকা
        </div>
      );
    },
  },
  {
    accessorKey: "fineAmount",
    header: () => <div className="font-bold text-red-600">জরিমানা</div>,
    cell: ({ row }) => (
      <p className="font-bold">
        {row.original.fineAmount!.toLocaleString("bn-BD").concat(" ৳")}
      </p>
    ),
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.fineAmount!, 0);
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
    cell: ({ row }) => {
      return (
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
      );
    },
  },
];

// Main Component
export default function UserList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const members = useAppSelector((state) => state.members.members);

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<IUser | null>(null);

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteMember(id));
    setEditingUser(null);

    const findMember = members.find((member) => member.id === id);

    toast("সদস্য  ডিলিট করা হয়েছে", {
      description: `নাম: ${findMember?.name}`,

      action: {
        label: "Undo",
        onClick: () => dispatch(addMember(findMember!)),
      },
    });
  };
  const dispatch = useAppDispatch();

  const columns = getColumns(handleEdit, handleDelete);

  const sortedMembers = React.useMemo(() => {
    return [...members].sort((a, b) => (a.roll ?? 0) - (b.roll ?? 0));
  }, [members]);

  const table = useReactTable({
    data: sortedMembers,
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
        সদস্যদের তালিকা
      </h1>

      <div className="flex items-center py-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="নামের মাধ্যমে খুঁজুন..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            className="w-sm"
          />
          <Button
            variant="default"
            onClick={() => {
              setIsOpen(true);
              setEditingUser(null);
            }}
          >
            যোগ করুন <Plus />
          </Button>
        </div>

        <AddUserModal
          open={isOpen}
          onOpenChange={setIsOpen}
          initialData={editingUser}
          setEditingUser={setEditingUser}
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
                  colSpan={
                    getColumns(
                      (_) => {},
                      (_) => {},
                    ).length
                  }
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
