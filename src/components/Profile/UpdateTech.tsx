// components/settings/UpdateTech.tsx
'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserTechSlot } from "@prisma/client";

// Константы
const NATIONS = [
  { id: "Vanguard", name: "Vanguard", image: "/source/nation/Vanguard.webp" },
  { id: "Liberty", name: "Liberty", image: "/source/nation/Liberty.webp" },
  { id: "Martyrs", name: "Martyrs", image: "/source/nation/Martyrs.webp" },
] as const;

const GROUND_UNITS = [
  { id: "infantry", name: "Пехота", image: "/source/army/Icon-infantry.webp" },
  { id: "LTank", name: "Легкий танк", image: "/source/army/Icon-LTank.webp" },
  { id: "MTank", name: "Средний танк", image: "/source/army/Icon-MTank.webp" },
  { id: "arty", name: "Артиллерия", image: "/source/army/Icon-arty.webp" },
  { id: "tank-hunter", name: "Истребитель танков", image: "/source/army/Icon-tank-hunter.webp" },
  { id: "HTank", name: "Тяжелый танк", image: "/source/army/Icon-HTank.webp" },
  { id: "SH", name: "Сверхтяжелый танк", image: "/source/army/Icon-SH.webp" },
  { id: "howitzer", name: "Противотанковая гаубица", image: "/source/army/Icon-howitzer.webp" },
] as const;

const AIR_UNITS = [
  { id: "fighter", name: "Истребитель", image: "/source/air/Icon-fighter.webp" },
  { id: "bomber", name: "Бомбардировщик", image: "/source/air/Icon-bomber.webp" },
  { id: "pointBomber", name: "Точечный бомбардировщик", image: "/source/air/Icon-pointBomber.webp" },
] as const;

const NAVAL_UNITS = [
  { id: "air_destroyer", name: "Эсминец ПВО", image: "/source/naval/Icon-air_destroyer.webp" },
  { id: "rocket_destroyer", name: "Ракетный эсминец", image: "/source/naval/Icon-rocket_destroyer.webp" },
  { id: "aircraft_carrier", name: "Авианосец", image: "/source/naval/Icon-aircraft_carrier.webp" },
  { id: "submarine", name: "Подводная лодка", image: "/source/naval/Icon-submarine.webp" },
  { id: "armored_destroyer", name: "Бронированный эсминец", image: "/source/naval/Icon-armored_destroyer.webp" },
  { id: "naval_destroyer", name: "Противолодочный корабль", image: "/source/naval/Icon-naval_destroyer.webp" },
] as const;

// Типы
type TechType = 'ground' | 'air' | 'naval';
type NationId = typeof NATIONS[number]['id'];
type UnitId = typeof GROUND_UNITS[number]['id'] | typeof AIR_UNITS[number]['id'] | typeof NAVAL_UNITS[number]['id'];

interface TechSlot {
  nation: NationId | null;
  unit: UnitId | null;
}

interface TechSlots {
  ground: TechSlot[];
  air: TechSlot[];
  naval: TechSlot[];
}

interface UnitDefinition {
  id: UnitId;
  name: string;
  image: string;
}

interface UpdateTechProps {
  initialTechSlots: Omit<UserTechSlot, 'id' | 'userId'>[];
  id: string;
}

// Конфигурация слотов по типам
const SLOTS_CONFIG: Record<TechType, { count: number; units: readonly UnitDefinition[] }> = {
  ground: { count: 5, units: GROUND_UNITS },
  air: { count: 3, units: AIR_UNITS },
  naval: { count: 3, units: NAVAL_UNITS },
};

// Вспомогательная функция для создания начального состояния
const createInitialSlots = (): TechSlots => {
  return {
    ground: Array(SLOTS_CONFIG.ground.count).fill(null).map(() => ({ nation: null, unit: null })),
    air: Array(SLOTS_CONFIG.air.count).fill(null).map(() => ({ nation: null, unit: null })),
    naval: Array(SLOTS_CONFIG.naval.count).fill(null).map(() => ({ nation: null, unit: null })),
  };
};

// Компонент для отображения одного слота
interface TechSlotProps {
  type: TechType;
  slotIndex: number;
  slot: TechSlot;
  onNationSelect: (type: TechType, slotIndex: number, nationId: NationId) => void;
  onUnitSelect: (type: TechType, slotIndex: number, unitId: UnitId) => void;
  onResetSlot: (type: TechType, slotIndex: number) => void;
}

