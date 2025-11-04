import React from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useAppSelector } from "@/store";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

const tableHeader = [
  "নং",
  "নাম",
  "মিল",
  "ফিঃ মিল",
  "মিল রেট",
  "ফিঃ মিল খরচ",
  "বিবিধ",
  "মোট খরচ",
  "টাকা জমা",
  "অতিথি মিল খরচ",
  "জরিমানা",
  "টাকা দেনা",
  "টাকা পাওনা",
  "চাউল জমা",
  "অতিরিক্ত চাউল",
  "খালার চাউল",
  "চাউল খরচ",
  "চাউল দেনা",
  "চাউল পাওনা",
]
  .map(
    (th) =>
      `<th style="padding: 0.75rem 1rem; text-align: center; font-weight: bold; font-size: 14px; color: #1d4ed8;">${th}</th>`,
  )
  .join("");

const DownloadPdf: React.FC = () => {
  const members = useAppSelector((state) => state.members.members);
  const messInfo = useAppSelector((state) => state.moreInfo.messInfo);
  const managerInfo = useAppSelector((state) => state.moreInfo.managerInfo);
  const marketers = useAppSelector((state) => state.marketers.marketers);
  const smallCosts = useAppSelector((state) => state.smallCosts.smallCosts);
  const otherCosts = useAppSelector((state) => state.otherCosts.otherCosts);

  // Total Market Cost
  const totalMarketCost = marketers.reduce((prev, curr) => {
    return (prev += curr.amount);
  }, 0);
  const totalSmallCost = smallCosts.reduce((prev, curr) => {
    return (prev += curr.amount);
  }, 0);

  const originalMarketCost = totalMarketCost + totalSmallCost;

  // Total Fixed Meal
  const totalFixedMeal = members.reduce((prev, curr) => {
    return (prev += curr.fixedMeal ?? 0);
  }, 0);

  // Meal Rate
  const mealRate = Number((originalMarketCost / totalFixedMeal).toFixed(2));

  // Fixed Meal Cost
  // const fixedMealCost =

  // Total Other Cost
  const totalOtherCost = otherCosts.reduce((prev, curr) => {
    return (prev += curr.amount);
  }, 0);

  // Other Cost Per-Person
  const otherCostPerPerson = Number(
    (totalOtherCost / members.length).toFixed(2),
  );

  const totalMeal = members.reduce((prev, curr) => {
    return (prev += curr.totalMeal ?? 0);
  }, 0);

  const totalMoney = members.reduce((sum, member) => sum + member.money!, 0);
  const totalGuestMealAmount = members.reduce(
    (sum, member) => sum + member.guestMealAmount!,
    0,
  );
  const totalFineAmount = members.reduce(
    (sum, member) => sum + member.fineAmount!,
    0,
  );
  const totalRice = members.reduce((sum, member) => sum + member.rice!, 0);
  const totalExtraRice = members.reduce(
    (sum, member) => sum + member.extraRice!,
    0,
  );

  const totalRiceDena = members.reduce((sum, member) => {
    const totalRiceCost =
      (member.totalMeal ?? 0) +
      (member.khalarRice ?? 0) +
      (member.extraRice ?? 0);

    const rice = totalRiceCost - (member.rice ?? 0);

    const result = sum + (rice > 0 ? rice : 0);

    return result;
  }, 0);

  const totalRicePawna = members.reduce((sum, member) => {
    const totalRiceCost =
      (member.totalMeal ?? 0) +
      (member.khalarRice ?? 0) +
      (member.extraRice ?? 0);

    const rice = (member.rice ?? 0) - totalRiceCost;

    const result = sum + (rice > 0 ? rice : 0);

    return result;
  }, 0);

  const bn = (text: any) => Number(text).toLocaleString("bn-BD");

  const download = async () => {
    // 1. Build the HTML element you want to capture
    const container = document.createElement("div");
    container.style.padding = "20px";
    container.style.fontFamily = "sans-serif"; // you can change to your Bangla font
    container.innerHTML = `
    <script src="https://cdn.tailwindcss.com"></script>

    <h1 class="text-center text-2xl font-bold text-black">بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</h1>
    <h1 class="text-center text-5xl font-bold text-pink-500">${messInfo.name}</h1>
    <p class="mb-10 text-center text-gray-700">${messInfo.address}</p>


    <h1 class="mb-3 text-center text-4xl font-bold text-blue-500">
      মাসিক চার্ট রিপোর্ট
    </h1>

    <div class="flex items-center justify-between px-5 mb-5">
      <div>
        <h2 class="font-semibold text-gray-800">${managerInfo.name}</h2>
        <h3 class="text-sm font-semibold text-gray-800">${managerInfo.phone}</h3>
      </div>
      <h4 class="font-semibold text-gray-800">${new Intl.DateTimeFormat(
        "bn-BD",
        { dateStyle: "long" },
      ).format(new Date(otherCosts?.[0]?.date ?? new Date()))}</h4>
    </div>
    <div
      class="mx-auto overflow-hidden rounded-lg border border-gray-300 bg-white"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-100">
          <tr class="divide-x divide-gray-300">${tableHeader}</tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          ${members
            .map((member, index) => {
              const fixedMealCost = Math.ceil(
                mealRate * (member.fixedMeal ?? 0) + otherCostPerPerson,
              );

              const totalCost =
                fixedMealCost +
                (member.guestMealAmount ?? 0) +
                (member.fineAmount ?? 0);

              const moneyDena = totalCost - (member.money ?? 0);

              const moneyPawna = (member.money ?? 0) - totalCost;

              const totalRiceCost =
                (member.extraRice ?? 0) +
                (member.totalMeal ?? 0) +
                (member.khalarRice ?? 0);

              const riceDena = totalRiceCost - (member.rice ?? 0);
              const ricePawna = (member.rice ?? 0) - totalRiceCost;

              return `
          <tr class="divide-x">
            <td class="px-1 py-3 text-center font-bold">${bn(index + 1)}</td>
            <td class="px-1 py-3 text-left font-bold">${member.name}</td>
            <td class="px-1 py-3 text-center font-bold">${bn(member.totalMeal)}</td>
            <td class="px-1 py-3 text-center font-bold">${bn(member.fixedMeal)}</td>
            <td class="px-1 py-3 text-center font-bold">${bn(mealRate)}</td>
            <td class="px-1 py-3 text-center font-bold">${bn(mealRate * (member.fixedMeal ?? 0))} ৳</td>
            <td class="px-1 py-3 text-center font-bold">${bn(otherCostPerPerson)} ৳</td>
            <td class="px-1 py-3 text-center font-bold">${bn(totalCost)} ${totalCost > 0 ? " ৳" : ""}</td>
            <td class="px-1 py-3 text-center font-bold">${bn(member.money)} ৳</td>
            <td class="px-1 py-3 text-center font-bold">${bn(member.guestMealAmount)} ${member.guestMealAmount! > 0 ? " ৳" : ""}</td>
            <td class="px-1 py-3 text-center font-bold text-red-500">${bn(member.fineAmount)} ${member.fineAmount! > 0 ? " ৳" : ""}</td>
            <td class="px-1 py-3 text-center font-bold text-red-500">${bn(moneyDena > 0 ? moneyDena : 0)} ${moneyDena > 0 ? " ৳" : ""}</td>
            <td class="px-1 py-3 text-center font-bold text-green-700">${bn(moneyPawna > 0 ? moneyPawna : 0)} ${moneyPawna > 0 ? " ৳" : ""}</td>
            <td class="px-1 py-3 text-center font-bold">${bn(member.rice)} পট</td>
            <td class="px-1 py-3 text-center font-bold">${bn(member.extraRice)} ${(member.extraRice ?? 0) > 0 ? " পট" : ""}</td>
            <td class="px-1 py-3 text-center font-bold">${bn(member.khalarRice)} পট</td>
            <td class="px-1 py-3 text-center font-bold">${bn(totalRiceCost)} পট</td>
            <td class="px-1 py-3 text-center font-bold  text-red-500">${bn(riceDena > 0 ? riceDena : 0)} ${riceDena > 0 ? " পট" : ""}</td>
            <td class="px-1 py-3 text-center font-bold text-green-700">${bn(ricePawna > 0 ? ricePawna : 0)} ${ricePawna > 0 ? " পট" : ""}</td>
          </tr>`;
            })
            .join("")}
        </tbody>
        <tfoot>
          <tr class="divide-x bg-green-100 text-green-700">
            <td class="px-1 py-3 text-center font-bold"></td>
            <td class="px-1 py-3 text-center font-bold"></td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalMeal)}</td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalFixedMeal)}</td>
            <td class="px-1 py-3 text-center font-bold"></td>
            <td class="px-1 py-3 text-center font-bold"></td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalOtherCost)} ৳</td>
            <td class="px-1 py-3 text-center font-bold"></td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalMoney)} ৳</td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalGuestMealAmount)} ৳</td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalFineAmount)} ৳</td>
            <td class="px-1 py-3 text-center font-bold"></td>
            <td class="px-1 py-3 text-center font-bold"></td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalRice)} পট</td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalExtraRice)} পট</td>
            <td class="px-1 py-3 text-center font-bold"></td>
            <td class="px-1 py-3 text-center font-bold"></td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalRiceDena)} পট</td>
            <td class="px-1 py-3 text-center font-bold">মোট: ${bn(totalRicePawna)} পট</td>
          </tr>
        </tfoot>
      </table>
    </div>   
`;
    container.style.background = "#ffffff"; // white background
    document.body.appendChild(container);

    // 2. Use html2canvas‑pro to capture the container
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
      logging: true,
    });

    // 3. Convert canvas to image data
    const imgData = canvas.toDataURL("image/png", 1.0);

    // 4. Create jsPDF and add the image
    const pdf = new jsPDF({
      unit: "px",
      format: "a4",
      orientation: "portrait",
      compress: true,
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("মাসিক_চার্ট.pdf");

    // 5. Clean up
    document.body.removeChild(container);
  };

  return (
    <Button onClick={download} variant="default">
      Download PDF <Download />
    </Button>
  );
};

export default DownloadPdf;
