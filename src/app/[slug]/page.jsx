import { fetchAPI } from "../../app/api/api.js";
import Image from "next/image.js";
import { krona_one } from "@/app/fonts";
import BandBio from "@/components/frondend/BandBio.jsx";
import { HeartIcon } from "@heroicons/react/24/outline";

export async function generateMetadata({ params }) {
  const { slug } = params;
  const fetchData = await fetchAPI("/bands");
  const filterData = fetchData.filter((band) => band.slug === slug);
  const band = filterData[0];
  // Husk at sætte en if statement på, så der er fejl hvis den ikke finder data...
  if (!band) {
    return { title: "Band Not Found" };
  }
  return {
    title: `FooFest - ${band.name}`,
  };
}

export async function generateStaticParams() {
  const data = await fetchAPI("/bands");
  return data.map((band) => ({
    slug: band.slug,
  }));
}

export default async function Band({ params }) {
  const { slug } = params;
  const fetchBandsData = await fetchAPI("/bands");
  const fetchScheduleData = await fetchAPI("/schedule");

  const filterBandsData = fetchBandsData.filter((band) => band.slug === slug);
  const band = filterBandsData[0];

  if (!band) {
    return <div>Band not found</div>;
  }

  let bandSchedule = [];

  Object.keys(fetchScheduleData).forEach((stage) => {
    Object.keys(fetchScheduleData[stage]).forEach((day) => {
      fetchScheduleData[stage][day].forEach((event) => {
        if (event.act === band.name) {
          bandSchedule.push({ ...event, stage, day });
        }
      });
    });
  });

  return (
    <>
      <section className="grid grid-cols-gridContent">
        <div className="col-start-2 col-end-5">
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col p-5">
              <h1 className={`${krona_one.className} text-4xl text-center py-5`}>{band.name}</h1>
              {bandSchedule.length > 0 &&
                bandSchedule.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center text-center pb-6">
                    <div className="uppercase bg-labelColor text-secondaryTextColor rounded-lg w-28 lg:w-36 lg:px-5 py-3">
                      {schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1)} {schedule.start}
                    </div>
                    <div className="uppercase bg-labelColor text-secondaryTextColor rounded-lg w-28 lg:w-36 lg:px-5 py-3">{schedule.stage}</div>
                    <div>
                      <HeartIcon className="stroke-primaryTextColor stroke-2 transition duration-800 ease-in h-12 hover:fill-primaryColor" />
                    </div>
                  </div>
                ))}
              <div className="pb-6">
                <BandBio bio={band.bio} />
              </div>
              <div>
                <div className="rounded-lg overflow-hidden">
                  <iframe
                    title="playliste"
                    src="https://open.spotify.com/embed/artist/08GQAI4eElDnROBrJRGE0X?utm_source=generator"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="w-full h-88" // Tailwind classes for width and height
                  ></iframe>
                </div>
              </div>
            </div>
            <figure className="py-5">
              <Image src={band.logo.includes("https") ? band.logo : `/logos/${band.logo}`} width={400} height={400} alt="Picture of Artist" />
              <p className=" text-xs text-right px-2">{band.logoCredits}</p>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
