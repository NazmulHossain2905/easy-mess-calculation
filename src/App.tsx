import { decrement, increment } from "@/store/slices/counterSlice";
import { useAppDispatch, useAppSelector, type RootState } from "./store";
// import { decrement, increment } from "./store/slices/counterSlice";

export default function App() {
  const count = useAppSelector((state: RootState) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
