export default function Loading({ className }) {
  return (
    <div
      className={`rounded-full w-8 h-8 border-4  border-blue-10 border-t-blue-100 ${className} animate-spin`}
    ></div>
  );
}
