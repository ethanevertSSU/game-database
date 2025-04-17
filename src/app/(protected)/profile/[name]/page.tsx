// pages/profile/[name].js

import { useRouter } from "next/router";

const UserProfile = () => {
  const router = useRouter();
  const { name } = router.query;
  console.log(name);

  if (!name) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome, {name}!
      </h1>
      <p className="text-gray-600">This is your profile page.</p>
    </div>
  );
};

export default UserProfile;
