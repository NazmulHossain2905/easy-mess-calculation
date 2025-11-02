"use client";

import * as React from "react";
import { Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  changeFixedMeal,
  changeKhalarRice,
  updateManagerInfo,
  updateMessInfo,
} from "@/store/slices/moreInfoSlice";
import { toast } from "sonner";
import { setMember } from "@/store/slices/memberSlice";

// Main Component
export default function OthersFields() {
  const members = useAppSelector((state) => state.members.members);
  const fixedMealAmount = useAppSelector(
    (state) => state.moreInfo.fixedMealPerPerson,
  );
  const khalarRicePerPerson = useAppSelector(
    (state) => state.moreInfo.khalarRicePerPerson,
  );
  const managerInfo = useAppSelector((state) => state.moreInfo.managerInfo);
  const messInfo = useAppSelector((state) => state.moreInfo.messInfo);

  const dispatch = useAppDispatch();

  const [fixedMeal, setFixedMeal] = React.useState(fixedMealAmount + "");
  const [khalarRice, setKhalarRice] = React.useState(khalarRicePerPerson + "");

  // Manager info
  const [manager, setManager] = React.useState(managerInfo);
  const [mess, setMess] = React.useState(messInfo);

  const updateFixedMeal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedFixedMealMembers = members.map((member) => ({
      ...member,
      // fixedMeal: Number(fixedMeal),
      fixedMeal: Math.max(Number(fixedMeal), member.totalMeal ?? 0),
    }));

    dispatch(setMember(updatedFixedMealMembers));

    dispatch(changeFixedMeal(Number(fixedMeal)));

    toast("ফিক্সড মিল", {
      description: "ফিক্সড মিল সঠিক ভাবে পরিবর্তন হয়েছে",
    });
  };

  const updateKhalarRice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedKhalarRiceMembers = members.map((member) => ({
      ...member,
      khalarRice: Number(khalarRice),
    }));

    dispatch(setMember(updatedKhalarRiceMembers));

    dispatch(changeKhalarRice(Number(khalarRice)));

    toast("খালার জন্য চাউল", {
      description: "খালার জন্য চাউল সঠিক ভাবে পরিবর্তন হয়েছে",
    });
  };

  const managerUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(updateManagerInfo(manager));

    toast("ম্যানেজারের তথ্য", {
      description: "ম্যানেজারের তথ্য সঠিক ভাবে পরিবর্তন হয়েছে",
    });
  };

  const messUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(updateMessInfo(mess));

    toast("মেসের তথ্য", {
      description: "মেসের তথ্য সঠিক ভাবে পরিবর্তন হয়েছে",
    });
  };

  return (
    <div className="w-full">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
        আরও কিছু বিষয়
      </h1>

      <div className="flex items-center gap-8 py-4">
        <form onSubmit={updateFixedMeal} className="flex items-end gap-4">
          <div className="grid w-sm items-center gap-3">
            <Label htmlFor="fixed-meal-amount">ফিক্সড মিলের পরিমাণ লিখুন</Label>
            <Input
              type="number"
              id="fixed-meal-amount"
              min={1}
              required
              placeholder="ফিক্সড মিলের পরিমাণ লিখুন, যেমন: ৬৫"
              value={fixedMeal}
              onChange={(e) => setFixedMeal(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <Button variant="default" type="submit">
            পরিবর্তন করুন <Repeat />
          </Button>
        </form>

        <form onSubmit={updateKhalarRice} className="flex items-end gap-4">
          <div className="grid w-sm items-center gap-3">
            <Label htmlFor="fixed-meal-amount">
              জনপ্রতি খালাকে কত পট চাউল দিতে হয় লিখুন
            </Label>
            <Input
              type="number"
              id="fixed-meal-amount"
              min={0}
              required
              placeholder="ফিক্সড মিলের পরিমাণ লিখুন, যেমন: ৬৫"
              value={khalarRice}
              onChange={(e) => setKhalarRice(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <Button variant="default" type="submit">
            পরিবর্তন করুন <Repeat />
          </Button>
        </form>
      </div>

      <div className="my-10 flex-col items-center gap-8">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          ম্যানেজারের তথ্য
        </h2>

        <form onSubmit={managerUpdate} className="mt-4 flex items-end gap-8">
          <div className="grid w-sm items-center gap-3">
            <Label htmlFor="manager-name">ম্যানেজারের নাম লিখুন</Label>
            <Input
              type="text"
              id="manager-name"
              placeholder="ম্যানেজারের নাম লিখুন"
              minLength={3}
              value={manager.name}
              onChange={(e) =>
                setManager((manager) => ({
                  ...manager,
                  name: e.target.value,
                }))
              }
              onFocus={(e) => e.target.select()}
            />
          </div>

          <div className="grid w-sm items-center gap-3">
            <Label htmlFor="manager-mobile-no">
              ম্যানেজারের মোবাইল নাম্বার লিখুন
            </Label>
            <Input
              type="tel"
              id="manager-mobile-no"
              placeholder="ম্যানেজারের মোবাইল নাম্বার লিখুন"
              minLength={11}
              value={manager.phone}
              onChange={(e) =>
                setManager((m) => ({ ...m, phone: e.target.value }))
              }
              onFocus={(e) => e.target.select()}
            />
          </div>

          <Button variant="default">
            পরিবর্তন করুন <Repeat />
          </Button>
        </form>
      </div>

      {/* Mess Info */}
      <div className="my-10 flex-col items-center gap-8">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          মেসের তথ্য
        </h2>

        <form onSubmit={messUpdate} className="mt-4 flex items-end gap-8">
          <div className="grid w-sm items-center gap-3">
            <Label htmlFor="mess-name">মেসের নাম লিখুন</Label>
            <Input
              type="text"
              id="mess-name"
              placeholder="মেসের নাম লিখুন"
              // minLength={3}
              value={mess.name}
              onChange={(e) => setMess((m) => ({ ...m, name: e.target.value }))}
              onFocus={(e) => e.target.select()}
            />
          </div>

          <div className="grid w-sm items-center gap-3">
            <Label htmlFor="mess-address">ঠিকানা (স্থান)</Label>
            <Input
              type="tel"
              id="mess-address"
              placeholder="ঠিকানা (স্থান)"
              value={mess.address}
              onChange={(e) =>
                setMess((m) => ({ ...m, address: e.target.value }))
              }
              onFocus={(e) => e.target.select()}
            />
          </div>

          <Button variant="default">
            পরিবর্তন করুন <Repeat />
          </Button>
        </form>
      </div>
    </div>
  );
}
