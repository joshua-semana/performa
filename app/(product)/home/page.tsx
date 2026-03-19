import { wait } from "@/lib/utils";

export default async function Home() {
  await wait(2000); // 2 seconds delay
  return (
    <div className="p-4">
      <h1 className="h-screen">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae
        voluptatum accusamus reiciendis consectetur, eos quisquam rerum sunt
        illo qui mollitia totam iusto minima sit voluptatem, similique explicabo
        commodi ab! Aliquam?
      </h1>
      <h1 className="h-screen">Home</h1>
    </div>
  );
}
