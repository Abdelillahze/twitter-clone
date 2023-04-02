import Link from "next/link";

export default function notFound() {
  return (
    <div className="min-h-[100vh] grid bg-black-100 text-white-100 place-items-center">
      <p>
        404,{" "}
        <Link href="/home" className="hover:underline">
          Back to Home Page
        </Link>
      </p>
    </div>
  );
}

notFound.getLayout = (page) => {
  return page;
};
