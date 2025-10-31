import UserList from "./components/UserList";
import MarketerList from "./components/MarketerList";
import SmallCostList from "./components/SmallCostList";
import OthersCostList from "./components/OtherCostList";
import OthersFields from "./components/OthersFileds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "./store";
import {
  Layout,
  List,
  ListChecks,
  MoreHorizontal,
  Settings,
  Store,
  Trash2Icon,
  Users,
} from "lucide-react";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteAllMarketers } from "./store/slices/marketerSlice";
import { deleteAllMember } from "./store/slices/memberSlice";
import { deleteAllSmallCost } from "./store/slices/smallCostSlice";
import { deleteAllOtherCosts } from "./store/slices/otherCostSlice";
import { changeLayout, deleteAllMoreInfo } from "./store/slices/moreInfoSlice";
import AccountChart from "./components/AccountChart";

function App() {
  const messInfo = useAppSelector((state) => state.moreInfo.messInfo);
  const layout = useAppSelector((state) => state.moreInfo.layout);

  const dispatch = useAppDispatch();

  const deleteAll = () => {
    dispatch(deleteAllMember());
    dispatch(deleteAllMarketers());
    dispatch(deleteAllSmallCost());
    dispatch(deleteAllOtherCosts());
    dispatch(deleteAllMoreInfo());
  };

  return (
    <main className="px-5 pt-5">
      {/* {Object.values(managerInfo).filter(Boolean).length ? ( */}
      <div className="mb-5">
        <p className="text-center">بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</p>
        <h1 className="scroll-m-20 text-center text-5xl font-extrabold tracking-tight">
          {messInfo.name}
        </h1>
        <p className="text-center">{messInfo.address}</p>
      </div>
      {/* ) : null} */}

      <div className="absolute top-5 right-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-5 w-56" align="start">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Layout />
                <span className="capitalize">{layout}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={layout}
                  onValueChange={(value) => dispatch(changeLayout(value))}
                >
                  <DropdownMenuRadioItem value="single-page">
                    Single Page
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="tabs">
                    Tabs
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Trash2Icon />
                Delete
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem variant="destructive" onClick={deleteAll}>
                    <Trash2Icon />
                    সব কিছু
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => dispatch(deleteAllMember())}>
                    <Users />
                    সদস্যদের তালিকা
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => dispatch(deleteAllMarketers())}
                  >
                    <Store />
                    বাজার খরচের তালিকা
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => dispatch(deleteAllSmallCost())}
                  >
                    <List />
                    খুচরা খরচের তালিকা
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => dispatch(deleteAllOtherCosts())}
                  >
                    <ListChecks />
                    বিবিধ খরচের তালিকা
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => dispatch(deleteAllMoreInfo())}
                  >
                    <MoreHorizontal />
                    আরও কিছু বিষয়
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {layout === "tabs" ? (
        <Tabs defaultValue="user-list" className="w-full">
          <TabsList className="mb-5 self-center">
            <TabsTrigger value="user-list">সদস্য তালিকা</TabsTrigger>
            <TabsTrigger value="marketer-list">বাজার খরচ</TabsTrigger>
            <TabsTrigger value="small-cost">খুচরা খরচ</TabsTrigger>
            <TabsTrigger value="other-cost">বিবিধ খরচ</TabsTrigger>
            <TabsTrigger value="more">আরও</TabsTrigger>
            <TabsTrigger value="chart">হিসাবের চার্ট</TabsTrigger>
          </TabsList>
          <TabsContent value="user-list">
            <UserList />
          </TabsContent>
          <TabsContent value="marketer-list">
            <MarketerList />
          </TabsContent>
          <TabsContent value="small-cost">
            <SmallCostList />
          </TabsContent>
          <TabsContent value="other-cost">
            <OthersCostList />
          </TabsContent>
          <TabsContent value="more">
            <OthersFields />
          </TabsContent>
          <TabsContent value="chart">
            <AccountChart />
          </TabsContent>
        </Tabs>
      ) : layout === "single-page" ? (
        <>
          <UserList />
          <MarketerList />
          <SmallCostList />
          <OthersCostList />
          <OthersFields />
          <AccountChart />
        </>
      ) : null}
    </main>
  );
}

export default App;
