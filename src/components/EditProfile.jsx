import { IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

export default function EditProfile({ changeShowEditProfile, refresh }) {
  const parent = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: "",
    bio: "",
  });

  const fetchProfile = async () => {
    const res = await axios.get("/api/user/profile");
    const data = await res.data;
    setData({ name: data.user.name, bio: data.user.bio });
    setLoading(false);
    return data;
  };

  const handleSubmit = async () => {
    await axios.patch("/api/user/profile", data);
    refresh();
    closeHandler();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const closeHandler = () => {
    changeShowEditProfile();
    parent.current.remove();
    document.getElementById("portal").display = "none";
  };

  return (
    <div className="absolute grid z-20 place-items-center bg-blue-5 w-full h-full">
      <div
        ref={parent}
        className="bg-black-100 w-full h-full py-2 sm:w-2/3 lg:w-1/3 sm:h-80"
      >
        {loading ? (
          <Loading className={"mx-auto mt-8"} />
        ) : (
          <>
            <div className="px-2 flex items-center justify-between text-white-100 h-14 mb-4">
              <div className="flex items-center">
                <IoMdClose
                  onClick={closeHandler}
                  className="cursor-pointer h-10 w-10 py-2 rounded-full transition-colors hover:bg-white-10"
                />
                <h1 className="font-bold text-lg">Edit Profile</h1>
              </div>
              <button
                onClick={handleSubmit}
                className="mr-2 font-bold text-black-100 bg-white-100 rounded-full w-16 h-10 px-3 py-2 transition-opacity hover:opacity-90"
              >
                Save
              </button>
            </div>

            <div className="px-4">
              <label htmlFor="name" className="block text-white-100 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="name"
                value={data.name}
                onChange={(e) =>
                  setData((data) => ({ ...data, name: e.target.value }))
                }
                className="w-full border border-borderColor outline-none bg-transparent text-white-100 py-2 px-4 rounded mb-4"
              />
              <label htmlFor="bio" className="block text-white-100 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                type="text"
                placeholder="Bio"
                value={data.bio}
                onChange={(e) =>
                  setData((data) => ({ ...data, bio: e.target.value }))
                }
                className="w-full border border-borderColor outline-none bg-transparent text-white-100 py-2 px-4 rounded mb-4"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
