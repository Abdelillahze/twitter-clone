import { forwardRef, useEffect } from "react";
import Loading from "./Loading";

const Selector = forwardRef(({ options, className, loading }, ref) => {
  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (ref.current && !ref.current.parentNode.contains(event.target)) {
        ref.current.style.display = "none";
      }
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      <ul className="w-full">
        {loading && <Loading className={"mx-4 my-2 mt-2"} />}
        {options.map((option, i) => {
          if (!option) {
            return;
          }

          return (
            <li
              key={i}
              onClick={option.onClick}
              className={`px-4 py-3 transition-colors hover:bg-white-10`}
            >
              {option.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

Selector.displayName = "Selector";
export default Selector;
