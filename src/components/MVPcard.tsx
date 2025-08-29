import Image from "next/image";

export interface MVPcardProps {
    nickname: string;
    description: string;
    children: React.ReactNode;
}

export const MVPcard = ({ nickname, description, children }: MVPcardProps) => {
    return (
        <div className="relative min-h-[300px] flex flex-col overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat">
            {children}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative z-10 p-4 text-white">
                <h3 className="text-4xl font-bold">{nickname}</h3>
                <p className="text-md">{description}</p>
            </div>
        </div>
    );
};

