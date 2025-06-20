import { ArrowLeft } from "phosphor-react";

interface BackButtonProps {
  onBack: () => void;
}

const BackButton = ({ onBack }: BackButtonProps) => {
  return (
    <button
      onClick={onBack}
      className="py-3 font-semibold duration-200 flex items-center gap-2 cursor-pointer group"
    >
      <ArrowLeft
        size={20}
        className="group-hover:-translate-x-1 transition-transform"
      />
      Back
    </button>
  );
};

export default BackButton;
