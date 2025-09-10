import { type LucideProps } from "lucide-react";
import { Button } from "../button";

type ActionButtonProps = {
  text: string;
  onClick: () => void;
  className?: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

const ActionButton = ({
  text,
  onClick,
  className,
  Icon,
}: ActionButtonProps) => {
  return (
    <Button variant="hero" onClick={onClick} className={className}>
      <Icon className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
};

export default ActionButton;
