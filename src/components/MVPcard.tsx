import Image from "next/image";

export interface MVPcardProps {
    nickname: string;
    title: string;
    value: number | string;
    category: string;
    imageUrl: string;
}

export const MVPcard = ({ nickname, title, value, category, imageUrl }: MVPcardProps) => {
    const formatValue = () => {
        // Обрабатываем случаи с undefined/null
        if (value == null) return '0';

        if (category === 'kd') {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return numValue > 0 ? `+${numValue.toFixed(2)}` : numValue.toFixed(2);
        } else if (category === 'resource') {
            return String(value);
        } else {
            const numValue = typeof value === 'string' ? parseInt(value) : value;
            
            if (isNaN(numValue as number)) return '0';

            return numValue > 0 ? `+${numValue}` : String(numValue);
        }
    };

    return (
        <>
            <div className="relative min-h-[300px] flex flex-col overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat">
                <Image
                    src={imageUrl}
                    alt={nickname}
                    className="object-cover z-0"
                    fill
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative z-10 p-4 text-white">
                    <div className="flex-grow">
                        <h3 className="text-lg md:text-md font-bold">{nickname}</h3>
                        <p className="text-sm">{title}</p>
                    </div>
                    <div className="mt-auto">
                        {value != 0 && ( // Используем != вместо !== для проверки на null/undefined
                            <p className="text-lg md:text-xl font-bold">
                                {formatValue()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};