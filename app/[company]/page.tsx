import { getCompany } from "@/lib/server/get-company";
import { PageProps } from "@/lib/util";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export default async function CompanyPage({ params }: PageProps) {
  const company = await getCompany(params!.company);
  return (
    <div className="p-8 flex flex-col gap-6 m-auto max-w-7xl">
      <Image
        className="rounded-lg w-full max-h-80 object-cover"
        src={company.header_image_url}
        alt="Company Header Image"
        width={1280}
        height={384}
      />
      <h1 className="text-3xl font-bold">Welcome to {company.title}</h1>
      <p className="text-neutral-800">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut quam
        ultrices, rutrum elit et, vestibulum quam. Nulla eget lobortis nisi.
        Aliquam a mattis odio, a tincidunt magna, proin quis vestibulum purus,
        sed porttitor nulla. Duis eget magna at risus vestibulum pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis
        egestas. Integer convallis eu metus in pretium. Pellentesque posuere
        ullamcorper mi, ac ullamcorper justo dictum et.
      </p>
      <h3 className="text-xl font-bold">Your on-going courses</h3>
      <div className="flex flex-wrap gap-4">
        <CourseCard
          companyId={company.route}
          courseId="course-0"
          image={
            "https://images.unsplash.com/photo-1666624481302-3a9920b039b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDR8NnNNVmpUTFNrZVF8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
          }
          title={"Lorem ipsum dolor sit amet"}
          subtitle={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        />
        <CourseCard
          companyId={company.route}
          courseId="course-1"
          image={
            "https://images.unsplash.com/photo-1666797630713-f5a2e54d3d23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDZ8NnNNVmpUTFNrZVF8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
          }
          title={"Lorem ipsum dolor sit amet"}
          subtitle={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        />
      </div>
      <h3 className="text-xl font-bold">Other Courses</h3>
      <div className="flex flex-wrap gap-4">
        <CourseCard
          companyId={company.route}
          courseId="course-2"
          image={
            "https://images.unsplash.com/photo-1656498933204-93bbef61edeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fDZzTVZqVExTa2VRfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
          }
          title={"Lorem ipsum dolor sit amet"}
          subtitle={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        />
      </div>
    </div>
  );
}

const CourseCard: FC<{
  image: string;
  title: string;
  subtitle: string;
  courseId: string;
  companyId: string;
}> = ({ image, title, subtitle, companyId, courseId }) => {
  return (
    <Link href={`/${companyId}/${courseId}`}>
      <div className="w-80 flex flex-col gap-2 transition rounded-lg  group cursor-pointer">
        <Image
          width={320}
          height={180}
          src={image}
          alt="Course Image"
          className="rounded-lg aspect-video object-cover group-hover:shadow-lg group-hover:scale-105 transition"
        />
        <h4 className="font-bold text-lg  group-hover:underline">{title}</h4>
        <span className="text-neutral-600 overflow-hidden text-ellipsis group-hover:underline">
          {subtitle}
        </span>
      </div>
    </Link>
  );
};
