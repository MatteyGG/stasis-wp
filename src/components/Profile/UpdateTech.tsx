// components/settings/UpdateTech.tsx
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const nations = [
  { id: "Vanguard", name: "Vanguard", image: "/source/nation/Vanguard.webp" },
  { id: "Liberty", name: "Liberty", image: "/source/nation/Liberty.webp" },
  { id: "Martyrs", name: "Martyrs", image: "/source/nation/Martyrs.webp" },
];

const groundUnits = [
  { id: "infantry", name: "Пехота", image: "/source/army/Icon-infantry.webp" },
  { id: "LTank", name: "Легкий танк", image: "/source/army/Icon-LTank.webp" },
  { id: "MTank", name: "Средний танк", image: "/source/army/Icon-MTank.webp" },
  { id: "tank-hunter", name: "Истребитель танков", image: "/source/army/Icon-tank-hunter.webp" },
  { id: "HTank", name: "Тяжелый танк", image: "/source/army/Icon-HTank.webp" },
  { id: "SH", name: "Самоходная гаубица", image: "/source/army/Icon-SH.webp" },
];

const airUnits = [
  { id: "fighter", name: "Истребитель", image: "/source/air/fighter.webp" },
  { id: "bomber", name: "Бомбардировщик", image: "/source/air/bomber.webp" },
  { id: "pointBomber", name: "Точечный бомбардировщик", image: "/source/air/pointBomber.webp" },
];

const navalUnits = [
  { id: "destroyer", name: "Эсминец", image: "/source/naval/destroyer.webp" },
  { id: "cruiser", name: "Крейсер", image: "/source/naval/cruiser.webp" },
  { id: "battleship", name: "Линкор", image: "/source/naval/battleship.webp" },
];

// Начальное состояние для слотов техники
const initialSlots = {
  ground: Array(5).fill({ nation: null, unit: null }),
  air: Array(3).fill({ nation: null, unit: null }),
  naval: Array(3).fill({ nation: null, unit: null }),
};

export default function UpdateTech({ 
  initialTechSlots,
  id 
}: { 
  initialTechSlots: any[];
  id: string; 
}) {
  const [selectedSlots, setSelectedSlots] = useState(initialSlots);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Загружаем начальные данные при монтировании компонента
  useEffect(() => {
    if (initialTechSlots && initialTechSlots.length > 0) {
      const newSlots = { ...initialSlots };
      
      initialTechSlots.forEach(slot => {
        if (slot.type === 'ground' && slot.slotIndex < 5) {
          newSlots.ground[slot.slotIndex] = { 
            nation: slot.nation, 
            unit: slot.unit 
          };
        } else if (slot.type === 'air' && slot.slotIndex < 3) {
          newSlots.air[slot.slotIndex] = { 
            nation: slot.nation, 
            unit: slot.unit 
          };
        } else if (slot.type === 'naval' && slot.slotIndex < 3) {
          newSlots.naval[slot.slotIndex] = { 
            nation: slot.nation, 
            unit: slot.unit 
          };
        }
      });
      
      setSelectedSlots(newSlots);
    }
  }, [initialTechSlots]);

  const handleNationSelect = (type: 'ground' | 'air' | 'naval', slotIndex: number, nationId: string) => {
    setSelectedSlots(prev => ({
      ...prev,
      [type]: prev[type].map((slot, index) => 
        index === slotIndex ? { ...slot, nation: nationId, unit: null } : slot
      )
    }));
  };

  const handleUnitSelect = (type: 'ground' | 'air' | 'naval', slotIndex: number, unitId: string) => {
    setSelectedSlots(prev => ({
      ...prev,
      [type]: prev[type].map((slot, index) => 
        index === slotIndex ? { ...slot, unit: unitId } : slot
      )
    }));
  };

  const handleResetSlot = (type: 'ground' | 'air' | 'naval', slotIndex: number) => {
    setSelectedSlots(prev => ({
      ...prev,
      [type]: prev[type].map((slot, index) => 
        index === slotIndex ? { nation: null, unit: null } : slot
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/userUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id, 
          groundUnits: selectedSlots.ground,
          airUnits: selectedSlots.air,
          navalUnits: selectedSlots.naval
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast.success("Настройки техники сохранены!");
      
      setTimeout(() => {
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ошибка при сохранении настроек");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSlot = (type: 'ground' | 'air' | 'naval', slotIndex: number, slot: any) => {
    const units = type === 'ground' ? groundUnits : type === 'air' ? airUnits : navalUnits;
    
    return (
      <div className="border rounded-lg p-3">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs md:text-sm font-medium">Слот {slotIndex + 1}</p>
          {slot.nation && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleResetSlot(type, slotIndex)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          )}
        </div>
        
        {!slot.nation ? (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Выберите нацию</p>
            <div className="flex gap-2">
              {nations.map((nation) => (
                <div
                  key={nation.id}
                  className={`cursor-pointer border rounded-lg p-1 transition-all ${
                    "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => handleNationSelect(type, slotIndex, nation.id)}
                >
                  <Image 
                    src={nation.image} 
                    alt={nation.name} 
                    width={40} 
                    height={40} 
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 border rounded-md">
                <Image 
                  src={nations.find(n => n.id === slot.nation)?.image || ""} 
                  alt={nations.find(n => n.id === slot.nation)?.name || ""} 
                  width={32} 
                  height={32} 
                  className="rounded-md"
                />
              </div>
            </div>
            
            <Select
              value={slot.unit || ""}
              onValueChange={(value) => handleUnitSelect(type, slotIndex, value)}
            >
              <SelectTrigger className="flex-1">
                {slot.unit ? (
                  <div className="flex items-center">
                    <Image 
                      src={units.find(u => u.id === slot.unit)?.image || "/source/help/unit-placeholder.png"} 
                      alt="Unit" 
                      width={20} 
                      height={20} 
                      className="mr-2"
                    />
                    {units.find(u => u.id === slot.unit)?.name}
                  </div>
                ) : (
                  <SelectValue placeholder="Выберите юнит" />
                )}
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    <div className="flex items-center">
                      <Image 
                        src={unit.image || "/source/help/unit-placeholder.png"} 
                        alt={unit.name} 
                        width={20} 
                        height={20} 
                        className="mr-2"
                      />
                      {unit.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <Tabs defaultValue="ground" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="ground" className="text-xs md:text-sm">Наземная</TabsTrigger>
          <TabsTrigger value="air" className="text-xs md:text-sm">Авиация</TabsTrigger>
          <TabsTrigger value="naval" className="text-xs md:text-sm">Флот</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ground" className="space-y-4">
          <h3 className="text-sm md:text-base font-medium">Наземная техника</h3>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {selectedSlots.ground.map((slot, index) => (
              renderSlot('ground', index, slot)
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="air" className="space-y-4">
          <h3 className="text-sm md:text-base font-medium">Авиация</h3>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {selectedSlots.air.map((slot, index) => (
              renderSlot('air', index, slot)
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="naval" className="space-y-4">
          <h3 className="text-sm md:text-base font-medium">Морские единицы</h3>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {selectedSlots.naval.map((slot, index) => (
              renderSlot('naval', index, slot)
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
        {isLoading ? "Сохранение..." : "Сохранить изменения"}
      </Button>
    </form>
  );
}