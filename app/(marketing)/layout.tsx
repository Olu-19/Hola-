import { Navbar } from "./_components/Navbar";

const MarketingLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-[100vh]">
            <Navbar />
            <main className="h-[100vh] pt-40">{children}</main>
        </div>
    );
}
 
export default MarketingLayout;