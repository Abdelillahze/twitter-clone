export default function notFound() {
  return (
    <div className="min-h-[100vh] grid bg-black-100 text-white-100 place-items-center">
      404
    </div>
  );
}

notFound.getLayout = (page) => {
  return page;
};
