import Button from "@/components/Button";

const HomeContainer = () => {
    return (
        <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-5xl font-bold mb-6">Houston We Have a Program</h1>
            <Button label="Get Started" onClick={() => alert('Get started clicked!')} />
        </main>
    );
};

export default HomeContainer;
