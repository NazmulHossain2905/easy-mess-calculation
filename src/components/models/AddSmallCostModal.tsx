import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { formatDate, isValidDate } from "@/utils/validity";

import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "../ui/textarea";
import { randomUid } from "rand-uid";
import type { IMarket } from "@/interfaces/IMarket";
import { useAppDispatch } from "@/store";
import { addSmallCost, editSmallCost } from "@/store/slices/smallCostSlice";
import { toast } from "sonner";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: IMarket | null;
  setInitialData?: (user: IMarket | null) => void;
}

export default function AddSmallCostModal({
  open,
  onOpenChange,
  initialData,
  setInitialData,
}: ModalProps) {
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newCost: IMarket = {
      id: randomUid(),
      date: date!,
      title,
      amount: Number(amount),
    };

    if (initialData) {
      dispatch(
        editSmallCost({
          id,
          editedSmallCost: { id, amount: Number(amount), date: date!, title },
        }),
      );
      toast("খুচরা খরচ আপডেট হয়েছে", {
        description: `বিবরণ: ${newCost.title}`,
      });
    } else {
      dispatch(addSmallCost(newCost));

      toast("খুচরা খরচ যোগ হয়েছে", {
        description: `বিবরণ: ${newCost.title}`,
      });
    }

    setDate(new Date());
    setTitle("");
    setAmount("");
    setValue(formatDate(new Date()));
    onOpenChange(false);
    setInitialData?.(null);

    console.log("Small Cost added:", newCost);
  };

  useEffect(() => {
    if (initialData) {
      setDate(new Date(initialData.date));
      setId(initialData.id);
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setValue(formatDate(new Date(initialData.date)));
    }
  }, [initialData]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setDate(new Date());
        setTitle("");
        setAmount("");
        setValue(formatDate(new Date()));
        onOpenChange(false);
        setInitialData?.(null);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              খুচরা খরচ {initialData ? "আপডেট" : "যোগ"} করুন
            </DialogTitle>
            <DialogDescription>
              খুচরা খরচের বিস্তারিত {initialData ? "আপডেট" : "যোগ"} করুন।
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 grid gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="date" className="px-1">
                তারিখ দিন
              </Label>
              <div className="relative flex gap-2">
                <Input
                  id="date"
                  value={value}
                  placeholder="October 01, 2025"
                  className="bg-background pr-10"
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setValue(e.target.value);
                    if (isValidDate(date)) {
                      setDate(date);
                      setMonth(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setIsOpen(true);
                    }
                  }}
                />
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-picker"
                      variant="ghost"
                      className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                      <CalendarIcon className="size-3.5" />
                      <span className="sr-only">Select date</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(date) => {
                        setDate(date);
                        setValue(formatDate(date));
                        setIsOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid w-full gap-3">
              <Label htmlFor="title">বিবরণ</Label>
              <Textarea
                className="resize-none"
                placeholder="যেমনঃ তেল, আলু, ডিম, হলুদ ইত্যাদি"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>

            <div className="grid w-full gap-3">
              <Label htmlFor="amount">খরচের পরিমাণ লিখুন</Label>
              <Input
                id="amount"
                required
                placeholder="খরচের পরিমাণ লিখুন"
                type="number"
                value={amount ?? ""}
                min={1}
                onChange={(e) => {
                  const { value } = e.target;
                  setAmount(value);
                }}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">বাতিল</Button>
            </DialogClose>
            <Button type="submit">
              {initialData ? "আপডেট" : "যুক্ত"} করুন
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