function TechSlotComponent({ 
  type, 
  slotIndex, 
  slot, 
  onNationSelect, 
  onUnitSelect, 
  onResetSlot 
}: TechSlotProps) {
  const units = SLOTS_CONFIG[type].units;
  const selectedNation = slot.nation ? NATIONS.find(n => n.id === slot.nation) : null;
  const selectedUnit = slot.unit ? units.find(u => u.id === slot.unit) : null;

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs md:text-sm font-medium">Слот {slotIndex + 1}</p>
        {slot.nation && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onResetSlot(type, slotIndex)}
            className="h-6 w-6 p-0"
            type="button"
          >
            ×
          </Button>
        )}
      </div>
      
      {!slot.nation ? (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Выберите нацию</p>
          <div className="flex gap-2">
            {NATIONS.map((nation) => (
              <button
                key={nation.id}
                type="button"
                className="cursor-pointer border border-transparent rounded-lg p-1 transition-all hover:border-gray-300"
                onClick={() => onNationSelect(type, slotIndex, nation.id)}
              >
                <Image 
                  src={nation.image} 
                  alt={nation.name} 
                  width={40} 
                  height={40} 
                  className="rounded-md"
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-10 w-10 border rounded-md">
              {selectedNation && (
                <Image 
                  src={selectedNation.image} 
                  alt={selectedNation.name} 
                  width={32} 
                  height={32} 
                  className="rounded-md"
                />
              )}
            </div>
          </div>
          
          <Select
            value={slot.unit || ""}
            onValueChange={(value) => onUnitSelect(type, slotIndex, value as UnitId)}
          >
            <SelectTrigger className="flex-1">
              {selectedUnit ? (
                <div className="flex items-center">
                  <Image 
                    src={selectedUnit.image} 
                    alt={selectedUnit.name} 
                    width={20} 
                    height={20} 
                    className="mr-2"
                  />
                  {selectedUnit.name}
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
                      src={unit.image} 
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
}

// Основной компонент
export default function UpdateTech({ initialTechSlots, id }: UpdateTechProps) {
  const [techSlots, setTechSlots] = useState<TechSlots>(createInitialSlots);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Загрузка начальных данных
  useEffect(() => {
    if (initialTechSlots?.length > 0) {
      const loadedSlots = createInitialSlots();
      
      initialTechSlots.forEach(slot => {
        if (['ground', 'air', 'naval'].includes(slot.type) && 
            slot.slotIndex < SLOTS_CONFIG[slot.type as TechType].count) {
          loadedSlots[slot.type as TechType][slot.slotIndex] = {
            nation: slot.nation as NationId,
            unit: slot.unit as UnitId
          };
        }
      });
      
      setTechSlots(loadedSlots);
    }
  }, [initialTechSlots]);

  // Обработчики с useCallback для оптимизации
  const handleNationSelect = useCallback((type: TechType, slotIndex: number, nationId: NationId) => {
    setTechSlots(prev => ({
      ...prev,
      [type]: prev[type].map((slot, index) => 
        index === slotIndex ? { nation: nationId, unit: null } : slot
      )
    }));
  }, []);

  const handleUnitSelect = useCallback((type: TechType, slotIndex: number, unitId: UnitId) => {
    setTechSlots(prev => ({
      ...prev,
      [type]: prev[type].map((slot, index) => 
        index === slotIndex ? { ...slot, unit: unitId } : slot
      )
    }));
  }, []);

  const handleResetSlot = useCallback((type: TechType, slotIndex: number) => {
    setTechSlots(prev => ({
      ...prev,
      [type]: prev[type].map((slot, index) => 
        index === slotIndex ? { nation: null, unit: null } : slot
      )
    }));
  }, []);

  // Отправка данных
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
          groundUnits: techSlots.ground,
          airUnits: techSlots.air,
          navalUnits: techSlots.naval
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast.success("Настройки техники сохранены!");
      router.refresh();
      
    } catch (error) {
      console.error("Error updating tech slots:", error);
      toast.error("Ошибка при сохранении настроек");
    } finally {
      setIsLoading(false);
    }
  };

  // Рендер таба с определенным типом техники
  const renderTechTab = (type: TechType, title: string) => (
    <TabsContent value={type} className="space-y-4">
      <h3 className="text-sm md:text-base font-medium">{title}</h3>
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {techSlots[type].map((slot, index) => (
          <TechSlotComponent
            key={`${type}-${index}`}
            type={type}
            slotIndex={index}
            slot={slot}
            onNationSelect={handleNationSelect}
            onUnitSelect={handleUnitSelect}
            onResetSlot={handleResetSlot}
          />
        ))}
      </div>
    </TabsContent>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <Tabs defaultValue="ground" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="ground" className="text-xs md:text-sm">
            Наземная
          </TabsTrigger>
          <TabsTrigger value="air" className="text-xs md:text-sm">
            Авиация
          </TabsTrigger>
          <TabsTrigger value="naval" className="text-xs md:text-sm">
            Флот
          </TabsTrigger>
        </TabsList>
        
        {renderTechTab('ground', 'Наземная техника')}
        {renderTechTab('air', 'Авиация')}
        {renderTechTab('naval', 'Морские единицы')}
      </Tabs>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full md:w-auto"
      >
        {isLoading ? "Сохранение..." : "Сохранить изменения"}
      </Button>
    </form>
  );
}