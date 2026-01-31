import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RideTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  onSelect: () => void;
  isSelected?: boolean;
}

const RideTypeCard = ({
  icon: Icon,
  title,
  description,
  price,
  onSelect,
  isSelected = false,
}: RideTypeCardProps) => {
  return (
    <div
      className={`card-elevated rounded-xl p-6 bg-card border-2 transition-all cursor-pointer ${
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-transparent hover:border-primary/30"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-green flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-accent font-semibold">{price}</span>
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideTypeCard;
