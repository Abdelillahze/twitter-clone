import { forwardRef, useEffect } from "react";

const Selector = forwardRef(({ options, className }, ref) => {
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
        {options.map((option, i) => {
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
