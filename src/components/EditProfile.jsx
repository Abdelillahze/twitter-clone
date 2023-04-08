import { IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Loading from "./Loading";

export default function EditProfile({ changeShowEditProfile, refresh }) {
  const parent = useRef(null);
  const imageFileRef = useRef(null);
  const bannerFileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [upload, setUpload] = useState(false);
  const [data, setData] = useState({
    name: "",
    bio: "",
    image: null,
    selectedImageFile: null,
    selectedBannerFile: null,
    banner: null,
  });

  const fetchProfile = async () => {
    const res = await axios.get("/api/user/profile");
    const data = await res.data;
    setData({
      name: data.user.name,
      bio: data.user.bio,
      selectedImageFile: data.user.image,
      selectedBannerFile: data.user.banner,
      image: data.user.image,
      banner: data.user.banner,
    });
    setLoading(false);
    return data;
  };

  const handleSubmit = async () => {
    setUpload(true);
    let image = null;
    let banner = null;
    if (data.selectedImageFile) {
      const formData = new FormData();
      formData.append("file", data.selectedImageFile);
      formData.append("upload_preset", "profiles");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dj1fjrjqx/image/upload`,
        formData
      );
      const dataImg = await res.data;
      image = dataImg.secure_url;
    }
    if (data.selectedBannerFile) {
      const formData = new FormData();
      formData.append("file", data.selectedBannerFile);
      formData.append("upload_preset", "banners");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dj1fjrjqx/image/upload`,
        formData
      );
      const dataImg = await res.data;
      banner = dataImg.secure_url;
    }

    await axios.patch("/api/user/profile", { ...data, image, banner });
    refresh();
    setUpload(false);
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
        className="bg-black-100 w-full h-full py-2 sm:w-2/3 lg:w-1/3"
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
                disabled={upload}
                className={`mr-2 font-bold text-black-100 bg-white-100 rounded-full w-16 h-10 px-3 py-2 transition-opacity ${
                  !upload && "hover:opacity-90"
                } ${upload && "opacity-70"}`}
              >
                Save
              </button>
            </div>
            <div className="relative transition-opacity hover:opacity-90 h-40 w-full mb-2 mx-auto cursor-pointer bg-borderColor">
              {data.banner && (
                <IoMdClose
                  className="absolute text-white-100 cursor-pointer h-6 w-6 top-1 left-1 py-1 rounded-full transition-colors hover:bg-black-30"
                  onClick={() => {
                    setData((data) => ({ ...data, banner: null }));
                  }}
                />
              )}
              <div
                className="w-full h-full"
                onClick={() => {
                  bannerFileRef.current && bannerFileRef.current.click();
                }}
              >
                {data.banner && (
                  <>
                    <Image
                      className="object-cover h-full w-full"
                      src={data.banner}
                      alt={"pfp"}
                      width="500"
                      height="500"
                    />
                  </>
                )}
              </div>

              <input
                onChange={(e) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    setData((data) => ({
                      ...data,
                      banner: URL.createObjectURL(file),
                      selectedBannerFile: file,
                    }));
                  }
                }}
                ref={bannerFileRef}
                type="file"
                className="hidden"
              />
            </div>
            <div
              onClick={() => {
                imageFileRef.current && imageFileRef.current.click();
              }}
              className="transition-opacity hover:opacity-90 h-28 w-28 rounded-full ml-4 border-2 border-black-100 -translate-y-1/2 cursor-pointer bg-borderColor"
            >
              {data.image && (
                <Image
                  className="h-full w-full rounded-full"
                  src={data.image}
                  alt={"pfp"}
                  width="500"
                  height="500"
                />
              )}
              <input
                ref={imageFileRef}
                onChange={(e) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    setData((data) => ({
                      ...data,
                      image: URL.createObjectURL(file),
                      selectedImageFile: file,
                    }));
                  }
                }}
                type="file"
                className="hidden"
              />
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
