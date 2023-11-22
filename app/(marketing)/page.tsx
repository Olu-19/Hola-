import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { Heroes } from "./_components/Heroes";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col flex-1 items-center justify-center text-center gap-y-8 px-6 pb-10">
        <Header />
        <Heroes />
      </div>
      <Footer />
    </div>
  );
}


export default MarketingPage;