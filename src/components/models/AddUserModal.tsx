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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import type { IUser } from "@/interfaces/IUser";
import { randomUid } from "rand-uid";
import { useAppDispatch, useAppSelector } from "@/store";
import { addMember, editMember } from "@/store/slices/memberSlice";
import { toast } from "sonner";
import { getInitials } from "@/utils/getInitials";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: IUser | null;
  setEditingUser?: (user: IUser | null) => void;
}

const USER: IUser = {
  photoUrl: "",
  name: "",
  money: undefined,
  rice: undefined,
  totalMeal: undefined,
  extraRice: 0,
  guestMealAmount: 0,
  fineAmount: 0,
};

export default function AddUserModal({
  open,
  onOpenChange,
  initialData,
  setEditingUser,
}: ModalProps) {
  const members = useAppSelector((state) => state.members.members);
  const fixedMealAmount = useAppSelector(
    (state) => state.moreInfo.fixedMealPerPerson,
  );
  const khalarRicePerPerson = useAppSelector(
    (state) => state.moreInfo.khalarRicePerPerson,
  );
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState<IUser>(initialData ?? USER);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "name": {
        setUserData({
          ...userData,
          [name]: value,
        });
        return;
      }
    }

    setUserData({
      ...userData,
      [name]: value === "" ? "" : isNaN(Number(value)) ? value : Number(value),
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUser: IUser = {
      id: randomUid(),
      ...userData,
      fixedMeal: fixedMealAmount,
      khalarRice: khalarRicePerPerson,
    };

    if (initialData) {
      dispatch(editMember({ id: userData.id!, editedMember: userData }));
      toast("মেম্বার আপডেট হয়েছে", {
        description: ` নামঃ ${newUser.name}`,
      });
    } else {
      dispatch(addMember(newUser));

      toast("মেম্বার যোগ হয়েছে", {
        description: ` নামঃ ${newUser.name}`,
      });
    }

    setUserData({ roll: members.length + 2, ...USER });

    onOpenChange(false);

    setEditingUser?.(null);

    console.log("User added:", newUser);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserData({ ...userData, photoUrl: url });
  };

  useEffect(() => {
    setUserData({ ...userData, roll: members.length + 1 });
  }, []);

  useEffect(() => {
    if (initialData) setUserData(initialData);
    else setUserData({ roll: members.length + 1, ...USER });
  }, [initialData]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        setUserData({ roll: members.length + 1, ...userData });
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              সদস্য {initialData ? "আপডেট " : "যোগ"} করুন
            </DialogTitle>
            <DialogDescription>
              {initialData ? "সদস্য আপডেট " : "নতুন সদস্য যুক্ত"} করুন এবং
              প্রয়োজনীয় তথ্য পূরণ করুন।
            </DialogDescription>
            <Avatar className="my-4 size-20">
              <AvatarImage
                src={userData.photoUrl || undefined}
                className="object-cover"
              />

              <AvatarFallback className="text-lg font-bold uppercase">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-end gap-4">
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="profile-url">
                  ছবি যোগ করুন (লিঙ্ক বা আপলোড)
                </Label>

                <div className="flex gap-4">
                  <Input
                    id="profile-url"
                    name="photoUrl"
                    type="text"
                    placeholder="এখানে একটি ছবির লিঙ্ক দিন"
                    value={userData.photoUrl}
                    onChange={onChange}
                  />
                  <Label
                    htmlFor="profile-url-local"
                    className="rounded-sm bg-slate-950 px-2"
                  >
                    <Upload className="size-5 text-white" />
                  </Label>
                  <Input
                    id="profile-url-local"
                    type="file"
                    className="hidden"
                    name="photoUrl"
                    onChange={handleFileUpload}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="grid w-1/2 gap-3">
                <Label htmlFor="name">সদস্যের নাম লিখুন</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="সদস্যের নাম লিখুন"
                  value={userData["name"]}
                  onChange={onChange}
                  onFocus={(e) => e.target.select()}
                />
              </div>

              <div className="grid w-1/2 gap-3">
                <Label htmlFor="roll">সদস্যের ক্রমিক নং (রোল) লিখুন</Label>
                <Input
                  id="roll"
                  name="roll"
                  required
                  type="number"
                  placeholder="সদস্যের ক্রমিক নং (রোল/সিরিয়াল) লিখুন"
                  value={userData["roll"]}
                  onChange={onChange}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="grid w-1/2 gap-3">
                <Label htmlFor="money">জমা দেওয়া অর্থ</Label>
                <Input
                  type="number"
                  placeholder="কত টাকা জমা দিয়েছে"
                  id="money"
                  required
                  name="money"
                  value={userData["money"] ?? ""}
                  onChange={onChange}
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className="grid w-1/2 gap-3">
                <Label htmlFor="rice">কত পট চাউল জমা দিয়েছে</Label>
                <Input
                  id="rice"
                  name="rice"
                  type="number"
                  placeholder="কত পট চাউল জমা দিয়েছে"
                  required
                  value={userData["rice"] ?? ""}
                  onChange={onChange}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="grid w-1/2 gap-3">
                <Label htmlFor="total-meal">মোট মিলের সংখ্যা</Label>
                <Input
                  type="number"
                  id="total-meal"
                  name="totalMeal"
                  placeholder="মোট কতটি মিল চলেছে"
                  required
                  value={userData["totalMeal"] ?? ""}
                  onChange={onChange}
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className="grid w-1/2 gap-3">
                <Label htmlFor="guest-meal">অতিথি মিলের টাকা</Label>
                <Input
                  type="number"
                  id="guest-meal"
                  name="guestMealAmount"
                  placeholder="অতিথি মিলের টাকা"
                  required
                  value={userData["guestMealAmount"]}
                  onChange={onChange}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="grid w-1/2 gap-3">
                <Label htmlFor="extraRice">অতিরিক্ত চাউল কত পট</Label>
                <Input
                  id="extraRice"
                  name="extraRice"
                  type="number"
                  placeholder="অতিরিক্ত চাউল কত পট"
                  required
                  value={userData["extraRice"]}
                  onChange={onChange}
                  onFocus={(e) => e.target.select()}
                />
              </div>

              <div className="grid w-1/2 gap-3">
                <Label htmlFor="fine-amount">জরিমানা</Label>
                <Input
                  id="fine-amount"
                  name="fineAmount"
                  type="number"
                  placeholder="যেমনঃ বাজার না করা"
                  required
                  value={userData["fineAmount"]}
                  onChange={onChange}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>
            {initialData && (
              <div className="flex w-full gap-4">
                <div className="grid w-1/2 gap-3">
                  <Label htmlFor="fixedMeal">ফিক্সড মিল কত টি</Label>
                  <Input
                    id="fixedMeal"
                    name="fixedMeal"
                    type="number"
                    placeholder="ফিক্সড মিল কত টি"
                    required
                    min={1}
                    step={0.5}
                    value={userData["fixedMeal"]}
                    onChange={onChange}
                    onFocus={(e) => e.target.select()}
                  />
                </div>

                <div className="grid w-1/2 gap-3">
                  <Label htmlFor="khalarRice">খালার জন্য চাউল কত পট</Label>
                  <Input
                    id="khalarRice"
                    name="khalarRice"
                    type="number"
                    placeholder="খালার জন্য চাউল কত পট"
                    value={userData["khalarRice"]}
                    min={0}
                    onChange={onChange}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">বাতিল</Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              {initialData ? "আপডেট " : "যুক্ত"} করুন
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
