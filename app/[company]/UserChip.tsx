import { getUser } from "@/lib/server/get-user";
import { blurDataURL } from "@/lib/util";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export async function UserChip() {
  const user = await getUser();
  if (!user) throw Error;
  return (
    <div className="flex gap-3 items-center bg-emerald-500/25 rounded-full pl-4">
      <span className="font-semibold">{user.username}</span>
      {user.profilePicUrl ? (
        <Image
          placeholder="blur"
          blurDataURL={blurDataURL}
          alt="Your profile picture"
          src={user.profilePicUrl}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="rounded-full w-10 h-10 bg-emerald-500/50 flex items-center justify-center text-white">
          <FontAwesomeIcon icon={faPerson} />
        </div>
      )}
    </div>
  );
}
